# Feature Parity Matrix: prompt-optimizer UI Rewrite

**Generated**: 2026-11-19 | **Spec**: .specify/spec.md | **Plan**: .specify/plan.md

**Legend**: ✅ = Mapped & Verified | 🔄 = In Progress | ⬜ = Not Started | ❌ = Blocked

---

## Overview

| # | User Story (Priority) | Core Logic Source | Stores / Composables | Key Services | Test ID Prefix | Status |
|---|----------------------|-------------------|---------------------|--------------|----------------|--------|
| 1 | Single Prompt Optimization (P1) | `packages/core/services/prompt`, `packages/ui/composables/prompt` | `usePromptDraftStore`, `useTemporaryVariablesStore`, `useCurrentMode`, `usePromptOptimizer`, `useTemplateManager`, `useWorkspaceTemplateSelection` | — | TDD-001 | ⬜ |
| 2 | Variables Management (P1) | `packages/ui/composables/variable`, `packages/core/services/data` | `useTemporaryVariablesStore`, `useVariableManager`, `useAggregatedVariables`, `useTestVariableManager`, `useVariableAwareInputBridge` | `core/services/data/manager.ts` | TDD-002 | ⬜ |
| 3 | Context Chain Management (P1) | `packages/core/services/context`, `packages/ui/composables/context` | `useContextManagement`, `useContextEditor`, `useContextEditorUIState`, `useProSubMode` | `core/services/context/repo.ts` | TDD-003 | ⬜ |
| 4 | Image Generation T2I/I2I (P1) | `packages/core/services/image`, `packages/ui/composables/image` | `useImageGeneration`, `useImageModelManager`, `useImageInputPreparation`, `useReferenceImageActions`, `useImageSubMode` | `core/services/image/adapters/registry.ts` | TDD-004 | ⬜ |
| 5 | Compare / Test Mode (P1) | `packages/core/services/compare`, `packages/core/services/evaluation`, `packages/ui/composables/prompt` | `useCompareRoleConfig`, `useEvaluationHandler`, `useConversationTester`, `useTestVariantState`, `useWorkspaceTestBatch` | `core/services/compare/service.ts`, `core/services/evaluation/service.ts` | TDD-005 | ⬜ |
| 6 | History & Version Control (P1) | `packages/core/services/history`, `packages/ui/composables/app`, `packages/ui/composables/storage` | `useHistoryManager`, `useAppHistoryRestore`, `useSessionRestoreCoordinator`, `useBasicUserSession`, `useProSession` | `core/services/history/manager.ts` | TDD-006 | ⬜ |
| 7 | Model / Template / Favorites Manager (P1) | `packages/core/services/favorite`, `packages/ui/composables/model`, `packages/ui/composables/prompt` | `useTextModelManager`, `useImageModelManager`, `useFunctionModelManager`, `useTemplateManager`, `useFavoriteStore`, `useFavoriteInitializer`, `useAppFavorite` | `core/services/favorite/manager.ts` | TDD-007 | ⬜ |
| 8 | Import / Export (P1) | `packages/core/services/data`, `packages/ui/composables/app`, `packages/ui/composables/storage` | `useDataManager`, `useAppPromptGardenImport`, `usePreferenceManager`, `useFavoriteInitializer` | `core/services/data/manager.ts`, `core/services/data/workspace-session-transfer.ts` | TDD-008 | ⬜ |
| 9 | Internationalization (P1) | `packages/ui/src/i18n`, `packages/ui/plugins/i18n.ts` | `useI18n` (vue-i18n), `useNaiveTheme`, locale files in `packages/ui/src/i18n/locales/{en-US,zh-CN,zh-TW,vi-VN}` | — | TDD-009 | ⬜ |
| 10 | Settings & Platform Adapters (P1) | `packages/ui/composables/ui`, `packages/ui/composables/system`, `packages/desktop`, `packages/extension` | `useGlobalSettingsStore`, `usePreferenceManager`, `useNaiveTheme`, `useAppInitializer`, `useUpdater`, `useResponsive`, `useFullscreen` | Platform adapters in desktop/extension | TDD-010 | ⬜ |

---

## Detailed Mapping by User Story

### US1: Single Prompt Optimization (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Prompt textarea | `PromptInputArea` / `VariableAwareInput` | `PromptInput` | `usePromptDraftStore.text`, `usePromptDraftStore.cursor` | `text`, `setText`, `cursor`, `setCursor` | TDD-001-01 |
| Optimize button | `ActionButton` (optimize) | `OptimizeButton` | `usePromptOptimizer.optimize` | `optimize()`, `isOptimizing`, `lastResult` | TDD-001-02 |
| Mode selector | `ModeSwitch` / `CompactNavigation` | `ModeSelector` | `useCurrentMode.mode`, `useCurrentMode.switchMode` | `mode`, `switchMode()` | TDD-001-03 |
| Template selector | `TemplateSelector` / `MobileTemplateList` | `TemplateSelector` | `useTemplateManager.templates`, `useTemplateManager.applyTemplate` | `templates`, `applyTemplate(id)` | TDD-001-04 |
| Optimization result | `PromptPreviewPanel` / `HtmlPreview` | `OptimizationResult` | `usePromptOptimizer.lastResult`, `usePromptOptimizer.optimize` | `lastResult`, `isOptimizing` | TDD-001-05 |
| Variables inline | `VariableAwareInput` | Integrated in `PromptInput` | `useTemporaryVariablesStore.variables`, `useVariableAwareInputBridge` | `variables`, `replaceVariables()` | TDD-001-06 |

**Verification**: Mount `PromptInput` + `OptimizeButton` with real `usePromptOptimizer`, `useTemplateManager`, `useCurrentMode`, `usePromptDraftStore`. Click optimize → verify store action called → verify result renders.

---

### US2: Variables Management (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Variables list | `MobileVariableList` / `VariableManagerModal` | `VariableList` | `useVariableManager.variables`, `useTemporaryVariablesStore.variables` | `variables`, `addVariable`, `removeVariable`, `updateVariable` | TDD-002-01 |
| Variable editor | `VariableEditor` | `VariableEditor` | `useVariableManager.editVariable` | `editVariable(id, data)` | TDD-002-02 |
| Import dialog | `VariableImporter` | `VariableImporter` | `useVariableManager.importVariables` | `importVariables(json)` | TDD-002-03 |
| Export button | `VariableImporter` (export) | `VariableExporter` | `useVariableManager.exportVariables` | `exportVariables() → blob` | TDD-002-04 |
| Test variables | `VariableManagerModal` (test tab) | Integrated in `VariableList` | `useTestVariableManager.testVariables` | `testVariables`, `addTestVariable` | TDD-002-05 |
| Variable detection | `VariableExtractionDialog` | `VariableExtractionDialog` | `useVariableExtraction` (composable) | `extractFromText(text)` | TDD-002-06 |

**Verification**: Mount `VariableList` with real stores. Add variable → verify in store. Import JSON → verify parsed. Export → verify valid JSON. Test variables tab works.

---

### US3: Context Chain Management (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Context chain | `ContextChain` (in Pro workspace) | `ContextChain` | `useContextManagement.chain`, `useContextEditor.nodes` | `chain`, `nodes`, `addNode`, `removeNode`, `reorderNodes` | TDD-003-01 |
| Context node | `ContextNode` (inline) | `ContextNode` | `useContextEditor.editNode` | `editNode(id, content)` | TDD-003-02 |
| Drag handle | Native drag/drop | `DragHandle` | `useContextEditor.reorderNodes` | `reorderNodes(from, to)` | TDD-003-03 |
| Save chain | Auto-save / manual | Integrated | `useContextEditor.saveChain` | `saveChain()` | TDD-003-04 |
| Context types | `ContextNode` (type selector) | `ContextNode` (type badge) | `useContextManagement.nodeTypes` | `type: 'system' | 'user' | 'assistant' | 'tool'` | TDD-003-05 |

**Verification**: Mount `ContextChain` with real composables. Add nodes → verify order. Drag reorder → verify store update. Edit content → verify persistence. Save → verify `useContextEditor.saveChain` called.

---

### US4: Image Generation T2I/I2I (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Mode selector | `ImageModeSelector` | `ImageModeSelector` | `useImageSubMode.subMode`, `useImageSubMode.setSubMode` | `subMode: 't2i' | 'i2i' | 'multi'`, `setSubMode()` | TDD-004-01 |
| T2I form | `ImageText2ImageWorkspace` | `Text2ImageForm` | `useImageGeneration.generate`, `useImageModelManager.models` | `generate(params)`, `models`, `selectedModel` | TDD-004-02 |
| I2I form | `ImageImage2ImageWorkspace` | `Image2ImageForm` | `useImageGeneration.generate`, `useReferenceImageActions.upload` | `generate(params)`, `upload(file)`, `referenceImages` | TDD-004-03 |
| Multi-image | `ImageMultiImageWorkspace` | `MultiImageForm` | `useImageGeneration.generateBatch` | `generateBatch(params[])` | TDD-004-04 |
| Image preview | `AppPreviewImage` / `AppPreviewImageGroup` | `ImagePreview` | `useImageGeneration.lastResult`, `useImageGeneration.history` | `lastResult`, `history[]` | TDD-004-05 |
| Model selector | `MobileModelRow` (image) | `ImageModelSelector` | `useImageModelManager.models`, `useImageModelManager.selectModel` | `models`, `selectModel(id)` | TDD-004-06 |
| Token usage | `ImageTokenUsage` | `ImageTokenUsage` | `useImageGeneration.tokenUsage` | `tokenUsage` | TDD-004-07 |

**Verification**: Mount forms with real composables. Select model → verify adapter registry. T2I generate → verify `useImageGeneration.generate` called with correct adapter. I2I upload → verify `useReferenceImageActions`. Preview renders result.

---

### US5: Compare / Test Mode (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Variant list | `TestVariantList` / `ArenaWorkspace` | `TestVariantList` | `useCompareRoleConfig.variants`, `useTestVariantState.variants` | `variants[]`, `addVariant`, `removeVariant`, `updateVariant` | TDD-005-01 |
| Variant editor | `TestVariantEditor` | `TestVariantEditor` | `useCompareRoleConfig.editVariant` | `editVariant(id, config)` | TDD-005-02 |
| Compare runner | `CompareRunner` / `useConversationTester` | `CompareRunner` | `useEvaluationHandler.run`, `useConversationTester.test` | `run(config)`, `test(config)` | TDD-005-03 |
| Results view | `ComparisonResults` / `ArenaWorkspace` | `ComparisonResults` | `useEvaluationHandler.results`, `useCompareResultMetadata.metadata` | `results[]`, `metadata` | TDD-005-04 |
| Structured compare | `StructuredCompareView` | `StructuredCompareView` | `useEvaluationHandler.structuredCompare` | `structuredCompare(prompts[])` | TDD-005-05 |
| Export results | Export button in results | `ExportResults` | `useDataManager.exportComparison` | `exportComparison(results)` | TDD-005-06 |

**Verification**: Mount `TestVariantList` + `CompareRunner` with real composables. Add variants → run compare → verify `useEvaluationHandler.run` called. Results render with metadata. Structured compare works. Export downloads valid file.

---

### US6: History & Version Control (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| History panel | `HistoryPanel` / session persistence | `HistoryPanel` | `useHistoryManager.entries`, `useAppHistoryRestore.restore` | `entries[]`, `restore(id)` | TDD-006-01 |
| History entry | `HistoryEntry` | `HistoryEntry` | `useHistoryManager.getEntry` | `getEntry(id) → session` | TDD-006-02 |
| Restore dialog | `HistoryRestoreDialog` | `HistoryRestoreDialog` | `useAppHistoryRestore.restore`, `useSessionRestoreCoordinator.coordinate` | `restore(id)`, `coordinate(session)` | TDD-006-03 |
| Delete confirm | Confirm dialog | `HistoryDeleteConfirm` | `useHistoryManager.deleteEntry` | `deleteEntry(id)` | TDD-006-04 |
| Version control | Session save/restore | Integrated | `useBasicUserSession.save`, `useProSession.save` | `save()`, `restore(version)` | TDD-006-05 |
| Workspace clear | `WorkspaceClearContent` | `WorkspaceClearContent` | `useSessionRestoreCoordinator.clear` | `clear()` | TDD-006-06 |

**Verification**: Mount `HistoryPanel` with real stores. List entries → click restore → verify `useAppHistoryRestore.restore` called with correct session. Delete → verify removed. Version control saves/restores correctly.

---

### US7: Model / Template / Favorites Manager (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Model manager | `ModelManagerModal` | `ModelManager` | `useTextModelManager.models`, `useImageModelManager.models`, `useFunctionModelManager.models` | `models[]`, `addModel`, `editModel`, `deleteModel`, `testConnection` | TDD-007-01 |
| Model editor | `ModelEditorForm` | `ModelEditor` | `useModelManager.editModel`, `useConnectionConfig.config` | `editModel(id, config)`, `config` | TDD-007-02 |
| Template manager | `TemplateManagerModal` / `MobileTemplateList` | `TemplateManager` | `useTemplateManager.templates`, `useTemplateManager.createTemplate` | `templates[]`, `createTemplate`, `updateTemplate`, `deleteTemplate` | TDD-007-03 |
| Template editor | `MobileTemplateEditor` | `TemplateEditor` | `useTemplateManager.editTemplate` | `editTemplate(id, content)` | TDD-007-04 |
| Favorites page | `FavoritesPage` | `FavoritesPage` | `useFavoriteStore.favorites`, `useFavoriteInitializer.initialize` | `favorites[]`, `initialize()` | TDD-007-05 |
| Favorite card | `FavoriteCard` / `FavoriteSurfaceSection` | `FavoriteCard` | `useFavoriteStore.getFavorite`, `useAppFavorite.toggleFavorite` | `getFavorite(id)`, `toggleFavorite(id)` | TDD-007-06 |
| Favorite editor | `FavoriteEditorForm` / `FavoritePromptAssetVersionPreviewModal` | `FavoriteEditor` | `useFavoriteStore.updateFavorite`, `useFavoriteStore.createVersion` | `updateFavorite(id, data)`, `createVersion(id)` | TDD-007-07 |
| Favorite import/export | `FavoriteImportPanel` / `FavoriteShareExportDialog` | `FavoriteImportExport` | `useFavoriteStore.import`, `useFavoriteStore.export` | `import(data)`, `export(ids)` | TDD-007-08 |

**Verification**: Mount each manager with real stores. CRUD operations persist. Favorites page loads via `useFavoriteInitializer`. Import/export round-trip works.

---

### US8: Import / Export (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Import dialog | `DataManager` (import) | `ImportDialog` | `useDataManager.importWorkspace`, `useAppPromptGardenImport.import` | `importWorkspace(file)`, `importPromptGarden(file)` | TDD-008-01 |
| Export dialog | `DataManager` (export) | `ExportDialog` | `useDataManager.exportWorkspace`, `useDataManager.exportFavorites` | `exportWorkspace(options)`, `exportFavorites(options)` | TDD-008-02 |
| Import progress | `ImportProgress` | `ImportProgress` | `useDataManager.importProgress` | `importProgress` (reactive) | TDD-008-03 |
| Export options | `ExportOptions` | `ExportOptions` | `useDataManager.exportOptions` | `options: {includeHistory, includeFavorites, includeSettings}` | TDD-008-04 |
| Workspace transfer | `WorkspaceSessionTransfer` | Integrated | `useDataManager.transferSession` | `transferSession(session)` | TDD-008-05 |

**Verification**: Mount dialogs with real `useDataManager`. Export → verify valid JSON/zip. Import → verify full state restored. Progress updates reactively. Options filter export content.

---

### US9: Internationalization (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Language switcher | `LanguageSwitchDropdown` / `BuiltinTemplateLanguageSwitch` | `LanguageSwitcher` | `useI18n.locale`, `useI18n.setLocale` | `locale`, `setLocale('en-US'|'zh-CN'|'zh-TW'|'vi-VN')` | TDD-009-01 |
| All components | All Vue components | All new components | `t()` / `$t()` from vue-i18n | Translation keys | TDD-009-02 |
| Locale parity | `check-locale-parity.mjs` | `check-locale-parity.mjs` | — | Zero missing keys | TDD-009-03 |
| No Chinese runtime | `check-no-chinese-runtime.mjs` | `check-no-chinese-runtime.mjs` | — | Zero Chinese in build | TDD-009-04 |
| Built-in templates | `packages/core` templates | Unchanged (en-US/zh-CN only) | `useTemplateManager.builtinTemplates` | Templates unaffected by UI locale | TDD-009-05 |

**Verification**: Switch each locale → verify all UI strings translated. Run `pnpm check:locale` → 0 missing. Run `pnpm check:no-chinese-runtime` → 0 violations. Built-in templates remain en-US/zh-CN.

---

### US10: Settings & Platform Adapters (P1)

| UI Element | Old Component | New Component (TDD) | Store/Composable | Action/State | Test ID |
|------------|---------------|---------------------|------------------|--------------|---------|
| Settings panel | `SettingsPanel` / `GlobalSettings` | `SettingsPanel` | `useGlobalSettingsStore.settings`, `usePreferenceManager.save` | `settings`, `save(settings)` | TDD-010-01 |
| Theme selector | `useNaiveTheme` integration | `ThemeSelector` | `useNaiveTheme.theme`, `useNaiveTheme.setTheme` | `theme`, `setTheme('light'|'dark'|'auto')` | TDD-010-02 |
| Platform settings | Extension/Desktop specific | `PlatformSettings` | `useGlobalSettingsStore.platformSettings` | `platformSettings` | TDD-010-03 |
| Extension config | Extension popup options | `ExtensionSettings` | `useGlobalSettingsStore.extension` | `extension: {popupBehavior, shortcuts}` | TDD-010-04 |
| Desktop config | Electron window config | `DesktopSettings` | `useGlobalSettingsStore.desktop` | `desktop: {windowSize, autoUpdate, tray}` | TDD-010-05 |
| App initializer | `useAppInitializer` | Integrated in `App.vue` | `useAppInitializer.initialize` | `initialize()` | TDD-010-06 |
| Updater | `useUpdater` | `UpdateBanner` | `useUpdater.checkUpdate`, `useUpdater.applyUpdate` | `checkUpdate()`, `applyUpdate()` | TDD-010-07 |
| Responsive | `useResponsive` | Integrated in layout | `useResponsive.breakpoint` | `breakpoint: 'mobile'|'tablet'|'desktop'` | TDD-010-08 |
| Fullscreen | `useFullscreen` | `FullscreenToggle` | `useFullscreen.isFullscreen`, `useFullscreen.toggle` | `isFullscreen`, `toggle()` | TDD-010-09 |

**Verification**: Mount `SettingsPanel` with real store. Change settings → verify persistence. Theme switch → verify `useNaiveTheme`. Extension/Desktop settings respected by platform adapters. App initializes correctly. Updater checks/applies. Responsive breakpoints work. Fullscreen toggles.

---

## Cross-Cutting Components (Used Across Stories)

| Component | Stories | Store/Composable | Test IDs |
|-----------|---------|------------------|----------|
| `AppLayout` / `MobileLayout` / `DesktopSplitPane` | All | `useResponsive`, `useCurrentMode` | TDD-LAYOUT-01 |
| `AppHeaderActions` | All | `useModals`, `useToast`, `useClipboard` | TDD-LAYOUT-02 |
| `CompactNavigation` | US1, US3, US4 | `useCurrentMode`, `useProSubMode`, `useImageSubMode` | TDD-LAYOUT-03 |
| `AdaptiveModal` | US2, US3, US6, US7, US8 | `useModals` | TDD-LAYOUT-04 |
| `Toast` / `ConfirmDialog` | All | `useToast`, `useConfirmDialog` | TDD-LAYOUT-05 |
| `PromptPreviewPanel` / `HtmlPreview` | US1, US5, US6 | `useLocalPromptPreviewPanel` | TDD-LAYOUT-06 |
| `SafePreviewToolbar` | US4 | `safe-preview-toolbar.ts` | TDD-LAYOUT-07 |

---

## Verification Checklist (Per Story)

Before marking a story ✅:

- [ ] All Test IDs implemented with RED tests first (confirmed fail)
- [ ] GREEN implementation makes all tests pass
- [ ] REFACTOR completes without test regression
- [ ] Component mounts with **real** stores/composables (no mocks)
- [ ] Feature Parity Matrix row 100% mapped
- [ ] Screenshot QA passes on 412×915, 421×933, 1280×720, 1920×1080
- [ ] DOM measurements: no overflow, font≥16px, tap≥44×44, animation=0s
- [ ] avoid-ai-design scan passes (P0=0, P1=0, score<6)
- [ ] Tier 1 review: 100% spec/parity match
- [ ] Tier 2 review: 0 Important findings (after ≤3 rounds)
- [ ] Locale parity verified for all 4 languages
- [ ] Build/lint/typecheck/unit tests pass

---

## Overall Status

| Metric | Target | Current |
|--------|--------|---------|
| User Stories Mapped | 10/10 | 10/10 |
| Test IDs Defined | 70+ | 70+ |
| Components to Rewrite | ~200 | 0 |
| Stories Verified | 10/10 | 0/10 |
| avoid-ai-design Score | <6 | TBD |
| Screenshot QA Viewports | 4 | 0/4 |
| Tier 1 Review | PASS | Pending |
| Tier 2 Review | 0 Important | Pending |

---

**Next Step**: Run `/speckit-tasks` to generate actionable tasks from this plan and matrix, then begin Phase 1 (Design System & Foundation) in worktrees.