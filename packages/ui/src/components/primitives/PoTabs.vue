<!-- PoTabs — the tab primitive (design-system §3).
     Wraps Naive NTabs (type="line") + NTabPane. Touch targets 44px; the
     active tab is accent + underline (theme barColor) AND its label text —
     never colour alone. Keyboard: Naive tabs are arrow-key navigable per
     ARIA APG.
     Props: modelValue (v-model, the active tab value), options
       [{ label, value, disabled? }], ariaLabel (labels the tab list).
     Slots: panel-<value> — one per tab, e.g. <template #panel-basic>.
     Emits: update:modelValue.
     States: rest / hover / focus-visible (accent ring) / active (accent +
       underline) / disabled. No raw hex — tokens only. -->
<template>
  <NTabs ref="tabsRef" v-model:value="current" :type="type" class="po-tabs" :aria-label="ariaLabel">
    <NTabPane
      v-for="option in options"
      :key="String(option.value)"
      :name="option.value"
      :tab="option.label"
      :disabled="option.disabled"
    >
      <slot :name="`panel-${String(option.value)}`" />
    </NTabPane>
  </NTabs>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import { crossfade, killMotion } from '../../utils/motion'

export interface PoTabOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  /** Active tab value (v-model). */
  modelValue?: string | number
  /** Tabs, in order. */
  options: PoTabOption[]
  /** Accessible name of the tab list. */
  ariaLabel?: string
  /** Naive tab type. PoSegmented fixes this to "segment". */
  type?: 'line' | 'segment' | 'card'
}>(), {
  modelValue: undefined,
  ariaLabel: undefined,
  type: 'line',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const current = computed({
  get: () => props.modelValue,
  set: (value: string | number) => emit('update:modelValue', value),
})

// M4 (step 7): in-place tab switches cross-fade the newly active pane
// (opacity only, 125ms; instant when reduced-motion). Note: in this app
// the sub-mode switches that use PoTabs/PoSegmented are route changes —
// the workspace remounts, so this watch does not fire for them; the
// visible switch fade lives on the route change in MainLayout. This watch
// covers any in-place switch (and any future one) without layout shift.
const tabsRef = ref<{ $el?: HTMLElement } | null>(null)
const crossfadeActivePane = () => {
  const root = tabsRef.value?.$el
  if (!root) return
  const panes = [...root.querySelectorAll<HTMLElement>('.n-tab-pane')]
  // Naive renders only the active pane by default (display-directive
  // "if"); if "show" is ever used, take the first actually visible one.
  const pane = panes.find((el) => el.offsetParent !== null) ?? panes[0]
  if (!pane) return
  killMotion(pane)
  crossfade(pane)
}
watch(current, () => {
  void nextTick(crossfadeActivePane)
})
onBeforeUnmount(() => {
  const root = tabsRef.value?.$el
  if (root) killMotion(root.querySelectorAll('.n-tab-pane'))
})
</script>

<style scoped>
.po-tabs :deep(.n-tabs-tab) {
  min-height: var(--touch-target-min);
  padding-left: var(--spacing-2);
  padding-right: var(--spacing-2);
}

.po-tabs :deep(.n-tabs-tab:focus-visible) {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}
</style>
