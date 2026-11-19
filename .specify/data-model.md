# Data Model: prompt-optimizer UI Rewrite

**Generated**: 2026-11-19 | **Spec**: .specify/spec.md | **Plan**: .specify/plan.md

---

## Key Entities

### 1. PromptSession
**Represents**: User's active prompt workspace state

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique session ID | `useBasicUserSession` / `useProSession` |
| `mode` | `'basic-user' \| 'basic-system' \| 'pro' \| 'arena' \| 'image'` | Current workspace mode | `useCurrentMode.mode` |
| `promptText` | string | Current prompt input | `usePromptDraftStore.text` |
| `cursorPosition` | number | Cursor position in textarea | `usePromptDraftStore.cursor` |
| `variables` | `Variable[]` | Active variables for substitution | `useTemporaryVariablesStore.variables` |
| `contextChain` | `ContextNode[]` | Ordered context nodes (Pro mode) | `useContextManagement.chain` |
| `selectedModel` | `ModelConfig` | Active LLM model | `useTextModelManager.selectedModel` |
| `selectedTemplate` | `PromptTemplate \| null` | Applied template | `useTemplateManager.selectedTemplate` |
| `history` | `PromptSession[]` | Session history stack | `useHistoryManager.entries` |
| `createdAt` | number | Timestamp | Session store |
| `updatedAt` | number | Last modification timestamp | Session store |

---

### 2. OptimizationResult
**Represents**: Output from prompt optimization

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique result ID | `usePromptOptimizer` |
| `originalPrompt` | string | Input prompt | `usePromptOptimizer.lastInput` |
| `optimizedPrompt` | string | Optimized output | `usePromptOptimizer.lastResult` |
| `templateUsed` | `PromptTemplate \| null` | Template applied | `useTemplateManager.selectedTemplate` |
| `modelUsed` | `ModelConfig` | Model that generated result | `useTextModelManager.selectedModel` |
| `tokensUsed` | `{input: number, output: number}` | Token consumption | `usePromptOptimizer.tokenUsage` |
| `duration` | number | Generation time (ms) | `usePromptOptimizer.duration` |
| `createdAt` | number | Timestamp | `usePromptOptimizer` |

---

### 3. ImageGenerationResult
**Represents**: Output from T2I/I2I generation

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique result ID | `useImageGeneration` |
| `mode` | `'t2i' \| 'i2i' \| 'multi'` | Generation mode | `useImageSubMode.subMode` |
| `prompt` | string | Text prompt | `useImageGeneration.lastPrompt` |
| `referenceImages` | `ReferenceImage[]` | Input images (I2I) | `useReferenceImageActions.referenceImages` |
| `images` | `GeneratedImage[]` | Output images | `useImageGeneration.lastResult` |
| `modelUsed` | `ModelConfig` | Image model used | `useImageModelManager.selectedModel` |
| `parameters` | `ImageGenerationParams` | Generation parameters | `useImageGeneration.lastParams` |
| `tokenUsage` | `TokenUsage` | Token consumption | `useImageGeneration.tokenUsage` |
| `createdAt` | number | Timestamp | `useImageGeneration` |

---

### 4. ComparisonResult
**Represents**: Side-by-side evaluation output

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique comparison ID | `useEvaluationHandler` |
| `variants` | `TestVariant[]` | Compared variants | `useCompareRoleConfig.variants` |
| `results` | `VariantResult[]` | Per-variant outputs | `useEvaluationHandler.results` |
| `metadata` | `CompareMetadata` | Evaluation metadata | `useCompareResultMetadata.metadata` |
| `structuredCompare` | `StructuredCompareResult \| null` | Structured evaluation | `useEvaluationHandler.structuredCompare` |
| `createdAt` | number | Timestamp | `useEvaluationHandler` |

---

### 5. ModelConfig
**Represents**: LLM/Image model configuration

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique model ID | `useTextModelManager` / `useImageModelManager` |
| `name` | string | Display name | Model manager |
| `provider` | `'openai' \| 'anthropic' \| 'google' \| 'ollama' \| 'custom' \| ...` | Provider identifier | Model manager |
| `endpoint` | string | API endpoint | `useConnectionConfig` |
| `model` | string | Model identifier | Model manager |
| `apiKey` | string \| null | API key (encrypted) | `useConnectionConfig` |
| `parameters` | `ModelParameters` | Generation parameters | `useModelAdvancedParameters` |
| `capabilities` | `ModelCapabilities` | Supported features | Model catalog |
| `isBuiltIn` | boolean | Built-in vs custom | Model manager |
| `lastTested` | number \| null | Last connection test | Model manager |

---

### 6. PromptTemplate
**Represents**: Reusable prompt template with variables

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique template ID | `useTemplateManager` |
| `name` | string | Display name | Template manager |
| `description` | string | Template description | Template manager |
| `content` | string | Template content with `{{variable}}` placeholders | Template manager |
| `variables` | `TemplateVariable[]` | Declared variables | Template manager |
| `category` | string | Organization category | Template manager |
| `isBuiltIn` | boolean | Built-in vs user-created | Template manager |
| `builtinLocale` | `'en-US' \| 'zh-CN' \| null` | Built-in template locale | Template manager |
| `createdAt` | number | Creation timestamp | Template manager |
| `updatedAt` | number | Last modification | Template manager |

---

### 7. FavoritePrompt
**Represents**: Saved prompt with metadata, versions, sharing

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique favorite ID | `useFavoriteStore` |
| `name` | string | Display name | Favorite store |
| `prompt` | string | Prompt content | Favorite store |
| `variables` | `Variable[]` | Associated variables | Favorite store |
| `contextChain` | `ContextNode[]` | Associated context | Favorite store |
| `modelConfig` | `ModelConfig` | Model used | Favorite store |
| `tags` | `string[]` | Organization tags | Favorite store |
| `versions` | `FavoriteVersion[]` | Version history | Favorite store |
| `currentVersion` | number | Active version index | Favorite store |
| `isShared` | boolean | Publicly shared | Favorite store |
| `shareId` | string \| null | Share token | Favorite store |
| `createdAt` | number | Creation timestamp | Favorite store |
| `updatedAt` | number | Last modification | Favorite store |

---

### 8. ContextChain / ContextNode
**Represents**: Ordered list of context nodes for Pro mode

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique node ID | `useContextManagement` |
| `type` | `'system' \| 'user' \| 'assistant' \| 'tool'` | Message role | Context management |
| `content` | string | Node content | Context management |
| `metadata` | `Record<string, unknown>` | Additional data | Context management |
| `order` | number | Position in chain | Context management |
| `isEnabled` | boolean | Whether included in optimization | Context management |

---

### 9. Variable
**Represents**: Named value for template substitution

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `id` | string | Unique variable ID | `useVariableManager` |
| `name` | string | Variable name (e.g., `topic`) | Variable manager |
| `value` | string | Variable value | Variable manager |
| `description` | string | Human-readable description | Variable manager |
| `isTemporary` | boolean | Session-only vs persisted | `useTemporaryVariablesStore` |
| `scope` | `'global' \| 'test' \| 'template'` | Usage scope | Variable manager |

---

### 10. WorkspaceExport
**Represents**: Serializable full workspace state for import/export

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `version` | string | Export format version | `useDataManager` |
| `exportedAt` | number | Export timestamp | `useDataManager` |
| `sessions` | `PromptSession[]` | All sessions | `useDataManager` |
| `favorites` | `FavoritePrompt[]` | All favorites | `useDataManager` |
| `variables` | `Variable[]` | Global variables | `useDataManager` |
| `templates` | `PromptTemplate[]` | User templates | `useDataManager` |
| `models` | `ModelConfig[]` | Custom models | `useDataManager` |
| `settings` | `GlobalSettings` | User settings | `useGlobalSettingsStore` |
| `history` | `PromptSession[]` | Session history | `useDataManager` |

---

## Entity Relationships

```
PromptSession (1) ──→ (N) OptimizationResult
PromptSession (1) ──→ (N) ImageGenerationResult
PromptSession (1) ──→ (1) ContextChain (N ContextNode)
PromptSession (1) ──→ (N) Variable (via useTemporaryVariablesStore)
PromptSession (1) ──→ (1) ModelConfig
PromptSession (1) ──→ (0..1) PromptTemplate

FavoritePrompt (1) ──→ (N) FavoriteVersion
FavoritePrompt (1) ──→ (1) ModelConfig
FavoritePrompt (1) ──→ (N) Variable
FavoritePrompt (1) ──→ (1) ContextChain

ComparisonResult (1) ──→ (N) TestVariant
ComparisonResult (1) ──→ (N) VariantResult

WorkspaceExport (1) ──→ (N) PromptSession
WorkspaceExport (1) ──→ (N) FavoritePrompt
WorkspaceExport (1) ──→ (N) Variable
WorkspaceExport (1) ──→ (N) PromptTemplate
WorkspaceExport (1) ──→ (N) ModelConfig
WorkspaceExport (1) ──→ (1) GlobalSettings
WorkspaceExport (1) ──→ (N) HistoryEntry
```

---

## Store/Composable API Contracts (Preserved - New UI Must Wire To)

### Session Stores
```typescript
// useBasicUserSession / useBasicSystemSession / useProSession / useArenaSession
interface SessionStore {
  // State
  currentSession: PromptSession | null
  sessions: PromptSession[]
  isLoading: boolean
  
  // Actions
  createSession(mode: Mode): PromptSession
  loadSession(id: string): Promise<PromptSession>
  saveSession(session: PromptSession): Promise<void>
  deleteSession(id: string): Promise<void>
  duplicateSession(id: string): PromptSession
}
```

### Prompt Draft Store
```typescript
// usePromptDraftStore
interface PromptDraftStore {
  text: string
  cursor: number
  setText(text: string): void
  setCursor(position: number): void
  reset(): void
}
```

### Temporary Variables Store
```typescript
// useTemporaryVariablesStore
interface TemporaryVariablesStore {
  variables: Variable[]
  addVariable(variable: Variable): void
  removeVariable(id: string): void
  updateVariable(id: string, updates: Partial<Variable>): void
  clear(): void
  importFromJSON(json: string): void
  exportToJSON(): string
}
```

### Prompt Optimizer Composable
```typescript
// usePromptOptimizer
interface PromptOptimizer {
  isOptimizing: boolean
  lastResult: OptimizationResult | null
  lastInput: string | null
  tokenUsage: {input: number, output: number} | null
  duration: number | null
  error: Error | null
  
  optimize(options: OptimizeOptions): Promise<OptimizationResult>
  cancel(): void
}

interface OptimizeOptions {
  prompt: string
  template?: PromptTemplate
  model?: ModelConfig
  variables?: Variable[]
  contextChain?: ContextNode[]
}
```

### Template Manager Composable
```typescript
// useTemplateManager
interface TemplateManager {
  templates: PromptTemplate[]
  builtinTemplates: PromptTemplate[]
  selectedTemplate: PromptTemplate | null
  isLoading: boolean
  
  createTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): PromptTemplate
  updateTemplate(id: string, updates: Partial<PromptTemplate>): void
  deleteTemplate(id: string): void
  applyTemplate(id: string): void
  importTemplates(json: string): PromptTemplate[]
  exportTemplates(ids?: string[]): string
}
```

### Variable Manager Composable
```typescript
// useVariableManager
interface VariableManager {
  variables: Variable[]
  testVariables: Variable[] // For compare/test mode
  
  addVariable(variable: Omit<Variable, 'id'>): Variable
  removeVariable(id: string): void
  updateVariable(id: string, updates: Partial<Variable>): void
  importVariables(json: string): Variable[]
  exportVariables(ids?: string[]): string
}
```

### Context Management Composable
```typescript
// useContextManagement
interface ContextManagement {
  chain: ContextNode[]
  nodeTypes: ContextNode['type'][]
  
  addNode(node: Omit<ContextNode, 'id' | 'order'>): ContextNode
  removeNode(id: string): void
  reorderNodes(fromIndex: number, toIndex: number): void
  updateNode(id: string, updates: Partial<ContextNode>): void
  clearChain(): void
}

// useContextEditor
interface ContextEditor {
  nodes: ContextNode[]
  isEditing: boolean
  editingNodeId: string | null
  
  startEdit(nodeId: string): void
  cancelEdit(): void
  saveEdit(content: string): void
  saveChain(): Promise<void>
}
```

### Image Generation Composable
```typescript
// useImageGeneration
interface ImageGeneration {
  isGenerating: boolean
  lastResult: ImageGenerationResult | null
  lastPrompt: string | null
  history: ImageGenerationResult[]
  tokenUsage: TokenUsage | null
  error: Error | null
  
  generate(params: ImageGenerationParams): Promise<ImageGenerationResult>
  generateBatch(params: ImageGenerationParams[]): Promise<ImageGenerationResult[]>
  cancel(): void
}

interface ImageGenerationParams {
  prompt: string
  model: ModelConfig
  referenceImages?: ReferenceImage[]
  parameters: ImageModelParameters
  mode: 't2i' | 'i2i' | 'multi'
}
```

### Image Model Manager Composable
```typescript
// useImageModelManager
interface ImageModelManager {
  models: ModelConfig[]
  selectedModel: ModelConfig | null
  isLoading: boolean
  
  selectModel(id: string): void
  addModel(config: ModelConfig): ModelConfig
  updateModel(id: string, updates: Partial<ModelConfig>): void
  deleteModel(id: string): void
  testConnection(model: ModelConfig): Promise<boolean>
}
```

### Compare / Evaluation Composables
```typescript
// useCompareRoleConfig
interface CompareRoleConfig {
  variants: TestVariant[]
  roles: CompareRole[]
  
  addVariant(variant: TestVariant): void
  removeVariant(id: string): void
  updateVariant(id: string, updates: Partial<TestVariant>): void
  setRoles(roles: CompareRole[]): void
}

// useEvaluationHandler
interface EvaluationHandler {
  isRunning: boolean
  results: VariantResult[]
  metadata: CompareMetadata | null
  structuredCompare: StructuredCompareResult | null
  error: Error | null
  
  run(config: EvaluationConfig): Promise<VariantResult[]>
  runStructuredCompare(prompts: string[]): Promise<StructuredCompareResult>
  cancel(): void
}

interface EvaluationConfig {
  variants: TestVariant[]
  roles: CompareRole[]
  model: ModelConfig
}
```

### History Manager Composable
```typescript
// useHistoryManager
interface HistoryManager {
  entries: HistoryEntry[]
  isLoading: boolean
  
  list(): Promise<HistoryEntry[]>
  getEntry(id: string): Promise<PromptSession>
  restoreEntry(id: string): Promise<PromptSession>
  deleteEntry(id: string): Promise<void>
  clearHistory(): Promise<void>
}
```

### Favorite Store
```typescript
// useFavoriteStore
interface FavoriteStore {
  favorites: FavoritePrompt[]
  isLoading: boolean
  
  getFavorite(id: string): FavoritePrompt | undefined
  createFavorite(data: Omit<FavoritePrompt, 'id' | 'versions' | 'createdAt' | 'updatedAt'>): FavoritePrompt
  updateFavorite(id: string, updates: Partial<FavoritePrompt>): void
  deleteFavorite(id: string): void
  toggleFavorite(id: string): void
  createVersion(id: string): FavoriteVersion
  restoreVersion(id: string, versionIndex: number): void
  importFavorites(data: FavoritePrompt[]): void
  exportFavorites(ids?: string[]): string
  shareFavorite(id: string): string // returns shareId
  unshareFavorite(id: string): void
}
```

### Data Manager Composable
```typescript
// useDataManager
interface DataManager {
  exportWorkspace(options: ExportOptions): Promise<Blob>
  importWorkspace(file: File): Promise<ImportResult>
  exportFavorites(options: ExportOptions): Promise<Blob>
  importFavorites(file: File): Promise<ImportResult>
  transferSession(session: PromptSession): Promise<void>
  importProgress: ImportProgress // reactive
  exportOptions: ExportOptions
}

interface ExportOptions {
  includeHistory: boolean
  includeFavorites: boolean
  includeSettings: boolean
  includeTemplates: boolean
  includeModels: boolean
  format: 'json' | 'zip'
}
```

### Global Settings Store
```typescript
// useGlobalSettingsStore
interface GlobalSettingsStore {
  settings: GlobalSettings
  platformSettings: PlatformSettings
  
  updateSettings(updates: Partial<GlobalSettings>): void
  updatePlatformSettings(updates: Partial<PlatformSettings>): void
  resetToDefaults(): void
}

interface GlobalSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'en-US' | 'zh-CN' | 'zh-TW' | 'vi-VN'
  autoSave: boolean
  compactMode: boolean
  // ... other settings
}

interface PlatformSettings {
  extension: ExtensionSettings
  desktop: DesktopSettings
  web: WebSettings
}
```

### Naive Theme Composable
```typescript
// useNaiveTheme
interface NaiveTheme {
  theme: 'light' | 'dark' | 'auto'
  setTheme(theme: 'light' | 'dark' | 'auto'): void
  toggleTheme(): void
  isDark: boolean
}
```

---

## Platform Adapter Interfaces (Preserved)

### Electron (Desktop)
```typescript
// packages/desktop/src/main/ipc-handlers.ts
interface DesktopIPC {
  'window:minimize': () => void
  'window:maximize': () => void
  'window:close': () => void
  'window:setFullscreen': (fullscreen: boolean) => void
  'settings:get': () => GlobalSettings
  'settings:set': (settings: GlobalSettings) => void
  'update:check': () => UpdateInfo
  'update:apply': () => void
}
```

### Chrome Extension
```typescript
// packages/extension/src/background/
interface ExtensionAPI {
  storage: {
    get: (keys: string[]) => Promise<Record<string, unknown>>
    set: (data: Record<string, unknown>) => Promise<void>
    remove: (keys: string[]) => Promise<void>
  }
  runtime: {
    sendMessage: (message: unknown) => Promise<unknown>
    onMessage: (handler: (message: unknown) => void) => void
  }
  action: {
    setPopup: (popup: string) => void
    openPopup: () => void
  }
}
```

---

## Notes

- All stores/composables/services listed above are **PRESERVED** and must not be modified
- New UI components must wire to these exact APIs
- TypeScript interfaces above reflect current implementation (verify against actual source)
- Any discrepancy between this document and actual code: actual code wins
- Feature Parity Matrix maps each user story to these contracts