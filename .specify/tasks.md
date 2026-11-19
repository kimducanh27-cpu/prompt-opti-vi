---
description: "Task list for Complete UI Rewrite with Backend Preservation"
---

# Tasks: Complete UI Rewrite (001-complete-ui-rewrite)

**Input**: Design documents from `.specify/`

**Prerequisites**: plan.md (required), spec.md (required), feature-parity-matrix.md, data-model.md, contracts/

**Tests**: All tasks include test tasks. Tests are MANDATORY - TDD Red-Green-Refactor enforced for every component.

**Organization**: Tasks grouped by phase and user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US10, FDN=Foundation, SYS=System)
- Include exact file paths in descriptions

---

## Phase 0: Research & Parity Matrix ✅ COMPLETED

- [x] T000 [FDN] Create Feature Parity Matrix mapping all 10 user stories to stores/composables/services (.specify/feature-parity-matrix.md)
- [x] T001 [FDN] Create Data Model with entity relationships and API contracts (.specify/data-model.md)
- [x] T002 [FDN] Create Implementation Plan with phases, dependencies, parallel opportunities (.specify/plan.md)
- [x] T003 [FDN] Create Constitution with 10 non-negotiable principles (.specify/constitution.md)
- [x] T004 [FDN] Create Feature Specification with 10 user stories and requirements (.specify/spec.md)

---

## Phase 1: Design System & Foundation (Sequential - Blocking)

### 1.1 Design System Setup (impeccable)

- [ ] T005 [FDN] Install `@impeccable/audit`, `@impeccable/adapt`, `@impeccable/layout`, `@impeccable/typeset`, `@impeccable/distill`, `@impeccable/harden`, `@impeccable/polish` as devDependencies in packages/ui
- [ ] T006 [FDN] Create `packages/ui/src/styles/tokens.css` with semantic tokens (colors, spacing, typography) following impeccable primitives
- [ ] T007 [FDN] Run `impeccable-audit` on existing UI components to establish baseline violations
- [ ] T008 [FDN] Run `impeccable-adapt` for mobile-first Honor Magic 6 (412×915, 421×933) with safe-area insets
- [ ] T009 [FDN] Run `impeccable-layout` for desktop ≥1024px split-pane layout
- [ ] T010 [FDN] Run `impeccable-typeset` for 16px input floor, geometric type scale
- [ ] T011 [FDN] Run `impeccable-distill` to remove decorative elements (gradients, orbs, pill badges)
- [ ] T012 [FDN] Run `impeccable-harden` for accessibility (tap targets ≥44×44, contrast ratios)
- [ ] T013 [FDN] Run `impeccable-polish` for final refinement
- [ ] T014 [FDN] Verify `impeccable-animate` and `impeccable-delight` are NOT installed/used

### 1.2 Avoid-AI-Design Scanner Setup

- [ ] T015 [FDN] Clone `funboy322/avoid-ai-design` to local skill directory
- [ ] T016 [FDN] Install avoid-ai-design CLI and integrate into verification pipeline (package.json script)
- [ ] T017 [FDN] Run baseline avoid-ai-design scan on current packages/ui and packages/web
- [ ] T018 [FDN] Document baseline violations (expected: many P0/P1, stack score > 6)

### 1.3 Test Infrastructure

- [ ] T019 [FDN] Configure Vitest for component TDD with real store mounting (create test helpers in packages/ui/tests/utils/)
- [ ] T020 [FDN] Configure Playwright for screenshot QA with 4 viewports (Honor Magic 6 412×915, 421×933; Desktop 1280×720, 1920×1080)
- [ ] T021 [FDN] Create DOM measurement utilities (scrollWidth/innerWidth, font-size, tap target, animationDuration/transitionDuration)
- [ ] T022 [FDN] Create screenshot QA worker script (packages/ui/tests/qa/screenshot-qa.ts)

### 1.4 Worktree Automation

- [ ] T023 [FDN] Create worktree management script (scripts/worktree-manager.sh) for create/clean/list operations
- [ ] T024 [FDN] Define branch naming convention: `ui-rewrite/<task-id>-<slug>`
- [ ] T025 [FDN] Test worktree creation for a sample task

**Checkpoint**: Foundation ready - all design system tokens, test infrastructure, and worktree automation verified. User story implementation can now begin in parallel.

---

## Phase 2: Component Rewriting (Parallel by User Story)

Each user story follows: **Create worktree → Write RED tests → Implement GREEN → REFACTOR → Verify → Screenshot QA**

### US1: Single Prompt Optimization (P1) 🎯 MVP

**Goal**: Prompt input, optimize button, mode selector, template selector, optimization result

**Independent Test**: Mount components with real `usePromptOptimizer`, `useTemplateManager`, `useCurrentMode`, `usePromptDraftStore`. Click optimize → verify store action called → verify result renders.

#### Tests (RED - Write First, Confirm Fail)

- [ ] T026 [P] [US1] Create RED test: `packages/ui/tests/unit/components/PromptInput.spec.ts` - mounts with real stores, tests text input, cursor, variable replacement
- [ ] T027 [P] [US1] Create RED test: `packages/ui/tests/unit/components/OptimizeButton.spec.ts` - mounts with real `usePromptOptimizer`, tests click → optimize() called, loading state, result handling
- [ ] T028 [P] [US1] Create RED test: `packages/ui/tests/unit/components/ModeSelector.spec.ts` - mounts with real `useCurrentMode`, tests mode display, switchMode() called
- [ ] T029 [P] [US1] Create RED test: `packages/ui/tests/unit/components/TemplateSelector.spec.ts` - mounts with real `useTemplateManager`, tests template list, applyTemplate() called
- [ ] T030 [P] [US1] Create RED test: `packages/ui/tests/unit/components/OptimizationResult.spec.ts` - mounts with real `usePromptOptimizer`, tests result rendering, loading/error states
- [ ] T031 [P] [US1] Create RED test: `packages/ui/tests/unit/components/US1-integration.spec.ts` - full flow: input → select mode/template → optimize → verify result

#### Implementation (GREEN - Make Tests Pass)

- [ ] T032 [US1] Create `packages/ui/src/components/workspace/PromptInput.vue` - textarea with variable-aware input, 16px font, 44×44 tap target
- [ ] T033 [US1] Create `packages/ui/src/components/workspace/OptimizeButton.vue` - action button, loading state, no animation
- [ ] T034 [US1] Create `packages/ui/src/components/workspace/ModeSelector.vue` - mode switcher, mobile/desktop variants
- [ ] T035 [US1] Create `packages/ui/src/components/workspace/TemplateSelector.vue` - template list, search, apply action
- [ ] T036 [US1] Create `packages/ui/src/components/workspace/OptimizationResult.vue` - result display, copy action, metadata
- [ ] T037 [US1] Create `packages/ui/src/views/BasicUserWorkspace.vue` - composes US1 components for basic-user mode
- [ ] T038 [US1] Create `packages/ui/src/views/BasicSystemWorkspace.vue` - composes US1 components for basic-system mode
- [ ] T039 [US1] Create `packages/ui/src/views/ProWorkspace.vue` - composes US1 + context chain (US3) for pro mode

#### Refactor & Verify

- [ ] T040 [US1] REFACTOR: Extract shared logic, optimize bundle, ensure zero animations
- [ ] T041 [US1] Run avoid-ai-design scan on US1 components → must pass (P0=0, P1=0, score<6)
- [ ] T042 [US1] Run screenshot QA on US1 viewports → must pass DOM measurements
- [ ] T043 [US1] Run unit tests → all pass

---

### US2: Variables Management (P1)

**Goal**: Variable list, editor, importer, exporter, test variables

**Independent Test**: Mount with real `useVariableManager`, `useTemporaryVariablesStore`. Add variable → verify in store. Import JSON → verify parsed. Export → verify valid JSON.

#### Tests (RED)

- [ ] T044 [P] [US2] Create RED test: `packages/ui/tests/unit/components/VariableList.spec.ts` - list, add, remove, update
- [ ] T045 [P] [US2] Create RED test: `packages/ui/tests/unit/components/VariableEditor.spec.ts` - edit variable form
- [ ] T046 [P] [US2] Create RED test: `packages/ui/tests/unit/components/VariableImporter.spec.ts` - import JSON, parse, validate
- [ ] T047 [P] [US2] Create RED test: `packages/ui/tests/unit/components/VariableExporter.spec.ts` - export JSON, valid output
- [ ] T048 [P] [US2] Create RED test: `packages/ui/tests/unit/components/VariableExtractionDialog.spec.ts` - extract from text
- [ ] T049 [P] [US2] Create RED test: `packages/ui/tests/unit/components/US2-integration.spec.ts` - full variables workflow

#### Implementation (GREEN)

- [ ] T050 [US2] Create `packages/ui/src/components/variable/VariableList.vue` - list with inline edit, drag reorder
- [ ] T051 [US2] Create `packages/ui/src/components/variable/VariableEditor.vue` - modal form for add/edit
- [ ] T052 [US2] Create `packages/ui/src/components/variable/VariableImporter.vue` - file input, JSON parse, validation
- [ ] T053 [US2] Create `packages/ui/src/components/variable/VariableExporter.vue` - export button, blob download
- [ ] T054 [US2] Create `packages/ui/src/components/variable/VariableExtractionDialog.vue` - text input, variable detection
- [ ] T055 [US2] Create `packages/ui/src/views/VariablesPanel.vue` - composes US2 components (mobile drawer, desktop panel)

#### Refactor & Verify

- [ ] T056 [US2] REFACTOR
- [ ] T057 [US2] avoid-ai-design scan → pass
- [ ] T058 [US2] screenshot QA → pass
- [ ] T059 [US2] unit tests → all pass

---

### US3: Context Chain Management (P1)

**Goal**: Context chain, nodes, drag reorder, save

**Independent Test**: Mount with real `useContextManagement`, `useContextEditor`. Add nodes → verify order. Drag reorder → verify store update. Edit → verify persistence.

#### Tests (RED)

- [ ] T060 [P] [US3] Create RED test: `packages/ui/tests/unit/components/ContextChain.spec.ts` - chain display, add, remove, reorder
- [ ] T061 [P] [US3] Create RED test: `packages/ui/tests/unit/components/ContextNode.spec.ts` - node edit, type selector
- [ ] T062 [P] [US3] Create RED test: `packages/ui/tests/unit/components/DragHandle.spec.ts` - drag reorder updates store
- [ ] T063 [P] [US3] Create RED test: `packages/ui/tests/unit/components/US3-integration.spec.ts` - full context chain workflow

#### Implementation (GREEN)

- [ ] T064 [US3] Create `packages/ui/src/components/context/ContextChain.vue` - ordered list, drop zones
- [ ] T065 [US3] Create `packages/ui/src/components/context/ContextNode.vue` - content editor, type badge, delete
- [ ] T066 [US3] Create `packages/ui/src/components/context/DragHandle.vue` - native drag/drop, 44×44 tap target
- [ ] T067 [US3] Update `packages/ui/src/views/ProWorkspace.vue` - integrate ContextChain (from T039)

#### Refactor & Verify

- [ ] T068 [US3] REFACTOR
- [ ] T069 [US3] avoid-ai-design scan → pass
- [ ] T070 [US3] screenshot QA → pass
- [ ] T071 [US3] unit tests → all pass

---

### US4: Image Generation T2I/I2I (P1)

**Goal**: Mode selector, T2I form, I2I form, multi-image, preview, model selector, token usage

**Independent Test**: Mount with real `useImageGeneration`, `useImageModelManager`, `useReferenceImageActions`. Select model → verify adapter. T2I generate → verify call. I2I upload → verify reference. Preview renders.

#### Tests (RED)

- [ ] T072 [P] [US4] Create RED test: `packages/ui/tests/unit/components/ImageModeSelector.spec.ts` - subMode switch
- [ ] T073 [P] [US4] Create RED test: `packages/ui/tests/unit/components/Text2ImageForm.spec.ts` - prompt, model, generate
- [ ] T074 [P] [US4] Create RED test: `packages/ui/tests/unit/components/Image2ImageForm.spec.ts` - reference upload, prompt, generate
- [ ] T075 [P] [US4] Create RED test: `packages/ui/tests/unit/components/MultiImageForm.spec.ts` - batch generation
- [ ] T076 [P] [US4] Create RED test: `packages/ui/tests/unit/components/ImagePreview.spec.ts` - result display, history
- [ ] T077 [P] [US4] Create RED test: `packages/ui/tests/unit/components/ImageModelSelector.spec.ts` - model list, select, test
- [ ] T078 [P] [US4] Create RED test: `packages/ui/tests/unit/components/ImageTokenUsage.spec.ts` - token display
- [ ] T079 [P] [US4] Create RED test: `packages/ui/tests/unit/components/US4-integration.spec.ts` - full image workflow

#### Implementation (GREEN)

- [ ] T080 [US4] Create `packages/ui/src/components/image-mode/ImageModeSelector.vue` - t2i/i2i/multi tabs
- [ ] T081 [US4] Create `packages/ui/src/components/image-mode/Text2ImageForm.vue` - prompt, params, generate
- [ ] T082 [US4] Create `packages/ui/src/components/image-mode/Image2ImageForm.vue` - reference upload, prompt, generate
- [ ] T083 [US4] Create `packages/ui/src/components/image-mode/MultiImageForm.vue` - batch params, generate
- [ ] T084 [US4] Create `packages/ui/src/components/image-mode/ImagePreview.vue` - gallery, history, download
- [ ] T085 [US4] Create `packages/ui/src/components/image-mode/ImageModelSelector.vue` - model list, connection test
- [ ] T086 [US4] Create `packages/ui/src/components/image-mode/ImageTokenUsage.vue` - token display
- [ ] T087 [US4] Create `packages/ui/src/views/ImageWorkspace.vue` - composes US4 components

#### Refactor & Verify

- [ ] T088 [US4] REFACTOR
- [ ] T089 [US4] avoid-ai-design scan → pass
- [ ] T090 [US4] screenshot QA → pass
- [ ] T091 [US4] unit tests → all pass

---

### US5: Compare / Test Mode (P1)

**Goal**: Variant list, editor, runner, results, structured compare, export

**Independent Test**: Mount with real `useCompareRoleConfig`, `useEvaluationHandler`, `useConversationTester`. Add variants → run compare → verify call. Results render. Structured compare works. Export downloads.

#### Tests (RED)

- [ ] T092 [P] [US5] Create RED test: `packages/ui/tests/unit/components/TestVariantList.spec.ts` - variants CRUD
- [ ] T093 [P] [US5] Create RED test: `packages/ui/tests/unit/components/TestVariantEditor.spec.ts` - variant config
- [ ] T094 [P] [US5] Create RED test: `packages/ui/tests/unit/components/CompareRunner.spec.ts` - run, loading, cancel
- [ ] T095 [P] [US5] Create RED test: `packages/ui/tests/unit/components/ComparisonResults.spec.ts` - results display, metadata
- [ ] T096 [P] [US5] Create RED test: `packages/ui/tests/unit/components/StructuredCompareView.spec.ts` - structured evaluation
- [ ] T097 [P] [US5] Create RED test: `packages/ui/tests/unit/components/ExportResults.spec.ts` - export download
- [ ] T098 [P] [US5] Create RED test: `packages/ui/tests/unit/components/US5-integration.spec.ts` - full compare workflow

#### Implementation (GREEN)

- [ ] T099 [US5] Create `packages/ui/src/components/compare/TestVariantList.vue` - variant cards, add/remove
- [ ] T100 [US5] Create `packages/ui/src/components/compare/TestVariantEditor.vue` - variant config form
- [ ] T101 [US5] Create `packages/ui/src/components/compare/CompareRunner.vue` - run button, progress, cancel
- [ ] T102 [US5] Create `packages/ui/src/components/compare/ComparisonResults.vue` - split view, metadata
- [ ] T103 [US5] Create `packages/ui/src/components/compare/StructuredCompareView.vue` - structured output
- [ ] T104 [US5] Create `packages/ui/src/components/compare/ExportResults.vue` - export options, download
- [ ] T105 [US5] Create `packages/ui/src/views/CompareWorkspace.vue` - composes US5 components
- [ ] T106 [US5] Create `packages/ui/src/views/ArenaWorkspace.vue` - arena mode (multi-model)

#### Refactor & Verify

- [ ] T107 [US5] REFACTOR
- [ ] T108 [US5] avoid-ai-design scan → pass
- [ ] T109 [US5] screenshot QA → pass
- [ ] T110 [US5] unit tests → all pass

---

### US6: History & Version Control (P1)

**Goal**: History panel, entry, restore dialog, delete confirm, version control, workspace clear

**Independent Test**: Mount with real `useHistoryManager`, `useAppHistoryRestore`. List entries → restore → verify call. Delete → verify removed. Version control saves/restores.

#### Tests (RED)

- [ ] T111 [P] [US6] Create RED test: `packages/ui/tests/unit/components/HistoryPanel.spec.ts` - entries list, load more
- [ ] T112 [P] [US6] Create RED test: `packages/ui/tests/unit/components/HistoryEntry.spec.ts` - entry display, actions
- [ ] T113 [P] [US6] Create RED test: `packages/ui/tests/unit/components/HistoryRestoreDialog.spec.ts` - restore confirmation
- [ ] T114 [P] [US6] Create RED test: `packages/ui/tests/unit/components/HistoryDeleteConfirm.spec.ts` - delete confirmation
- [ ] T115 [P] [US6] Create RED test: `packages/ui/tests/unit/components/WorkspaceClearContent.spec.ts` - clear action
- [ ] T116 [P] [US6] Create RED test: `packages/ui/tests/unit/components/US6-integration.spec.ts` - full history workflow

#### Implementation (GREEN)

- [ ] T117 [US6] Create `packages/ui/src/components/history/HistoryPanel.vue` - virtualized list, search, filter
- [ ] T118 [US6] Create `packages/ui/src/components/history/HistoryEntry.vue` - session preview, restore/delete
- [ ] T119 [US6] Create `packages/ui/src/components/history/HistoryRestoreDialog.vue` - confirm, coordinate restore
- [ ] T120 [US6] Create `packages/ui/src/components/history/HistoryDeleteConfirm.vue` - confirm, delete
- [ ] T121 [US6] Create `packages/ui/src/components/history/WorkspaceClearContent.vue` - clear with confirmation
- [ ] T122 [US6] Create `packages/ui/src/views/HistoryView.vue` - composes US6 components

#### Refactor & Verify

- [ ] T123 [US6] REFACTOR
- [ ] T124 [US6] avoid-ai-design scan → pass
- [ ] T125 [US6] screenshot QA → pass
- [ ] T126 [US6] unit tests → all pass

---

### US7: Model / Template / Favorites Manager (P1)

**Goal**: Model manager/editor, template manager/editor, favorites page/card/editor, import/export

**Independent Test**: Mount with real managers. CRUD persists. Favorites page loads via initializer. Import/export round-trip.

#### Tests (RED)

- [ ] T127 [P] [US7] Create RED test: `packages/ui/tests/unit/components/ModelManager.spec.ts` - models CRUD, test connection
- [ ] T128 [P] [US7] Create RED test: `packages/ui/tests/unit/components/ModelEditor.spec.ts` - model config form
- [ ] T129 [P] [US7] Create RED test: `packages/ui/tests/unit/components/TemplateManager.spec.ts` - templates CRUD
- [ ] T130 [P] [US7] Create RED test: `packages/ui/tests/unit/components/TemplateEditor.spec.ts` - template content, variables
- [ ] T131 [P] [US7] Create RED test: `packages/ui/tests/unit/components/FavoritesPage.spec.ts` - favorites list, initialize
- [ ] T132 [P] [US7] Create RED test: `packages/ui/tests/unit/components/FavoriteCard.spec.ts` - card display, toggle, version
- [ ] T133 [P] [US7] Create RED test: `packages/ui/tests/unit/components/FavoriteEditor.spec.ts` - favorite edit, versions
- [ ] T134 [P] [US7] Create RED test: `packages/ui/tests/unit/components/FavoriteImportExport.spec.ts` - import/export round-trip
- [ ] T135 [P] [US7] Create RED test: `packages/ui/tests/unit/components/US7-integration.spec.ts` - full manager workflow

#### Implementation (GREEN)

- [ ] T136 [US7] Create `packages/ui/src/components/model/ModelManager.vue` - tabs (text/image/function), CRUD
- [ ] T137 [US7] Create `packages/ui/src/components/model/ModelEditor.vue` - config form, connection test
- [ ] T138 [US7] Create `packages/ui/src/components/template/TemplateManager.vue` - list, search, CRUD
- [ ] T139 [US7] Create `packages/ui/src/components/template/TemplateEditor.vue` - content editor, variable detection
- [ ] T140 [US7] Create `packages/ui/src/components/favorites/FavoritesPage.vue` - grid/list, search, filter
- [ ] T141 [US7] Create `packages/ui/src/components/favorites/FavoriteCard.vue` - preview, toggle, version badge
- [ ] T142 [US7] Create `packages/ui/src/components/favorites/FavoriteEditor.vue` - edit form, version history
- [ ] T143 [US7] Create `packages/ui/src/components/favorites/FavoriteImportExport.vue` - import/export dialogs
- [ ] T144 [US7] Create `packages/ui/src/views/ModelsView.vue` - composes ModelManager
- [ ] T145 [US7] Create `packages/ui/src/views/TemplatesView.vue` - composes TemplateManager
- [ ] T146 [US7] Create `packages/ui/src/views/FavoritesView.vue` - composes FavoritesPage

#### Refactor & Verify

- [ ] T147 [US7] REFACTOR
- [ ] T148 [US7] avoid-ai-design scan → pass
- [ ] T149 [US7] screenshot QA → pass
- [ ] T150 [US7] unit tests → all pass

---

### US8: Import / Export (P1)

**Goal**: Import dialog, export dialog, progress, options, workspace transfer

**Independent Test**: Mount with real `useDataManager`, `useAppPromptGardenImport`. Export → valid JSON/zip. Import → full state restored. Progress reactive. Options filter.

#### Tests (RED)

- [ ] T151 [P] [US8] Create RED test: `packages/ui/tests/unit/components/ImportDialog.spec.ts` - file pick, import call
- [ ] T152 [P] [US8] Create RED test: `packages/ui/tests/unit/components/ExportDialog.spec.ts` - options, export call, download
- [ ] T153 [P] [US8] Create RED test: `packages/ui/tests/unit/components/ImportProgress.spec.ts` - progress reactive updates
- [ ] T154 [P] [US8] Create RED test: `packages/ui/tests/unit/components/ExportOptions.spec.ts` - options filter content
- [ ] T155 [P] [US8] Create RED test: `packages/ui/tests/unit/components/US8-integration.spec.ts` - full import/export workflow

#### Implementation (GREEN)

- [ ] T156 [US8] Create `packages/ui/src/components/data/ImportDialog.vue` - file input, type select, import
- [ ] T157 [US8] Create `packages/ui/src/components/data/ExportDialog.vue` - options checkboxes, export, download
- [ ] T158 [US8] Create `packages/ui/src/components/data/ImportProgress.vue` - progress bar, status, cancel
- [ ] T159 [US8] Create `packages/ui/src/components/data/ExportOptions.vue` - checkbox group, reactive
- [ ] T160 [US8] Create `packages/ui/src/views/DataManagementView.vue` - composes US8 components

#### Refactor & Verify

- [ ] T161 [US8] REFACTOR
- [ ] T162 [US8] avoid-ai-design scan → pass
- [ ] T163 [US8] screenshot QA → pass
- [ ] T164 [US8] unit tests → all pass

---

### US9: Internationalization (P1)

**Goal**: Language switcher, all components use t(), locale parity, no Chinese runtime

**Independent Test**: Switch each locale → all UI strings translated. `pnpm check:locale` → 0 missing. `pnpm check:no-chinese-runtime` → 0 violations. Built-in templates unaffected.

#### Tests (RED)

- [ ] T165 [P] [US9] Create RED test: `packages/ui/tests/unit/components/LanguageSwitcher.spec.ts` - locale switch, persistence
- [ ] T166 [P] [US9] Create RED test: `packages/ui/tests/unit/i18n/locale-parity.spec.ts` - all 4 locales, zero missing keys
- [ ] T167 [P] [US9] Create RED test: `packages/ui/tests/unit/i18n/no-chinese-runtime.spec.ts` - build output scan

#### Implementation (GREEN)

- [ ] T168 [US9] Create `packages/ui/src/components/ui/LanguageSwitcher.vue` - dropdown, 4 locales, flag icons
- [ ] T169 [US9] Verify all new components use `t()` / `$t()` - audit via grep
- [ ] T170 [US9] Run `pnpm check:locale` - fix any missing keys in vi-VN, zh-TW
- [ ] T171 [US9] Run `pnpm check:no-chinese-runtime` - fix any Chinese strings in components
- [ ] T172 [US9] Verify built-in templates (packages/core) remain en-US/zh-CN only

#### Refactor & Verify

- [ ] T173 [US9] REFACTOR
- [ ] T174 [US9] avoid-ai-design scan → pass
- [ ] T175 [US9] screenshot QA (all viewports, all locales) → pass
- [ ] T176 [US9] unit tests → all pass

---

### US10: Settings & Platform Adapters (P1)

**Goal**: Settings panel, theme selector, platform settings, extension config, desktop config, initializer, updater, responsive, fullscreen

**Independent Test**: Mount with real stores. Change settings → persist. Theme switch → verify. Extension/Desktop settings respected. App initializes. Updater checks/applies. Responsive works. Fullscreen toggles.

#### Tests (RED)

- [ ] T177 [P] [US10] Create RED test: `packages/ui/tests/unit/components/SettingsPanel.spec.ts` - settings form, save, persistence
- [ ] T178 [P] [US10] Create RED test: `packages/ui/tests/unit/components/ThemeSelector.spec.ts` - light/dark/auto, Naive UI sync
- [ ] T179 [P] [US10] Create RED test: `packages/ui/tests/unit/components/PlatformSettings.spec.ts` - extension/desktop/web tabs
- [ ] T180 [P] [US10] Create RED test: `packages/ui/tests/unit/components/ExtensionSettings.spec.ts` - popup behavior, shortcuts
- [ ] T181 [P] [US10] Create RED test: `packages/ui/tests/unit/components/DesktopSettings.spec.ts` - window, tray, auto-update
- [ ] T182 [P] [US10] Create RED test: `packages/ui/tests/unit/components/UpdateBanner.spec.ts` - check, apply, dismiss
- [ ] T183 [P] [US10] Create RED test: `packages/ui/tests/unit/components/FullscreenToggle.spec.ts` - toggle, state
- [ ] T184 [P] [US10] Create RED test: `packages/ui/tests/unit/components/US10-integration.spec.ts` - full settings workflow

#### Implementation (GREEN)

- [ ] T185 [US10] Create `packages/ui/src/components/settings/SettingsPanel.vue` - tabs, forms, save
- [ ] T186 [US10] Create `packages/ui/src/components/settings/ThemeSelector.vue` - 3 options, immediate apply
- [ ] T187 [US10] Create `packages/ui/src/components/settings/PlatformSettings.vue` - extension/desktop/web subtabs
- [ ] T188 [US10] Create `packages/ui/src/components/settings/ExtensionSettings.vue` - extension-specific
- [ ] T189 [US10] Create `packages/ui/src/components/settings/DesktopSettings.vue` - desktop-specific
- [ ] T190 [US10] Create `packages/ui/src/components/settings/UpdateBanner.vue` - check/apply/dismiss
- [ ] T191 [US10] Create `packages/ui/src/components/ui/FullscreenToggle.vue` - toggle button, state
- [ ] T192 [US10] Create `packages/ui/src/views/SettingsView.vue` - composes US10 components
- [ ] T193 [US10] Verify `packages/web/src/App.vue` initializes via `useAppInitializer`
- [ ] T194 [US10] Verify `packages/web/src/main.ts` registers all plugins correctly

#### Refactor & Verify

- [ ] T195 [US10] REFACTOR
- [ ] T196 [US10] avoid-ai-design scan → pass
- [ ] T197 [US10] screenshot QA → pass
- [ ] T198 [US10] unit tests → all pass

---

## Phase 3: Shell & Routing (After All US Components)

- [ ] T199 [SYS] Create worktree for shell
- [ ] T200 [SYS] Create RED test: `packages/ui/tests/unit/components/AppLayout.spec.ts` - mobile/desktop layout, responsive
- [ ] T201 [SYS] Create RED test: `packages/ui/tests/unit/components/MobileLayout.spec.ts` - drawer, header, safe-area
- [ ] T202 [SYS] Create RED test: `packages/ui/tests/unit/components/DesktopSplitPane.spec.ts` - split pane, resize, collapse
- [ ] T203 [SYS] Create RED test: `packages/web/tests/unit/App.spec.ts` - root app, router, global modals
- [ ] T204 [SYS] Create `packages/ui/src/components/layout/AppLayout.vue` - responsive wrapper
- [ ] T205 [SYS] Create `packages/ui/src/components/layout/MobileLayout.vue` - drawer navigation, safe-area insets
- [ ] T206 [SYS] Create `packages/ui/src/components/layout/DesktopSplitPane.vue` - split view, resizable panels
- [ ] T207 [SYS] Create `packages/ui/src/components/layout/AppHeaderActions.vue` - global actions, theme, fullscreen, menu
- [ ] T208 [SYS] Create `packages/ui/src/components/layout/CompactNavigation.vue` - mode switch, compact mode
- [ ] T209 [SYS] Rewrite `packages/web/src/App.vue` - router-view, global modals (AdaptiveModal), toasts, init
- [ ] T210 [SYS] Rewrite `packages/web/src/main.ts` - app bootstrap, plugin registration (Naive UI, i18n, router, Pinia)
- [ ] T211 [SYS] Verify `packages/ui/src/router/` routes match all views (preserved, verify wiring)
- [ ] T212 [SYS] REFACTOR shell
- [ ] T213 [SYS] avoid-ai-design scan → pass
- [ ] T214 [SYS] screenshot QA (all viewports, all routes) → pass
- [ ] T215 [SYS] unit tests → all pass

---

## Phase 4: Verification Pipeline (Full Build)

### 4.1 Automated Verification

- [ ] T216 [SYS] Run `pnpm build` - all packages build successfully
- [ ] T217 [SYS] Run `pnpm lint` - ESLint + stylelint pass
- [ ] T218 [SYS] Run `pnpm typecheck` - TypeScript strict pass
- [ ] T219 [SYS] Run `pnpm test:unit` - all Vitest unit tests pass
- [ ] T220 [SYS] Run `pnpm check:locale` - locale parity pass (0 missing keys)
- [ ] T221 [SYS] Run `pnpm check:no-chinese-runtime` - no Chinese in build
- [ ] T222 [SYS] Run `node scripts/verify-mobile-design-system.mjs` - mobile design system pass
- [ ] T223 [SYS] Run `avoid-ai-design scan packages/ui packages/web` - exit code 0, P0=0, P1=0, score<6

### 4.2 Screenshot QA Worker

- [ ] T224 [SYS] Run Playwright screenshot QA on 4 viewports:
  - Honor Magic 6: 412×915 (safe-area top 32px, bottom 24px)
  - Honor Magic 6: 421×933 (safe-area top 32px, bottom 24px)
  - Desktop: 1280×720
  - Desktop: 1920×1080
- [ ] T225 [SYS] Capture screenshots for all 10 user story flows + error states + modals
- [ ] T226 [SYS] Measure DOM per screenshot:
  - `scrollWidth <= innerWidth` (no horizontal overflow)
  - `input font-size >= 16px`
  - `min tap target >= 44×44px`
  - `computed animationDuration == 0s && transitionDuration == 0s`
  - Punch-hole/gesture bar occlusion check
- [ ] T227 [SYS] Generate QA report: screenshots + JSON measurements + PASS/FAIL verdict

### 4.3 Two-Stage Review

#### Tier 1: Fresh-Context Reviewer
- [ ] T228 [SYS] Spawn fresh-context subagent with: diff, screenshots, spec.md, feature-parity-matrix.md
- [ ] T229 [SYS] Tier 1 task: Verify 100% spec/parity match
- [ ] T230 [SYS] Tier 1 output: PASS (proceed to Tier 2) or FAIL with findings

#### Tier 2: Parallel Reviewers (3-5 subagents)
- [ ] T231 [SYS] Spawn 3-5 parallel reviewer subagents with: implementation, screenshots, DOM measurements
- [ ] T232 [SYS] Tier 2 task: Hunt logic/layout/backend-wiring bugs
- [ ] T233 [SYS] Each reviewer independent → jury vote
- [ ] T234 [SYS] Label findings: `[Important]` (blocks), `[Nit]` (polish), `[Pre-existing]` (not introduced by rewrite)
- [ ] T235 [SYS] Discard style-only findings
- [ ] T236 [SYS] Max 3 revision rounds for Important findings
- [ ] T237 [SYS] If >3 rounds with Important findings OR any build/scanner/screenshot failure → HARD STOP, list blockers

---

## Phase 5: PR Packaging & Human Gate

- [ ] T238 [SYS] Run `finishing-a-development-branch` workflow
- [ ] T239 [SYS] Prepare PR with mandatory sections:
  - Testing evidence (all verification logs from T216-T227)
  - Risk assessment
  - How-to-revert instructions
  - Feature Parity Matrix (100% ticked from .specify/feature-parity-matrix.md)
  - All screenshot QA evidence (images + measurements from T224-T227)
  - Two-stage review summary (T228-T237)
  - avoid-ai-design CLI output (exit code 0 from T223)
- [ ] T240 [SYS] **HUMAN APPROVAL REQUIRED** - Present PR package, await explicit approval
- [ ] T241 [SYS] On approval: Merge to main
- [ ] T242 [SYS] On rejection: Address feedback, re-run verification, re-present

---

## Dependencies & Execution Order

```
Phase 0: Research & Parity Matrix (DONE)
    ↓
Phase 1: Design System & Foundation (Sequential T005-T025)
    ↓
Phase 2: Component Rewriting (Parallel US1-US10 after Foundation)
    Each US: Worktree → RED tests (6-10 each) → GREEN (6-10 each) → REFACTOR → Verify (4 each)
    ↓
Phase 3: Shell & Routing (T199-T215, after all US)
    ↓
Phase 4: Verification Pipeline (T216-T237, full build)
    4.1 Automated (T216-T223) → 4.2 Screenshot QA (T224-T227) → 4.3 Two-Stage Review (T228-T237)
    ↓
Phase 5: PR Packaging & Human Gate (T238-T242)
```

## Parallel Opportunities

- Phase 1: T005-T014 (impeccable steps) can overlap; T015-T018 (avoid-ai-design) parallel; T019-T022 (test infra) parallel
- Phase 2: All 10 User Stories run in parallel (separate worktrees, no shared files)
- Phase 4.1: All verification commands parallel
- Phase 4.3 Tier 2: All 3-5 parallel reviewers run simultaneously

---

## Notes

- [P] tasks = different files, no dependencies (different user stories = different component trees)
- Each user story is independently completable and testable (mounts with real stores)
- Verify tests FAIL before implementing (TDD)
- Commit after each task in its worktree
- Stop at any checkpoint to validate story independently
- Feature Parity Matrix is the source of truth for completeness
- Human approval gate is mandatory at the end (T240)
- **HARD STOP CONDITIONS**: build fail, scanner fail, screenshot QA fail, >3 review rounds with Important findings