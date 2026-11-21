<template>
  <ToastUI>
    <!-- Slice 7: PoSheet — mobile bottom sheet (max 90dvh, drag-to-close),
         desktop card ≤720px. The list sheet hides while a sub-sheet (text
         edit, image edit, network settings) is open, so only one layer is
         ever visible; closing the sub-sheet returns to this list. -->
    <PoSheet
      :show="show && !subSheetOpen"
      :title="t('modelManager.title')"
      class="model-manager-sheet"
      @update:show="(value) => !value && close()"
    >
      <template #header-extra>
        <PoButton v-if="hasDesktopNetwork" variant="secondary" @click="showNetworkSettings = true" style="margin-right: 12px" data-testid="network-settings-open">
          {{ t('networkSettings.title') }}
        </PoButton>
        <PoButton
          v-if="activeTab === 'text'"
          variant="primary"
          @click="openAddForActiveTab"
        >
          <template #icon>
            <UiFilePlus2 />
          </template>
          {{ isCompact ? t('common.add') : t('modelManager.addModel') }}
        </PoButton>
        <PoButton
          v-else-if="activeTab === 'image'"
          variant="primary"
          @click="handleAddImageModel"
        >
          <template #icon>
            <UiFilePlus2 />
          </template>
          {{ isCompact ? t('common.add') : t('modelManager.addImageModel') }}
        </PoButton>
      </template>

      <div class="model-manager-content" data-testid="model-manager-dialog">
        <!-- R3C-06 + R3D-03: Naive NTabs renders plain <div>s with no role,
             tabindex or aria-selected, and no keyboard handling — keyboard
             users could never switch tabs. Fixed at usage level (no Naive
             fork): syncTabA11y() stamps role="tab" / aria-selected / roving
             tabindex onto the rendered .n-tabs-tab elements, and
             onTabsKeydown() implements Arrow/Home/End switching. -->
        <NTabs
          ref="tabsRef"
          v-model:value="activeTab"
          data-testid="model-manager-tabs"
          type="segment"
          size="small"
          animated
          class="model-manager-tabs"
          @keydown="onTabsKeydown"
        >
          <NTabPane name="text" :tab="t('modelManager.textModels')" />
          <NTabPane name="image" :tab="t('modelManager.imageModels')" />
          <NTabPane name="function" :tab="t('modelManager.functionModels')" />
        </NTabs>

        <div class="model-manager-panel">
          <NCard
            embedded
            size="small"
            :bordered="false"
            class="model-manager-shell"
            :content-style="{ padding: isCompact ? '0' : '16px', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: '0' }"
          >
            <div ref="scrollAreaRef" class="model-manager-scroll-area">
              <!-- R3C-06/R3D-03: id/role/aria-labelledby fall through onto each
                   manager's root element, making them the tab panels for the
                   tabs above. v-show stays on the components themselves (not
                   a wrapper div) so the show/hide behaviour is unchanged. -->
              <TextModelManager
                id="model-manager-panel-text"
                role="tabpanel"
                aria-labelledby="model-manager-tab-text"
                v-show="activeTab === 'text'"
                :active="show && activeTab === 'text'"
                :manager="textModelManager"
                ref="textManagerRef"
                @models-updated="handleTextModelsUpdated"
                @edit-open="textEditorOpen = true"
                @edit-close="textEditorOpen = false"
              />
              <ImageModelManager
                id="model-manager-panel-image"
                role="tabpanel"
                aria-labelledby="model-manager-tab-image"
                v-show="activeTab === 'image'"
                ref="imageListRef"
                @edit="handleEditImageModel"
                @clone="handleCloneImageModel"
                @add="handleAddImageModel"
              />
              <FunctionModelManager
                id="model-manager-panel-function"
                role="tabpanel"
                aria-labelledby="model-manager-tab-function"
                v-show="activeTab === 'function'"
                ref="functionManagerRef"
              />
            </div>
          </NCard>
        </div>
      </div>
      <ModelNetworkStatus />
    </PoSheet>

    <ImageModelEditModal
      :show="showImageModelEdit"
      :config-id="editingImageModelId"
      :initial-config="draftImageModelConfig"
      @update:show="updateImageEditModalVisibility"
      @saved="handleImageModelSaved"
    />
    <!-- EU06-06: the text edit modal is a sibling of the list sheet (same
         pattern as the image editor). It used to render INSIDE
         TextModelManager, so hiding the list sheet while the editor was open
         unmounted the editor too — Add/Edit/Clone on the Text tab killed the
         whole Model Manager. :show is textEditorOpen, driven by the
         edit-open/edit-close events from TextModelManager. -->
    <TextModelEditModal
      :show="textEditorOpen"
      @update:show="handleTextEditModalVisibility"
      @saved="handleTextModelSaved"
    />
    <NetworkSettingsModal v-if="hasDesktopNetwork" v-model:show="showNetworkSettings" />
  </ToastUI>
</template>

<script setup lang="ts">
import { PhFilePlus as UiFilePlus2 } from '@phosphor-icons/vue'
import PoSheet from './primitives/PoSheet.vue'
import PoButton from './primitives/PoButton.vue'
import { computed, inject, nextTick, onMounted, onUnmounted, provide, ref, watch, type Ref } from 'vue'

import { useI18n } from 'vue-i18n'
import { NCard,  NTabs, NTabPane } from 'naive-ui'
import type { ImageModelConfig } from '@prompt-optimizer/core'
import ImageModelEditModal from './ImageModelEditModal.vue'
import ImageModelManager from './ImageModelManager.vue'
import TextModelEditModal from './TextModelEditModal.vue'
import TextModelManager from './TextModelManager.vue'
import FunctionModelManager from './FunctionModelManager.vue'
import { useTextModelManager } from '../composables/model/useTextModelManager'
import ToastUI from './Toast.vue'
import NetworkSettingsModal from './NetworkSettingsModal.vue'
import ModelNetworkStatus from './ModelNetworkStatus.vue'
import type { AppServices } from '../types/services'
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['modelsUpdated', 'close', 'select', 'update:show'])

const { t } = useI18n()
const { isCompact } = useWorkspaceLayout()

const activeTab = ref<'text' | 'image' | 'function'>('text')
const scrollAreaRef = ref<HTMLElement | null>(null)
// R3C-06 + R3D-03: Naive NTabs renders the tabs as plain <div>s (no role,
// tabindex, aria-selected) and handles no keys. Stamp the WAI-ARIA tab
// semantics onto the rendered .n-tabs-tab elements at usage level and drive
// Arrow/Home/End switching ourselves. The sheet content unmounts while a
// sub-sheet is open, so re-sync whenever the sheet reopens as well as when
// the active tab changes.
const tabsRef = ref<{ $el?: HTMLElement } | null>(null)
const TAB_ORDER = ['text', 'image', 'function'] as const
const syncTabA11y = () => {
  const root = tabsRef.value?.$el
  if (!root) return
  root.querySelector('.n-tabs-nav')?.setAttribute('role', 'tablist')
  // R3C-06/R3D-03 fix: Naive's segment tabs render an extra EMPTY .n-tabs-tab
  // inside .n-tabs-capsule (the sliding pill, Tabs.mjs:781-785). Stamping
  // every .n-tabs-tab by index shifted every real tab by one (the pill
  // claimed the text tab's id/role, "Function Models" got nothing). Real
  // tabs render as .n-tabs-tab-wrapper > .n-tabs-tab (Tab.mjs:100,108) —
  // stamp only those, and strip any stale attributes an earlier sync left
  // on the capsule placeholder (otherwise it keeps a duplicate id and a
  // focusable phantom tab).
  const realTabs = Array.from(root.querySelectorAll<HTMLElement>('.n-tabs-tab-wrapper > .n-tabs-tab'))
  root.querySelectorAll<HTMLElement>('.n-tabs-tab').forEach((el) => {
    if (realTabs.includes(el)) return
    el.removeAttribute('role')
    el.removeAttribute('id')
    el.removeAttribute('aria-selected')
    el.removeAttribute('aria-controls')
    el.removeAttribute('tabindex')
  })
  realTabs.forEach((el, index) => {
    const name = TAB_ORDER[index]
    if (!name) return
    el.setAttribute('role', 'tab')
    el.setAttribute('id', `model-manager-tab-${name}`)
    el.setAttribute('aria-selected', String(activeTab.value === name))
    el.setAttribute('aria-controls', `model-manager-panel-${name}`)
    el.setAttribute('tabindex', activeTab.value === name ? '0' : '-1')
  })
}
const onTabsKeydown = (event: KeyboardEvent) => {
  if (!(event.target as HTMLElement | null)?.classList?.contains('n-tabs-tab')) return
  const current = TAB_ORDER.indexOf(activeTab.value)
  let next = -1
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % TAB_ORDER.length
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + TAB_ORDER.length) % TAB_ORDER.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = TAB_ORDER.length - 1
  else return
  event.preventDefault()
  activeTab.value = TAB_ORDER[next]
  void nextTick(() => {
    syncTabA11y()
    tabsRef.value?.$el?.querySelector<HTMLElement>(`#model-manager-tab-${TAB_ORDER[next]}`)?.focus()
  })
}
onMounted(() => { void nextTick(syncTabA11y) })
watch(activeTab, () => { void nextTick(syncTabA11y) })
watch(() => props.show, (visible) => { if (visible) void nextTick(syncTabA11y) })
const compactScrollTop = { text: 0, image: 0, function: 0 }
watch(activeTab, async (tab, previous) => {
  if (!isCompact.value) return
  compactScrollTop[previous] = scrollAreaRef.value?.scrollTop ?? 0
  await nextTick()
  if (isCompact.value && activeTab.value === tab && scrollAreaRef.value) {
    scrollAreaRef.value.scrollTop = compactScrollTop[tab]
  }
}, { flush: 'pre' })
const hasDesktopNetwork = typeof window !== 'undefined' && !!window.electronAPI?.network
const showNetworkSettings = ref(false)
// Slice 7: sheet-page swap — while a sub-sheet (text edit, image edit, network
// settings) is open the list sheet hides, so only one layer is ever visible.
// Closing the sub-sheet returns to this list.
const textEditorOpen = ref(false)
const subSheetOpen = computed(() =>
  showImageModelEdit.value || showNetworkSettings.value || textEditorOpen.value,
)
const textManagerRef = ref<InstanceType<typeof TextModelManager> | null>(null)
// EU06-06: the text-model manager instance lives here (created + provided
// for the sibling TextModelEditModal below) instead of inside
// TextModelManager — see the modal comment above.
const textModelManager = useTextModelManager()
provide('textModelManager', textModelManager)

const handleTextEditModalVisibility = (value: boolean) => {
  // EU06-06 (fix 2): the text close must mirror the image path — set
  // textEditorOpen directly. Routing only through the child's ref is a
  // no-op when the list content is unmounted (list hidden while the editor
  // is open), so the editor could never close cleanly. Keep the child sync
  // as a best-effort for when the ref exists.
  textEditorOpen.value = value
  if (!value) textManagerRef.value?.updateEditModalVisibility(false)
}

const handleTextModelSaved = (id?: string) => {
  void textManagerRef.value?.handleModelUpdated(id)
}
const openTextModel = async (id: string) => {
  activeTab.value = 'text'
  await nextTick()
  await textManagerRef.value?.openEditModal(id)
}
const openImageModel = async (id: string) => {
  activeTab.value = 'image'
  await nextTick()
  handleEditImageModel(id)
}
defineExpose({ openTextModel, openImageModel })
const imageListRef = ref<InstanceType<typeof ImageModelManager> | null>(null)
const functionManagerRef = ref<InstanceType<typeof FunctionModelManager> | null>(null)
const showImageModelEdit = ref(false)
const editingImageModelId = ref<string | undefined>(undefined)
const draftImageModelConfig = ref<ImageModelConfig | undefined>(undefined)

const services = inject<Ref<AppServices | null>>('services')
if (!services?.value) {
  throw new Error('Services not provided!')
}

provide('imageModelManager', services.value.imageModelManager)
provide('imageRegistry', services.value.imageAdapterRegistry)
provide('imageService', services.value.imageService)

const close = () => {
  showNetworkSettings.value = false
  emit('update:show', false)
  emit('close')
}

const openAddForActiveTab = () => {
  if (activeTab.value === 'text') {
    textManagerRef.value?.openAddModal()
  } else if (activeTab.value === 'image') {
    handleAddImageModel()
  }
}

const handleTextModelsUpdated = async (id?: string) => {
  emit('modelsUpdated', id)
  await functionManagerRef.value?.refresh?.()
}

const handleAddImageModel = () => {
  editingImageModelId.value = undefined
  draftImageModelConfig.value = undefined
  showImageModelEdit.value = true
}

const handleEditImageModel = (configId: string) => {
  editingImageModelId.value = configId
  draftImageModelConfig.value = undefined
  showImageModelEdit.value = true
}

const handleCloneImageModel = (draft: ImageModelConfig) => {
  editingImageModelId.value = undefined
  draftImageModelConfig.value = draft
  showImageModelEdit.value = true
}

const updateImageEditModalVisibility = (value: boolean) => {
  showImageModelEdit.value = value
  if (!value) {
    editingImageModelId.value = undefined
    draftImageModelConfig.value = undefined
  }
}

const handleImageModelSaved = () => {
  showImageModelEdit.value = false
  editingImageModelId.value = undefined
  draftImageModelConfig.value = undefined
  try {
    imageListRef.value?.refresh?.()
  } catch {
      // 静默处理错误
    }
}

if (typeof window !== 'undefined') {
  const networkHandler = () => { if (hasDesktopNetwork) showNetworkSettings.value = true }
  onMounted(() => window.addEventListener('model-network:open-settings', networkHandler))
  onUnmounted(() => window.removeEventListener('model-network:open-settings', networkHandler))
  const tabHandler = (e: Event) => {
    try {
      const tab = (e as CustomEvent).detail
      if (tab === 'text' || tab === 'image' || tab === 'function') activeTab.value = tab
    } catch {
      // 静默处理错误
    }
  }
  onMounted(() => window.addEventListener('model-manager:set-tab', tabHandler))
  onUnmounted(() => window.removeEventListener('model-manager:set-tab', tabHandler))
}
</script>

<style scoped>
.model-manager-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}

.model-manager-tabs {
  flex: 0 0 auto;
}

.model-manager-tabs :deep(.n-tabs-nav) {
  margin-bottom: 0;
}

.model-manager-tabs :deep(.n-tabs-nav-scroll-wrapper) {
  padding: 2px;
}

.model-manager-tabs :deep(.n-tabs-content) {
  display: none;
}

.model-manager-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.model-manager-shell {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 16px;
}

.model-manager-shell :deep(.n-card__content) {
  min-height: 0;
}

.model-manager-scroll-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

/* Slice 7: PoSheet card hook — the class falls through PoSheet → AdaptiveModal
   → card. The card content is a flex column so the inner scroll area keeps a
   definite height (the old content-style flex chain, which PoSheet does not take). */
:global(.model-manager-sheet) {
  max-height: 90vh;
}

:global(.model-manager-sheet > .n-card-content) {
  display: flex;
  flex-direction: column;
}

:global(.workspace-compact .model-manager-sheet.adaptive-modal-sheet > .n-card-header) {
  grid-template-columns: minmax(0, 1fr) auto auto;
  padding: 8px 12px;
  gap: 8px;
}

:global(.workspace-compact .model-manager-sheet.adaptive-modal-sheet > .n-card-header > .n-card-header__extra) {
  grid-row: 1;
  grid-column: 2;
}

:global(.workspace-compact .model-manager-sheet.adaptive-modal-sheet > .n-card-header > .n-base-close) {
  grid-column: 3;
}

:global(.workspace-compact .model-manager-sheet.adaptive-modal-sheet > .n-card-content) {
  padding: 12px !important;
  overflow: hidden;
}

:global(.workspace-compact .model-manager-sheet .model-manager-content) { gap: 8px; }
:global(.workspace-compact .model-manager-sheet .model-manager-shell) { border-radius: 0; background: transparent; }
:global(.workspace-compact .model-manager-sheet .model-manager-scroll-area) { padding: 0; overscroll-behavior: contain; }


.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
