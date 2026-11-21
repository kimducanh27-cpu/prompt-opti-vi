<!-- PoLoading — the loading-state primitive (design-system §3).
     Renders a skeleton matching the content shape while loading, and the
     real content (default slot) when done. The skeleton region is
     role="status" + aria-busy so screen readers announce the loading state.
     Props: loading (default true), shape (text | card | list), rows (number
       of skeleton lines/rows, default 3), ariaLabel (accessible name of the
       loading region, e.g. the i18n string for "Loading").
     Slots: default (content shown when not loading).
     States: loading / loaded. No raw hex — skeleton token only. -->
<template>
  <div v-if="loading" class="po-loading" role="status" :aria-busy="'true'" :aria-label="ariaLabel">
    <template v-if="shape === 'card'">
      <NSkeleton :height="120" round class="po-loading__card" />
      <NSkeleton
        v-for="index in rows"
        :key="index"
        text
        :width="index === rows ? '70%' : '100%'"
        class="po-loading__line"
      />
    </template>
    <template v-else-if="shape === 'list'">
      <div v-for="index in rows" :key="index" class="po-loading__list-row">
        <NSkeleton :width="24" :height="24" round class="po-loading__thumb" />
        <NSkeleton text width="80%" class="po-loading__line" />
      </div>
    </template>
    <template v-else>
      <NSkeleton
        v-for="index in rows"
        :key="index"
        text
        :width="index === rows ? '70%' : '100%'"
        class="po-loading__line"
      />
    </template>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { NSkeleton } from 'naive-ui'

export type PoLoadingShape = 'text' | 'card' | 'list'

withDefaults(defineProps<{
  loading?: boolean
  /** Skeleton shape: text lines, a card block + lines, or list rows (thumb + line). */
  shape?: PoLoadingShape
  /** Number of skeleton text lines / list rows. */
  rows?: number
  /** Accessible name of the loading region (parent passes the i18n string). */
  ariaLabel?: string
}>(), {
  loading: true,
  shape: 'text',
  rows: 3,
  ariaLabel: undefined,
})
</script>

<style scoped>
.po-loading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.po-loading__card {
  background: var(--color-skeleton);
}

.po-loading__line {
  background: var(--color-skeleton);
}

.po-loading__list-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  min-height: calc(var(--touch-target-min) + var(--spacing-3));
  border-bottom: 1px solid var(--color-border);
}

.po-loading__thumb {
  flex: 0 0 auto;
  background: var(--color-skeleton);
}
</style>
