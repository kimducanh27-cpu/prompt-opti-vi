<template>
  <header class="mobile-result-header" :data-testid="`mobile-result-header-${variant.id}`">
    <div class="mobile-result-heading">
      <strong>{{ variant.id.toUpperCase() }}</strong>
      <button type="button" class="mobile-result-prompt" :disabled="!variant.promptContent"
        :aria-label="`${promptTitle} ${variant.id.toUpperCase()}`" @click="showPrompt = true">
        <span class="mobile-result-source">{{ variant.sourceLabel }} <span aria-hidden="true">↗</span></span>
        <span class="mobile-result-excerpt">{{ variant.promptContent?.replace(/\s+/g, ' ') || t('workspace.emptyPromptReference') }}</span>
      </button>
      <NButton quaternary circle size="small" :loading="variant.running"
        :disabled="variant.disabled || (busy && !variant.running)"
        :aria-label="t('workspace.runGroup', { group: variant.id.toUpperCase() })"
        :data-testid="`mobile-result-run-${variant.id}`" @click="$emit('run')">
        <template #icon>
          <UiPlay aria-hidden="true" :size="15" />
        </template>
      </NButton>
    </div>
  </header>
  <TestSourcePreview v-model:show="showPrompt" :title="`${variant.id.toUpperCase()} · ${promptTitle}`"
    :content="variant.promptContent || ''" :editable="false" />
</template>

<script setup lang="ts">
import { PhPlay as UiPlay } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'
import { NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import TestSourcePreview from './TestSourcePreview.vue'

const props = defineProps<{
  variant: { id: string; sourceLabel: string; running: boolean; disabled?: boolean; promptContent?: string; hasPromptSnapshot?: boolean }
  busy: boolean
}>()
defineEmits<{ run: [] }>()
const { t } = useI18n()
const showPrompt = ref(false)
const promptTitle = computed(() => t(props.variant.hasPromptSnapshot ? 'workspace.requestPrompt' : 'workspace.currentPromptReference'))
</script>

<style scoped>
.mobile-result-header { position: sticky; top: 0; z-index: 3; padding: 0 4px; background: var(--compact-paper); border-bottom: 1px solid var(--compact-border); }
.mobile-result-heading { display: flex; align-items: center; gap: 6px; min-height: 34px; font-size: 13px; }
.mobile-result-heading strong { font-size: 15px; }
.mobile-result-source { color: var(--compact-ink); font-size: 12px; }
.mobile-result-heading .n-button { flex-shrink: 0; min-width: 34px; min-height: 34px; }
.mobile-result-prompt { display: flex; flex: 1; min-width: 0; flex-direction: column; align-items: stretch; justify-content: center; gap: 1px; min-height: 44px; padding: 3px 0; border: 0; background: transparent; color: var(--compact-muted); cursor: pointer; text-align: left; font: inherit; font-size: 11px; }
.mobile-result-prompt svg { flex-shrink: 0; }
.mobile-result-prompt span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* M-C (EU03-04): the excerpt truncated mid-word on one line ("This source has
   no pr···"). Let it wrap to 2 lines instead of a single-line character
   ellipsis. The full prompt stays one tap away — the button opens
   TestSourcePreview with the whole text.
   Known limit (V-C, verified live): Chromium's line-clamp still truncates
   at CHARACTER level to fit the ellipsis, so the last English word can lose
   its final letter(s) ("Enter on···" for "one"). There is no clean CSS fix
   for this — line-clamp has no word-boundary option — and a JS word-boundary
   truncator is out of scope for a 2-line preview whose full text is one tap
   away. Accepted as a residual nit; do not re-file as a fresh finding. */
.mobile-result-prompt .mobile-result-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  line-height: 1.35;
}
.mobile-result-prompt:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
</style>
