/**
 * naive-theme <-> tokens match test (UIUX-M03, M-Ea).
 *
 * The palette in src/config/naive-theme.ts MUST stay plain hex/rgba
 * literals: Naive derives its component themes from these values in JS
 * (seemly changeColor()/composite()/scaleColor() parse them) and THROWS on
 * var()/color-mix() — verified 2026-11-19, seemly 0.3.10:
 * changeColor('var(--color-accent)', {alpha: 0.2}) throws
 * "[seemly/rgba]: Invalid color value var(--color-accent)."
 * So the single-source rule is enforced HERE, not by var() references:
 * every palette value must equal its design token in styles/tokens.css
 * (light + dark), every alpha-derived value must equal rgba(token, alpha),
 * and every tokenless literal is pinned in an explicit allowlist with its
 * reason. If this test fails, a palette value drifted from its token —
 * fix the DRIFT, do not convert the palette to var() references.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { naiveThemeConfigs } from '../../../src/config/naive-theme'

// Vitest runs with cwd = packages/ui (where vitest.config.ts lives).
const TOKENS_PATH = join(process.cwd(), 'src/styles/tokens.css')

type ModePair = { light: string; dark: string }

/** Extract the body of the first top-level block whose prelude matches. */
function blockBody(css: string, preludeRe: RegExp): string {
  const m = preludeRe.exec(css)
  if (!m) throw new Error(`block not found: ${preludeRe}`)
  const open = css.indexOf('{', m.index)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') {
      depth--
      if (depth === 0) return css.slice(open + 1, i)
    }
  }
  throw new Error(`unbalanced block: ${preludeRe}`)
}

/** Parse `--name: value;` declarations out of a CSS block body. */
function parseDeclarations(body: string): Map<string, string> {
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, '')
  const out = new Map<string, string>()
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/g
  let m: RegExpExecArray | null
  while ((m = re.exec(clean)) !== null) {
    out.set(m[1], m[2].replace(/\s+/g, ' ').trim())
  }
  return out
}

/** Resolve a token value to a light/dark pair of hex strings. */
function tokenPair(raw: string, all: Map<string, string>): ModePair {
  const v = raw.trim()
  const ld = /^light-dark\(\s*(#[0-9a-fA-F]{6,8})\s*,\s*(#[0-9a-fA-F]{6,8})\s*\)$/.exec(v)
  if (ld) return { light: ld[1].toLowerCase(), dark: ld[2].toLowerCase() }
  const single = /^(#[0-9a-fA-F]{6,8})$/.exec(v)
  if (single) return { light: single[1].toLowerCase(), dark: single[1].toLowerCase() }
  const alias = /^var\(--([a-z0-9-]+)\)$/.exec(v)
  if (alias) {
    const target = all.get(alias[1])
    if (!target) throw new Error(`unresolvable alias: ${v}`)
    return tokenPair(target, all)
  }
  throw new Error(`not a colour token value: ${v}`)
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const css = readFileSync(TOKENS_PATH, 'utf8')
// The main :root block is the one that sets `color-scheme: light` (the
// dark/media-query :root blocks only override a few keys).
const themeDecls = parseDeclarations(blockBody(css, /@theme\s*\{/))
const rootDecls = parseDeclarations(blockBody(css, /:root\s*\{/))
// blockBody finds the FIRST :root — verify it is the main one, else scan on.
const mainRootDecls = rootDecls.has('color-scheme') || rootDecls.get('color-accent')
  ? rootDecls
  : (() => {
      // Fallback: find the :root block containing `color-scheme: light`.
      const idx = css.indexOf('color-scheme: light')
      const start = css.lastIndexOf(':root', idx)
      const open = css.indexOf('{', start)
      let depth = 0
      for (let i = open; i < css.length; i++) {
        if (css[i] === '{') depth++
        else if (css[i] === '}') {
          depth--
          if (depth === 0) return parseDeclarations(css.slice(open + 1, i))
        }
      }
      throw new Error('main :root block not found')
    })()

const tokens = new Map<string, ModePair>()
for (const [name, raw] of mainRootDecls) {
  if (!name.startsWith('color-')) continue
  try {
    tokens.set(name, tokenPair(raw, mainRootDecls))
  } catch {
    // Non-colour token (e.g. a var() alias to a non-colour) — skip.
  }
}
const token = (name: string): ModePair => {
  const t = tokens.get(name)
  if (!t) throw new Error(`token not found in tokens.css: --${name}`)
  return t
}

const light = naiveThemeConfigs.light.themeOverrides as any
const dark = naiveThemeConfigs.dark.themeOverrides as any

describe('naive-theme tokens (UIUX-M03)', () => {
  it('@theme and :root blocks agree on every shared token', () => {
    for (const [name, themeValue] of themeDecls) {
      if (!mainRootDecls.has(name)) continue
      expect(mainRootDecls.get(name), `--${name}`).toBe(themeValue)
    }
    // The new tertiary token must exist in BOTH blocks (M-Ea, R3X-01).
    expect(themeDecls.has('color-text-tertiary')).toBe(true)
    expect(mainRootDecls.has('color-text-tertiary')).toBe(true)
  })

  it('common palette values equal their design tokens', () => {
    const pairs: Array<[string, string]> = [
      ['primaryColor', 'color-accent'],
      ['infoColor', 'color-status-info'],
      ['infoColorSuppl', 'color-status-info-muted'],
      ['successColor', 'color-status-success'],
      ['successColorSuppl', 'color-status-success-muted'],
      ['warningColor', 'color-status-warning'],
      ['warningColorSuppl', 'color-status-warning-muted'],
      ['errorColor', 'color-status-error'],
      ['errorColorSuppl', 'color-status-error-muted'],
      ['textColorBase', 'color-text-primary'],
      ['textColor1', 'color-text-primary'],
      ['textColor2', 'color-text-secondary'],
      ['textColor3', 'color-text-tertiary'],
      ['textColorDisabled', 'color-text-disabled'],
      ['placeholderColor', 'color-text-tertiary'],
      ['iconColor', 'color-text-tertiary'],
      ['iconColorPressed', 'color-text-primary'],
      ['closeIconColorHover', 'color-text-primary'],
      ['closeIconColorPressed', 'color-text-primary'],
      ['borderColor', 'color-border'],
      ['dividerColor', 'color-border'],
      ['cardColor', 'color-background-card'],
      ['modalColor', 'color-background-card'],
      ['popoverColor', 'color-background-card'],
      ['tableColor', 'color-background-surface'],
      ['inputColor', 'color-background-surface'],
      ['tableHeaderColor', 'color-background-body'],
      ['inputColorDisabled', 'color-background-body'],
      ['bodyColor', 'color-background-body'],
    ]
    for (const [key, tokenName] of pairs) {
      const t = token(tokenName)
      expect(light.common[key], `${key} light (token --${tokenName})`).toBe(t.light)
      expect(dark.common[key], `${key} dark (token --${tokenName})`).toBe(t.dark)
    }
  })

  it('component overrides equal their design tokens', () => {
    const t = (n: string) => token(n)
    expect(light.Tag.textColorWarning).toBe(t('color-status-warning-text').light)
    expect(dark.Tag.textColorWarning).toBe(t('color-status-warning-text').dark)
    expect(light.Typography.textColorWarning).toBe(t('color-status-warning-text').light)
    expect(dark.Typography.textColorWarning).toBe(t('color-status-warning-text').dark)
    expect(light.Button.colorPrimary).toBe(t('color-accent').light)
    expect(dark.Button.colorPrimary).toBe(t('color-accent').dark)
    expect(light.Button.textColorPrimary).toBe(t('color-on-accent').light)
    expect(dark.Button.textColorPrimary).toBe(t('color-on-accent').dark)
    expect(light.Button.color).toBe(t('color-background-surface').light)
    expect(dark.Button.color).toBe(t('color-background-surface').dark)
    expect(light.Button.border).toBe(`1px solid ${t('color-text-tertiary').light}`)
    expect(dark.Button.border).toBe(`1px solid ${t('color-text-tertiary').dark}`)
    expect(light.Button.borderFocusPrimary).toBe(`1px solid ${t('color-accent').light}`)
    expect(dark.Button.borderFocusPrimary).toBe(`1px solid ${t('color-accent').dark}`)
    expect(light.Input.border).toBe(`1px solid ${t('color-text-tertiary').light}`)
    expect(dark.Input.border).toBe(`1px solid ${t('color-text-tertiary').dark}`)
    expect(light.Input.color).toBe(t('color-background-surface').light)
    expect(dark.Input.color).toBe(t('color-background-surface').dark)
    expect(light.Input.colorDisabled).toBe(t('color-background-body').light)
    expect(dark.Input.colorDisabled).toBe(t('color-background-body').dark)
    expect(light.Input.caretColor).toBe(t('color-accent').light)
    expect(dark.Input.caretColor).toBe(t('color-accent').dark)
    expect(light.Card.color).toBe(t('color-background-card').light)
    expect(dark.Card.color).toBe(t('color-background-card').dark)
    expect(light.Card.colorModal).toBe(t('color-background-card').light)
    expect(dark.Card.colorModal).toBe(t('color-background-card').dark)
    expect(light.Card.colorTarget).toBe(t('color-background-card').light)
    expect(dark.Card.colorTarget).toBe(t('color-background-card').dark)
    expect(light.Card.textColor).toBe(t('color-text-primary').light)
    expect(dark.Card.textColor).toBe(t('color-text-primary').dark)
    expect(light.Card.borderColor).toBe(t('color-border').light)
    expect(dark.Card.borderColor).toBe(t('color-border').dark)
    expect(light.Tabs.tabColor).toBe(t('color-background-body').light)
    expect(dark.Tabs.tabColor).toBe(t('color-background-body').dark)
    expect(light.Tabs.tabColorActive).toBe(t('color-background-surface').light)
    expect(dark.Tabs.tabColorActive).toBe(t('color-background-surface').dark)
    expect(light.Tabs.barColor).toBe(t('color-accent').light)
    expect(dark.Tabs.barColor).toBe(t('color-accent').dark)
    expect(light.Radio.buttonColor).toBe(t('color-background-surface').light)
    expect(dark.Radio.buttonColor).toBe(t('color-background-surface').dark)
    expect(light.Radio.buttonColorActive).toBe(t('color-accent-muted').light)
    expect(dark.Radio.buttonColorActive).toBe(t('color-accent-muted').dark)
    expect(light.Radio.buttonBorderColorActive).toBe(t('color-accent').light)
    expect(dark.Radio.buttonBorderColorActive).toBe(t('color-accent').dark)
    expect(light.Dropdown.color).toBe(t('color-background-card').light)
    expect(dark.Dropdown.color).toBe(t('color-background-card').dark)
    const selL = light.Select.peers.InternalSelection
    const selD = dark.Select.peers.InternalSelection
    expect(selL.border).toBe(`1px solid ${t('color-text-tertiary').light}`)
    expect(selD.border).toBe(`1px solid ${t('color-text-tertiary').dark}`)
    expect(selL.placeholderColor).toBe(t('color-text-tertiary').light)
    expect(selD.placeholderColor).toBe(t('color-text-tertiary').dark)
    expect(selL.arrowColor).toBe(t('color-text-tertiary').light)
    expect(selD.arrowColor).toBe(t('color-text-tertiary').dark)
  })

  it('alpha-derived values equal rgba(token, alpha)', () => {
    const accent = token('color-accent')
    const text = token('color-text-primary')
    const tertiary = token('color-text-tertiary')
    const warningText = token('color-status-warning-text')
    const error = token('color-status-error')
    // common
    expect(light.common.hoverColor).toBe(hexToRgba(accent.light, 0.08))
    expect(dark.common.hoverColor).toBe(hexToRgba(accent.dark, 0.08))
    expect(light.common.scrollbarColor).toBe(hexToRgba(text.light, 0.25))
    expect(dark.common.scrollbarColor).toBe(hexToRgba(text.dark, 0.25))
    expect(light.common.scrollbarColorHover).toBe(hexToRgba(text.light, 0.45))
    expect(dark.common.scrollbarColorHover).toBe(hexToRgba(text.dark, 0.45))
    expect(light.common.clearColor).toBe(hexToRgba(text.light, 0.2))
    expect(dark.common.clearColor).toBe(hexToRgba(text.dark, 0.2))
    expect(light.common.clearColorHover).toBe(hexToRgba(text.light, 0.3))
    expect(dark.common.clearColorHover).toBe(hexToRgba(text.dark, 0.3))
    expect(light.common.clearColorPressed).toBe(hexToRgba(text.light, 0.4))
    expect(dark.common.clearColorPressed).toBe(hexToRgba(text.dark, 0.4))
    // closeIconColor uses a different alpha per mode (0.55 light, 0.6 dark).
    expect(light.common.closeIconColor).toBe(hexToRgba(text.light, 0.55))
    expect(dark.common.closeIconColor).toBe(hexToRgba(text.dark, 0.6))
    expect(light.common.placeholderColorDisabled).toBe(hexToRgba(tertiary.light, 0.6))
    expect(dark.common.placeholderColorDisabled).toBe(hexToRgba(tertiary.dark, 0.6))
    expect(light.common.iconColorDisabled).toBe(hexToRgba(tertiary.light, 0.5))
    expect(dark.common.iconColorDisabled).toBe(hexToRgba(tertiary.dark, 0.5))
    // Input focus rings: accent/warning-text/error at 0.25 (light) / 0.3 (dark).
    expect(light.Input.boxShadowFocus).toBe(`0 0 0 2px ${hexToRgba(accent.light, 0.25)}`)
    expect(dark.Input.boxShadowFocus).toBe(`0 0 0 2px ${hexToRgba(accent.dark, 0.3)}`)
    expect(light.Input.boxShadowFocusWarning).toBe(`0 0 0 2px ${hexToRgba(warningText.light, 0.25)}`)
    expect(dark.Input.boxShadowFocusWarning).toBe(`0 0 0 2px ${hexToRgba(warningText.dark, 0.3)}`)
    expect(light.Input.boxShadowFocusError).toBe(`0 0 0 2px ${hexToRgba(error.light, 0.25)}`)
    expect(dark.Input.boxShadowFocusError).toBe(`0 0 0 2px ${hexToRgba(error.dark, 0.3)}`)
    expect(light.Button.rippleColorPrimary).toBe(hexToRgba(accent.light, 0.25))
    expect(dark.Button.rippleColorPrimary).toBe(hexToRgba(accent.dark, 0.3))
    expect(light.Dropdown.optionColorHover).toBe(hexToRgba(accent.light, 0.08))
    expect(dark.Dropdown.optionColorHover).toBe(hexToRgba(accent.dark, 0.08))
    expect(light.Dropdown.optionColorActive).toBe(hexToRgba(accent.light, 0.16))
    expect(dark.Dropdown.optionColorActive).toBe(hexToRgba(accent.dark, 0.16))
    const selL = light.Select.peers.InternalSelection
    const selD = dark.Select.peers.InternalSelection
    expect(selL.boxShadowHover).toBe(`0 0 0 2px ${hexToRgba(accent.light, 0.12)}`)
    expect(selD.boxShadowHover).toBe(`0 0 0 2px ${hexToRgba(accent.dark, 0.12)}`)
    expect(selL.boxShadowFocus).toBe(`0 0 0 2px ${hexToRgba(accent.light, 0.25)}`)
    expect(selD.boxShadowFocus).toBe(`0 0 0 2px ${hexToRgba(accent.dark, 0.3)}`)
    expect(selL.textColorDisabled).toBe(hexToRgba(text.light, 0.45))
    expect(selD.textColorDisabled).toBe(hexToRgba(text.dark, 0.45))
    expect(selL.arrowColorDisabled).toBe(hexToRgba(tertiary.light, 0.5))
    expect(selD.arrowColorDisabled).toBe(hexToRgba(tertiary.dark, 0.5))
  })

  it('--n-* bridge values in tokens.css match the palette they copy (R3X-01)', () => {
    // The four --n-* definitions that carry raw values (not token refs)
    // copy palette values. If the palette changes, these must follow —
    // assert the copy against the resolved theme, not just the token.
    const bridge = (name: string): ModePair => {
      const raw = mainRootDecls.get(name)
      if (!raw) throw new Error(`--${name} not defined in tokens.css :root`)
      const trimmed = raw.trim()
      if (!trimmed.startsWith('light-dark(') || !trimmed.endsWith(')')) {
        throw new Error(`--${name} is not a light-dark() pair: ${raw}`)
      }
      // Split the two args on the comma at paren depth 0 (rgba() args
      // contain commas of their own — a plain split would cut them).
      const inner = trimmed.slice('light-dark('.length, -1)
      let depth = 0
      let split = -1
      for (let i = 0; i < inner.length; i++) {
        const c = inner[i]
        if (c === '(') depth++
        else if (c === ')') depth--
        else if (c === ',' && depth === 0) {
          split = i
          break
        }
      }
      if (split < 0) throw new Error(`--${name} has no top-level comma: ${raw}`)
      return { light: inner.slice(0, split).trim(), dark: inner.slice(split + 1).trim() }
    }
    const hover = bridge('n-primary-color-hover')
    expect(light.common.primaryColorHover).toBe(hover.light)
    expect(dark.common.primaryColorHover).toBe(hover.dark)
    const suppl = bridge('n-primary-color-suppl')
    expect(light.common.primaryColorSuppl).toBe(suppl.light)
    expect(dark.common.primaryColorSuppl).toBe(suppl.dark)
    const hov = bridge('n-hover-color')
    expect(light.common.hoverColor).toBe(hov.light)
    expect(dark.common.hoverColor).toBe(hov.dark)
    const borderHover = bridge('n-border-hover-color')
    expect(light.Input.borderHover).toBe(`1px solid ${borderHover.light}`)
    expect(dark.Input.borderHover).toBe(`1px solid ${borderHover.dark}`)
  })

  it('kept literals are pinned (tokenless by design — change deliberately)', () => {
    // [section, key, light, dark, reason]
    const pinned: Array<[string, string, string, string, string]> = [
      ['common', 'primaryColorHover', '#185cb8', '#87aefe', 'accent hover shade, no token'],
      ['common', 'primaryColorPressed', '#134c98', '#a3c0fe', 'accent pressed shade, no token'],
      ['common', 'primaryColorSuppl', '#6caef7', '#253c5a', 'accent suppl; dark == accent-muted, light has no token'],
      ['common', 'infoColorHover', '#005fb8', '#87aefe', 'info hover shade, no token'],
      ['common', 'infoColorPressed', '#004e96', '#a3c0fe', 'info pressed shade, no token'],
      ['common', 'successColorHover', '#146a00', '#79bd63', 'success hover shade, no token'],
      ['common', 'successColorPressed', '#0f5200', '#90ca90', 'success pressed shade, no token'],
      ['common', 'warningColorHover', '#e6b800', '#ffd94d', 'warning hover shade, no token'],
      ['common', 'warningColorPressed', '#c9a000', '#eec448', 'warning pressed shade, no token'],
      ['common', 'errorColorHover', '#a92632', '#ff8a7a', 'error hover shade, no token'],
      ['common', 'errorColorPressed', '#8f1f28', '#ffaea7', 'error pressed shade, no token'],
      ['common', 'actionColor', '#f1f1f1', '#262626', 'body-light + surface-dark mix, no single token'],
      ['common', 'iconColorHover', '#474747', '#ffffff', 'secondary-light + primary-dark mix, no single token'],
      ['Card', 'boxShadow', '0 12px 28px rgba(15, 23, 42, 0.08)', '0 12px 28px rgba(0, 0, 0, 0.45)', 'elevation shadow, not a colour token'],
      ['Button', 'colorHover', '#f1f1f1', '#333333', 'default-button hover, no token'],
      ['Button', 'colorPressed', '#e8e8e8', '#404040', 'default-button pressed, no token'],
      ['Button', 'borderHover', '1px solid #525252', '1px solid #c2c2c2', 'default-button border hover, no token'],
      ['Button', 'borderPressed', '1px solid #404040', '1px solid #d4d4d4', 'default-button border pressed, no token'],
      ['Button', 'colorHoverPrimary', '#185cb8', '#87aefe', 'accent hover shade, no token'],
      ['Button', 'colorPressedPrimary', '#134c98', '#a3c0fe', 'accent pressed shade, no token'],
      ['Button', 'borderHoverPrimary', '1px solid #185cb8', '1px solid #87aefe', 'accent hover shade, no token'],
      ['Input', 'borderHover', '1px solid #525252', '1px solid #c2c2c2', 'input border hover, no token'],
      ['Card', 'actionColor', '#f1f1f1', '#262626', 'same body-light + surface-dark mix as common.actionColor'],
    ]
    for (const [section, key, l, d, reason] of pinned) {
      expect(light[section][key], `${section}.${key} light (${reason})`).toBe(l)
      expect(dark[section][key], `${section}.${key} dark (${reason})`).toBe(d)
    }
  })
})
