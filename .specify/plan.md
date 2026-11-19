# Implementation Plan: Complete UI Rewrite with Backend Preservation

**Branch**: `001-complete-ui-rewrite` | **Date**: 2026-11-19 | **Spec**: .specify/spec.md

**Input**: Feature specification from `.specify/spec.md`

## Summary

Complete rewrite of the presentation layer (`packages/ui` components/views/styles and `packages/web` shell) while preserving 100% of backend logic in `packages/core`, `packages/mcp-server`, `packages/desktop`, `packages/extension`, and all Pinia stores/composables in `packages/ui`. The new UI will be built using the `impeccable` design system, enforced by `funboy322/avoid-ai-design` scanner, with mobile-first Honor Magic 6 support, zero animations, TDD workflow, and two-stage review.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3.5, Vite 8
**Primary Dependencies**: Naive UI 2.44, Tailwind CSS 4.2, Pinia 3, Vue Router 5, vue-i18n 11, @impeccable/* design system
**Storage**: IndexedDB (via idb), localStorage, Electron Store (desktop), Chrome Storage (extension)
**Testing**: Vitest (unit), Playwright (e2e), funboy322/avoid-ai-design (design scanner)
**Target Platform**: Web (PWA), Chrome Extension, Electron Desktop
**Project Type**: Monorepo (pnpm workspaces) with 6 packages

**Performance Goals**:
- Initial load < 2s on mobile 3G
- Interaction response < 100ms
- No layout shift (CLS = 0)
- Bundle size < 500KB gzipped (web)

**Constraints**:
- Zero animations/transitions
- Mobile-first: Honor Magic 6 (412×915, 421×933) with safe-area insets
- Desktop: ≥1024px split-pane layout preserved
- Input font-size ≥ 16px, tap targets ≥ 44×44px
- No horizontal overflow (scrollWidth ≤ innerWidth)
- 4-locale parity (en-US, zh-CN, zh-TW, vi-VN)
- avoid-ai-design exit code 0 (P0=0, P1=0, stack score < 6)
- All work in git worktrees on feature branches
- TDD Red-Green-Refactor mandatory

**Scale/Scope**: ~200 Vue components, ~100 composables, ~20 stores, 10 user stories, ~50 viewports/flows for screenshot QA

## Constitution Check

✅ **I. Backend Preservation**: Plan explicitly preserves all backend/core/adapters/stores/composables
✅ **II. Feature Parity 100%**: Feature Parity Matrix with 10 user stories mapped to stores/composables/services
✅ **III. Test-First TDD**: Every UI component task requires RED test first
✅ **IV. Worktree Isolation**: Every task runs in clean worktree
✅ **V. Subagent Orchestration**: Plan defines roles for spec-author, TDD worker, screenshot QA, fresh-context reviewer, parallel reviewers
✅ **VI. Anti-AI-Design Gate**: avoid-ai-design CLI integrated in verification pipeline
✅ **VII. Zero Animation**: Explicitly banned in constraints and design system usage
✅ **VIII. Mobile-First Honor Magic 6**: Primary viewports defined with safe-area handling
✅ **IX. Screenshot QA + DOM Measurement**: Playwright headless with measurement assertions
✅ **X. Two-Stage Review**: Tier 1 (spec/parity) → Tier 2 (parallel bug hunt with jury vote)

## Project Structure

### Documentation (this feature)
```
.specify/
├── constitution.md        # Project constitution (created)
├── spec.md               # Feature specification (created)
├── plan.md               # This file
├── feature-parity-matrix.md  # 100% feature mapping (to create)
├── data-model.md         # Key entities and relationships (to create)
├── contracts/            # Store/composable API contracts (to create)
├── tasks.md              # Actionable tasks (to create via /speckit-tasks)
└── checklists/
    └── requirements.md   # Requirements quality checklist (to create)
```

### Source Code (repository root)
```
packages/
├── core/                 # PRESERVED - Core LLM/Image services, evaluation, storage
├── mcp-server/           # PRESERVED - MCP protocol server
├── desktop/              # PRESERVED - Electron main/preload
├── extension/            # PRESERVED - Chrome extension wrapper
├── ui/                   # REWRITE - Shared Vue 3 UI component library
│   ├── src/
│   │   ├── components/   # REWRITE - All Vue components
│   │   ├── views/        # REWRITE - Page-level views
│   │   ├── styles/       # REWRITE - Design system tokens, global styles
│   │   ├── composables/  # PRESERVED - All composables (100+ files)
│   │   ├── stores/       # PRESERVED - All Pinia stores (20 files)
│   │   ├── router/       # PRESERVED - Vue Router config
│   │   ├── i18n/         # PRESERVED - Locales (en-US, zh-CN, zh-TW, vi-VN)
│   │   ├── plugins/      # PRESERVED - Naive UI, i18n, etc.
│   │   ├── utils/        # REVIEW - Utility functions
│   │   └── main.ts       # PRESERVED - Library entry
│   ├── tests/            # REWRITE - Unit tests (TDD)
│   └── package.json
├── web/                  # REWRITE - Web application shell & PWA
│   ├── src/
│   │   ├── App.vue       # REWRITE
│   │   ├── main.ts       # REWRITE
│   │   └── pwa/          # PRESERVED - PWA config
│   └── package.json
└── tests/                # REWRITE - E2E tests (Playwright)
```

**Structure Decision**: Monorepo with 6 packages. `packages/core`, `mcp-server`, `desktop`, `extension` are PRESERVED. `packages/ui` and `packages/web` are REWRITTEN. `packages/ui/src/composables`, `stores`, `router`, `i18n`, `plugins` are PRESERVED. `packages/ui/src/components`, `views`, `styles`, `utils` are REWRITTEN. `packages/web/src/App.vue`, `main.ts` are REWRITTEN.

## Complexity Tracking

No constitution violations - all principles aligned with plan.

## Data Model

Key entities (from spec.md):
- **PromptSession**: Active workspace state (text, mode, variables, context chain, history)
- **OptimizationResult**: Output from prompt optimization
- **ImageGenerationResult**: Output from T2I/I2I
- **ComparisonResult**: Side-by-side evaluation output
- **ModelConfig**: LLM/image model configuration
- **PromptTemplate**: Reusable template with variables
- **FavoritePrompt**: Saved prompt with metadata, versions, sharing
- **ContextChain**: Ordered list of context nodes
- **Variable**: Named value for template substitution
- **WorkspaceExport**: Serializable full workspace state

## Contracts

Store/composable APIs that new UI must wire to (PRESERVED):

### Stores
- `usePromptDraftStore` - Current prompt text, cursor position
- `useTemporaryVariablesStore` - In-session variable overrides
- `useBasicUserSession` / `useBasicSystemSession` / `useProSession` / `useArenaSession` - Mode-specific session state
- `useGlobalSettingsStore` - Theme, language, platform settings
- `useFavoriteStore` - Favorites management
- `useHistoryStore` - Session history

### Composables (key ones)
- `usePromptOptimizer` - Optimization workflow
- `usePromptTester` - Testing workflow
- `useImageGeneration` - T2I/I2I workflow
- `useTemplateManager` - Template CRUD
- `useVariableManager` - Variable CRUD, import/export
- `useContextManagement` / `useContextEditor` - Context chain
- `useModelManager` / `useTextModelManager` / `useImageModelManager` - Model config
- `useHistoryManager` - History operations
- `useFavoriteInitializer` - Favorites bootstrap
- `usePreferenceManager` - Settings persistence
- `useDataManager` - Import/export
- `useCurrentMode` / `useProSubMode` / `useBasicSubMode` / `useImageSubMode` - Mode state
- `useComparisonRoleConfig` / `useEvaluationHandler` - Compare/test
- `useConversationOptimization` / `useConversationTester` - Conversation flows

### Core Services (via adapters)
- `core/services/compare/service.ts` - Comparison engine
- `core/services/evaluation/service.ts` - Evaluation engine
- `core/services/favorite/manager.ts` - Favorites persistence
- `core/services/history/manager.ts` - History persistence
- `core/services/data/manager.ts` - Import/export
- `core/services/image/adapters/registry.ts` - Image adapter registry

## Quickstart

1. Clone repo, `pnpm install`
2. `pnpm build` - Verify baseline builds
3. `pnpm test:unit` - Verify baseline tests pass
4. Run Spec Kit: `specify plan` → `specify tasks` → `specify implement`
5. Each task runs in worktree with TDD

---

## Phase 0: Research & Feature Parity Matrix ✅ COMPLETED

Created `.specify/feature-parity-matrix.md` mapping all 10 user stories to stores/composables/services.

## Phase 1: Design System & Foundation

### 1.1 Design System Setup (impeccable)
- Install `@impeccable/audit`, `@impeccable/adapt`, `@impeccable/layout`, `@impeccable/typeset`, `@impeccable/distill`, `@impeccable/harden`, `@impeccable/polish`
- Configure tokens in `packages/ui/src/styles/tokens.css` (semantic colors, spacing, typography)
- Run `impeccable-audit` on existing UI to baseline
- Run `impeccable-adapt` for mobile-first Honor Magic 6
- Run `impeccable-layout` for split-pane desktop
- Run `impeccable-typeset` for 16px input floor, geometric scale
- Run `impeccable-distill` to remove decorative elements
- Run `impeccable-harden` for accessibility (tap targets, contrast)
- Run `impeccable-polish` for final refinement
- **FORBIDDEN**: `impeccable-animate`, `impeccable-delight`

### 1.2 Avoid-AI-Design Scanner Setup
- Clone `funboy322/avoid-ai-design` to local skill
- Integrate CLI into verification pipeline
- Baseline scan of current UI (expected: many violations)
- Target: exit code 0, P0=0, P1=0, stack score < 6

### 1.3 Test Infrastructure
- Configure Vitest for component TDD with real store mounting
- Configure Playwright for screenshot QA (Honor Magic 6 + desktop viewports)
- Add DOM measurement utilities (scrollWidth, font-size, tap target, animationDuration)

### 1.4 Worktree Automation
- Script to create/clean worktrees per task
- Branch naming: `ui-rewrite/<task-id>-<slug>`

## Phase 2: Component Rewriting (TDD per User Story)

Each user story follows: **Create worktree → Write RED tests → Implement GREEN → REFACTOR → Verify → Screenshot QA**

### US1: Single Prompt Optimization
- Components: `PromptInput`, `OptimizeButton`, `OptimizationResult`, `ModeSelector`, `TemplateSelector`
- Tests: Mount with real `usePromptOptimizer`, `useTemplateManager`, `useCurrentMode`
- Wiring: `usePromptOptimizer.optimize()`, `useTemplateManager.apply()`, `useCurrentMode.mode`

### US2: Variables Management
- Components: `VariableList`, `VariableEditor`, `VariableImporter`, `VariableExporter`
- Tests: Mount with real `useVariableManager`, `useTemporaryVariablesStore`
- Wiring: `useVariableManager.add/remove/import/export`, `useTemporaryVariablesStore`

### US3: Context Chain Management
- Components: `ContextChain`, `ContextNode`, `ContextNodeEditor`, `DragHandle`
- Tests: Mount with real `useContextManagement`, `useContextEditor`
- Wiring: `useContextManagement.add/reorder/remove`, `useContextEditor.save`

### US4: Image Generation (T2I/I2I)
- Components: `ImageModeSelector`, `Text2ImageForm`, `Image2ImageForm`, `ImagePreview`, `ImageModelSelector`
- Tests: Mount with real `useImageGeneration`, `useImageModelManager`, `useReferenceImageActions`
- Wiring: `useImageGeneration.generate()`, `useImageModelManager.models`, `useReferenceImageActions.upload`

### US5: Compare / Test Mode
- Components: `TestVariantList`, `TestVariantEditor`, `CompareRunner`, `ComparisonResults`, `StructuredCompareView`
- Tests: Mount with real `useCompareRoleConfig`, `useEvaluationHandler`, `useConversationTester`
- Wiring: `useCompareRoleConfig.addVariant`, `useEvaluationHandler.run`, `useConversationTester.test`

### US6: History & Version Control
- Components: `HistoryPanel`, `HistoryEntry`, `HistoryRestoreDialog`, `HistoryDeleteConfirm`
- Tests: Mount with real `useHistoryManager`, `useAppHistoryRestore`
- Wiring: `useHistoryManager.list/restore/delete`, `useAppHistoryRestore.restore`

### US7: Model / Template / Favorites Manager
- Components: `ModelManager`, `ModelEditor`, `TemplateManager`, `TemplateEditor`, `FavoritesPage`, `FavoriteCard`, `FavoriteEditor`
- Tests: Mount with real `useTextModelManager`, `useImageModelManager`, `useTemplateManager`, `useFavoriteStore`
- Wiring: Respective manager CRUD methods

### US8: Import / Export
- Components: `ImportDialog`, `ExportDialog`, `ImportProgress`, `ExportOptions`
- Tests: Mount with real `useDataManager`, `useAppPromptGardenImport`
- Wiring: `useDataManager.export/import`, `useAppPromptGardenImport.import`

### US9: Internationalization
- Components: `LanguageSwitcher`, all components use `t()` from `vue-i18n`
- Tests: Mount with each locale, verify `check:locale` passes
- Wiring: `useI18n` locale switching, locale files in `packages/ui/src/i18n/locales/`

### US10: Settings & Platform Adapters
- Components: `SettingsPanel`, `PlatformSettings`, `ThemeSelector`, `ExtensionSettings`, `DesktopSettings`
- Tests: Mount with real `useGlobalSettingsStore`, `usePreferenceManager`, `useNaiveTheme`
- Wiring: Settings persistence, platform-specific adapters

## Phase 3: Shell & Routing

- `packages/web/src/App.vue` - Root app with router-view, global modals, toasts
- `packages/web/src/main.ts` - App bootstrap, plugin registration
- `packages/ui/src/router/` - Routes for all views (preserved, verify wiring)
- Layout components: `AppLayout`, `MobileLayout`, `DesktopSplitPane`

## Phase 4: Verification Pipeline

### 4.1 Automated Verification (per task + full build)
- `pnpm build` - All packages build
- `pnpm lint` - ESLint + stylelint
- `pnpm typecheck` - TypeScript strict
- `pnpm test:unit` - Vitest unit tests
- `pnpm check:locale` - Locale parity
- `pnpm check:no-chinese-runtime` - No Chinese in build
- `node scripts/verify-mobile-design-system.mjs` - Mobile design system
- `avoid-ai-design scan packages/ui packages/web` - Design scanner

### 4.2 Screenshot QA Worker
- Playwright headless Chromium
- Viewports: `412×915` (safe-area 32/24), `421×933` (safe-area 32/24), `1280×720`, `1920×1080`
- Flows: All 10 user stories + error states + modals
- Measurements per screenshot:
  - `scrollWidth <= innerWidth` (no horizontal overflow)
  - `input font-size >= 16px`
  - `min tap target >= 44×44px`
  - `computed animationDuration == 0s && transitionDuration == 0s`
  - Punch-hole/gesture bar occlusion check
- Output: Screenshots + JSON measurements + PASS/FAIL verdict

### 4.3 Two-Stage Review

**Tier 1: Fresh-Context Reviewer**
- Input: Diff, screenshots, spec.md, feature-parity-matrix.md
- Task: Verify 100% spec/parity match
- Output: PASS (proceed to Tier 2) or FAIL with findings

**Tier 2: Parallel Reviewers (3-5 subagents)**
- Input: Implementation, screenshots, DOM measurements
- Task: Hunt logic/layout/backend-wiring bugs
- Process: Each reviewer independent, then jury vote
- Labels: `[Important]` (blocks), `[Nit]` (polish), `[Pre-existing]` (not introduced by rewrite)
- Style-only findings discarded
- Max 3 revision rounds for Important findings

## Phase 5: PR Packaging & Human Gate

- Run `finishing-a-development-branch` workflow
- PR includes:
  - Testing evidence (all verification logs)
  - Risk assessment
  - How-to-revert instructions
  - Feature Parity Matrix (100% ticked)
  - All screenshot QA evidence (images + measurements)
  - Two-stage review summary
  - avoid-ai-design CLI output (exit code 0)
- **Human approval required** - no auto-merge

---

## Dependencies & Execution Order

```
Phase 0: Research & Parity Matrix (DONE)
    ↓
Phase 1: Design System & Foundation (Sequential)
    1.1 → 1.2 → 1.3 → 1.4
    ↓
Phase 2: Component Rewriting (Parallel by User Story after Foundation)
    US1, US2, US3, US4, US5, US6, US7, US8, US9, US10
    (Each: Worktree → RED tests → GREEN → REFACTOR → Verify → Screenshot QA)
    ↓
Phase 3: Shell & Routing (After all US components)
    ↓
Phase 4: Verification Pipeline (Full build)
    4.1 → 4.2 → 4.3 (Tier 1 → Tier 2)
    ↓
Phase 5: PR Packaging & Human Gate
```

## Parallel Opportunities

- Phase 1 tasks 1.1-1.4 can be parallelized (different tools)
- Phase 2: All 10 User Stories can run in parallel (separate worktrees, no shared files)
- Phase 4.1: All verification commands parallel
- Phase 4.3 Tier 2: All parallel reviewers run simultaneously

---

## Notes

- [P] tasks = different files, no dependencies (different user stories = different component trees)
- Each user story is independently completable and testable (mounts with real stores)
- Verify tests FAIL before implementing (TDD)
- Commit after each task in its worktree
- Stop at any checkpoint to validate story independently
- Feature Parity Matrix is the source of truth for completeness
- Human approval gate is mandatory at the end