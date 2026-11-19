# Feature Specification: Complete UI Rewrite with Backend Preservation

**Feature Branch**: `001-complete-ui-rewrite`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Xóa toàn bộ lớp UI cũ và xây mới 100% tính năng cho repo linshenkx/prompt-optimizer, bảo toàn backend/core, đạt chuẩn anti-AI-design và QA screenshot mobile-first trước khi mở PR chờ duyệt."

## User Scenarios & Testing

### User Story 1 - Single Prompt Optimization (Priority: P1)
User enters a prompt, selects optimization mode/template, and gets optimized result.

**Why this priority**: Core value proposition of the product.

**Independent Test**: Can be fully tested by entering a prompt, selecting a built-in template, clicking optimize, and verifying the output connects to the real `usePromptOptimizer` composable and Pinia store.

**Acceptance Scenarios**:
1. **Given** user on main workspace, **When** they type a prompt and click Optimize, **Then** optimized prompt appears via real store action
2. **Given** user selects a built-in template, **When** they apply it, **Then** template variables are populated via `useTemplateManager`
3. **Given** user switches between Basic/Pro modes, **When** mode changes, **Then** workspace adapts via `useCurrentMode`

---

### User Story 2 - Variables Management (Priority: P1)
User creates, edits, imports, exports prompt variables.

**Why this priority**: Essential for template-driven workflows.

**Independent Test**: Can be fully tested by adding a variable, verifying it appears in the list, using it in a prompt, and confirming persistence via `useVariableManager` and `temporaryVariables` store.

**Acceptance Scenarios**:
1. **Given** user opens Variables panel, **When** they add a variable with name/value, **Then** it appears in list and is usable in prompts
2. **Given** user imports variables from JSON, **When** import completes, **Then** all variables are loaded via `useVariableManager.importVariables`
3. **Given** user exports variables, **When** export triggers, **Then** valid JSON downloads via `useVariableManager.exportVariables`

---

### User Story 3 - Context Chain Management (Priority: P1)
User builds ordered context chains for prompt optimization.

**Why this priority**: Core Pro-mode feature for complex prompt engineering.

**Independent Test**: Can be fully tested by creating context nodes, reordering them, and verifying the chain is passed to optimizer via `useContextManagement` and `contextEditor` composables.

**Acceptance Scenarios**:
1. **Given** user in Pro mode, **When** they add context nodes, **Then** nodes appear in ordered chain
2. **Given** user drags to reorder nodes, **When** drop completes, **Then** order updates in `useContextEditor`
3. **Given** user saves context chain, **When** save completes, **Then** chain persists via session store

---

### User Story 4 - Image Generation (T2I/I2I) (Priority: P1)
User generates images from text (T2I) or image+text (I2I) using configured adapters.

**Why this priority**: Major feature pillar alongside text optimization.

**Independent Test**: Can be fully tested by configuring an image model, entering prompt, clicking generate, and verifying result via `useImageGeneration` composable and image adapter registry.

**Acceptance Scenarios**:
1. **Given** user selects Text2Image mode, **When** they enter prompt and click Generate, **Then** image appears via real adapter call
2. **Given** user selects Image2Image mode, **When** they upload reference image and enter prompt, **Then** generated image reflects reference via adapter
3. **Given** user switches image model, **When** model changes, **Then** adapter registry provides correct implementation

---

### User Story 5 - Compare / Test Mode (Priority: P1)
User runs side-by-side comparison of multiple prompt variants or model outputs.

**Why this priority**: Core evaluation and testing workflow.

**Independent Test**: Can be fully tested by creating test variants, running comparison, and verifying results via `useCompareRoleConfig`, `useEvaluationHandler`, and compare service.

**Acceptance Scenarios**:
1. **Given** user in Test mode, **When** they add variants and run test, **Then** results render in split view via compare service
2. **Given** user runs structured compare, **When** evaluation completes, **Then** structured results appear via `useEvaluationHandler`
3. **Given** user exports test results, **When** export triggers, **Then** valid export downloads

---

### User Story 6 - History & Version Control (Priority: P1)
User views, restores, and manages prompt/session history.

**Why this priority**: Essential for iterative prompt engineering.

**Independent Test**: Can be fully tested by performing actions, opening history, restoring a session, and verifying state via `useHistoryManager` and session stores.

**Acceptance Scenarios**:
1. **Given** user has previous sessions, **When** they open History panel, **Then** all sessions list with timestamps
2. **Given** user selects a history entry, **When** they click Restore, **Then** session state loads via `useAppHistoryRestore`
3. **Given** user deletes history entry, **When** confirmed, **Then** entry removed from store

---

### User Story 7 - Model / Template / Favorites Manager (Priority: P1)
User manages LLM models, prompt templates, and favorite prompts/assets.

**Why this priority**: Configuration and reuse core to power-user workflow.

**Independent Test**: Can be fully tested by adding a model, creating a template, saving a favorite, and verifying each via respective managers and stores.

**Acceptance Scenarios**:
1. **Given** user opens Model Manager, **When** they add custom model config, **Then** model appears in selector via `useTextModelManager`/`useImageModelManager`
2. **Given** user creates template, **When** they save, **Then** template appears in list via `useTemplateManager`
3. **Given** user saves prompt as favorite, **When** save completes, **Then** favorite appears in Favorites page via favorite store

---

### User Story 8 - Import / Export (Priority: P1)
User imports/exports workspace, sessions, favorites, variables.

**Why this priority**: Portability and backup critical for user trust.

**Independent Test**: Can be fully tested by exporting workspace, importing into fresh instance, and verifying full state restoration via data manager and import-export services.

**Acceptance Scenarios**:
1. **Given** user exports workspace, **When** export completes, **Then** valid JSON/zip downloads via data manager
2. **Given** user imports workspace file, **When** import completes, **Then** all state restored via import-export service
3. **Given** user exports favorites only, **When** export completes, **Then** favorites-only package downloads

---

### User Story 9 - Internationalization (i18n) (Priority: P1)
UI displays in en-US, zh-CN, zh-TW, vi-VN with locale parity.

**Why this priority**: Product ships in 4 languages; parity is mandatory.

**Independent Test**: Can be fully tested by switching each language and verifying all UI strings via `vue-i18n` and locale parity checker.

**Acceptance Scenarios**:
1. **Given** user switches to vi-VN, **When** UI reloads, **Then** all strings show Vietnamese via `packages/ui/src/i18n/locales/vi-VN`
2. **Given** locale parity check runs, **When** check completes, **Then** zero missing keys across 4 locales
3. **Given** built-in templates remain en-US/zh-CN, **When** language switches, **Then** templates unaffected

---

### User Story 10 - Settings & Platform Adapters (Priority: P1)
User configures global settings, platform-specific options (web/extension/desktop).

**Why this priority**: Platform adapters and settings control runtime behavior.

**Independent Test**: Can be fully tested by changing settings, verifying persistence via `useGlobalSettings` and `usePreferenceManager`, and confirming platform adapters respect them.

**Acceptance Scenarios**:
1. **Given** user changes theme, **When** setting saves, **Then** theme applies via `useNaiveTheme` and persists
2. **Given** user in extension, **When** they configure popup behavior, **Then** extension adapter respects setting
3. **Given** user in desktop, **When** they configure window behavior, **Then** Electron main/preload respects setting

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST preserve 100% of existing backend logic in `packages/core`, `packages/mcp-server`, `packages/desktop`, `packages/extension`
- **FR-002**: System MUST preserve all Pinia stores and composables in `packages/ui` without modification
- **FR-003**: System MUST rewrite 100% of presentation layer: `packages/ui/src/components`, `packages/ui/src/views`, `packages/ui/src/styles`, `packages/web/src`
- **FR-004**: System MUST implement Feature Parity Matrix mapping every existing feature to new UI with real store/backend wiring
- **FR-005**: System MUST enforce TDD Red-Green-Refactor for every UI component
- **FR-006**: System MUST run all work in isolated git worktrees on feature branches
- **FR-007**: System MUST pass `funboy322/avoid-ai-design` scanner with exit code 0 (0 P0, 0 P1, stack score < 6)
- **FR-008**: System MUST have zero animations: no `@keyframes`, `transition`, Vue `<Transition>`, motion libraries
- **FR-009**: System MUST support Honor Magic 6 viewports (412×915, 421×933) with safe-area insets, input ≥16px, tap targets ≥44×44px, no horizontal overflow
- **FR-010**: System MUST preserve desktop ≥1024px split-pane layout
- **FR-011**: System MUST capture screenshot QA evidence with DOM measurements for all viewports
- **FR-012**: System MUST pass Two-Stage Review (Tier 1 spec/parity match, Tier 2 parallel bug hunt with jury vote)
- **FR-013**: System MUST support 4 locales (en-US, zh-CN, zh-TW, vi-VN) with locale parity
- **FR-014**: System MUST use `impeccable` design system (audit, adapt, layout, typeset, distill, harden, polish) for new UI
- **FR-015**: System MUST NOT use `impeccable-animate` or `impeccable-delight`
- **FR-016**: System MUST build, lint, typecheck, and pass all existing tests
- **FR-017**: System MUST package PR with Testing, Risk, How-to-revert, Feature Parity Matrix, all verification logs, screenshots

### Key Entities

- **PromptSession**: User's active prompt workspace state (text, mode, variables, context chain, history)
- **OptimizationResult**: Output from prompt optimization via core services
- **ImageGenerationResult**: Output from T2I/I2I via image adapters
- **ComparisonResult**: Side-by-side evaluation output from compare service
- **ModelConfig**: LLM/image model configuration (provider, endpoint, parameters)
- **PromptTemplate**: Reusable prompt template with variables
- **FavoritePrompt**: Saved prompt with metadata, versions, sharing
- **ContextChain**: Ordered list of context nodes for Pro mode
- **Variable**: Named value for template substitution
- **WorkspaceExport**: Serializable full workspace state for import/export

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Feature Parity Matrix ticks 100% (all 10 user stories verified against real store/backend)
- **SC-002**: `avoid-ai-design` CLI exits 0 with P0=0, P1=0, stack score < 6
- **SC-003**: Build, lint, typecheck, unit tests all pass (`pnpm build && pnpm lint && pnpm test:unit`)
- **SC-004**: Screenshot QA passes on Honor Magic 6 (412×915, 421×933) and desktop (≥1024px) with DOM measurements meeting all thresholds
- **SC-005**: Two-Stage Review completes: Tier 1 100% spec/parity match, Tier 2 zero Important findings after ≤3 rounds
- **SC-006**: Locale parity check passes for all 4 languages (`pnpm check:locale`)
- **SC-007**: No Chinese runtime strings in production build (`pnpm check:no-chinese-runtime`)
- **SC-008**: Mobile design system verification passes (`node scripts/verify-mobile-design-system.mjs`)

---

## Assumptions

- Existing `packages/core`, `packages/mcp-server`, `packages/desktop`, `packages/extension` are stable and tested
- Pinia stores and composables in `packages/ui` correctly expose all required actions/state
- `impeccable` design system can be adapted to meet avoid-ai-design constraints
- Playwright/Chromium headless can run in the environment for screenshot QA
- Git worktrees are supported in the repository
- Spec Kit CLI (`specify`) and Superpowers skills are available
- User will provide final approval before merge (no auto-merge)