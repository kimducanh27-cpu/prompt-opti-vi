// Naive UI theme — Slice 3 rewrite (design-system §1.1, §6).
//
// ONE compact light/dark override, driven by the app's own markers:
// `data-workspace-theme` + the `.dark` class (PromptOptimizerApp.vue
// watches `naiveTheme.name` and sets dataset.workspaceTheme; applyThemeId
// below toggles `.dark` for Tailwind's `dark:` variant). Primary is the
// design token --color-accent in both modes, on-primary is
// --color-on-accent. There are no other themes.
//
// Structure: one `ThemePalette` per mode (plain values only) + one
// `buildThemeOverrides()` that turns a palette into the Naive overrides,
// so each rule is written once and light/dark cannot drift apart.
//
// Single source of truth (UIUX-M03, M-Ea): the palette values below are
// PLAIN hex/rgba literals on purpose, and they MUST stay literals. Naive
// derives its component themes from these values in JS — `seemly`
// changeColor() / composite() / scaleColor() parse them, and they THROW
// on anything that is not a parseable colour. Verified 2026-11-19 (Node,
// seemly 0.3.10): changeColor('var(--color-accent)', {alpha: 0.2}) throws
// "[seemly/rgba]: Invalid color value var(--color-accent)." — and so does
// color-mix(). 105+ call sites consume the common colours this way
// (changeColor: primaryColor 39x, errorColor 22x, warningColor 20x,
// successColor 12x, infoColor 12x, *ColorSuppl 2x each; composite/
// scaleColor: cardColor/modalColor/popoverColor 15-17x each, bodyColor
// 4x; Button's secondary branch runs changeColor on colorPrimary).
// Replacing a palette literal with var(--color-…) would therefore crash
// theme computation at app boot, not just restyle it. The single-source
// rule is enforced instead by tests/unit/config/naive-theme-tokens.spec.ts,
// which reads styles/tokens.css and asserts every palette value equals
// its token (light + dark), asserts the alpha-derived values equal
// rgba(token, alpha), and pins the tokenless literals (hover/pressed
// shades, action, iconColorHover) so any change is deliberate. If a
// palette value and its token ever disagree, fix the DRIFT — do not
// convert the palette to var() references.
//
// Replaces the old 925-line, 6-theme file (light #4b5563, thin-only dark
// #64748b, blue #1f6bd1, classic #7b6a58, dark-base green #1fb598,
// dark-base purple #b47bff). Removed ids and their fate:
// - blue / classic were light-base -> resolve to `light`
// - green / purple were dark-base -> resolve to `dark`
// - a persisted removed id (global-settings, or the legacy
//   localStorage('naive-theme-id') key) is normalised once at init and
//   whenever switchTheme() is called, so old installs keep working.
// - `theme.blue/classic/green/purple` i18n keys were removed with them;
//   the toggle offers Light / Dark / Auto only (ThemeToggleUI.vue).
//
// Sizing (design-system §1.2, §1.3): inputs/selects take 16px via
// fontSizeMedium (PoInput rule: 16px on all screens — this is also what
// stops iOS zoom on focus). Height: theme sets the 36px desktop floor
// (heightMedium); the 44px mobile target lives in the compact CSS, which
// is exactly the mobile layout (isCompact = width < 1024), not in
// per-component overrides.
//
// Contrast, measured by script (Slice 3, contrast.py — see
// ~/workspace/prompt-optimizer-coordinator/naive-theme/contrast.txt):
// - Transient pair from Slice 2, RESOLVED: #111111 on #6d9cfe = 7.05:1
//   (was #111111 on #64748b = 3.97:1). Light primary: #ffffff on #1f6bd1
//   = 5.14:1. Both pass 4.5:1.
// - Input border vs input surface (3:1 UI bar): the token
//   --color-border-emphasized FAILS here (#d4d4d4 on #ffffff = 1.48:1;
//   #525252 on #262626 = 1.94:1), so this file overrides the Naive
//   Input/Select border to a passing grey WITHOUT changing tokens.css:
//   light #767676 on #ffffff = 4.54:1, dark #9e9e9e (= dark
//   --color-text-secondary) on #262626 = 5.65:1. Hover/focus borders are
//   darker / the accent.
// - Focus ring (accent) vs surroundings, all pass 3:1: light #1f6bd1 vs
//   #ffffff 5.14:1, vs #f1f1f1 4.55:1; dark #6d9cfe vs #262626 5.65:1,
//   vs #1b1b1b 6.43:1.
// - Placeholder is #767676 light (4.54:1) / #9e9e9e dark (5.65:1).
// - Disabled text/borders are exempt from the contrast bars (WCAG
//   1.4.3/1.4.11 do not apply to disabled controls).
// - KNOWN OPEN ISSUE (not fixed here — DataManager.vue is out of this
//   slice's edit scope): its local dark correction forces primary-button
//   text to #fff, which was 4.76:1 on the old slate #64748b but is only
//   2.68:1 on the new #6d9cfe. That override should be deleted in Slice 4.
// - KNOWN LIMIT (compact CSS), RESOLVED by M-Ea (UIUX-M01): compact
//   inputs/selects now use `--n-border: 1px solid
//   var(--color-text-tertiary)` (compact/foundation.css) — #767676 light
//   (4.54:1 vs paper, 4.02:1 vs the #f1f1f1 fill) / #9e9e9e dark
//   (5.65:1 vs #262626). The fill (--compact-soft) is unchanged.
import { computed, ref, watch } from 'vue'

import { darkTheme, lightTheme, type GlobalTheme, type GlobalThemeOverrides } from 'naive-ui'
import { pinia } from '../plugins/pinia'
import { useGlobalSettings } from '../stores/settings/useGlobalSettings'

// The only applied theme ids. 'auto' is a *selection* (persisted in
// useGlobalSettings, default), resolved to light/dark at apply time.
export type ThemeId = 'light' | 'dark'
export type SelectedThemeId = ThemeId | 'auto'

// Removed theme ids (Slice 3) and what they resolve to, for installs
// that still have one persisted. blue/classic were light-base,
// green/purple were dark-base.
const LEGACY_THEME_ID_MAP: Record<string, ThemeId> = {
  blue: 'light',
  classic: 'light',
  green: 'dark',
  purple: 'dark',
}

/** Normalise a persisted/legacy selection: removed ids map to light/dark, unknown ids -> null. */
const normalizeSelectedThemeId = (themeId: string): SelectedThemeId | null => {
  if (themeId === 'light' || themeId === 'dark' || themeId === 'auto') return themeId
  return LEGACY_THEME_ID_MAP[themeId] ?? null
}

// 当前主题ID (the *applied* id: 'light' | 'dark', never 'auto')
export const currentThemeId = ref<ThemeId>('light')

// 主题类型定义
export interface ThemeConfig {
  id: ThemeId
  labelKey: string
  naiveTheme: GlobalTheme | null
  themeOverrides: GlobalThemeOverrides
}

/** All per-mode values. Accent/on-accent mirror --color-accent / --color-on-accent in tokens.css. */
interface ThemePalette {
  accent: string
  accentHover: string
  accentPressed: string
  accentSuppl: string
  onAccent: string
  onAccentDisabled: string
  info: string
  infoHover: string
  infoPressed: string
  infoSuppl: string
  success: string
  successHover: string
  successPressed: string
  successSuppl: string
  warning: string
  warningHover: string
  warningPressed: string
  warningSuppl: string
  warningBorder: string
  warningText: string
  error: string
  errorHover: string
  errorPressed: string
  errorSuppl: string
  body: string
  surface: string
  table: string
  tableHeader: string
  input: string
  inputDisabled: string
  action: string
  hoverOverlay: string
  hoverOverlayStrong: string
  text1: string
  text2: string
  text3: string
  textDisabled: string
  inputTextDisabled: string
  placeholder: string
  placeholderDisabled: string
  icon: string
  iconHover: string
  iconPressed: string
  iconDisabled: string
  border: string
  divider: string
  scrollbar: string
  scrollbarHover: string
  close: string
  closeHover: string
  closePressed: string
  clear: string
  clearHover: string
  clearPressed: string
  inputBorder: string
  inputBorderHover: string
  inputBorderDisabled: string
  focusRing: string
  focusRingSoft: string
  warningRing: string
  errorRing: string
  btnDefault: string
  btnDefaultHover: string
  btnDefaultPressed: string
  btnDefaultBorder: string
  btnDefaultBorderHover: string
  btnDefaultBorderPressed: string
  disabledBg: string
  ripple: string
  tab: string
  tabActive: string
  radioActiveBg: string
  shadow: string
}

const lightPalette: ThemePalette = {
  accent: '#0f766e',
  accentHover: '#185cb8',
  accentPressed: '#134c98',
  accentSuppl: '#6caef7',
  onAccent: '#ffffff',
  onAccentDisabled: 'rgba(255, 255, 255, 0.6)',
  info: '#0074e2',
  infoHover: '#005fb8',
  infoPressed: '#004e96',
  infoSuppl: '#b9d7ff',
  success: '#198100',
  successHover: '#146a00',
  successPressed: '#0f5200',
  successSuppl: '#bce0bb',
  warning: '#ffce2f',
  warningHover: '#e6b800',
  warningPressed: '#c9a000',
  warningSuppl: '#fae19e',
  warningBorder: '#836700',
  warningText: '#836700',
  error: '#c9303a',
  errorHover: '#a92632',
  errorPressed: '#8f1f28',
  errorSuppl: '#ffc4be',
  body: '#f1f1f1',
  surface: '#ffffff',
  table: '#ffffff',
  tableHeader: '#f1f1f1',
  input: '#ffffff',
  inputDisabled: '#f1f1f1',
  action: '#f1f1f1',
  hoverOverlay: 'rgba(31, 107, 209, 0.08)',
  hoverOverlayStrong: 'rgba(31, 107, 209, 0.16)',
  text1: '#000000',
  text2: '#474747',
  text3: '#767676',
  textDisabled: '#919191',
  inputTextDisabled: 'rgba(0, 0, 0, 0.45)',
  placeholder: '#767676',
  placeholderDisabled: 'rgba(118, 118, 118, 0.6)',
  icon: '#767676',
  iconHover: '#474747',
  iconPressed: '#000000',
  iconDisabled: 'rgba(118, 118, 118, 0.5)',
  border: '#00000014',
  divider: '#00000014',
  scrollbar: 'rgba(0, 0, 0, 0.25)',
  scrollbarHover: 'rgba(0, 0, 0, 0.45)',
  close: 'rgba(0, 0, 0, 0.55)',
  closeHover: '#000000',
  closePressed: '#000000',
  clear: 'rgba(0, 0, 0, 0.2)',
  clearHover: 'rgba(0, 0, 0, 0.3)',
  clearPressed: 'rgba(0, 0, 0, 0.4)',
  // 3:1 boundary: #767676 on #ffffff = 4.54:1 (token
  // --color-border-emphasized #d4d4d4 is only 1.48:1 — see header).
  inputBorder: '#767676',
  inputBorderHover: '#525252',
  inputBorderDisabled: 'rgba(118, 118, 118, 0.5)',
  focusRing: '0 0 0 2px rgba(31, 107, 209, 0.25)',
  focusRingSoft: '0 0 0 2px rgba(31, 107, 209, 0.12)',
  warningRing: '0 0 0 2px rgba(131, 103, 0, 0.25)',
  errorRing: '0 0 0 2px rgba(201, 48, 58, 0.25)',
  btnDefault: '#ffffff',
  btnDefaultHover: '#f1f1f1',
  btnDefaultPressed: '#e8e8e8',
  btnDefaultBorder: '#767676',
  btnDefaultBorderHover: '#525252',
  btnDefaultBorderPressed: '#404040',
  disabledBg: '#b9d7ff',
  ripple: 'rgba(31, 107, 209, 0.25)',
  tab: '#f1f1f1',
  tabActive: '#ffffff',
  radioActiveBg: '#b9d7ff',
  shadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
}

const darkPalette: ThemePalette = {
  accent: '#2dd4bf',
  accentHover: '#87aefe',
  accentPressed: '#a3c0fe',
  accentSuppl: '#253c5a',
  onAccent: '#111111',
  onAccentDisabled: 'rgba(17, 17, 17, 0.55)',
  info: '#6d9cfe',
  infoHover: '#87aefe',
  infoPressed: '#a3c0fe',
  infoSuppl: '#88bcff3d',
  success: '#64af4c',
  successHover: '#79bd63',
  successPressed: '#90ca90',
  successSuppl: '#90ca903d',
  warning: '#ffce2f',
  warningHover: '#ffd94d',
  warningPressed: '#eec448',
  warningSuppl: '#e2b6233d',
  warningBorder: '#eec448',
  warningText: '#eec448',
  error: '#ff705d',
  errorHover: '#ff8a7a',
  errorPressed: '#ffaea7',
  errorSuppl: '#ff98903d',
  body: '#1b1b1b',
  surface: '#1b1b1b',
  table: '#262626',
  tableHeader: '#1b1b1b',
  input: '#262626',
  inputDisabled: '#1b1b1b',
  action: '#262626',
  hoverOverlay: 'rgba(109, 156, 254, 0.08)',
  hoverOverlayStrong: 'rgba(109, 156, 254, 0.16)',
  text1: '#ffffff',
  text2: '#9e9e9e',
  text3: '#9e9e9e',
  textDisabled: '#525252',
  inputTextDisabled: 'rgba(255, 255, 255, 0.45)',
  placeholder: '#9e9e9e',
  placeholderDisabled: 'rgba(158, 158, 158, 0.6)',
  icon: '#9e9e9e',
  iconHover: '#ffffff',
  iconPressed: '#ffffff',
  iconDisabled: 'rgba(158, 158, 158, 0.5)',
  border: '#ffffff1a',
  divider: '#ffffff1a',
  scrollbar: 'rgba(255, 255, 255, 0.25)',
  scrollbarHover: 'rgba(255, 255, 255, 0.45)',
  close: 'rgba(255, 255, 255, 0.6)',
  closeHover: '#ffffff',
  closePressed: '#ffffff',
  clear: 'rgba(255, 255, 255, 0.2)',
  clearHover: 'rgba(255, 255, 255, 0.3)',
  clearPressed: 'rgba(255, 255, 255, 0.4)',
  // 3:1 boundary: #9e9e9e on #262626 = 5.65:1 (token
  // --color-border-emphasized #525252 is only 1.94:1 — see header).
  inputBorder: '#9e9e9e',
  inputBorderHover: '#c2c2c2',
  inputBorderDisabled: 'rgba(158, 158, 158, 0.5)',
  focusRing: '0 0 0 2px rgba(109, 156, 254, 0.3)',
  focusRingSoft: '0 0 0 2px rgba(109, 156, 254, 0.12)',
  warningRing: '0 0 0 2px rgba(238, 196, 72, 0.3)',
  errorRing: '0 0 0 2px rgba(255, 112, 93, 0.3)',
  btnDefault: '#262626',
  btnDefaultHover: '#333333',
  btnDefaultPressed: '#404040',
  btnDefaultBorder: '#9e9e9e',
  btnDefaultBorderHover: '#c2c2c2',
  btnDefaultBorderPressed: '#d4d4d4',
  disabledBg: '#253c5a',
  ripple: 'rgba(109, 156, 254, 0.3)',
  tab: '#1b1b1b',
  tabActive: '#262626',
  radioActiveBg: '#253c5a',
  shadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
}

/**
 * One builder for both modes. Sizing is fixed by the design system, not
 * the palette: fontSizeMedium 16px (inputs/selects, all screens),
 * heightMedium 36px (desktop floor; 44px mobile lives in compact CSS).
 */
const buildThemeOverrides = (p: ThemePalette): GlobalThemeOverrides => ({
  common: {
    primaryColor: p.accent,
    primaryColorHover: p.accentHover,
    primaryColorPressed: p.accentPressed,
    primaryColorSuppl: p.accentSuppl,
    infoColor: p.info,
    infoColorHover: p.infoHover,
    infoColorPressed: p.infoPressed,
    infoColorSuppl: p.infoSuppl,
    successColor: p.success,
    successColorHover: p.successHover,
    successColorPressed: p.successPressed,
    successColorSuppl: p.successSuppl,
    warningColor: p.warning,
    warningColorHover: p.warningHover,
    warningColorPressed: p.warningPressed,
    warningColorSuppl: p.warningSuppl,
    errorColor: p.error,
    errorColorHover: p.errorHover,
    errorColorPressed: p.errorPressed,
    errorColorSuppl: p.errorSuppl,
    bodyColor: p.body,
    cardColor: p.surface,
    modalColor: p.surface,
    popoverColor: p.surface,
    tableColor: p.table,
    tableHeaderColor: p.tableHeader,
    inputColor: p.input,
    inputColorDisabled: p.inputDisabled,
    actionColor: p.action,
    hoverColor: p.hoverOverlay,
    textColorBase: p.text1,
    textColor1: p.text1,
    textColor2: p.text2,
    textColor3: p.text3,
    textColorDisabled: p.textDisabled,
    placeholderColor: p.placeholder,
    placeholderColorDisabled: p.placeholderDisabled,
    iconColor: p.icon,
    iconColorHover: p.iconHover,
    iconColorPressed: p.iconPressed,
    iconColorDisabled: p.iconDisabled,
    borderColor: p.border,
    dividerColor: p.divider,
    scrollbarColor: p.scrollbar,
    scrollbarColorHover: p.scrollbarHover,
    closeIconColor: p.close,
    closeIconColorHover: p.closeHover,
    closeIconColorPressed: p.closePressed,
    clearColor: p.clear,
    clearColorHover: p.clearHover,
    clearColorPressed: p.clearPressed,
  },
  /* A11Y-H02 + R3D-01: Naive's Tag/Typography warning TEXT defaults to
   * common.warningColor (#ffce2f) — unreadable on the pale warning
   * background (1.40:1) and on white (1.49:1). The design-system token
   * --color-status-warning-text (#836700 light / #eec448 dark) is the
   * text color; warningColor itself stays #ffce2f so warning buttons,
   * alert icons and other warning surfaces are unaffected. */
  Tag: {
    textColorWarning: p.warningText,
    closeIconColorWarning: p.warningText,
    closeIconColorHoverWarning: p.warningText,
    closeIconColorPressedWarning: p.warningText,
  },
  Typography: {
    textColorWarning: p.warningText,
  },
  Button: {
    fontSizeMedium: '16px',
    heightMedium: '36px',
    borderRadiusMedium: '10px',
    textColorPrimary: p.onAccent,
    textColorHoverPrimary: p.onAccent,
    textColorPressedPrimary: p.onAccent,
    textColorFocusPrimary: p.onAccent,
    textColorDisabledPrimary: p.onAccentDisabled,
    colorPrimary: p.accent,
    colorHoverPrimary: p.accentHover,
    colorPressedPrimary: p.accentPressed,
    colorFocusPrimary: p.accent,
    colorDisabledPrimary: p.disabledBg,
    borderPrimary: `1px solid ${p.accent}`,
    borderHoverPrimary: `1px solid ${p.accentHover}`,
    borderPressedPrimary: `1px solid ${p.accentPressed}`,
    borderFocusPrimary: `1px solid ${p.accent}`,
    borderDisabledPrimary: `1px solid ${p.disabledBg}`,
    rippleColorPrimary: p.ripple,
    textColor: p.text1,
    textColorHover: p.text1,
    textColorPressed: p.text1,
    color: p.btnDefault,
    colorHover: p.btnDefaultHover,
    colorPressed: p.btnDefaultPressed,
    border: `1px solid ${p.btnDefaultBorder}`,
    borderHover: `1px solid ${p.btnDefaultBorderHover}`,
    borderPressed: `1px solid ${p.btnDefaultBorderPressed}`,
  },
  Input: {
    fontSizeMedium: '16px',
    heightMedium: '36px',
    borderRadius: '10px',
    lineHeight: '1.5',
    color: p.input,
    colorDisabled: p.inputDisabled,
    colorFocus: p.input,
    textColor: p.text1,
    textColorDisabled: p.inputTextDisabled,
    placeholderColor: p.placeholder,
    placeholderColorDisabled: p.placeholderDisabled,
    iconColor: p.icon,
    iconColorHover: p.iconHover,
    iconColorPressed: p.iconPressed,
    iconColorDisabled: p.iconDisabled,
    clearColor: p.clear,
    clearColorHover: p.clearHover,
    clearColorPressed: p.clearPressed,
    border: `1px solid ${p.inputBorder}`,
    borderDisabled: `1px solid ${p.inputBorderDisabled}`,
    borderHover: `1px solid ${p.inputBorderHover}`,
    borderFocus: `1px solid ${p.accent}`,
    boxShadowFocus: p.focusRing,
    borderWarning: `1px solid ${p.warningBorder}`,
    borderHoverWarning: `1px solid ${p.warningBorder}`,
    borderFocusWarning: `1px solid ${p.warningBorder}`,
    boxShadowFocusWarning: p.warningRing,
    borderError: `1px solid ${p.error}`,
    borderHoverError: `1px solid ${p.error}`,
    borderFocusError: `1px solid ${p.error}`,
    boxShadowFocusError: p.errorRing,
    caretColor: p.accent,
    suffixTextColor: p.text2,
    prefixTextColor: p.text2,
  },
  Select: {
    peers: {
      InternalSelection: {
        fontSizeMedium: '16px',
        heightMedium: '36px',
        borderRadius: '10px',
        textColor: p.text1,
        textColorDisabled: p.inputTextDisabled,
        placeholderColor: p.placeholder,
        placeholderColorDisabled: p.placeholderDisabled,
        color: p.input,
        colorDisabled: p.inputDisabled,
        colorActive: p.input,
        border: `1px solid ${p.inputBorder}`,
        borderHover: `1px solid ${p.inputBorderHover}`,
        borderActive: `1px solid ${p.accent}`,
        borderFocus: `1px solid ${p.accent}`,
        boxShadowHover: p.focusRingSoft,
        boxShadowActive: p.focusRing,
        boxShadowFocus: p.focusRing,
        borderWarning: `1px solid ${p.warningBorder}`,
        borderHoverWarning: `1px solid ${p.warningBorder}`,
        borderActiveWarning: `1px solid ${p.warningBorder}`,
        borderFocusWarning: `1px solid ${p.warningBorder}`,
        boxShadowFocusWarning: p.warningRing,
        borderError: `1px solid ${p.error}`,
        borderHoverError: `1px solid ${p.error}`,
        borderActiveError: `1px solid ${p.error}`,
        borderFocusError: `1px solid ${p.error}`,
        boxShadowFocusError: p.errorRing,
        caretColor: p.accent,
        arrowColor: p.icon,
        arrowColorDisabled: p.iconDisabled,
        loadingColor: p.accent,
      },
      InternalSelectMenu: {
        optionFontSizeMedium: '16px',
        optionHeightMedium: '36px',
        borderRadius: '10px',
        color: p.surface,
        optionTextColor: p.text1,
        optionTextColorPressed: p.text1,
        optionTextColorActive: p.text1,
        optionColorPending: p.hoverOverlay,
        optionColorActive: p.hoverOverlayStrong,
        optionColorActivePending: p.hoverOverlayStrong,
        optionCheckColor: p.accent,
      },
    },
  },
  Card: {
    borderRadius: '12px',
    color: p.surface,
    colorModal: p.surface,
    colorTarget: p.surface,
    textColor: p.text1,
    titleTextColor: p.text1,
    borderColor: p.border,
    actionColor: p.action,
    closeIconColor: p.icon,
    closeIconColorHover: p.iconHover,
    closeIconColorPressed: p.iconPressed,
    boxShadow: p.shadow,
  },
  Tabs: {
    tabColor: p.tab,
    tabColorActive: p.tabActive,
    tabBorderColor: p.border,
    tabTextColorBar: p.text2,
    tabTextColorBarHover: p.text1,
    tabTextColorBarActive: p.text1,
    tabTextColorCard: p.text2,
    tabTextColorCardActive: p.text1,
    barColor: p.accent,
  },
  Radio: {
    buttonBorderColor: p.inputBorder,
    buttonBorderColorActive: p.accent,
    buttonColor: p.input,
    buttonColorActive: p.radioActiveBg,
    buttonTextColor: p.text2,
    buttonTextColorActive: p.text1,
  },
  Dropdown: {
    color: p.surface,
    optionTextColor: p.text1,
    optionTextColorHover: p.text1,
    optionTextColorActive: p.text1,
    optionColorHover: p.hoverOverlay,
    optionColorActive: p.hoverOverlayStrong,
    borderColor: p.border,
  },
})

// 纯Naive UI主题配置 - 完全消除CSS依赖
export const naiveThemeConfigs: Record<ThemeId, ThemeConfig> = {
  light: {
    id: 'light',
    labelKey: 'theme.light',
    naiveTheme: lightTheme,
    themeOverrides: buildThemeOverrides(lightPalette),
  },
  dark: {
    id: 'dark',
    labelKey: 'theme.dark',
    naiveTheme: darkTheme,
    themeOverrides: buildThemeOverrides(darkPalette),
  },
}

// 获取可用主题列表
export const availableThemes = Object.values(naiveThemeConfigs)

// 当前主题配置
export const currentThemeConfig = computed(() =>
  naiveThemeConfigs[currentThemeId.value] || naiveThemeConfigs.light
)

// 当前 Naive UI 主题
export const currentNaiveTheme = computed<GlobalTheme | null>(() =>
  currentThemeConfig.value.naiveTheme
)

// 当前主题覆盖配置
export const currentThemeOverrides = computed<GlobalThemeOverrides>(() =>
  currentThemeConfig.value.themeOverrides || {}
)

const resolveAppliedThemeId = (selectedThemeId: string): ThemeId => {
  const normalized = normalizeSelectedThemeId(selectedThemeId)
  if (normalized === 'auto' || normalized === null) {
    // 'auto', and any unknown id, fall back to the OS preference (light on failure).
    try {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  }
  return normalized
}

const applyThemeId = (selectedThemeId: string): boolean => {
  const applied = resolveAppliedThemeId(selectedThemeId)
  if (!naiveThemeConfigs[applied]) {
    console.warn(`Theme '${applied}' not found`)
    return false
  }
  currentThemeId.value = applied

  // Keep Tailwind's `dark:` variant in sync with the app theme.
  // Tailwind in this repo uses `darkMode: 'class'`, so we must toggle `.dark`.
  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      const isDark = naiveThemeConfigs[applied]?.naiveTheme === darkTheme
      document.documentElement.classList.toggle('dark', Boolean(isDark))
    }
  } catch (error) {
    // Best-effort only; theme switching must not break if DOM is unavailable.
    console.warn('[Theme] Failed to sync Tailwind dark class:', error)
  }
  return true
}

type MediaQueryListCompat = MediaQueryList & {
  addListener?: (listener: (e: MediaQueryListEvent) => void) => void
  removeListener?: (listener: (e: MediaQueryListEvent) => void) => void
}

let __autoColorSchemeWatchInitialized = false
let __autoColorSchemeQuery: MediaQueryListCompat | null = null
let __autoColorSchemeListener: ((e: MediaQueryListEvent) => void) | null = null

const cleanupAutoColorSchemeWatch = (): void => {
  try {
    const query = __autoColorSchemeQuery
    const listener = __autoColorSchemeListener
    if (!query || !listener) return

    if (typeof query.removeEventListener === 'function') {
      query.removeEventListener('change', listener)
    } else if (typeof query.removeListener === 'function') {
      query.removeListener(listener)
    }
  } catch (error) {
    console.warn('[Theme] Failed to cleanup prefers-color-scheme watcher:', error)
  } finally {
    __autoColorSchemeQuery = null
    __autoColorSchemeListener = null
    __autoColorSchemeWatchInitialized = false
  }
}

const ensureAutoColorSchemeWatch = (settings: ReturnType<typeof useGlobalSettings>): void => {
  // Only relevant when the user-selected theme is 'auto'.
  if (__autoColorSchemeWatchInitialized) return
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

  try {
    const query = window.matchMedia('(prefers-color-scheme: dark)') as MediaQueryListCompat
    const listener = (_e: MediaQueryListEvent) => {
      if (settings.state.selectedThemeId !== 'auto') return
      applyThemeId('auto')
    }

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', listener)
    } else if (typeof query.addListener === 'function') {
      query.addListener(listener)
    }

    // Keep refs so we can clean up on HMR dispose.
    __autoColorSchemeQuery = query
    __autoColorSchemeListener = listener

    // Dev-only: avoid accumulating listeners across Vite HMR reloads.
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        cleanupAutoColorSchemeWatch()
      })
    }

    __autoColorSchemeWatchInitialized = true
  } catch (error) {
    console.warn('[Theme] Failed to init prefers-color-scheme watcher:', error)
  }
}

// 主题切换（统一由 useGlobalSettings 持久化）
export const switchTheme = (themeId: string): boolean => {
  const normalized = normalizeSelectedThemeId(themeId)
  if (normalized === null) {
    console.warn(`Theme '${themeId}' not found`)
    return false
  }
  const settings = useGlobalSettings(pinia)
  settings.updateThemeId(normalized)

  const ok = applyThemeId(normalized)
  if (ok) {
    console.log(`Pure Naive UI theme switched to: ${normalized}`)
  }
  return ok
}

// 获取当前主题ID
export const getCurrentThemeId = (): string => currentThemeId.value

// 获取主题配置 (removed ids resolve to their light/dark replacement)
export const getThemeConfig = (themeId: string): ThemeConfig | null => {
  const normalized = normalizeSelectedThemeId(themeId)
  if (normalized === null || normalized === 'auto') return null
  return naiveThemeConfigs[normalized] || null
}

// 初始化主题系统
export const initializeNaiveTheme = (): void => {
  const settings = useGlobalSettings(pinia)

  // 一次性迁移：localStorage('naive-theme-id') → useGlobalSettings
  // 只在 global-settings/v1 尚未恢复且当前为默认 'auto' 时执行
  try {
    const legacy = localStorage.getItem('naive-theme-id')
    if (legacy && settings.state.selectedThemeId === 'auto' && !settings.hasRestored) {
      settings.updateThemeId(legacy)
    }
  } catch (error) {
    console.warn('Failed to load legacy theme preference:', error)
  }

  // 一次性规范化：已持久化的 theme id 若已被删除 (blue/classic/green/
  // purple) 或未知 -> 对应的 light/dark, 或 'auto'.
  const stored = settings.state.selectedThemeId
  const normalizedStored = normalizeSelectedThemeId(stored)
  if (normalizedStored && normalizedStored !== stored) {
    settings.updateThemeId(normalizedStored)
  } else if (normalizedStored === null) {
    console.warn(`Unknown persisted theme '${stored}', resetting to 'auto'`)
    settings.updateThemeId('auto')
  }

  // When in 'auto' mode, keep theme synced with OS color scheme changes.
  ensureAutoColorSchemeWatch(settings)

  // 监听全局配置的主题选择，驱动实际应用主题
  // 使用模块级 guard，防止 initializeNaiveTheme 被多次调用时重复注册 watch
  if (!__themeWatchInitialized) {
    __themeWatchInitialized = true
    watch(
      () => settings.state.selectedThemeId,
      (selectedId) => {
        if (!selectedId) return
        applyThemeId(selectedId)
      },
      { immediate: true }
    )
  } else {
    // 已注册 watch：手动应用一次，确保初始化时 theme 与 state 对齐
    applyThemeId(settings.state.selectedThemeId)
  }
}

let __themeWatchInitialized = false

// 检查是否为深色主题
export const isDarkTheme = computed(() => {
  const config = currentThemeConfig.value
  return config.naiveTheme === darkTheme
})

// 为向后兼容性导出的别名
export const naiveTheme = currentNaiveTheme
export const themeOverrides = currentThemeOverrides
