<template>
  <div class="image-model-list">
    <!-- 空状态 -->
    <NEmpty v-if="configs.length === 0" :description="t('image.model.empty')">
      <template #extra>
        <PoButton variant="primary" @click="openAddModal">{{ t('image.model.addFirst') }}</PoButton>
      </template>
    </NEmpty>

    <!-- Presentation changes do not recreate the manager or its test results. -->
    <div v-else-if="isCompact" ref="mobileListRef" class="image-model-mobile-list">
      <NInput v-model:value="searchQuery" :placeholder="t('common.search')" :aria-label="t('common.search')" clearable />
      <NEmpty v-if="filteredConfigs.length === 0" :description="t('common.noContent')" />
      <MobileModelRow
        v-for="config in visibleMobileConfigs"
        :key="config.id"
        :title="config.name || config.id"
        :subtitle="`${providerDisplayName(config)} · ${config.model?.name || config.modelId}`"
        :enabled="config.enabled"
        :testing="isTestingConnectionFor(config.id)"
        :test-disabled="isTestingConnectionFor(config.id)"
        :test-label="t('common.test')"
        :menu-options="mobileActions(config)"
        @edit="editConfig(config.id)"
        @test="testConnection(config.id)"
        @action="handleMobileAction($event, config)"
      >
        <div class="image-model-mobile-capabilities">
          <NText v-if="config.model?.capabilities?.text2image" depth="3">{{ t('image.capability.text2image') }}</NText>
          <NText v-if="config.model?.capabilities?.image2image" depth="3">{{ t('image.capability.image2image') }}</NText>
          <NText v-if="config.provider?.corsRestricted && !isElectronEnv" type="warning">{{ t('modelManager.corsRestrictedTag') }}</NText>
        </div>
        <template v-if="testResults[config.id]" #test-result>
          <div class="image-model-mobile-result" role="status">
            <AppPreviewImage
              v-if="testResults[config.id]?.success && testResults[config.id]?.image"
              :src="getPreviewImageSrc(config.id) || ''"
              width="48"
              height="48"
              object-fit="cover"
              :preview-disabled="false"
              :alt="t('image.connection.testImagePreview')"
            />
            <NText :type="testResults[config.id].success ? 'success' : 'error'">
              {{ t(testResults[config.id].success ? 'image.connection.testSuccess' : 'image.connection.testError') }}
            </NText>
          </div>
        </template>
      </MobileModelRow>
      <!-- P-010: "Load more" for the paginated mobile list. -->
      <PoButton v-if="hasMoreConfigs" variant="secondary" style="width: 100%; margin-top: 8px" @click="loadMoreConfigs">
        {{ t('common.loadMore') }}
      </PoButton>
    </div>

    <!-- Slice 7: dense list as PoRow (design-system §2.4) instead of one Card
         per config. Title + meta carry the old header/tags as text; the test
         button, result thumbnail and the same four actions live in the row's
         action slot. The compact list already uses MobileModelRow. -->
    <div v-else ref="desktopListRef" class="image-model-stack">
      <PoRow
        v-for="config in visibleDesktopConfigs"
        :key="config.id"
        class="image-model-card"
        :class="{ 'image-model-card--disabled': !config.enabled }"
        :title="config.name || config.id"
        :meta="imageModelMeta(config)"
        :chevron="false"
      >
        <template #action>
          <NSpace :size="4" class="image-model-actions">
            <PoButton
              icon-only
              variant="ghost"
              :aria-label="t('modelManager.testConnection')"
              :disabled="isTestingConnectionFor(config.id)"
              :loading="isTestingConnectionFor(config.id)"
              @click="testConnection(config.id)"
            >
              <template #icon>
                <UiLink />
              </template>
            </PoButton>
            <AppPreviewImage
              v-if="testResults[config.id]?.success && testResults[config.id]?.image"
              :src="getPreviewImageSrc(config.id) || ''"
              width="24"
              height="24"
              object-fit="cover"
              :style="{ borderRadius: '4px', border: '1px solid var(--n-border-color)' }"
              :preview-disabled="false"
              :alt="t('image.connection.testImagePreview')"
            />
            <PoButton
              icon-only
              variant="ghost"
              :aria-label="t('modelManager.editModel')"
              @click="editConfig(config.id)"
            >
              <template #icon>
                <UiSquarePen />
              </template>
            </PoButton>
            <PoButton
              icon-only
              variant="ghost"
              :aria-label="t('modelManager.cloneModel')"
              @click="cloneConfig(config.id)"
            >
              <template #icon>
                <UiCopy />
              </template>
            </PoButton>
            <PoButton
              icon-only
              variant="ghost"
              :aria-label="config.enabled ? t('common.disable') : t('common.enable')"
              @click="toggleConfig(config)"
            >
              <template #icon>
                <UiPowerOff v-if="config.enabled" />
                <UiPower v-else />
              </template>
            </PoButton>
            <PoButton
              icon-only
              variant="destructive"
              :aria-label="t('common.delete')"
              @click="deleteConfig(config.id)"
            >
              <template #icon>
                <UiTrash2 />
              </template>
            </PoButton>
          </NSpace>
        </template>
      </PoRow>
      <!-- P-010: "Load more" for the paginated desktop list. -->
      <PoButton v-if="hasMoreConfigs" variant="secondary" style="width: 100%; margin-top: 8px" @click="loadMoreConfigs">
        {{ t('common.loadMore') }}
      </PoButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhLink as UiLink, PhPencilSimple as UiSquarePen, PhCopy as UiCopy, PhPower as UiPowerOff, PhPower as UiPower, PhTrash as UiTrash2 } from '@phosphor-icons/vue'
import { ref, onMounted, inject, h, computed, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import {
  NSpace, NText, NTag, NEmpty, NInput
} from 'naive-ui'
import PoRow from './primitives/PoRow.vue'
import PoButton from './primitives/PoButton.vue'
import { useImageModelManager } from '../composables/model/useImageModelManager'
import { useListReveal } from '../composables/ui/useListReveal'
import { useConfirmDialog } from '../composables/ui/useConfirmDialog'
import { useToast } from '../composables/ui/useToast'
import { getI18nErrorMessage } from '../utils/error'
import { isRunningInElectron, type IImageService, type ImageModel } from '@prompt-optimizer/core'
import { getProviderDisplayName } from '../utils/provider-display'
import AppPreviewImage from './media/AppPreviewImage.vue'
import MobileModelRow from './common/MobileModelRow.vue'
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout'

const { t } = useI18n()
const { isCompact } = useWorkspaceLayout()
const toast = useToast()
const confirmDialog = useConfirmDialog()
const isElectronEnv = isRunningInElectron()

// 定义事件
const emit = defineEmits(['add', 'edit', 'clone'])

// 使用 composable
const {
  configs,
  initialize,
  loadConfigs,
  updateConfig,
  deleteConfig: deleteConfigFromManager
} = useImageModelManager()

// 注入依赖
const imageService = inject<IImageService>('imageService')
if (!imageService) {
  throw new Error('[ImageModelManager] Missing required dependency: imageService')
}

// 状态管理
const testingConnections = ref<Record<string, boolean>>({})
const testResults = ref<Record<string, {
  success: boolean
  image?: {
    url?: string
    b64?: string
    mimeType?: string
  }
  testType: 'text2image' | 'image2image'
}>>({})

const isTestingConnectionFor = (configId: string) => !!testingConnections.value[configId]
const providerDisplayName = (config: { provider?: { id?: string; name?: string }; providerId?: string }) =>
  getProviderDisplayName(config.provider || { id: config.providerId }, t)

// Slice 7: the row's single meta line carries the old tag row as text.
const imageModelMeta = (config: {
  provider?: { id?: string; name?: string; corsRestricted?: boolean }
  providerId?: string
  model?: { name?: string; capabilities?: { text2image?: boolean; image2image?: boolean } }
  modelId?: string
  enabled: boolean
}) => [
  providerDisplayName(config),
  config.model?.name || config.modelId,
  config.model?.capabilities?.text2image ? t('image.capability.text2image') : '',
  config.model?.capabilities?.image2image ? t('image.capability.image2image') : '',
  config.provider?.corsRestricted && !isElectronEnv ? t('modelManager.corsRestrictedTag') : '',
  config.enabled ? '' : t('modelManager.disabled'),
].filter(Boolean).join(' · ')

const searchQuery = ref('')
const filteredConfigs = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  if (!query) return configs.value
  return configs.value.filter(config => [config.name, config.id, config.modelId, config.model?.name, providerDisplayName(config)]
    .some(value => value?.toLocaleLowerCase().includes(query)))
})

// P-010: paginate both lists (20 per page + "Load more") instead of
// rendering every config. Resets on search change and when the underlying
// list changes length (load/add/delete).
const MODEL_PAGE_SIZE = 20
const visibleConfigCount = ref(MODEL_PAGE_SIZE)
const visibleMobileConfigs = computed(() => filteredConfigs.value.slice(0, visibleConfigCount.value))
const visibleDesktopConfigs = computed(() => configs.value.slice(0, visibleConfigCount.value))

// M5 (step 7): rows stagger in once, on first mount with content — never
// on scroll, "Load more", or search re-filter. Mobile rows are
// MobileModelRow (article.mobile-model-row); desktop rows are PoRow
// (.image-model-card). Neither row root binds inline :style, so
// revealList's clearProps cannot strip anything.
const mobileListRef = ref<HTMLElement | null>(null)
const desktopListRef = ref<HTMLElement | null>(null)
useListReveal(
  () => [
    ...(mobileListRef.value?.querySelectorAll('.mobile-model-row') ?? []),
    ...(desktopListRef.value?.querySelectorAll('.image-model-card') ?? []),
  ],
  () => visibleMobileConfigs.value.length > 0 || visibleDesktopConfigs.value.length > 0,
)
const hasMoreConfigs = computed(() => (isCompact.value ? filteredConfigs.value.length : configs.value.length) > visibleConfigCount.value)
const loadMoreConfigs = () => { visibleConfigCount.value += MODEL_PAGE_SIZE }
watch(searchQuery, () => { visibleConfigCount.value = MODEL_PAGE_SIZE })
watch(() => configs.value.length, () => { visibleConfigCount.value = MODEL_PAGE_SIZE })

const mobileActions = (config: { enabled: boolean }) => [
  { key: 'clone', label: t('modelManager.cloneModel') },
  { key: 'toggle', label: t(config.enabled ? 'common.disable' : 'common.enable') },
  { key: 'delete', label: t('common.delete') },
]

const handleMobileAction = (action: string, config: { id: string; enabled: boolean }) => {
  if (action === 'clone') cloneConfig(config.id)
  else if (action === 'toggle') void toggleConfig(config)
  else if (action === 'delete') void deleteConfig(config.id)
}

// 辅助函数：根据模型能力选择测试类型
const selectTestType = (model: ImageModel): 'text2image' | 'image2image' => {
  const { text2image, image2image } = model.capabilities

  if (text2image && !image2image) {
    return 'text2image'  // 只支持文生图
  }

  if (!text2image && image2image) {
    return 'image2image' // 只支持图生图
  }

  if (text2image && image2image) {
    return 'text2image'  // 两种都支持，优先文生图
  }

  throw new Error('The model does not support image generation')
}

const getPreviewImageSrc = (configId: string): string | null => {
  const img = testResults.value[configId]?.image
  if (!img) return null
  if (img.url) return img.url
  const b64 = img.b64
  if (!b64) return null
  if (b64.startsWith('data:')) return b64
  return `data:image/png;base64,${b64}`
}

// 操作方法
const openAddModal = () => {
  emit('add')
}

const editConfig = (configId: string) => {
  emit('edit', configId)
}

const cloneConfig = (configId: string) => {
  const source = configs.value.find(c => c.id === configId)
  if (!source) return

  try {
    const cloned = {
      ...JSON.parse(JSON.stringify(source)),
      id: '',
      name: `${source.name || source.id} (Copy)`
    }
    emit('clone', cloned)
  } catch (error) {
    console.error('Failed to clone model config:', error)
    toast.error(t('modelManager.cloneFailed'))
  }
}

const testConnection = async (configId: string) => {
  if (isTestingConnectionFor(configId)) return

  const config = configs.value.find(c => c.id === configId)
  if (!config) return

  const runTest = async () => {
    try {
      testingConnections.value[configId] = true

      // 清除之前的测试结果
      delete testResults.value[configId]

      if (!config) throw new Error('Config not found')

      // 获取选中的模型信息
      if (!config.model) {
        throw new Error('The selected model could not be found')
      }

      // 根据模型能力确定测试类型
      const testType = selectTestType(config.model)

      // 通过统一服务执行测试（Electron 下经 IPC 走主进程；Web 下本地执行）
      const result = await imageService.testConnection(config)

      // 测试成功
      testResults.value[configId] = {
        success: true,
        image: result.images[0],
        testType
      }

      toast.success(t('image.connection.testSuccess'))

    } catch (error) {
      console.error('Connection test failed:', error)

      // 记录失败结果
      testResults.value[configId] = {
        success: false,
        testType: 'text2image' // 默认值
      }

      const detail = getI18nErrorMessage(error, t('image.connection.testError'))
      if (detail === t('image.connection.testError')) {
        toast.error(detail)
      } else {
        toast.error(`${t('image.connection.testError')}: ${detail}`)
      }
    } finally {
      delete testingConnections.value[configId]
    }
  }

  if (!isRunningInElectron()) {
    if (config?.provider?.corsRestricted) {
      // Route through the shared confirm dialog (EU05-01/R3E-04): its
      // Confirm is primary (white on #1f6bd1 = 5.14:1). A direct
      // dialog.warning() renders Confirm as type="warning" — white text on
      // #ffce2f (1.49:1). The dialog closes on click before runTest starts,
      // so the test still runs without blocking the close.
      const confirmed = await confirmDialog.warning({
        title: t('modelManager.corsRestrictedTag'),
        content: () => h('div', { style: 'white-space: pre-line;' }, t('modelManager.corsRestrictedConfirm', { provider: providerDisplayName(config) })),
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
      })
      if (!confirmed) return
    }
  }

  await runTest()
}

const toggleConfig = async (config: { id: string; enabled: boolean }) => {
  try {
    await updateConfig(config.id, { enabled: !config.enabled })
    await loadConfigs()
    toast.success(config.enabled ? t('modelManager.disableSuccess') : t('modelManager.enableSuccess'))
  } catch (error) {
    console.error('[ImageModelManager] Failed to toggle model status:', error)
    toast.error(t('modelManager.toggleFailed', { error: getI18nErrorMessage(error, t('common.error')) }))
  }
}

const deleteConfig = async (configId: string) => {
  const confirmed = await confirmDialog.warning({
    title: t('common.warning'),
    content: t('modelManager.deleteConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
  })
  if (!confirmed) return

  try {
    await deleteConfigFromManager(configId)
    await loadConfigs()
    toast.success(t('modelManager.deleteSuccess'))
  } catch (error) {
    console.error('[ImageModelManager] Failed to delete model:', error)
    toast.error(t('modelManager.deleteFailed', { error: getI18nErrorMessage(error, t('common.error')) }))
  }
}

// 初始化
onMounted(async () => {
  try {
    await initialize()
  } catch (error) {
    console.error('[ImageModelManager] Failed to initialize:', error)
  }
})

// 暴露给父组件的刷新方法
defineExpose({
  refresh: async () => {
    try {
      await loadConfigs()
    } catch {
      // 静默处理错误
    }
  }
})
</script>

<style scoped>
.image-model-list {
  width: 100%;
}

.image-model-mobile-list {
  display: grid;
  /* M04 (M-G): gap 0 so the PoRow dividers sit directly above the next row. */
  gap: 0;
}

.image-model-mobile-capabilities,
.image-model-mobile-result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  font-size: 12px;
}

.image-model-mobile-result {
  overflow-wrap: anywhere;
}

.image-model-stack {
  width: 100%;
}

.image-model-card--disabled {
  opacity: 0.6;
}

.image-model-actions {
  align-items: center;
  flex-wrap: nowrap;
}

/* 文本截断样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
