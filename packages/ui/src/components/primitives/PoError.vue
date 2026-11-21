<!-- PoError — the error-state primitive (design-system §3, §5).
     Error text + a Retry button (PoButton). Never colour alone: the "!"
     mark + the error text carry the meaning, and role="alert" announces it.
     Props: message (required error text — parent passes the i18n string),
       retryLabel (label of the Retry button; when omitted no button renders
       — the parent then supplies its own recovery action via the actions slot).
     Slots: actions (extra recovery actions beside Retry).
     Emits: retry (when the Retry button is pressed).
     States: rest / hover / focus-visible (accent ring, on the button).
     No raw hex — status tokens only. -->
<template>
  <div class="po-error" role="alert">
    <span class="po-error__mark" aria-hidden="true">!</span>
    <p class="po-error__message">{{ message }}</p>
    <div class="po-error__actions">
      <PoButton v-if="retryLabel" variant="secondary" @click="emit('retry')">
        {{ retryLabel }}
      </PoButton>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PoButton from './PoButton.vue'

defineProps<{
  /** Error text (parent passes the i18n string). */
  message: string
  /** Label of the Retry button. Omit to hide the button. */
  retryLabel?: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.po-error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  border-radius: var(--radius-element);
  background: var(--color-status-error-muted);
}

.po-error__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-6);
  height: var(--spacing-6);
  border-radius: var(--radius-full);
  background: var(--color-status-error);
  color: var(--color-background-surface);
  font-weight: 700;
}

.po-error__message {
  margin: 0;
  color: var(--color-status-error-text);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
}

.po-error__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
</style>
