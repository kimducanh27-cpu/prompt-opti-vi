import { test, expect, type Page } from '../fixtures'
import { waitForAppReady } from '../helpers/common'
import { selectModelConfiguration } from '../helpers/model-selector'
import {
  fillOriginalPrompt,
  clickOptimizeButton,
  expectOptimizedResultNotEmpty,
} from '../helpers/optimize'

/**
 * Slice 10 — mobile journey (Honor Magic6 viewports).
 *
 * Runs ONLY on the mobile-412 / mobile-430 projects (playwright.config.ts
 * scopes those projects with testMatch 'mobile/*.spec.ts'). Replay mode only:
 * the optimize test reuses the desktop basic-user VCR fixture — the fixture
 * JSON was COPIED (not re-recorded) to
 * tests/e2e/fixtures/vcr/mobile-basic-user-journey-spec-ts/ with the same
 * test-case title, and the test sends the identical prompt + model so the
 * recorded request hash matches.
 */

const MODE = 'basic-user' as const
const PROMPT = '帮我写一封邮件，关于项目进度汇报'
const FAVORITE_TITLE = 'E2E Mobile Favorite'

const EXPECTED_VIEWPORTS: Record<string, { width: number; height: number }> = {
  'mobile-412': { width: 412, height: 915 },
  'mobile-430': { width: 430, height: 932 },
}

async function gotoBasicUser(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await waitForAppReady(page)
  await page.goto('/#/basic/user', { waitUntil: 'domcontentloaded' })
  await waitForAppReady(page)
  await expect(page.locator('[data-testid="workspace"][data-mode="basic-user"]')).toBeVisible({ timeout: 20000 })
  await expect(page).toHaveURL(/\/#\/basic\/user$/)
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  }))
  // eslint-disable-next-line no-console
  console.log(`[mobile-journey] overflow check: ${JSON.stringify(overflow)}`)
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth)
}

async function openCompactMenu(page: Page): Promise<void> {
  await page.getByTestId('compact-global-menu').click()
  // The functions sheet renders the model-manager row; waiting for it proves
  // the sheet (not just the button) is open.
  await expect(page.getByTestId('compact-menu-models')).toBeVisible({ timeout: 10000 })
}

/**
 * Save the main output as a favorite.
 * Desktop renders a direct `…-output-favorite` star button; on compact the
 * output toolbar is <400px wide, so favorite/copy fold into the "···"
 * (output-compact-actions) dropdown — the direct button is not in the DOM
 * at all (v-if). Both paths open the same SaveFavoriteDialog PoSheet.
 */
async function saveOutputAsFavorite(page: Page, title: string): Promise<void> {
  const output = page.locator('[data-testid="basic-user-output"]')
  const direct = output.locator('[data-testid="basic-user-output-favorite"]')
  if ((await direct.count()) > 0) {
    await direct.click()
  } else {
    await output.locator('[data-testid="output-compact-actions"]').click()
    const menu = page.locator('.n-dropdown-menu').filter({ hasText: 'Save to Favorites' }).first()
    await expect(menu).toBeVisible({ timeout: 5000 })
    await menu.getByText('Save to Favorites', { exact: true }).first().click()
  }
  const titleField = page.locator('[data-testid="favorite-editor-title"] input')
  await expect(titleField).toBeVisible({ timeout: 10000 })
  await titleField.fill(title)
  await page.getByTestId('favorite-editor-save').click()
  // The save sheet closes once the favorite is stored.
  await expect(titleField).toBeHidden({ timeout: 15000 })
}

test.describe('Mobile Basic User journey', () => {
  test('mobile layout: no horizontal overflow, optimize target >= 44px', async ({ page }, testInfo) => {
    await gotoBasicUser(page)

    const expected = EXPECTED_VIEWPORTS[testInfo.project.name]
    const viewport = page.viewportSize()
    expect(viewport).not.toBeNull()
    if (expected) {
      expect(viewport?.width).toBe(expected.width)
      expect(viewport?.height).toBe(expected.height)
    }
    // Compact layout is width-driven (<1024px): the bottom tab bar must exist.
    await expect(page.getByTestId('compact-tab-basic')).toBeVisible()

    await expectNoHorizontalOverflow(page)

    const button = page.getByTestId('basic-user-optimize-button')
    await expect(button).toBeVisible({ timeout: 15000 })
    const box = await button.boundingBox()
    expect(box).not.toBeNull()
    // eslint-disable-next-line no-console
    console.log(`[mobile-journey] optimize button box: ${JSON.stringify(box)}`)
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })

  test('优化提示词并生成优化结果', async ({ page }) => {
    test.setTimeout(180000)

    await gotoBasicUser(page)
    // Pin the recorded provider so built-in default-model updates do not invalidate VCR replay.
    await selectModelConfiguration(page, page.getByTestId('basic-user-model-select'), /deepseek/i)

    await fillOriginalPrompt(page, MODE, PROMPT)
    await clickOptimizeButton(page, MODE)

    await expectOptimizedResultNotEmpty(page, MODE)

    // (c) SAVE FAVORITE — the step missing from all existing optimize specs.
    await saveOutputAsFavorite(page, FAVORITE_TITLE)

    // Assert the favorite is stored and listed on the Favorites page.
    await page.goto('/#/favorites', { waitUntil: 'domcontentloaded' })
    await waitForAppReady(page)
    await expect(page.getByTestId('favorites-manager-add')).toBeVisible({ timeout: 20000 })
    const listItem = page.getByTestId('favorite-workspace-list-item').filter({ hasText: FAVORITE_TITLE }).first()
    await expect(listItem).toBeVisible({ timeout: 10000 })
  })

  test('switch language to vi-VN from the mobile menu', async ({ page }) => {
    await gotoBasicUser(page)

    await openCompactMenu(page)
    // Language switcher lives inside the compact functions sheet. Two
    // instances exist in the DOM (desktop header + compact sheet); only the
    // sheet's is visible on mobile, so scope to :visible.
    const languageTrigger = page.locator('button[aria-label="Switch language (English)"]:visible')
    await expect(languageTrigger).toBeVisible({ timeout: 10000 })
    await languageTrigger.click()
    const dropdown = page.locator('.n-dropdown-menu').filter({ hasText: 'Tiếng Việt' }).first()
    await expect(dropdown).toBeVisible({ timeout: 5000 })
    await dropdown.getByText('Tiếng Việt', { exact: true }).first().click()

    // Vietnamese string renders: the optimize button label switches to vi-VN.
    await expect(page.getByTestId('basic-user-optimize-button')).toContainText('Tối ưu', { timeout: 10000 })
    // Longer Vietnamese strings must not introduce horizontal overflow.
    await expectNoHorizontalOverflow(page)
  })

  test('model manager opens as a bottom sheet on mobile', async ({ page }) => {
    await gotoBasicUser(page)

    await openCompactMenu(page)
    await page.getByTestId('compact-menu-models').click()

    const dialog = page.getByTestId('model-manager-dialog')
    await expect(dialog).toBeVisible({ timeout: 10000 })

    // The sheet card is the closest .n-card ancestor of the dialog content.
    const sheet = await dialog.evaluate((el) => {
      const card = el.closest('.n-card') as HTMLElement | null
      if (!card) return null
      const rect = card.getBoundingClientRect()
      const close = card.querySelector('.n-base-close') as HTMLElement | null
      const closeRect = close?.getBoundingClientRect()
      return {
        top: rect.top,
        height: rect.height,
        bottom: rect.bottom,
        innerHeight: window.innerHeight,
        closeVisible: !!close && !!closeRect && closeRect.width > 0 && closeRect.height > 0,
        closeWidth: closeRect?.width ?? 0,
        closeHeight: closeRect?.height ?? 0,
      }
    })
    expect(sheet).not.toBeNull()
    // eslint-disable-next-line no-console
    console.log(`[mobile-journey] model manager sheet: ${JSON.stringify(sheet)}`)
    // Design-system §2.4: sheet max 90dvh, bottom-anchored, 44px close button.
    expect(sheet!.height).toBeLessThanOrEqual(sheet!.innerHeight * 0.9 + 1)
    expect(sheet!.bottom).toBeGreaterThanOrEqual(sheet!.innerHeight - 8)
    expect(sheet!.top).toBeGreaterThan(0)
    expect(sheet!.closeVisible).toBe(true)
    expect(sheet!.closeWidth).toBeGreaterThanOrEqual(44)
    expect(sheet!.closeHeight).toBeGreaterThanOrEqual(44)

    // Close via the sheet's real close button and verify it is gone.
    // Exact class-token match: a substring match would stop at the nearer
    // `.n-card-content` ancestor, which has no close button.
    const card = dialog.locator(
      'xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " n-card ")][1]',
    )
    await card.locator('.n-base-close').first().click()
    await expect(dialog).toBeHidden({ timeout: 10000 })
  })
})
