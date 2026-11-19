# prompt-optimizer UI Architecture Constitution

## Core Principles

### I. Backend Preservation (NON-NEGOTIABLE)
All business logic, core services, platform adapters, Pinia stores, and composables MUST remain unchanged. Only the presentation layer (`packages/ui` components/views/styles and `packages/web` shell) may be rewritten. Any change to `packages/core`, `packages/mcp-server`, `packages/desktop`, `packages/extension`, or stores/composables in `packages/ui` constitutes a violation.

### II. Feature Parity 100% (NON-NEGOTIABLE)
Every existing feature must be mapped in a Feature Parity Matrix and verified against real store/backend wiring. No stubs, no mocks, no omitted features. The matrix must tick 100% before any PR is considered complete.

### III. Test-First TDD (NON-NEGOTIABLE)
Red-Green-Refactor cycle strictly enforced for all UI work:
- RED: Write test that connects to real store/backend and covers the feature; confirm it fails.
- GREEN: Write minimal UI to make test pass.
- REFACTOR: Clean up while keeping tests green.
Code written before its test must be deleted immediately.

### IV. Worktree Isolation (NON-NEGOTIABLE)
Every task that deletes old UI or writes new UI MUST run in a clean git worktree on a dedicated branch. No direct commits to main/master.

### V. Subagent Orchestration
All implementation tasks are executed by specialized subagents (spec-author, TDD worker, screenshot QA worker, fresh-context reviewer, parallel reviewers) with isolated contexts. The orchestrator coordinates via the task DAG.

### VI. Anti-AI-Design Gate (NON-NEGOTIABLE)
The `funboy322/avoid-ai-design` scanner MUST pass with exit code 0: zero P0/P1 findings among the 81 AI tells, stack score < 6. Gradient text, pill badges, decorative orbs, tracked all-caps eyebrows, and monochrome palettes are forbidden. If `impeccable` suggestions conflict with avoid-ai-design P0/P1, the avoid-ai-design remediation wins.

### VII. Zero Animation (NON-NEGOTIABLE)
No `@keyframes`, `transition`, Vue `<Transition>`, or motion libraries. Only instantaneous color/opacity changes on `:active` are permitted. `impeccable-animate` and `impeccable-delight` micro-interactions are banned.

### VIII. Mobile-First Honor Magic 6 (NON-NEGOTIABLE)
Primary viewports: `412×915` and `421×933` CSS px with `env(safe-area-inset-top/bottom)` for punch-hole and gesture bar. Input font-size ≥ 16px. Tap targets ≥ 44×44px. No horizontal overflow (`scrollWidth ≤ innerWidth`). Desktop ≥ 1024px split-pane layout must be preserved.

### IX. Screenshot QA + DOM Measurement (NON-NEGOTIABLE)
Headless Playwright/Chromium must render the build, capture full-flow screenshots, and measure real DOM:
- `scrollWidth / innerWidth`
- input `font-size`
- minimum tap target
- computed `animationDuration` / `transitionDuration` = 0s
- punch-hole/gesture bar occlusion check
Evidence (screenshots + measurements) must be attached to the verification log.

### X. Two-Stage Review (NON-NEGOTIABLE)
- Tier 1: Fresh-context subagent diffs implementation against `spec.md` and Feature Parity Matrix; 100% match required to proceed.
- Tier 2: Parallel subagents hunt logic/layout/backend-wiring bugs; agent jury votes and labels `[Important | Nit | Pre-existing]` (style-only discarded).
- Maximum 3 revision rounds for Important findings. Beyond 3 rounds with remaining Important issues, or any build/scanner/screenshot failure → hard stop, list blockers, no auto-merge.

## Governance

- Constitution supersedes all other practices.
- Amendments require documented rationale, approval, and migration plan.
- All PRs/reviews must verify compliance with every principle above.
- Complexity must be justified; YAGNI applies.
- Human approval gate at PR packaging is mandatory; no auto-merge.

**Version**: 1.0.0 | **Ratified**: 2026-11-19 | **Last Amended**: 2026-11-19