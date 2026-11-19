import fs from 'node:fs'
import path from 'node:path'

import { toComparableFileUrl } from './direct-execution.mjs'

const REQUIRED_TOKENS = [
  '--po-color-bg-body',
  '--po-color-bg-surface',
  '--po-color-bg-card',
  '--po-color-bg-popover',
  '--po-color-bg-muted',
  '--po-color-text-primary',
  '--po-color-text-secondary',
  '--po-color-text-muted',
  '--po-color-text-disabled',
  '--po-color-accent',
  '--po-color-on-accent',
  '--po-color-border',
  '--po-color-info',
  '--po-color-success',
  '--po-color-warning',
  '--po-color-error',
  '--po-font-sans',
  '--po-font-mono',
  '--po-text-input-mobile',
  '--po-space-1',
  '--po-space-2',
  '--po-space-3',
  '--po-space-4',
  '--po-radius-sm',
  '--po-radius-md',
  '--po-radius-lg',
  '--po-radius-sheet',
  '--po-touch-target',
  '--po-touch-target-lg',
  '--po-shadow-resting',
  '--po-shadow-floating-md',
  '--po-z-sticky',
  '--po-z-dropdown',
  '--po-z-sheet',
  '--po-z-modal',
  '--po-duration-fast',
  '--po-duration-medium',
  '--po-ease-standard',
  '--po-focus-ring',
  '--po-safe-top',
  '--po-safe-bottom',
  '--po-safe-left',
  '--po-safe-right',
]

const REQUIRED_THEMES = [
  'data-workspace-theme="light"',
  'data-workspace-theme="dark"',
  'data-workspace-theme="blue"',
  'data-workspace-theme="green"',
  'data-workspace-theme="purple"',
  'data-workspace-theme="classic"',
]

export function verifyTokensFile(tokensCssContent) {
  const missingTokens = REQUIRED_TOKENS.filter((token) => !tokensCssContent.includes(`${token}:`))
  const missingThemes = REQUIRED_THEMES.filter((theme) => !tokensCssContent.includes(theme))
  const hasReducedMotion = tokensCssContent.includes('prefers-reduced-motion: reduce')
  const hasMobileInputFloor16px = /--po-text-input-mobile:\s*1rem/.test(tokensCssContent)
  const hasTouchTarget44px = /--po-touch-target:\s*44px/.test(tokensCssContent)

  return {
    ok:
      missingTokens.length === 0 &&
      missingThemes.length === 0 &&
      hasReducedMotion &&
      hasMobileInputFloor16px &&
      hasTouchTarget44px,
    missingTokens,
    missingThemes,
    hasReducedMotion,
    hasMobileInputFloor16px,
    hasTouchTarget44px,
  }
}

export function scanCompactCssForSubTouchTargets(cssDir) {
  const files = fs
    .readdirSync(cssDir)
    .filter((f) => f.endsWith('.css'))
    .sort()

  const violations = []
  const disallowedPattern = /(?:min-height|--n-height)\s*:\s*(?:2[0-9]|3[0-9])px\b/

  for (const file of files) {
    const fullPath = path.join(cssDir, file)
    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)
    lines.forEach((line, idx) => {
      if (disallowedPattern.test(line)) {
        violations.push({
          file: path.join('packages/ui/src/styles/compact', file),
          line: idx + 1,
          text: line.trim(),
        })
      }
    })
  }

  return violations
}

export function verifyVietnameseLocalizationFiles(repoRoot) {
  const checks = []

  // 1. Check 12 files in packages/ui/src/i18n/locales/vi-VN/
  const expectedModules = [
    'index.ts',
    'arena.ts',
    'workspace.ts',
    'core.ts',
    'favorites.ts',
    'prompt.ts',
    'models.ts',
    'templates.ts',
    'testing.ts',
    'context.ts',
    'image.ts',
    'errors.ts',
  ]
  for (const mod of expectedModules) {
    const p = path.join(repoRoot, 'packages/ui/src/i18n/locales/vi-VN', mod)
    if (!fs.existsSync(p)) {
      checks.push(`Missing vi-VN locale module: ${mod}`)
    }
  }

  // 2. Check plugins/i18n.ts includes vi-VN
  const i18nPlugin = fs.readFileSync(path.join(repoRoot, 'packages/ui/src/plugins/i18n.ts'), 'utf8')
  if (!i18nPlugin.includes('"vi-VN"') || !i18nPlugin.includes("return 'vi-VN'")) {
    checks.push('packages/ui/src/plugins/i18n.ts is missing full vi-VN support')
  }

  // 3. Check LanguageSwitchDropdown.vue includes vi-VN
  const langDropdown = fs.readFileSync(
    path.join(repoRoot, 'packages/ui/src/components/LanguageSwitchDropdown.vue'),
    'utf8',
  )
  if (!langDropdown.includes("key: 'vi-VN'")) {
    checks.push('packages/ui/src/components/LanguageSwitchDropdown.vue is missing vi-VN option')
  }

  // 4. Check docs/compare-help.ts & docs/syntax-guide.ts include 'vi-VN'
  const compareHelp = fs.readFileSync(path.join(repoRoot, 'packages/ui/src/docs/compare-help.ts'), 'utf8')
  if (!compareHelp.includes("'vi-VN':")) {
    checks.push('packages/ui/src/docs/compare-help.ts is missing vi-VN guide')
  }
  const syntaxGuide = fs.readFileSync(path.join(repoRoot, 'packages/ui/src/docs/syntax-guide.ts'), 'utf8')
  if (!syntaxGuide.includes("'vi-VN':")) {
    checks.push('packages/ui/src/docs/syntax-guide.ts is missing vi-VN guide')
  }

  // 5. Check packages/web/index.html has lang="vi" and viewport-fit=cover
  const webHtml = fs.readFileSync(path.join(repoRoot, 'packages/web/index.html'), 'utf8')
  if (!webHtml.includes('lang="vi"') || !webHtml.includes('viewport-fit=cover')) {
    checks.push('packages/web/index.html is missing lang="vi" or viewport-fit=cover')
  }

  // 6. Check core built-in template languages remain en-US and zh-CN only (per user constraint #2)
  const coreLangService = fs.readFileSync(
    path.join(repoRoot, 'packages/core/src/services/template/languageService.ts'),
    'utf8',
  )
  if (!coreLangService.includes("export type BuiltinTemplateLanguage = 'zh-CN' | 'en-US';")) {
    checks.push('packages/core/src/services/template/languageService.ts built-in template languages were unexpectedly altered')
  }

  return checks
}

export function isDirectExecution(importMetaUrl, argv1) {
  if (!argv1) return false
  return importMetaUrl === toComparableFileUrl(argv1)
}

function main() {
  const repoRoot = process.cwd()
  const tokensPath = path.join(repoRoot, 'packages/ui/src/styles/tokens.css')
  const compactDir = path.join(repoRoot, 'packages/ui/src/styles/compact')

  if (!fs.existsSync(tokensPath)) {
    console.error('[design-system] Missing packages/ui/src/styles/tokens.css')
    process.exitCode = 1
    return
  }

  const tokenReport = verifyTokensFile(fs.readFileSync(tokensPath, 'utf8'))
  const touchViolations = scanCompactCssForSubTouchTargets(compactDir)
  const i18nIssues = verifyVietnameseLocalizationFiles(repoRoot)

  let failed = false
  if (!tokenReport.ok) {
    failed = true
    console.error('[design-system] Token specification check failed:', tokenReport)
  }
  if (touchViolations.length > 0) {
    failed = true
    console.error('[design-system] Sub-44px touch target overrides found in compact CSS:')
    touchViolations.forEach((v) => console.error(`  - ${v.file}:${v.line} ${v.text}`))
  }
  if (i18nIssues.length > 0) {
    failed = true
    console.error('[design-system] Vietnamese localization verification issues:')
    i18nIssues.forEach((issue) => console.error(`  - ${issue}`))
  }

  if (failed) {
    process.exitCode = 1
    return
  }

  console.log('[design-system] All Mobile-First Design System tokens, >=44px touch targets, safe-area rules, and vi-VN localization checks passed')
}

if (isDirectExecution(import.meta.url, process.argv[1])) {
  main()
}
