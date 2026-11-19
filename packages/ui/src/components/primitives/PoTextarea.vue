<!-- PoTextarea — the only multi-line input primitive (design-system §3).
     Wraps Naive NInput type="textarea" + the tokens (tokens.css). Same
     contract as PoInput: 16px font on all screens/states, required visible
     label, inline error (FieldStatus, role="alert") + aria-invalid, help
     text, disabled / read-only. Autosizes between minRows and maxRows.
     Props: label (required), modelValue, placeholder, error, help,
       disabled, readonly, required, minRows (default 3), maxRows (default 8).
     Slots: none.
     Emits: update:modelValue, focus, blur.
     States: rest / hover / focus-visible (accent ring) / disabled /
       read-only / error. No raw hex. The only px values are the mandated
       16px input font (design-system §1.2) and the 2px focus outline. -->
<template>
  <div class="po-field">
    <label :for="inputId" class="po-field__label">
      {{ label }}<span v-if="required" class="po-field__required" aria-hidden="true"> *</span>
    </label>
    <NInput
      :value="modelValue"
      type="textarea"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :status="error ? 'error' : undefined"
      :autosize="{ minRows, maxRows }"
      :input-props="inputProps"
      class="po-textarea"
      @update:value="onUpdate"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <FieldStatus :error="error" :help="help" :error-id="errorId" :help-id="helpId" />
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { NInput } from 'naive-ui'
import FieldStatus from './FieldStatus.vue'

const props = withDefaults(defineProps<{
  /** Field value (v-model). */
  modelValue?: string | null
  /** Visible label, always rendered. Never placeholder-only. */
  label: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  minRows?: number
  maxRows?: number
}>(), {
  modelValue: '',
  placeholder: undefined,
  error: undefined,
  help: undefined,
  disabled: false,
  readonly: false,
  required: false,
  minRows: 3,
  maxRows: 8,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const uid = useId()
const inputId = computed(() => `po-textarea-${uid}`)
const errorId = computed(() => `po-textarea-${uid}-error`)
const helpId = computed(() => `po-textarea-${uid}-help`)
const describedBy = computed(() => (props.error ? errorId.value : props.help ? helpId.value : undefined))

// id + ARIA go to the NATIVE textarea via input-props (see PoInput).
const inputProps = computed(() => ({
  id: inputId.value,
  'aria-invalid': props.error ? true : undefined,
  'aria-describedby': describedBy.value || undefined,
  'aria-required': props.required ? true : undefined,
}))

const onUpdate = (value: string | null) => {
  emit('update:modelValue', value ?? '')
}
</script>

<style scoped>
.po-field {
  /* 16px input font on every screen/state (design-system §1.2). */
  --n-font-size: 16px;
}

.po-field__label {
  display: block;
  margin-bottom: var(--spacing-1);
  font-size: var(--text-label);
  line-height: var(--text-label--line-height);
  font-weight: 500;
  color: var(--color-text-primary);
}

.po-field__required {
  color: var(--color-status-error-text);
}

.po-textarea {
  font-size: 16px;
}

.po-textarea:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
