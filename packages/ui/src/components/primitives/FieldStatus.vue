<!-- FieldStatus — internal helper for PoInput / PoTextarea / PoSelect.
     NOT a public primitive (not exported from index.ts).
     Renders the inline error (role="alert", icon + text, never colour alone)
     or the help text under a field. The owning field wires aria-describedby
     to errorId / helpId. -->
<template>
  <p v-if="error" :id="errorId" class="po-field-status po-field-status--error" role="alert">
    <span class="po-field-status__mark" aria-hidden="true">!</span>
    <span>{{ error }}</span>
  </p>
  <p v-else-if="help" :id="helpId" class="po-field-status po-field-status--help">
    {{ help }}
  </p>
</template>

<script setup lang="ts">
defineProps<{
  /** Inline error text. When set, the field gets status="error" + aria-invalid. */
  error?: string
  /** Help/hint text, shown only when there is no error. */
  help?: string
  /** id of the error <p>, referenced by the field's aria-describedby. */
  errorId?: string
  /** id of the help <p>, referenced by the field's aria-describedby. */
  helpId?: string
}>()
</script>

<style scoped>
.po-field-status {
  margin: var(--spacing-1) 0 0;
  font-size: var(--text-supporting);
  line-height: var(--text-supporting--line-height);
}

.po-field-status--error {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-1);
  color: var(--color-status-error-text);
}

.po-field-status--help {
  color: var(--color-text-secondary);
}

.po-field-status__mark {
  flex: 0 0 auto;
  font-weight: 700;
}
</style>
