<template>
  <!-- Slice 7: PoSheet — mobile bottom sheet (max 90dvh), desktop card ≤720px
       (was min(94vw, 1160px)). The detail/edit/create/import modes are
       already pages inside this one sheet (no nested modal). -->
  <PoSheet
    :show="show"
    :title="dialogTitle"
    class="favorite-asset-panel"
    :mask-closable="true"
    @update:show="handleShowUpdate"
    @after-leave="$emit('after-leave')"
  >
    <FavoritePanelShell surface="dialog" :mode="panelMode" class="favorite-asset-panel__shell">
      <FavoriteDetailPanel
        v-if="mode === 'detail'"
        :favorite="favorite"
        :category="category"
        @copy="$emit('copy', $event)"
        @use="(target, options) => $emit('use', target, options)"
        @share="$emit('share', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @favorite-updated="$emit('favorite-updated', $event)"
      />

      <FavoriteEditorForm
        ref="editor"
        v-else-if="mode === 'edit'"
        embedded
        mode="edit"
        :favorite="favorite || undefined"
        @cancel="close"
        @saved="handleSaved"
      />

      <FavoriteEditorForm
        ref="editor"
        v-else-if="mode === 'create'"
        embedded
        mode="create"
        @cancel="close"
        @saved="handleSaved"
      />

      <FavoriteImportPanel
        v-else
        @cancel="close"
        @imported="handleImported"
      />
    </FavoritePanelShell>
  </PoSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'
import { useConfirmDialog } from '../../composables/ui/useConfirmDialog'
import PoSheet from '../primitives/PoSheet.vue'
import { useI18n } from 'vue-i18n'
import type { FavoriteCategory, FavoritePrompt } from '@prompt-optimizer/core'

import FavoriteDetailPanel from '../FavoriteDetailPanel.vue'
import FavoriteEditorForm from '../FavoriteEditorForm.vue'
import FavoriteImportPanel from '../FavoriteImportPanel.vue'
import FavoritePanelShell from './FavoritePanelShell.vue'

type AssetPanelMode = 'detail' | 'edit' | 'create' | 'import'

const props = withDefaults(defineProps<{
  show: boolean
  mode: AssetPanelMode
  favorite?: FavoritePrompt | null
  category?: FavoriteCategory
}>(), {
  favorite: null,
  category: undefined,
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'after-leave': []
  'copy': [favorite: FavoritePrompt]
  'use': [favorite: FavoritePrompt, options?: { applyExample?: boolean; exampleId?: string; exampleIndex?: number }]
  'share': [favorite: FavoritePrompt]
  'edit': [favorite: FavoritePrompt]
  'delete': [favorite: FavoritePrompt]
  'favorite-updated': [favoriteId: string]
  'saved': [favoriteId: string]
  'imported': []
}>()

const { t } = useI18n()
const { isCompact } = useWorkspaceLayout()
const confirmDialog = useConfirmDialog()
const editor = ref<InstanceType<typeof FavoriteEditorForm> | null>(null)
let confirmingClose = false

const panelMode = computed(() => {
  if (props.mode === 'edit') return 'edit'
  if (props.mode === 'create' || props.mode === 'import') return 'create'
  return 'detail'
})

const dialogTitle = computed(() => {
  if (props.mode === 'edit') return t('favorites.dialog.editTitle')
  if (props.mode === 'create') return t('favorites.dialog.createTitle')
  if (props.mode === 'import') return t('favorites.manager.importDialog.title')
  return t('favorites.manager.preview.title')
})

const close = async () => {
  if (isCompact.value && editor.value) {
    if (editor.value.saving || confirmingClose) return
    if (editor.value.hasUnsavedChanges) {
      confirmingClose = true
      try {
        const discard = await confirmDialog.warning({
          title: t('common.confirm'), content: t('workspace.unsavedForm'),
          positiveText: t('common.confirm'), negativeText: t('common.cancel'),
        })
        if (!discard) return
      } finally {
        confirmingClose = false
      }
    }
  }
  emit('update:show', false)
}

const handleShowUpdate = (value: boolean) => {
  if (value) emit('update:show', true)
  else void close()
}

const handleSaved = (favoriteId: string) => {
  emit('saved', favoriteId)
}

const handleImported = () => {
  emit('imported')
}
</script>

<style scoped>
/* Slice 7: PoSheet card hook — the class falls through PoSheet → AdaptiveModal
   → card. */
:global(.workspace-compact .favorite-asset-panel.po-sheet--compact.adaptive-modal-sheet > .n-card-content) {
  padding: 0 !important;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (max-width: 1023px) {
  .favorite-asset-panel__shell {
    height: 100%;
    min-height: 0;
    flex: 1;
  }
  .favorite-asset-panel__shell :deep(.favorite-panel-shell__body) {
    padding: 10px;
  }
  .favorite-asset-panel__shell.favorite-panel-shell--edit :deep(.favorite-panel-shell__body),
  .favorite-asset-panel__shell.favorite-panel-shell--create :deep(.favorite-panel-shell__body) {
    padding: 0;
  }
}

:global(.workspace-compact .favorite-asset-panel.po-sheet--compact.adaptive-modal-sheet > .n-card-header) {
  padding: 8px 12px;
}
/* EU05-01: the sheet close target is 44px via PoSheet
   (var(--touch-target-min)); the 36px override that used to live here
   made the Favorite Details close X measure 36x36. Deleted. */
</style>
