<template>
  <ToastUI>
    <!-- Slice 7: PoSheet — mobile bottom sheet (max 90dvh), desktop card ≤720px
         (was 96vw / max 1440px). The library inside keeps its own layout. -->
    <PoSheet
      :show="show"
      :title="t('favorites.manager.title')"
      @update:show="(value) => !value && close()"
    >
      <FavoriteLibraryWorkspace
        layout="modal"
        :active="show"
        :use-favorite="handleUseFavorite"
      />
    </PoSheet>
  </ToastUI>
</template>

<script setup lang="ts">
import PoSheet from "./primitives/PoSheet.vue"
import { useI18n } from 'vue-i18n'
import { } from 'naive-ui'
import type { FavoritePrompt } from '@prompt-optimizer/core'

import FavoriteLibraryWorkspace from './FavoriteLibraryWorkspace.vue'
import ToastUI from './Toast.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  show?: boolean
  useFavorite?: (favorite: FavoritePrompt, options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number }) => boolean | Promise<boolean>
}>(), {
  show: false,
})

const emit = defineEmits<{
  // Legacy event kept for consumers that still bind it; the shared library no longer exposes this action.
  'optimize-prompt': []
  'use-favorite': [favorite: FavoritePrompt, options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number }]
  'update:show': [value: boolean]
  'close': []
}>()

const close = () => {
  emit('update:show', false)
  emit('close')
}

const handleUseFavorite = async (
  favorite: FavoritePrompt,
  options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number },
) => {
  if (props.useFavorite) {
    return props.useFavorite(favorite, options)
  }

  emit('use-favorite', favorite, options)
  return true
}
</script>
