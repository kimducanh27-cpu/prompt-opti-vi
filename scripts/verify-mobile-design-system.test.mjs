import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import {
  verifyTokensFile,
  scanCompactCssForSubTouchTargets,
  verifyVietnameseLocalizationFiles,
} from './verify-mobile-design-system.mjs'

const repoRoot = process.cwd()

test('verifyTokensFile confirms all required semantic tokens, 5 themes, 16px input floor, 44px touch target, and reduced-motion guard', () => {
  const content = fs.readFileSync(path.join(repoRoot, 'packages/ui/src/styles/tokens.css'), 'utf8')
  const report = verifyTokensFile(content)
  assert.equal(report.ok, true)
  assert.deepEqual(report.missingTokens, [])
  assert.deepEqual(report.missingThemes, [])
  assert.equal(report.hasReducedMotion, true)
  assert.equal(report.hasMobileInputFloor16px, true)
  assert.equal(report.hasTouchTarget44px, true)
})

test('scanCompactCssForSubTouchTargets confirms zero <44px height regressions in styles/compact/*.css', () => {
  const violations = scanCompactCssForSubTouchTargets(
    path.join(repoRoot, 'packages/ui/src/styles/compact'),
  )
  assert.deepEqual(violations, [])
})

test('verifyVietnameseLocalizationFiles confirms complete vi-VN UI coverage while preserving core template languages', () => {
  const issues = verifyVietnameseLocalizationFiles(repoRoot)
  assert.deepEqual(issues, [])
})
