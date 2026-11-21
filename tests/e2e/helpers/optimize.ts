import { expect, type Page } from '@playwright/test'
import { throwIfCurrentTestHasVCRFailure, waitForConditionOrVCRFailure } from './vcr'

// R3Y-01 — pre-optimize text stashed by the click helpers, keyed by Page
// (fresh per test) and output testId. See clickOptimizeButton.
const preOptimizeTextByPage = new WeakMap<Page, Map<string, string>>()

function takePreOptimizeText(page: Page, outputTestId: string): string | undefined {
  return preOptimizeTextByPage.get(page)?.get(outputTestId)
}

export type OptimizeWorkspaceMode =
  | 'basic-system'
  | 'basic-user'
  | 'image-text2image'
  | 'image-image2image'
  | 'image-multiimage'
  | 'pro-variable'
  | 'pro-multi'

export function getWorkspace(page: Page, mode: OptimizeWorkspaceMode) {
  return page.locator(`[data-testid="workspace"][data-mode="${mode}"]`)
}

export async function fillOriginalPrompt(page: Page, mode: OptimizeWorkspaceMode, value: string) {
  const workspace = getWorkspace(page, mode)

  const input = workspace.locator(`[data-testid="${mode}-input"]`)
  await expect(input).toBeVisible({ timeout: 15000 })

  const cmContent = input.locator('.cm-content')
  if ((await cmContent.count()) > 0) {
    await cmContent.click()
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A')
    await page.keyboard.type(value)
  } else {
    const textarea = input.locator('textarea')
    await textarea.fill(value)
  }

  const optimizeButton = workspace.locator(`[data-testid="${mode}-optimize-button"]`)
  await expect(optimizeButton).toBeEnabled({ timeout: 15000 })
}

export async function clickOptimizeButton(page: Page, mode: OptimizeWorkspaceMode) {
  const workspace = getWorkspace(page, mode)

  // R3Y-01 follow-up — capture the pre-optimize output BEFORE the click is
  // dispatched. A VCR replay can finish (button re-enabled, final text in
  // the output) before the wait helper's first read lands; if `before` were
  // captured inside the helper instead, it would already equal the final
  // text and the `text !== before` rule could never be satisfied (proven by
  // the pro-variable gate spec timing out on a genuine replayed result).
  // The value is stashed per page+output and consumed by
  // expectOptimizedResultNotEmpty; it is overwritten by the next click on
  // the same output and never deleted, so a second expect after the same
  // click still sees the pre-click value. Pages are fresh per test, so
  // nothing leaks across tests.
  const outputTestId = `${mode}-output`
  const output = workspace.locator(`[data-testid="${outputTestId}"]:visible`)
  const before = (await readOutputSourceText(output).catch(() => ({ text: '' }))).text
  let perPage = preOptimizeTextByPage.get(page)
  if (!perPage) {
    perPage = new Map()
    preOptimizeTextByPage.set(page, perPage)
  }
  perPage.set(outputTestId, before)

  const button = workspace.locator(`[data-testid="${mode}-optimize-button"]`)
  await expect(button).toBeVisible({ timeout: 15000 })
  await expect(button).toBeEnabled({ timeout: 15000 })

  await button.click()
}

// ---------------------------------------------------------------------------
// R3Y-01 — the old readOutputSourceText passed VACUOUSLY (three mechanisms):
//  (A) its whole-card innerText() fallback read the empty-state text
//      ("Optimized prompt will be shown here..." / "No content") as a result
//      on mobile, where the output toolbar is hidden while empty;
//  (B) its CodeMirror path read the placeholder widget text inside the first
//      .cm-line as real output on desktop Pro/Image;
//  (C) its markdown branch read the FIRST .markdown-content in the card —
//      the reasoning area precedes the body, so reasoning text satisfied it.
//  Plus a structural hole (D): it never compared against the pre-optimize
//  value, so stale content from an earlier run passed immediately.
//  The fix below: scope every read to .output-display-body (excludes the
//  toolbar labels and the reasoning area), strip placeholder/status texts
//  explicitly, never fall back to whole-card innerText, and require the
//  text to differ from the pre-optimize value (or to have changed during
//  the wait — see waitForFreshOutputText). One narrow exception (V-H-01(b)):
//  when every precise read in the body is empty, the body's own visible
//  text is read as a last resort — the body's content can live in a node
//  none of the precise reads match (see readOutputSourceText). The body
//  still excludes toolbar/reasoning, and its status/empty chrome is
//  removed structurally, so the exception cannot read an empty output as
//  non-empty.
// ---------------------------------------------------------------------------

// Texts that must NEVER count as "output": empty-state placeholders and the
// failure/cancelled/capacity status lines rendered inside
// .output-display-body. (A failed optimize shows only its status line when
// nothing was received — that must read as '' and time out, not pass.)
const OUTPUT_PLACEHOLDERS = [
  'Optimized prompt will be shown here...',
  'Test result will be shown here...',
  'No content',
  'Generation stopped. Received content is retained.',
  'Generation did not complete. Received content is retained.',
  'Local output capacity reached. Received content is retained.',
]

function stripPlaceholders(text: string): string {
  let out = text
  for (const p of OUTPUT_PLACEHOLDERS) out = out.split(p).join('')
  // CodeMirror placeholder widget text is a child of .cm-line; the cm path
  // below already reads lines — dropping the placeholder string also drops
  // a line that is ONLY the placeholder.
  return out.trim()
}

async function ensureOutputSourceView(output: import('@playwright/test').Locator) {
  // OutputDisplay 头部有 Render / Source / Compare 三个 tab（Naive UI 的 n-button）。
  // 并发/渲染抖动时直接读 output.innerText 会把 tab 文案也读进来，导致误判。
  // 这里用 i18n 文案会受语言影响，改用“中间那个按钮”（Render/Source/Compare）更稳定。
  //
  // R3Y-01: FAIL LOUDLY instead of silently no-op-ing — but only when the
  // absence actually matters. The toolbar renders only when there is
  // content (v-if="hasToolbar && (!fitContent || hasContent ||
  // hasReasoning)"), so on an EMPTY output (mobile) an absent toolbar is
  // EXPECTED and the Render-view read of '' is sound — return silently.
  // An absent toolbar on a NON-EMPTY output means the view switch the
  // caller asked for is impossible, and the Render-view read that follows
  // must not be silently mistaken for a Source-view read.
  const toolbar = output.locator('.output-display-toolbar')
  // R3Y-01 follow-up (V-F diag4): on mobile the CodeMirror Source view
  // holds streamed text ~50ms BEFORE the output toolbar's v-if (hasContent)
  // renders it, so a single toolbar.count() sample taken in that window
  // trips the fail-loud check below on a genuine optimize. Poll briefly
  // for the toolbar before concluding it is absent. Bounded (2s): an output
  // whose toolbar never appears still fails loudly, just 2s later. The
  // no-click regression case is unaffected — with no click the output stays
  // empty, the poll expires, the content read below is '' and this returns
  // silently, so the fresh-text wait still times out exactly as before.
  // Only the [VCR wait timeout] is swallowed here; any other error (e.g. a
  // VCR failure raised by the waiter) propagates.
  let toolbarAppeared = false
  try {
    await waitForConditionOrVCRFailure(
      async () => (await toolbar.count()) > 0,
      { timeoutMs: 2000, intervalMs: 50, description: 'output toolbar should appear once the output has content' },
    )
    toolbarAppeared = true
  } catch (e) {
    if (e instanceof Error && !e.message.startsWith('[VCR wait timeout]')) throw e
  }
  if (!toolbarAppeared) {
    const { text } = await readOutputSourceText(output).catch(() => ({ text: '' }))
    if (/\S/.test(text)) {
      throw new Error(
        '[E2E][optimize] output toolbar is absent but the output already has content — '
        + 'cannot switch to Source view; refusing to silently read the Render view as if it were Source.',
      )
    }
    return
  }
  const leftGroupButtons = output.locator('.n-button-group').first().locator('.n-button')
  if ((await leftGroupButtons.count()) >= 2) {
    const source = leftGroupButtons.nth(1)
    // 如果已经处于 Source（disabled），直接返回
    if (!(await source.isDisabled().catch(() => false))) {
      await source.click({ timeout: 20000 })
    }
  }
}

async function readOutputSourceText(output: import('@playwright/test').Locator) {
  // Avoid Playwright strict-mode flakiness when the same testId is transiently duplicated in the DOM.
  // Always read from the first matched node.
  const root = output.first()
  if ((await root.count()) === 0) return { kind: 'missing', text: '' }

  try {
    // Scope to the body: excludes toolbar labels and the reasoning area
    // (whose .markdown-content would otherwise be read as the result).
    const body = root.locator('.output-display-body').first()
    const hasBody = (await body.count()) > 0
    const scope = hasBody ? body : root

    // Source 视图下优先读取编辑器/textarea 的“值”，避免拿到整张卡片的 innerText
    const cmContent = scope.locator('.cm-content')
    if ((await cmContent.count()) > 0) {
      const lines = cmContent.first().locator('.cm-line')
      if ((await lines.count()) > 0) {
        const text = stripPlaceholders((await lines.allInnerTexts()).join('\n'))
        if (text) {
          return { kind: 'cm', text }
        }
      }

      return { kind: 'cm', text: stripPlaceholders(await cmContent.first().innerText()) }
    }

    const textarea = scope.locator('textarea')
    if ((await textarea.count()) > 0) {
      return { kind: 'textarea', text: (await textarea.first().inputValue()).trim() }
    }

    // Render 视图：MarkdownRenderer 会渲染到 .markdown-content 容器中
    const markdown = scope.locator('.markdown-content')
    if ((await markdown.count()) > 0) {
      const text = stripPlaceholders(await markdown.first().innerText())
      if (text) return { kind: 'markdown', text }
    }

    // V-H-01(b) fallback — the body's content can live in a node none of
    // the three precise reads above match: <pre class="output-source-text">,
    // XmlRenderer, TextDiffUI, or the MarkdownRenderer container before its
    // async worker commits HTML (V-H proved the body's .markdown-content
    // can sit EMPTY while the card shows the full result). Read the body's
    // own text as a last resort. This does NOT reopen the R3Y-01 hole:
    // the body excludes the toolbar and the reasoning area by construction;
    // the status lines and the empty state are removed by STRUCTURE
    // (role="status" / .n-empty / .output-source-notice — locale-
    // independent), and the placeholder list is stripped as well — so an
    // empty or failed output still reads as '' and the no-click regression
    // still times out. Only runs when a body exists: with no body the
    // scope is the whole card and a whole-card read would be the vacuous
    // R3Y-01(A) fallback.
    if (hasBody) {
      const bodyText = stripPlaceholders(await readBodyVisibleText(body))
      if (bodyText) return { kind: 'body', text: bodyText }
    }

    // NO whole-card innerText fallback: an empty output must read as ''.
    // (The old fallback returned the NEmpty/NText placeholder text and the
    //  Render/Source/Compare tab labels — that was the vacuous pass.)
    return { kind: 'empty', text: '' }
  } catch {
    return { kind: 'missing', text: '' }
  }
}

// Body text with the non-content chrome removed structurally: the status
// lines (failed/cancelled/capacity, role="status"), the empty state
// (.n-empty) and the source-fallback notice are not output. Uses the live
// element's innerText (layout-aware: display:none subtrees excluded) and
// subtracts the chrome nodes' own text, so no locale strings are matched.
async function readBodyVisibleText(body: import('@playwright/test').Locator): Promise<string> {
  const full = (await body.innerText().catch(() => '')).trim()
  if (!full) return ''
  const chrome = await body
    .locator('[role="status"], .n-empty, .output-source-notice')
    .allInnerTexts()
    .catch(() => [] as string[])
  let out = full
  for (const c of chrome) {
    const t = (c || '').trim()
    if (t) out = out.split(t).join('')
  }
  return out.trim()
}

// Wait until the output holds non-empty text that is FRESH — i.e. at some
// point during the wait the text differed from the pre-optimize value.
// That closes the stale-content hole (D): a failed optimize that merely
// retains the previous result never satisfies the wait. It also accepts the
// identical-replay case: the app clears the output when Optimize starts,
// so a genuine re-run of the same prompt passes through '' (a poll reads a
// text different from `before`) even though the final text is identical.
// Caveat: if a future test re-optimizes the same prompt AND every poll
// misses the cleared window, the wait times out — that test must clear the
// output first or use a different prompt; the timeout is loud, not silent.
async function waitForFreshOutputText(
  output: import('@playwright/test').Locator,
  before: string,
  opts: { timeoutMs: number; description: string },
): Promise<string> {
  let sawDifferent = false
  let latest = ''
  await waitForConditionOrVCRFailure(
    async () => {
      const { text } = await readOutputSourceText(output).catch(() => ({ text: '' }))
      latest = text
      if (text !== before) sawDifferent = true
      return /\S/.test(text) && sawDifferent
    },
    {
      timeoutMs: opts.timeoutMs,
      intervalMs: 120,
      description: opts.description,
    },
  )
  return latest
}

export async function readOutputByTestIdText(page: Page, testId: string): Promise<string> {
  const output = page.locator(`[data-testid="${testId}"]:visible`)
  await ensureOutputSourceView(output)
  const { text } = await readOutputSourceText(output)
  return text
}

export async function expectOutputByTestIdNotEmpty(page: Page, testId: string, opts?: { timeoutMs?: number }) {
  const output = page.locator(`[data-testid="${testId}"]:visible`)
  const timeoutMs = opts?.timeoutMs ?? 120000

  throwIfCurrentTestHasVCRFailure()

  // Prefer the pre-click value stashed by the click helper; fall back to a
  // live read (e.g. Run All flows, which do not go through
  // clickOptimizeButton). Capture BEFORE ensureOutputSourceView so the
  // fallback window is as small as possible.
  const before =
    takePreOptimizeText(page, testId) ?? (await readOutputSourceText(output).catch(() => ({ text: '' }))).text
  await ensureOutputSourceView(output)

  await waitForFreshOutputText(output, before, {
    timeoutMs,
    description: `output ${testId} should become non-empty`,
  })
}

export async function expectOptimizedResultNotEmpty(
  page: Page,
  mode: OptimizeWorkspaceMode,
  opts?: { timeoutMs?: number },
) {
  const workspace = getWorkspace(page, mode)

  const output = workspace.locator(`[data-testid="${mode}-output"]:visible`)
  const optimizeButton = workspace.locator(`[data-testid="${mode}-optimize-button"]`)
  const timeoutMs = opts?.timeoutMs ?? 180000

  try {
    throwIfCurrentTestHasVCRFailure()

    // Prefer the pre-click value stashed by clickOptimizeButton; fall back
    // to a live read. Capture BEFORE ensureOutputSourceView so the fallback
    // window is as small as possible.
    const outputTestId = `${mode}-output`
    const before =
      takePreOptimizeText(page, outputTestId) ??
      (await readOutputSourceText(output).catch(() => ({ text: '' }))).text
    await ensureOutputSourceView(output)

    await waitForFreshOutputText(output, before, {
      timeoutMs,
      description: `${mode} optimized output should become non-empty`,
    })

    // 文本开始流出并不代表优化已完成；尤其是 pro-multi 左侧分析会在流式收尾阶段重建按钮节点。
    // 这里补一层“优化按钮重新可用”的等待，确保后续点击分析/测试时已经脱离 streaming 状态。
    if ((await optimizeButton.count()) > 0) {
      await expect(optimizeButton).toBeEnabled({ timeout: timeoutMs })
    }
  } catch (e) {
    const buttonInfo = await (async () => {
      try {
        const visible = await optimizeButton.isVisible()
        const enabled = await optimizeButton.isEnabled()
        const text = (await optimizeButton.innerText().catch(() => '')).trim()
        return { visible, enabled, text }
      } catch {
        return { visible: false, enabled: false, text: '' }
      }
    })()

    const outputInfo = await (async () => {
      try {
        const out = await readOutputSourceText(output)
        const readonly =
          out.kind === 'textarea' ? await output.locator('textarea').first().isDisabled().catch(() => false) : false
        return { ...out, readonly }
      } catch {
        return { kind: 'unknown', text: '', readonly: false }
      }
    })()

    const alertText = await page.locator('.n-alert').allInnerTexts().catch(() => [])
    const messageText = await page.locator('.n-message').allInnerTexts().catch(() => [])

    const debugPayload = {
      mode,
      button: buttonInfo,
      output: outputInfo,
      alerts: alertText.filter(Boolean).slice(0, 5),
      messages: messageText.filter(Boolean).slice(0, 5),
    }

    // eslint-disable-next-line no-console
    console.error('[E2E][optimize] output wait failure diagnostic:', JSON.stringify(debugPayload, null, 2))
    throw e
  }
}

export async function verifyOptimizeButtonDisabledWhenEmpty(page: Page, mode: OptimizeWorkspaceMode) {
  throwIfCurrentTestHasVCRFailure()
  const workspace = getWorkspace(page, mode)
  const button = workspace.locator(`[data-testid="${mode}-optimize-button"]`)

  await expect(button).toBeVisible({ timeout: 15000 })
  await expect(button).toBeDisabled()
}

export async function addProMultiUserMessage(page: Page, content: string) {
  const firstAddButton = page.getByTestId('pro-multi-add-first-message').first()
  if (await firstAddButton.isVisible().catch(() => false)) {
    await firstAddButton.click()
  } else {
    const addButton = page.getByTestId('pro-multi-add-message').first()
    await expect(addButton).toBeVisible({ timeout: 20000 })
    await addButton.click()
  }

  // 新增消息后，列表最后一项应该出现
  // 我们给 message card 加了 data-testid=pro-multi-message-card-{index}
  // 这里用“最后一个 message card”的内容输入框填写。
  const messageCards = page.locator('[data-testid^="pro-multi-message-card-"]')
  await expect(messageCards.first()).toBeVisible({ timeout: 20000 })

  const lastCard = messageCards.last()
  // VariableAwareInput 内部是 textarea 或 CodeMirror
  const cm = lastCard.locator('.cm-content')
  if ((await cm.count()) > 0) {
    await cm.click()
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A')
    await page.keyboard.type(content)
  } else {
    const textarea = lastCard.locator('textarea')
    await textarea.fill(content)
  }
}

export async function selectProMultiMessageForOptimization(page: Page, index: number) {
  // Pro Multi 现在自动选中最新消息；保留此 helper 以兼容旧测试。
  // 若选择按钮存在则点击，不存在则视为已自动选中。
  const selectButton = page.getByTestId(`pro-multi-select-message-${index}`)
  if ((await selectButton.count()) > 0) {
    await expect(selectButton).toBeVisible({ timeout: 20000 })
    await selectButton.click()
  }
}

export async function clickProMultiOptimizeButton(page: Page) {
  // Same pre-click stash as clickOptimizeButton (R3Y-01): a VCR replay can
  // finish before the wait helper's first read lands.
  const output = page.locator('[data-testid="pro-multi-output"]:visible')
  const before = (await readOutputSourceText(output).catch(() => ({ text: '' }))).text
  let perPage = preOptimizeTextByPage.get(page)
  if (!perPage) {
    perPage = new Map()
    preOptimizeTextByPage.set(page, perPage)
  }
  perPage.set('pro-multi-output', before)

  const button = page.getByTestId('pro-multi-optimize-button')
  await expect(button).toBeVisible({ timeout: 20000 })
  await expect(button).toBeEnabled({ timeout: 20000 })

  await button.click()
}
