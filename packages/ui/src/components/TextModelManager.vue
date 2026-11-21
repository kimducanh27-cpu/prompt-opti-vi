<template>
  <div class="text-model-manager">
    <LocalServiceDiscovery :active="active && modelsReady" :models="manager.models.value"
      :disabled="preparingLocalService || showEditModal" @select="handleLocalService" />
    <TextModelList
      :models="pagedVisibleModels"
      :is-testing-connection-for="isTestingConnectionFor"
      :is-default-model="manager.isDefaultModel"
      @test="handleTestConnection"
      @edit="handleEditModel"
      @clone="handleCloneModel"
      @enable="handleEnableModel"
      @disable="handleDisableModel"
      @delete="handleDeleteModel"
    />
    <!-- P-010: the list rendered ALL models; cap the rendered DOM at 20 per
         page with "Load more", mirroring the History/Template pagination. -->
    <NButton v-if="hasMoreModels" block style="margin-top: 8px" @click="loadMoreModels">
      {{ t('common.loadMore') }}
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, h, watch, computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { isRunningInElectron } from '@prompt-optimizer/core'
import LocalServiceDiscovery from './LocalServiceDiscovery.vue'
import { isChromeBuiltInPlaceholder, type DiscoveredLocalService } from '../utils/local-model-discovery'
import type { TextModelManager } from '../composables/model/useTextModelManager'
import TextModelList from './TextModelList.vue'
import { NButton } from 'naive-ui'
import { useToast } from '../composables/ui/useToast'
import { useConfirmDialog } from '../composables/ui/useConfirmDialog'
import { getProviderDisplayName } from '../utils/provider-display'

const emit = defineEmits(['modelsUpdated', 'edit-open', 'edit-close'])
const props = withDefaults(defineProps<{ active?: boolean, manager: TextModelManager }>(), { active: false })
const { t } = useI18n()
const toast = useToast()
const confirmDialog = useConfirmDialog()
// EU06-06: the manager instance is created + provided by ModelManager (the
// text edit modal now lives there as a sibling of the list sheet, mirroring
// the image path). This component only consumes it — it used to create the
// manager and render the modal itself, so hiding the list sheet while the
// editor was open unmounted the editor too and the whole Model Manager died.
const manager = props.manager
const visibleModels = computed(() => manager.models.value.filter(model => !isChromeBuiltInPlaceholder(model)))

// P-010: paginate the model list (20 per page + "Load more") instead of
// rendering every model. Resets when the underlying list changes length
// (load/add/delete); enable/disable keeps the length, so the page stays.
const MODEL_PAGE_SIZE = 20
const visibleModelCount = ref(MODEL_PAGE_SIZE)
const pagedVisibleModels = computed(() => visibleModels.value.slice(0, visibleModelCount.value))
const hasMoreModels = computed(() => visibleModels.value.length > visibleModelCount.value)
const loadMoreModels = () => { visibleModelCount.value += MODEL_PAGE_SIZE }
watch(() => visibleModels.value.length, () => { visibleModelCount.value = MODEL_PAGE_SIZE })

const showEditModal = ref(false)
// Slice 7: tell ModelManager when the text editor sheet is open so it can hide
// the list sheet — only one sheet layer is ever visible at a time.
watch(showEditModal, (open) => {
  emit(open ? 'edit-open' : 'edit-close')
})
const modelsReady = ref(false)
const preparingLocalService = ref(false)
let localDraftGeneration = 0
watch(() => props.active, active => {
  if (!active) {
    localDraftGeneration++
    manager.cancelLocalModelRequest()
  }
})
onBeforeUnmount(() => {
  localDraftGeneration++
  manager.cancelLocalModelRequest()
})
const handleLocalService = async (service: DiscoveredLocalService) => {
  if (preparingLocalService.value || showEditModal.value || !props.active) return
  preparingLocalService.value = true
  const current = ++localDraftGeneration
  try {
    const prepared = await manager.prepareForLocalService(service)
    if (!prepared || current !== localDraftGeneration || !props.active) return
    editingModelId.value = null
    showEditModal.value = true
  } catch {
    if (current === localDraftGeneration && props.active) toast.error(t('modelManager.loadFailed'))
  } finally {
    preparingLocalService.value = false
  }
}
const editingModelId = ref<string | null>(null)
const isTestingConnectionFor = (id: string) => !!manager.testingConnections.value[id]
const handleModelUpdated = async (id?: string) => {
  await manager.loadModels()
  const targetId = id || manager.models.value[0]?.id
  if (targetId) {
    emit('modelsUpdated', targetId)
  }

  // 保存成功后关闭模态框并重置表单状态
  showEditModal.value = false
  editingModelId.value = null
  manager.resetFormState()
}

const handleTestConnection = async (id: string) => {
  const runTest = async () => {
    await manager.testConfigConnection(id)
  }

  if (!isRunningInElectron()) {
    const model = manager.models.value.find(m => m.id === id)
    if (model) {
      const isCorsRestricted = !!model.providerMeta?.corsRestricted
      if (isCorsRestricted) {
        const providerName = getProviderDisplayName(model.providerMeta, t, 'Unknown Provider')
        // Route through the shared confirm dialog (EU05-01/R3E-04): its
        // Confirm is primary (white on #1f6bd1 = 5.14:1). A direct
        // dialog.warning() renders Confirm as type="warning" — white text on
        // #ffce2f (1.49:1). The dialog closes on click before runTest starts,
        // so the test still runs without blocking the close.
        const confirmed = await confirmDialog.warning({
          title: t('modelManager.corsRestrictedTag'),
          content: () => h('div', { style: 'white-space: pre-line;' }, t('modelManager.corsRestrictedConfirm', { provider: providerName })),
          positiveText: t('common.confirm'),
          negativeText: t('common.cancel'),
        })
        if (!confirmed) return
      }
    }
  }
  await runTest()
}

const handleEditModel = async (id: string) => {
  // 如果已经在编辑同一个模型且模态框已经打开，直接返回
  if (editingModelId.value === id && showEditModal.value === true) {
    return
  }

  // 如果切换到不同的模型，重置表单状态
  if (editingModelId.value && editingModelId.value !== id) {
    manager.resetFormState()
  }

  // 准备编辑模式（总是会执行，因为我们需要确保状态正确）
  await manager.prepareForEdit(id, true)
  editingModelId.value = id
  showEditModal.value = true
}

const updateEditModalVisibility = (value: boolean) => {
  showEditModal.value = value
  // 当模态框关闭时，重置编辑状态但不重置表单数据
  if (!value) {
    editingModelId.value = null
    manager.cancelLocalModelRequest()
  }
}

const handleCloneModel = async (id: string) => {
  try {
    await manager.prepareForClone(id)
    showEditModal.value = true
    editingModelId.value = null
  } catch {
    // prepareForClone already handles user-facing errors
  }
}

const handleEnableModel = async (id: string) => {
  await manager.enableModel(id)
  emit('modelsUpdated', id)
}

const handleDisableModel = async (id: string) => {
  await manager.disableModel(id)
  emit('modelsUpdated', id)
}

const handleDeleteModel = async (id: string) => {
  const confirmed = await confirmDialog.warning({
    title: t('common.warning'),
    content: t('modelManager.deleteConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
  })
  if (!confirmed) return

  await manager.deleteModel(id)
  const firstId = manager.models.value[0]?.id
  emit('modelsUpdated', firstId)
}

const openAddModal = async () => {
  await manager.prepareForCreate()
  editingModelId.value = null
  showEditModal.value = true
}

defineExpose({
  openAddModal,
  openEditModal: handleEditModel,
  updateEditModalVisibility,
  handleModelUpdated,
  refresh: manager.loadModels
})

onMounted(async () => {
  await manager.loadProviders()
  await manager.loadModels()
  modelsReady.value = true
  const firstId = manager.models.value[0]?.id
  if (firstId) {
    emit('modelsUpdated', firstId)
  }
})
</script>

<style scoped>
.text-model-manager {
  width: 100%;
}
</style>
