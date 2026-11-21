<!-- PoBadge — the count-badge primitive (design-system §2.2, §3).
     Counts ONLY — never status. Status belongs to PoStatus (text + dot).
     Use for the number on a tab or nav item (e.g. favourite count).
     Props: count (required number), max (default 99 — counts above it
       render as "99+"), ariaLabel (accessible name, e.g. the i18n string
       for "3 favourites"; when omitted the visible number is read as-is).
     Slots: none.
     States: rest only. No raw hex — tokens only. -->
<template>
  <span class="po-badge" :aria-label="ariaLabel">{{ displayCount }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Count to display. */
  count: number
  /** Counts above this render as "max+". */
  max?: number
  /** Accessible name (parent passes the i18n string). */
  ariaLabel?: string
}>(), {
  max: 99,
  ariaLabel: undefined,
})

const displayCount = computed(() =>
  props.count > props.max ? `${props.max}+` : String(props.count),
)
</script>

<style scoped>
.po-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--spacing-5);
  min-height: var(--spacing-5);
  padding: 0 var(--spacing-1);
  border-radius: var(--radius-full);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: var(--text-supporting);
  line-height: var(--text-supporting--line-height);
  font-weight: 600;
}
</style>
