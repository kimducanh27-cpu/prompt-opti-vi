<!-- PoStatus — the status-chip primitive (design-system §3, §5).
     Status as text + a StatusDot, never colour alone. The dot uses the
     status token; the label is always visible text.
     Props: kind (info | success | warning | error | neutral), label
       (required visible text, e.g. "Running", "Failed").
     Slots: none.
     States: one per kind. No raw hex — status tokens only. -->
<template>
  <span class="po-status" :class="`po-status--${kind}`">
    <span class="po-status__dot" aria-hidden="true" />
    <span class="po-status__text">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
export type PoStatusKind = 'info' | 'success' | 'warning' | 'error' | 'neutral'

withDefaults(defineProps<{
  kind?: PoStatusKind
  /** Visible status text (never colour alone). */
  label: string
}>(), {
  kind: 'neutral',
})
</script>

<style scoped>
.po-status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  min-height: var(--spacing-6);
  padding: 0 var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: var(--text-supporting);
  line-height: var(--text-supporting--line-height);
  font-weight: 500;
}

.po-status__dot {
  flex: 0 0 auto;
  width: var(--spacing-2);
  height: var(--spacing-2);
  border-radius: var(--radius-full);
}

.po-status--info {
  background: var(--color-status-info-muted);
  color: var(--color-status-info-text);
}
.po-status--info .po-status__dot { background: var(--color-status-info); }

.po-status--success {
  background: var(--color-status-success-muted);
  color: var(--color-status-success-text);
}
.po-status--success .po-status__dot { background: var(--color-status-success); }

.po-status--warning {
  background: var(--color-status-warning-muted);
  color: var(--color-status-warning-text);
}
.po-status--warning .po-status__dot { background: var(--color-status-warning); }

.po-status--error {
  background: var(--color-status-error-muted);
  color: var(--color-status-error-text);
}
.po-status--error .po-status__dot { background: var(--color-status-error); }

.po-status--neutral {
  background: var(--color-background-muted);
  color: var(--color-text-secondary);
}
.po-status--neutral .po-status__dot { background: var(--color-text-secondary); }
</style>
