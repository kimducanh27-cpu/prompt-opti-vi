<!-- PoRow — the dense-list row primitive (design-system §2.4, §3).
     For history / favorites / templates / models lists: rows, edge-to-edge
     with a divider between them — NEVER wrap each item in a PoCard.
     Row height 56px mobile (44px touch target + 12px), 48px desktop.
     Props: title (required), meta, clickable (renders a <button> and shows
       the chevron when true), chevron (default true when clickable),
       ariaLabel (accessible name for a clickable row without visible text).
     Slots: action (replaces the chevron — e.g. a PoButton or a switch).
     Emits: click (only when clickable).
     States: rest / hover / focus-visible (accent ring) / active / disabled
       (via the action slot content). No raw hex — tokens only; the 56px
       mobile height is the touch target + spacing token, not a raw value. -->
<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :type="clickable ? 'button' : undefined"
    :aria-label="ariaLabel"
    class="po-row"
    @click="onClick"
  >
    <span class="po-row__text">
      <span class="po-row__title">{{ title }}</span>
      <span v-if="meta" class="po-row__meta">{{ meta }}</span>
    </span>
    <span class="po-row__action">
      <slot name="action">
        <ChevronRight v-if="clickable && chevron" class="po-row__chevron" aria-hidden="true" />
      </slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { PhCaretRight as ChevronRight } from '@phosphor-icons/vue'

const props = withDefaults(defineProps<{
  /** Row title. */
  title: string
  /** Secondary line under the title. */
  meta?: string
  /** Renders a <button> (keyboard-focusable, emits click) and shows the chevron. */
  clickable?: boolean
  /** Show the chevron when clickable. */
  chevron?: boolean
  /** Accessible name for the row button. */
  ariaLabel?: string
}>(), {
  meta: undefined,
  clickable: false,
  chevron: true,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  if (!props.clickable) return
  emit('click', event)
}
</script>

<style scoped>
.po-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  width: 100%;
  /* 56px mobile = 44px touch target + 12px (design-system §3). */
  min-height: calc(var(--touch-target-min) + var(--spacing-3));
  padding: var(--spacing-1) var(--spacing-4);
  border: 0;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
  font-family: inherit;
  text-align: left;
}

button.po-row {
  cursor: pointer;
}

button.po-row:hover {
  background: var(--color-overlay-hover);
}

button.po-row:active {
  background: var(--color-overlay-pressed);
}

button.po-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.po-row__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 0;
}

.po-row__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
}

.po-row__meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-supporting);
  line-height: var(--text-supporting--line-height);
  color: var(--color-text-secondary);
}

.po-row__action {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
}

.po-row__chevron {
  width: var(--text-body);
  height: var(--text-body);
}

@media (pointer: fine) {
  .po-row {
    min-height: var(--spacing-12);
  }
}
</style>
