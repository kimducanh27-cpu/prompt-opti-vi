<template>
  <div class="optimization-controls-container">
    <div class="optimization-controls" :class="{ 'optimization-controls--compact': compact, 'optimization-controls--single': !$slots.template }">
      <div class="optimization-controls__field">
        <div class="optimization-controls__label-row">
          <NText depth="2" class="optimization-controls__label">{{ modelLabel || t('promptOptimizer.optimizeModel') }}</NText>
          <slot name="model-label-extra" />
        </div>
        <slot name="model" />
      </div>
      <div v-if="$slots.template" class="optimization-controls__field">
        <NText depth="2" class="optimization-controls__label">{{ templateLabel || t('promptOptimizer.templateLabel') }}</NText>
        <slot name="template" />
      </div>
      <div class="optimization-controls__actions">
        <slot name="extra" />
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
defineProps<{ compact?: boolean; modelLabel?: string; templateLabel?: string }>()
const { t } = useI18n()
</script>

<style scoped>
.optimization-controls-container { min-width: 0; width: 100%; container-type: inline-size; }
.optimization-controls { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) max-content; gap: 8px; align-items: end; }
.optimization-controls--single { grid-template-columns: minmax(0, 1fr) max-content; }
.optimization-controls__field { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.optimization-controls__field :deep(.swc-select) { min-width: 0 !important; width: 100%; }
.optimization-controls__label { font-size: 12px; line-height: 20px; white-space: nowrap; }
.optimization-controls__label-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
.optimization-controls__actions { display: flex; align-items: center; justify-content: end; gap: 8px; }
.optimization-controls__actions :deep(.n-button) { flex: none; font-size: 14px; }
@container (max-width: 440px) {
  .optimization-controls:not(.optimization-controls--compact) { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .optimization-controls:not(.optimization-controls--compact) .optimization-controls__actions { grid-column: 1 / -1; }
}
/* M-C (EU01-02/EU01-03/EU02-05/EU03-04/EU10-04): stack the compact optimize
   row to one column. The 3-column row squeezed each selector to ~100px, so
   model/mode names truncated mid-word ("Professional Opt", "V4 ···") with no
   way to read the current selection. One column gives each selector the full
   width, so the full name shows; the Optimize button stays right-aligned on
   its own row. Desktop (.optimization-controls, non-compact) is untouched. */
.optimization-controls--compact { grid-template-columns: minmax(0, 1fr); gap: 6px; }
.optimization-controls--compact.optimization-controls--single { grid-template-columns: minmax(0, 1fr); }
/* UIUX-M02 (M-Ea): the two rules below used to hide the field labels in
   compact mode (`display: none` on .optimization-controls__label and
   .optimization-controls__label-row). The R1-cited input.css rules for this
   were dead (0 template usages); THESE were the real mechanism. Deleted:
   the labels ("Model", "Template") are the only way to tell the two
   stacked selectors apart on mobile, and the M-C one-column layout gives
   each field its label above the selector at full width, so showing them
   is natural. Design-system §3 requires visible field labels. */
.optimization-controls--compact .optimization-controls__actions { min-width: 0; }
.optimization-controls--compact .optimization-controls__field :deep(.text-model-selector) { height: 44px; }
.optimization-controls--compact .optimization-controls__actions :deep(.n-button) { min-width: 48px; height: 44px; padding: 0 10px; }
</style>
