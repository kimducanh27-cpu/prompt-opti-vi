<!-- PoSegmented — the segmented-control primitive (design-system §2.2, §3).
     Wraps PoTabs with NTabs type="segment" (Naive UI has no standalone
     segmented component — its segment tab type is the segmented control).
     Used for mode switches directly under the header (System/User,
     Multi/Variable, Text/Image/Multi). Touch targets 44px; the active
     segment is accent + label text — never colour alone. Scrolls
     horizontally when it overflows instead of wrapping to two rows.
     Props: modelValue (v-model), options [{ label, value, disabled? }],
       ariaLabel (labels the control).
     Slots: panel-<value> — one per segment (same contract as PoTabs).
     Emits: update:modelValue.
     States: rest / hover / focus-visible (accent ring) / active / disabled.
     No raw hex — tokens only. -->
<template>
  <PoTabs
    :model-value="modelValue"
    :options="options"
    :aria-label="ariaLabel"
    type="segment"
    class="po-segmented"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </PoTabs>
</template>

<script setup lang="ts">
import PoTabs, { type PoTabOption } from './PoTabs.vue'

export type { PoTabOption as PoSegmentedOption }

withDefaults(defineProps<{
  /** Active segment value (v-model). */
  modelValue?: string | number
  /** Segments, in order. */
  options: PoTabOption[]
  /** Accessible name of the control. */
  ariaLabel?: string
}>(), {
  modelValue: undefined,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<style scoped>
.po-segmented {
  overflow-x: auto;
}
</style>
