<template>
  <!-- Slice 7: PoSheet — mobile bottom sheet (max 90dvh), desktop card ≤720px
       (was min(92vw, 1040px)). -->
  <PoSheet
    :show="show"
    :title="dialogTitle"
    :mask-closable="true"
    @update:show="handleClose"
  >
    <FavoritePanelShell surface="dialog" mode="save-target">
      <template #toolbar>
        <NSpace vertical :size="10">
          <NButtonGroup size="small">
            <PoButton
              size="sm"
              :variant="targetMode === 'create' ? 'primary' : 'secondary'"
              @click="targetMode = 'create'"
            >
              {{ t('favorites.dialog.saveTarget.create') }}
            </PoButton>
            <PoButton
              size="sm"
              :variant="targetMode === 'update' ? 'primary' : 'secondary'"
              @click="targetMode = 'update'"
            >
              {{ t('favorites.dialog.saveTarget.update') }}
            </PoButton>
          </NButtonGroup>
          <NSelect
            v-if="targetMode === 'update'"
            v-model:value="selectedFavoriteId"
            :options="favoriteOptions"
            :placeholder="t('favorites.dialog.saveTarget.targetPlaceholder')"
            :input-props="{ 'aria-label': t('favorites.dialog.saveTarget.targetPlaceholder') }"
            size="small"
            filterable
          />
          <NAlert
            v-if="targetMode === 'update' && !selectedFavorite"
            type="warning"
            :show-icon="false"
          >
            {{ t('favorites.dialog.saveTarget.targetMissing') }}
          </NAlert>
        </NSpace>
      </template>

      <FavoriteEditorForm
        v-if="targetMode !== 'update' || selectedFavorite"
        :mode="editorMode"
        :content="content"
        :original-content="originalContent"
        :current-function-mode="currentFunctionMode"
        :current-optimization-mode="currentOptimizationMode"
        :prefill="prefill"
        :favorite="selectedFavorite"
        :apply-incoming-content-on-edit="targetMode === 'update'"
        @cancel="handleClose"
        @saved="handleSaved"
      />
    </FavoritePanelShell>
  </PoSheet>
</template>

<script setup lang="ts">
import PoSheet from "./primitives/PoSheet.vue"
import PoButton from "./primitives/PoButton.vue"
import { computed, inject, ref, watch, type Ref } from 'vue'

import { NAlert, NButtonGroup,  NSelect, NSpace } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { FavoritePrompt } from '@prompt-optimizer/core'

import FavoriteEditorForm from './FavoriteEditorForm.vue'
import FavoritePanelShell from './favorites/FavoritePanelShell.vue'
import type { FavoriteReproducibilityDraft } from '../utils/favorite-reproducibility'
import {
  findFavoriteBySourceAssetRef,
  type SourceAssetRef,
} from '../utils/source-asset'
import type { AppServices } from '../types/services'

const { t } = useI18n()
const services = inject<Ref<AppServices | null> | null>('services', null)

interface Props {
  show: boolean
  mode?: 'create' | 'save' | 'edit'
  content?: string
  originalContent?: string
  currentFunctionMode?: 'basic' | 'context' | 'pro' | 'image' | 'arena'
  currentOptimizationMode?: 'system' | 'user'
  prefill?: {
    title?: string
    description?: string
    category?: string
    tags?: string[]
    functionMode?: 'basic' | 'context' | 'image'
    optimizationMode?: 'system' | 'user'
    imageSubMode?: 'text2image' | 'image2image' | 'multiimage'
    metadata?: Record<string, unknown>
    reproducibilityDraft?: FavoriteReproducibilityDraft
    updateIntent?: 'content' | 'examples'
  }
  favorite?: FavoritePrompt
  candidateSource?: SourceAssetRef | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'save',
  content: '',
  originalContent: undefined,
  currentFunctionMode: 'basic',
  currentOptimizationMode: 'system',
  prefill: undefined,
  favorite: undefined,
  candidateSource: undefined,
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'saved': [favoriteId?: string]
}>()

const favorites = ref<FavoritePrompt[]>([])
const targetMode = ref<'create' | 'update'>('create')
const selectedFavoriteId = ref('')

const selectedFavorite = computed(() => {
  if (targetMode.value !== 'update') return undefined
  return favorites.value.find((favoriteItem) => favoriteItem.id === selectedFavoriteId.value)
})

const favoriteOptions = computed(() =>
  favorites.value.map((favoriteItem) => ({
    label: favoriteItem.title,
    value: favoriteItem.id,
  })),
)

const editorMode = computed<'save' | 'edit'>(() =>
  targetMode.value === 'update' && selectedFavorite.value ? 'edit' : 'save',
)

const dialogTitle = computed(() => {
  if (targetMode.value === 'create') return t('favorites.dialog.saveTarget.createTitle')
  if (selectedFavorite.value) return t('favorites.dialog.saveTarget.updateTitle')
  return t('favorites.dialog.saveTitle')
})

const loadFavorites = async () => {
  const favoriteManager = services?.value?.favoriteManager
  if (!favoriteManager) {
    favorites.value = []
    return
  }
  try {
    favorites.value = await favoriteManager.getFavorites()
  } catch (error) {
    console.warn('[SaveFavoriteDialog] Failed to load favorites:', error)
    favorites.value = []
  }
}

watch(
  () => props.show,
  async (show) => {
    if (!show) return
    await loadFavorites()
    const sourceFavorite = findFavoriteBySourceAssetRef(favorites.value, props.candidateSource)
    if (sourceFavorite) {
      targetMode.value = 'update'
      selectedFavoriteId.value = sourceFavorite.id
    } else {
      targetMode.value = 'create'
      selectedFavoriteId.value = ''
    }
  },
  { immediate: true },
)

const handleClose = () => {
  emit('update:show', false)
}

const handleSaved = (favoriteId: string) => {
  emit('saved', favoriteId)
  emit('update:show', false)
}
</script>
