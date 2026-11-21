<template>
  <div v-if="isCompact" ref="mobileListRef" class="mobile-text-model-list" data-testid="mobile-text-model-list">
    <NInput
      v-model:value="search"
      :placeholder="t('common.search')"
      :aria-label="t('common.search')"
      clearable
      data-testid="text-model-search"
    />
    <MobileModelRow
      v-for="model in filteredModels"
      :key="model.id"
      :title="modelDisplayName(model)"
      :subtitle="[providerDisplayName(model), model.modelMeta?.name || model.modelMeta?.id].filter(Boolean).join(' · ')"
      :enabled="model.enabled"
      :testing="isTestingConnectionFor(model.id)"
      :test-label="t('common.test')"
      :menu-options="mobileActions(model)"
      @edit="emit('edit', model.id)"
      @test="emit('test', model.id)"
      @action="handleMobileAction($event, model)"
    >
      <div v-if="hasMobileCapabilities(model)" class="mobile-text-model-capabilities">
        <span v-if="model.modelMeta?.capabilities?.supportsTools">{{ t('modelManager.capabilities.tools') }}</span>
        <span v-if="model.modelMeta?.capabilities?.supportsReasoning">{{ t('modelManager.capabilities.reasoning') }}</span>
        <span v-if="model.providerMeta?.corsRestricted && !isElectronEnv" class="mobile-text-model-restriction">
          {{ t('modelManager.corsRestrictedTag') }}
        </span>
      </div>
    </MobileModelRow>
    <NEmpty v-if="!filteredModels.length" :description="t('common.noContent')" size="small" />
  </div>
  <!-- Slice 7: dense list as PoRow (design-system §2.4) instead of one Card
       per model. Title + meta carry the old header/tags as text; the same
       five actions live in the row's action slot. The compact list already
       uses MobileModelRow, so only the desktop branch changes. -->
  <div v-else ref="desktopListRef" class="model-list-stack">
    <PoRow
      v-for="model in models"
      :key="model.id"
      class="model-config-card"
      :class="{ 'model-config-card--disabled': !model.enabled }"
      :title="modelDisplayName(model)"
      :meta="modelMeta(model)"
      :chevron="false"
    >
      <template #action>
        <NSpace :size="4" class="model-card-actions">
          <PoButton
            icon-only
            variant="ghost"
            :aria-label="t('modelManager.testConnection')"
            :disabled="isTestingConnectionFor(model.id)"
            :loading="isTestingConnectionFor(model.id)"
            @click="emit('test', model.id)"
          >
            <template #icon>
              <UiLink />
            </template>
          </PoButton>
          <PoButton
            icon-only
            variant="ghost"
            :aria-label="t('modelManager.editModel')"
            @click="emit('edit', model.id)"
          >
            <template #icon>
              <UiSquarePen />
            </template>
          </PoButton>
          <PoButton
            icon-only
            variant="ghost"
            :aria-label="t('modelManager.cloneModel')"
            @click="emit('clone', model.id)"
          >
            <template #icon>
              <UiCopy />
            </template>
          </PoButton>
          <PoButton
            icon-only
            variant="ghost"
            :aria-label="model.enabled ? t('common.disable') : t('common.enable')"
            @click="emit(model.enabled ? 'disable' : 'enable', model.id)"
          >
            <template #icon>
              <UiPowerOff v-if="model.enabled" />
              <UiPower v-else />
            </template>
          </PoButton>
          <PoButton
            v-if="!isDefaultModel(model.id)"
            icon-only
            variant="destructive"
            :aria-label="t('common.delete')"
            @click="emit('delete', model.id)"
          >
            <template #icon>
              <UiTrash2 />
            </template>
          </PoButton>
        </NSpace>
      </template>
    </PoRow>
  </div>
</template>

<script setup lang="ts">
import { PhLink as UiLink, PhPencilSimple as UiSquarePen, PhCopy as UiCopy, PhPower as UiPowerOff, PhPower as UiPower, PhTrash as UiTrash2 } from '@phosphor-icons/vue'
import { computed, ref, type PropType } from 'vue'

import { useI18n } from 'vue-i18n'
import { NSpace, NInput, NEmpty, type DropdownOption } from 'naive-ui'
import PoRow from './primitives/PoRow.vue'
import PoButton from './primitives/PoButton.vue'
import MobileModelRow from './common/MobileModelRow.vue'
import { useWorkspaceLayout } from '../composables/ui/useWorkspaceLayout'
import { useListReveal } from '../composables/ui/useListReveal'
import { isRunningInElectron, type TextModelConfig } from '@prompt-optimizer/core'
import { getProviderDisplayName, getTextModelConfigDisplayName } from '../utils/provider-display'

const { models, isTestingConnectionFor, isDefaultModel } = defineProps({
  models: {
    type: Array as PropType<TextModelConfig[]>,
    default: () => []
  },
  isTestingConnectionFor: {
    type: Function as PropType<(id: string) => boolean>,
    required: true
  },
  isDefaultModel: {
    type: Function as PropType<(id: string) => boolean>,
    required: true
  }
})

const emit = defineEmits(['test', 'edit', 'clone', 'enable', 'disable', 'delete'])

const { t } = useI18n()

const { isCompact } = useWorkspaceLayout()
const search = ref('')
const filteredModels = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  if (!query) return models
  return models.filter(model => [modelDisplayName(model), providerDisplayName(model), model.modelMeta?.name, model.modelMeta?.id]
    .some(value => value?.toLocaleLowerCase().includes(query)))
})

// M5 (step 7): rows stagger in once, on first mount with content — never
// on scroll or search re-filter. Mobile rows are MobileModelRow
// (article.mobile-model-row); desktop rows are PoRow (.model-config-card).
// Neither row root binds inline :style, so revealList's clearProps cannot
// strip anything.
const mobileListRef = ref<HTMLElement | null>(null)
const desktopListRef = ref<HTMLElement | null>(null)
useListReveal(
  () => [
    ...(mobileListRef.value?.querySelectorAll('.mobile-model-row') ?? []),
    ...(desktopListRef.value?.querySelectorAll('.model-config-card') ?? []),
  ],
  () => filteredModels.value.length > 0 || models.length > 0,
)
const isElectronEnv = isRunningInElectron()
const mobileActions = (model: TextModelConfig): DropdownOption[] => [
  { label: t('modelManager.cloneModel'), key: 'clone' },
  { label: model.enabled ? t('common.disable') : t('common.enable'), key: model.enabled ? 'disable' : 'enable' },
  ...(!isDefaultModel(model.id) ? [{ label: t('common.delete'), key: 'delete' }] : []),
]
const handleMobileAction = (action: string, model: TextModelConfig) => {
  if (action === 'clone' || action === 'enable' || action === 'disable') emit(action, model.id)
  else if (action === 'delete' && !isDefaultModel(model.id)) emit('delete', model.id)
}
const hasMobileCapabilities = (model: TextModelConfig) =>
  model.modelMeta?.capabilities?.supportsTools || model.modelMeta?.capabilities?.supportsReasoning ||
  (model.providerMeta?.corsRestricted && !isElectronEnv)
const modelDisplayName = (model: TextModelConfig) => getTextModelConfigDisplayName(model, t)
const providerDisplayName = (model: TextModelConfig) => getProviderDisplayName(model.providerMeta, t)

// Slice 7: the row's single meta line carries the old tag row as text.
const modelMeta = (model: TextModelConfig) => [
  providerDisplayName(model),
  model.modelMeta?.name || model.modelMeta?.id,
  model.modelMeta?.capabilities?.supportsTools ? t('modelManager.capabilities.tools') : '',
  model.modelMeta?.capabilities?.supportsReasoning ? t('modelManager.capabilities.reasoning') : '',
  model.providerMeta?.corsRestricted && !isElectronEnv ? t('modelManager.corsRestrictedTag') : '',
  model.enabled ? '' : t('modelManager.disabled'),
].filter(Boolean).join(' · ')
</script>

<style scoped>
.mobile-text-model-list {
  display: flex;
  flex-direction: column;
  /* M04 (M-G): gap 0 so the PoRow dividers sit directly above the next row. */
  gap: 0;
}

.mobile-text-model-capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  color: var(--compact-muted);
  font-size: 12px;
  line-height: 1.4;
}

.mobile-text-model-restriction {
  color: var(--n-error-color);
}

.model-list-stack {
  width: 100%;
}

.model-config-card--disabled {
  opacity: 0.6;
}

.model-card-actions {
  align-items: center;
  flex-wrap: nowrap;
}
</style>
