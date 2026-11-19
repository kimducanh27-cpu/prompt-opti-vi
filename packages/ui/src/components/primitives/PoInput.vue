<!-- PoInput — the only single-line input primitive (design-system §3).
     Wraps Naive NInput + the tokens (tokens.css). Font is 16px on all screens
     and in all states (design-system §1.2 — stops iOS zoom on focus; the
     Naive theme also sets --n-font-size 16px, this re-asserts it locally).
     Props: label is REQUIRED and always rendered above the field — a
       placeholder never replaces it. error renders inline under the field
       (FieldStatus, role="alert") and sets status="error" + aria-invalid.
       help renders as hint text. disabled / readonly are passed through.
     Slots: prefix, suffix (forwarded to NInput).
     Emits: update:modelValue, focus, blur, clear.
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
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :status="error ? 'error' : undefined"
      :show-password-on="type === 'password' ? 'click' : undefined"
      :input-props="inputProps"
      class="po-input"
      @update:value="onUpdate"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @clear="emit('clear')"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
    </NInput>
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
  /** Input type. Naive NInput only accepts text / password here. */
  type?: 'text' | 'password'
  error?: string
  help?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
}>(), {
  modelValue: '',
  placeholder: undefined,
  type: 'text',
  error: undefined,
  help: undefined,
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}>()

const uid = useId()
const inputId = computed(() => `po-input-${uid}`)
const errorId = computed(() => `po-input-${uid}-error`)
const helpId = computed(() => `po-input-${uid}-help`)
const describedBy = computed(() => (props.error ? errorId.value : props.help ? helpId.value : undefined))

// id + ARIA go to the NATIVE input via input-props: attrs on NInput itself
// land on Naive's wrapper div, where a label's `for` and a screen reader
// would never reach the actual control.
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
  /* 16px input font on every screen/state (design-system §1.2). The var
     inherits into NInput, which reads --n-font-size from the theme. */
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

.po-input {
  min-height: var(--spacing-9);
  font-size: 16px;
}

.po-input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (pointer: coarse) {
  .po-input {
    min-height: var(--touch-target-min);
  }
}
</style>
