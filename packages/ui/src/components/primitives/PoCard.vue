<!-- PoCard — the only card primitive (design-system §3).
     Wraps Naive NCard + the tokens (tokens.css). Radius 12px, padding 16px.
     ONLY for widgets / settings groups / gallery. Dense lists (history,
     favorites, templates, models) must use PoRow, NOT PoCard — one card per
     list item is the old pattern this primitive replaces.
     Props: title, bordered (default true).
     Slots: header, header-extra, default, footer.
     States: rest / hover (only when hoverable). No raw hex/px — tokens only. -->
<template>
  <NCard
    :title="title"
    :bordered="bordered"
    :content-style="{ padding: 'var(--spacing-4)' }"
    class="po-card"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots['header-extra']" #header-extra>
      <slot name="header-extra" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </NCard>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'

withDefaults(defineProps<{
  /** Card title. */
  title?: string
  bordered?: boolean
}>(), {
  title: undefined,
  bordered: true,
})
</script>

<style scoped>
.po-card {
  border-radius: var(--radius-container);
}
</style>
