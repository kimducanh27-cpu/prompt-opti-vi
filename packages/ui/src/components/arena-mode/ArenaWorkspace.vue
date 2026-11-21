<template>
  <div class="arena-workspace" data-testid="arena-workspace">
    <!-- UIUX-M05: the save-error banner now uses the PoBanner primitive
         (design-system §3) instead of an ad-hoc NAlert. -->
    <PoBanner v-if="session.saveError" type="error">{{ t('arena.saveFailed') + ': ' + translateError(session.saveError) }}</PoBanner>

    <NCard size="small" class="arena-input" content-style="padding: 12px;">
      <TestInputSection v-model="session.state.prompt" :label="t('arena.prompt')" :show-header="false" :placeholder="t('arena.promptPlaceholder')" :min-rows="2" :max-rows="4" test-id="arena-prompt">
        <template #footer="{ openFullscreen }">
          <TestWorkspaceToolbar class="arena-toolbar" embedded :running="session.running" :run-disabled="!canRunAll" run-test-id="arena-run-all" @run="perform(session.runAll)">
            <template #leading>
              <PromptGardenInspirationPopover mode="arena" :label="t('arena.benchmarks')" :has-prompt="!!session.state.prompt.trim()" :disabled="session.running || uploading" test-id="arena-garden" @apply="importGarden" @open-import="showGardenImport = true" />
              <NButton size="small" data-testid="arena-add" @click="addColumn"><template #icon><Plus :size="16" /></template>{{ t('arena.addColumn') }}</NButton>
            </template>
            <template #actions>
              <NButton size="small" :loading="uploading" @click="fileInput?.click()"><template #icon><ImagePlus :size="16" /></template>{{ t('arena.addImages') }}</NButton>
              <NButton size="small" type="tertiary" ghost round :title="t('common.expand')" :aria-label="t('common.expand')" @click="openFullscreen"><template #icon><Maximize2 :size="16" /></template></NButton>
            </template>
          </TestWorkspaceToolbar>
        </template>
      </TestInputSection>
      <input ref="fileInput" class="file-input" type="file" accept="image/png,image/jpeg" multiple data-testid="arena-image-input" @change="upload" />
      <AppPreviewImageGroup v-if="session.state.images.length"><div class="input-images">
        <div v-for="(image, i) in session.state.images" :key="image.id + '-' + i" class="input-image">
          <ArenaImage :asset-id="image.id" :label="t('arena.inputImage') + ' ' + (i + 1)" :width="56" />
          <div class="image-actions">
            <NButton size="tiny" quaternary circle :disabled="i === 0" :aria-label="t('workspace.moveImageEarlier', { index: i + 1 })" :title="t('workspace.moveImageEarlier', { index: i + 1 })" @click="moveImage(i)"><template #icon><ArrowLeft :size="14" /></template></NButton>
            <NButton size="tiny" quaternary circle :aria-label="t('test.image.remove')" :title="t('test.image.remove')" @click="removeInputImage(i)"><template #icon><X :size="14" /></template></NButton>
          </div>
        </div>
      </div></AppPreviewImageGroup>
    </NCard>

    <section class="arena-comparison" :aria-label="t('arena.columns')">
      <!-- Slice 8: mobile (<1024px, isCompact) renders the deck as a vertical
           stack — one full-width card per contestant, collapsible — with no
           horizontal scroll. Desktop keeps the horizontal deck exactly. -->
      <NScrollbar ref="columnsScrollbar" class="arena-scrollbar" container-class="arena-scroll-container" :x-scrollable="!isCompact" trigger="none" :theme-overrides="{ height: '8px' }" :container-style="{ overflowY: 'hidden' }" :content-style="isCompact ? { width: '100%', height: 'auto', paddingBottom: '0', boxSizing: 'border-box' } : { width: '100%', height: '100%', minWidth: `calc(${session.state.contestants.length} * var(--arena-column-min-width) + ${(session.state.contestants.length - 1) * 12}px)`, paddingBottom: '14px', boxSizing: 'border-box' }">
      <div ref="deck" class="arena-deck" :class="{ 'arena-deck--compact': compactColumns, 'arena-deck--stacked': isCompact }" :style="{ gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : `repeat(${session.state.contestants.length}, minmax(0, 1fr))` }" data-testid="arena-deck" :aria-label="t('arena.columns')" tabindex="0">
        <article v-for="(c, index) in session.state.contestants" :key="c.id" class="arena-column" :class="{ 'arena-column--collapsed': isContestantCollapsed(c.id) }" :data-column-id="c.id" :data-testid="'arena-column-' + c.id">
          <div v-if="isCompact" class="arena-column-toggle-row">
            <NButton quaternary size="small" class="arena-column-toggle" :aria-expanded="!isContestantCollapsed(c.id)" :data-testid="'arena-column-toggle-' + c.id" @click="toggleContestant(c.id)">
              <template #icon><ChevronDown :size="16" :class="{ 'is-collapsed': isContestantCollapsed(c.id) }" /></template>
              {{ c.modelId || ('#' + (index + 1)) }}
            </NButton>
          </div>
          <div v-show="!isContestantCollapsed(c.id)" class="arena-column-body">
          <NCard size="small" class="arena-model-controls" content-style="padding: var(--arena-control-padding);">
            <div class="model-controls">
              <TextModelSelector :model-value="models.selection(c)" :options="models.textOptions.value" :additional-groups="models.imageGroups(imageCatalog)" :disabled="session.busy(c.id)" :placeholder="t('model.select.placeholder')" :aria-label="t('model.select.placeholder')" show-model-types size="small" @update:model-value="models.select(c, $event)" @update:show="show => { if (show) void loadImages() }" @config="id => configure(c, id)">
                <template v-if="parameterConfig(c)" #selection-detail>
                  <ModelParameterControls presentation="summary" :mode="c.kind" :model-key="models.selection(c)" :provider-id="parameterConfig(c)!.providerId || ''"
                    :definitions="parameterDefinitions(c)" :inherited="inheritedParameters(c)" :model-value="c.paramOverrides || {}" />
                </template>
                <template v-if="parameterConfig(c)" #parameters>
                  <ModelParameterControls :mode="c.kind" :model-key="models.selection(c)" :provider-id="parameterConfig(c)!.providerId || ''"
                    :definitions="parameterDefinitions(c)" :inherited="inheritedParameters(c)" :model-value="c.paramOverrides || {}" :disabled="session.busy(c.id)"
                    @update:model-value="c.paramOverrides = $event" />
                </template>
              </TextModelSelector>
              <NButton class="column-run" size="small" secondary :disabled="!canRun(c)" :loading="session.busy(c.id)" :aria-label="t('test.layout.runThisColumn')" :title="t('test.layout.runThisColumn')" :data-testid="'arena-run-' + c.id" @click="perform(() => session.run(c.id))"><template v-if="!compactColumns" #icon><Play :size="13" /></template>{{ t('test.title') }}</NButton>
              <NButton class="column-delete" size="small" quaternary circle :disabled="session.state.contestants.length <= 1 || session.busy(c.id)" :aria-label="t('arena.deleteColumn')" :title="t('arena.deleteColumn')" :data-testid="'arena-delete-' + c.id" @click="removeColumn(c.id)"><template #icon><Trash2 :size="16" /></template></NButton>
            </div>
            <NText v-if="c.modelId && !models.compatible(c)" class="model-warning" type="warning">{{ t('arena.incompatible') }}</NText>
          </NCard>
          <div class="arena-result-slot">
            <NCard size="small" class="arena-result-card" content-style="padding: 0; height: 100%; max-height: 100%; overflow: hidden; display: flex; flex-direction: column;">
              <p v-if="session.state.results[c.id]?.error" role="alert" class="compact-test-error">{{ translateError(session.state.results[c.id].error!) }}</p>
              <AppPreviewImageGroup v-if="session.state.results[c.id]?.images.length"><div class="result-images"><ArenaImage v-for="(image, i) in session.state.results[c.id].images" :key="image.id + '-' + i" :asset-id="image.id" :label="c.modelId + ' ' + (i + 1)" :width="280" /></div></AppPreviewImageGroup>
              <OutputDisplay v-if="!session.state.results[c.id]?.images.length || session.state.results[c.id]?.output.result || session.state.results[c.id]?.output.reasoning" :content="session.state.results[c.id]?.output.result || ''" :reasoning="session.state.results[c.id]?.output.reasoning" :output-record="session.state.results[c.id]?.output" :loading="session.busy(c.id)" :enable-stop="session.cancellable(c.id)" mode="readonly" reasoning-mode="auto" :enable-edit="false" :enable-favorite="false" :enable-diff="false" :streaming="session.state.results[c.id]?.status === 'running' && c.kind === 'text'" height="100%" />
            </NCard>
          </div>
          </div>
        </article>
      </div>
      </NScrollbar>
    </section>

    <PromptGardenImportDialog v-model:show="showGardenImport" @confirm="importGarden" />
  </div>
</template>

<script setup lang="ts">
import { computed, h, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { routerKey } from 'vue-router'
import { PhArrowLeft as ArrowLeft, PhCaretDown as ChevronDown, PhCheckCircle as CircleCheck, PhImageSquare as ImagePlus, PhArrowsOut as Maximize2, PhPlay as Play, PhPlus as Plus, PhTrash as Trash2, PhX as X } from '@phosphor-icons/vue'
import { NButton, NCard, NIcon, NScrollbar, NText, type ScrollbarInst } from 'naive-ui'
import { resolveTextModelParameterDefinitions, type ArenaContestant, type ImageModel } from '@prompt-optimizer/core'
import { getPiniaServices } from '../../plugins/pinia'
import { useArenaSession } from '../../stores/session/useArenaSession'
import { useImageInputPreparation } from '../../composables/image/useImageInputPreparation'
import { useArenaModels } from './useArenaModels'
import ArenaImage from './ArenaImage.vue'
import TextModelSelector from '../TextModelSelector.vue'
import ModelParameterControls from '../ModelParameterControls.vue'
import OutputDisplay from '../OutputDisplay.vue'
import TestInputSection from '../TestInputSection.vue'
import TestWorkspaceToolbar from '../TestWorkspaceToolbar.vue'
import AppPreviewImageGroup from '../media/AppPreviewImageGroup.vue'
import PoBanner from '../primitives/PoBanner.vue'
import PromptGardenInspirationPopover from '../common/PromptGardenInspirationPopover.vue'
import PromptGardenImportDialog from '../common/PromptGardenImportDialog.vue'
import type { PromptGardenImportRequest } from '../../utils/prompt-garden-import'
import { useToast } from '../../composables/ui/useToast'
import { useListReveal } from '../../composables/ui/useListReveal'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'

const session = useArenaSession()
const models = useArenaModels()
const { isCompact } = useWorkspaceLayout()
// Slice 8: per-contestant collapse, mobile only. All contestants start
// expanded; the toggle only hides the body while isCompact is true, so a
// resize back to desktop always shows every column.
const collapsedContestants = ref(new Set<string>())
const isContestantCollapsed = (id: string) => isCompact.value && collapsedContestants.value.has(id)
const toggleContestant = (id: string) => {
  const next = new Set(collapsedContestants.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  collapsedContestants.value = next
}
const parameterConfig = (c: ArenaContestant) => session.resolveConfig({ ...c, paramOverrides: undefined })
const parameterDefinitions = (c: ArenaContestant) => {
  const config = parameterConfig(c)
  if (!config) return []
  if (!('modelMeta' in config)) return config.model.parameterDefinitions
  const registry = getPiniaServices()?.textAdapterRegistry
  return registry ? resolveTextModelParameterDefinitions({ providerId: config.providerMeta.id,
    modelId: c.modelId, connectionConfig: config.connectionConfig || {}, savedDefinitions: config.modelMeta.parameterDefinitions,
    registry }) : config.modelMeta.parameterDefinitions
}
const inheritedParameters = (c: ArenaContestant) => {
  const config = parameterConfig(c)
  return config ? { ...('modelMeta' in config ? config.modelMeta.defaultParameterValues : config.model.defaultParameterValues), ...config.paramOverrides } : {}
}

const { t } = useI18n()
const toast = useToast()
const router = inject(routerKey, null)
const showGardenImport = ref(false)
const importGarden = (request: PromptGardenImportRequest) => {
  if (!router || session.running || uploading.value) return
  void router.push({ path: '/arena', query: { importCode: request.importCode, subModeKey: 'arena', ...(request.exampleId ? { exampleId: request.exampleId } : {}) } })
}
const openModelManager = inject<(kind: 'text' | 'image', id?: string) => void | Promise<void>>('openModelManager', () => {})
const uploading = ref(false)
const deck = ref<HTMLElement>()
const { width: deckWidth } = useElementSize(deck)

// M7 (step 7): opponent columns stagger in once, when the first
// contestants exist — never on scroll or when a contestant is added /
// removed mid-session, and never when results land inside a column
// (the article elements persist; only their inner content changes).
// The column roots bind no inline :style, so revealList's clearProps
// cannot strip anything.
useListReveal(
  () => [...(deck.value?.querySelectorAll('.arena-column') ?? [])],
  () => session.state.contestants.length > 0,
)
const compactColumns = computed(() => deckWidth.value > 0 && (deckWidth.value - 12 * (session.state.contestants.length - 1)) / session.state.contestants.length < 320)
const columnsScrollbar = ref<ScrollbarInst>()
const fileInput = ref<HTMLInputElement>()
const imageCatalog = ref<Record<string, ImageModel[]>>({})
const { prepareInputRefs } = useImageInputPreparation()
const canRun = (c: ArenaContestant) => !uploading.value && !session.busy(c.id) && !!session.state.prompt.trim() && models.compatible(c)
const canRunAll = computed(() => !session.running && session.state.contestants.every(canRun))
const translateError = (message: string) => message.startsWith('arena.') ? t(message) : message
const perform = async (fn: () => unknown) => { try { await fn() } catch (e) { toast.error(translateError(e instanceof Error ? e.message : String(e))) } }
const configure = (c: ArenaContestant, id?: string) => id?.startsWith('image:') ? openModelManager('image', id.slice(6)) : openModelManager(c.kind, c.configKey || undefined)
const focusColumn = (id: string) => deck.value?.querySelector<HTMLElement>(`[data-column-id="${id}"] .text-model-selector`)?.focus({ preventScroll: true })
const addColumn = async () => {
  const id = session.addContestant()
  await nextTick()
  const column = deck.value?.querySelector<HTMLElement>(`[data-column-id="${id}"]`)
  if (!column) return
  if (isCompact.value) {
    // Vertical stack: no horizontal deck to scroll — bring the new card
    // into view instead.
    column.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' })
    focusColumn(id)
    return
  }
  const container = deck.value?.closest<HTMLElement>('.arena-scroll-container')
  if (!container) return
  columnsScrollbar.value?.scrollTo({ left: column.getBoundingClientRect().right - container.getBoundingClientRect().right + container.scrollLeft,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  focusColumn(id)
}
const removeColumn = async (id: string) => {
  const index = session.state.contestants.findIndex(c => c.id === id)
  session.removeContestant(id)
  await nextTick()
  const next = session.state.contestants[Math.min(index, session.state.contestants.length - 1)]
  if (next) focusColumn(next.id)
}
const moveImage = (i: number) => { const images = session.state.images; [images[i - 1], images[i]] = [images[i], images[i - 1]] }
// R3B-02: deleting a reference image was silent (only the stale "Upload
// success" toast remained) and unrecoverable. Show a toast with a real Undo
// button: Naive's message API takes a `render` option that replaces the
// message body, so the render replicates Naive's `.n-message` classes
// (pinned to naive-ui 2.44.1 — verified in Message.mjs) to keep the success
// styling, with the Undo button restoring the image at its old position.
const removeInputImage = (index: number) => {
  const [removed] = session.state.images.splice(index, 1)
  if (!removed) return
  toast.add(t('arena.imageDeleted'), 'success', {
    duration: 5000,
    render: (messageProps) => h('div', { class: 'n-message n-message--success-type', style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
      h('div', { class: 'n-message__icon n-message__icon--success-type' }, [
        h(NIcon, { size: 18 }, { default: () => h(CircleCheck, { size: 18 }) }),
      ]),
      h('div', { class: 'n-message__content', style: { flex: '1', minWidth: '0' } }, t('arena.imageDeleted')),
      h(NButton, {
        size: 'small',
        type: 'primary',
        text: true,
        onClick: () => {
          const at = Math.min(index, session.state.images.length)
          session.state.images.splice(at, 0, removed)
          messageProps.onClose?.()
        },
      }, () => t('common.undo')),
    ]),
  })
}
const upload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  uploading.value = true
  await perform(async () => { const images = await prepareInputRefs(Array.from(input.files || [])); if (images) await session.addImages(images) })
  uploading.value = false; input.value = ''
}
let imageLoadVersion = 0
const loadImages = async () => {
  const version = ++imageLoadVersion
  await perform(async () => {
    const entries = await Promise.all(session.configurations.image.map(async config => [config.id, await models.loadImages(config)] as const))
    if (version === imageLoadVersion) imageCatalog.value = Object.fromEntries(entries)
  })
}
const refresh = () => { imageLoadVersion++; imageCatalog.value = {}; void perform(session.refreshConfigs) }
onMounted(() => { refresh(); window.addEventListener('basic-workspace-refresh-text-models', refresh); window.addEventListener('image-workspace-refresh-image-models', refresh) })
onUnmounted(() => { imageLoadVersion++; void session.saveSession(); window.removeEventListener('basic-workspace-refresh-text-models', refresh); window.removeEventListener('image-workspace-refresh-image-models', refresh) })

defineExpose({ isUpdateBusy: () => session.running || uploading.value })
</script>

<style scoped>
.arena-workspace { --arena-control-padding: 12px; width: 100%; height: 100%; min-height: 0; min-width: 0; display: flex; flex: 1; flex-direction: column; gap: 12px; overflow: auto; }
/* The 280px column minimum exists ONLY on desktop (it feeds the deck's
   horizontal min-width calc). Mobile overrides it to 0 — see below. */
@media (min-width: 1024px) {
  .arena-workspace { --arena-column-min-width: min(280px, 100%); }
}
.arena-input, .arena-toolbar, .arena-model-controls { flex-shrink: 0; }
.file-input { display: none; }
.input-images { display: flex; align-items: flex-start; gap: 8px; margin-top: 8px; overflow-x: auto; }
.input-image { flex-shrink: 0; }
.image-actions { display: flex; justify-content: space-between; }
.model-warning { font-size: 12px; line-height: 1.5; }
.arena-comparison { display: flex; flex: 1; min-height: 260px; min-width: 0; }
.arena-scrollbar { flex: 1; min-width: 0; min-height: 0; height: 100%; }
.arena-deck { display: grid; align-items: stretch; gap: 12px; width: 100%; height: 100%; min-height: 0; }
.arena-column { display: flex; flex-direction: column; min-width: 0; min-height: 0; gap: 12px; }
.arena-column-body { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; gap: 12px; }
.arena-column-toggle-row { display: flex; flex-shrink: 0; min-width: 0; }
.arena-column-toggle { min-width: 0; max-width: 100%; }
.arena-column-toggle :deep(.n-button__content) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.arena-column-toggle .is-collapsed { transform: rotate(-90deg); transition: transform var(--duration-fast, 125ms) ease; }
/* Slice 8: vertical stack (mobile). One full-width column, no deck
   min-width and no horizontal scroll — the 280px column minimum only
   exists in the desktop content-style binding above. */
.arena-deck--stacked { height: auto; }
.arena-deck--stacked .arena-column { min-height: 0; }
@media (max-width: 1023px) {
  .arena-workspace { --arena-column-min-width: 0; }
  .arena-comparison { min-height: 0; }
  .arena-scrollbar { height: auto; overflow: visible; }
  .arena-deck--stacked { grid-template-columns: minmax(0, 1fr); }
}
.model-controls { display: flex; gap: 8px; align-items: center; min-width: 0; }
.model-controls > :deep(.model-selection) { flex: 1; min-width: 0; }
.model-controls > .n-button { flex-shrink: 0; }
.arena-deck--compact .model-controls { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; }
.arena-deck--compact .model-controls > :deep(.model-selection) { grid-column: 1 / -1; }
.arena-deck--compact .model-controls > :deep(.local-model-parameters) { grid-column: 1; grid-row: 2; }
.arena-deck--compact .column-run { grid-column: 2; grid-row: 2; justify-self: end; }
.arena-deck--compact .column-delete { grid-column: 3; grid-row: 2; }
.model-warning { display: block; margin-top: 8px; }
.arena-result-slot { display: flex; flex: 1; flex-direction: column; min-height: 0; }
.arena-result-card { flex: 1; min-height: 0; overflow: hidden; }
.arena-result-card :deep(.compact-test-error) { flex-shrink: 0; }
.result-images { display: flex; flex-wrap: wrap; flex-shrink: 1; min-height: 0; max-height: 100%; box-sizing: border-box; gap: 8px; padding: 12px; overflow: auto; }
.result-images :deep(.n-image) { min-width: 0; max-width: 100%; }
.result-images :deep(img) { max-width: 100%; }
@media (max-width: 760px) {
  .arena-workspace { --arena-control-padding: 8px; box-sizing: border-box; padding: 12px; }
  .model-controls { gap: 4px; }
  .arena-toolbar :deep(.test-workspace-toolbar) { flex-wrap: wrap; }
  .arena-toolbar :deep(.test-global-actions) { flex-wrap: wrap; max-width: 100%; justify-content: flex-end; }
}
</style>
