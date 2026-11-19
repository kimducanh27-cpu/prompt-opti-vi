# REVIEW.md — Code Review & Verification Rules (Anthropic Process)

Following [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/), every change in this repository is verified against explicit, machine-checkable rules before completion, followed by a fresh-context diff review capped at a maximum of 3 convergence rounds.

## 1. What Failure Looks Like in This Repository

1. **Locale Drift (`check-locale-parity`)**: Any key present in `packages/ui/src/i18n/locales/en-US/` that is missing, extra, or shape-mismatched in `vi-VN`, `zh-CN`, or `zh-TW`.
2. **Hardcoded Runtime Copy (`check-no-chinese-runtime` / untranslated UI strings)**: User-facing strings hardcoded in `.vue` or `.ts` components instead of `t('...')`, or missing `vi-VN` support in `plugins/i18n.ts`, `LanguageSwitchDropdown.vue`, `compare-help.ts`, or `syntax-guide.ts`.
3. **Mobile Touch & Viewport Regressions**:
   - Interactive controls in `.workspace-compact` or `.arena-workspace` with touch targets smaller than `44×44px` (e.g., `36px` overrides).
   - Mobile `<input>` or `<textarea>` elements with `font-size < 16px` (triggers involuntary zoom on iOS/Android).
   - Missing `env(safe-area-inset-*)` padding on top header, bottom region switch, or fullscreen/sheet modals.
   - Horizontal overflow on `360px–430px` viewports (including Honor Magic 6 `412×915` / `421×933` CSS px) caused by longer Vietnamese labels.
4. **Desktop Regression**: Modifying desktop split-pane layout (`>= 1024px`) or breaking `packages/core` built-in prompt template languages (`en-US`, `zh-CN`).

## 2. Automated Verification Gates (Pre-Handoff)

Run and record exact output before completing any milestone:
- `node scripts/check-locale-parity.mjs` — Must verify `zh-CN`, `zh-TW`, and `vi-VN` against `en-US` with `0` missing, `0` extra, and `0` shape mismatches.
- `node scripts/check-no-chinese-runtime.mjs` — Must report `0` disallowed Chinese runtime strings.
- `node scripts/verify-mobile-design-system.mjs` — Must verify token completeness, `>= 44px` mobile touch target rules, `16px` input floor, safe-area insets, Vietnamese diacritic font stacks, and zero hardcoded untranslated UI strings.
- `node --test` on repository test suites (`run-many.test.mjs`, `check-locale-parity.test.mjs`, `check-no-chinese-runtime.test.mjs`, `package-scripts.test.mjs`, `release-notes.test.mjs`, `middleware-auth.test.mjs`, `workspace-select-config.test.mjs`).

## 3. Convergence Protocol

- Review the full `git diff` in a fresh context against `DESIGN.md` and `REVIEW.md`.
- Tag every finding as `Important`, `Nit`, or `Pre-existing` with `file:line` evidence.
- Fix the **entire class of bug** across all files, not just a single line.
- Cap review-and-fix loops at **3 rounds maximum**.
