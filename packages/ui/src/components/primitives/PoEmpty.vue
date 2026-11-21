<!-- PoEmpty — the empty-state primitive (design-system §3).
     Wraps Naive NEmpty: icon + text + call-to-action.
     Props: description (required text — parent passes the i18n string).
     Slots: icon (custom icon; Naive's default icon shows when omitted),
       cta (the call-to-action, e.g. a PoButton).
     States: rest only. No raw hex — tokens only. -->
<template>
  <NEmpty :description="description" class="po-empty">
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.cta" #extra>
      <slot name="cta" />
    </template>
  </NEmpty>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui'

defineProps<{
  /** Empty-state text (parent passes the i18n string). */
  description: string
}>()
</script>

<style scoped>
.po-empty {
  color: var(--color-text-secondary);
}
</style>
