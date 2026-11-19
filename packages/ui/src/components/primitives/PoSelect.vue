<!-- PoSelect — the only select primitive (design-system §3).
     Adaptive (design-system §3, "presentation=adaptive"): the SAME options
     and the SAME selected value on both branches —
     Desktop: anchored NSelect popover (filterable when > 8 options).
     Mobile (compact, width < 1024 — the app's isCompact signal): a trigger
       button opening a PoSheet (NOT a second overlay mechanism) with
       touch-sized 44px rows and a search field when > 8 options.
     Props: modelValue (v-model), options, label (required, always rendered),
       placeholder, error, help, disabled, clearable, searchLabel (label of
       the in-sheet search field; defaults to the field label).
     Slots: none (options render their label text).
     Emits: update:modelValue.
     States: rest / hover / focus-visible (accent ring) / selected /
       disabled / error. Font 16px on all screens (design-system §1.2).
     No raw hex. The only px value is the mandated 16px select font
     (the 2px focus outline excepted). -->
<template>
  <div class="po-field">
    <label :for="triggerId" class="po-field__label">{{ label }}</label>
    <NSelect
      v-if="!isCompact"
      :id="triggerId"
      :value="modelValue"
      :options="naiveOptions"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :filterable="options.length > 8"
      :status="error ? 'error' : undefined"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy || undefined"
      class="po-select"
      @update:value="onUpdate"
    />
    <template v-else>
      <PoButton
        :id="triggerId"
        variant="secondary"
        :disabled="disabled"
        :aria-haspopup="'listbox'"
        :aria-expanded="sheetOpen ? 'true' : 'false'"
        :aria-describedby="describedBy || undefined"
        block
        class="po-select__trigger"
        @click="sheetOpen = true"
      >
        {{ selectedLabel ?? placeholder }}
        <template #icon>
          <ChevronDown class="po-select__chevron" aria-hidden="true" />
        </template>
      </PoButton>
      <PoSheet v-model:show="sheetOpen" :title="label">
        <PoInput
          v-if="options.length > 8"
          v-model="query"
          :label="searchLabel ?? label"
          class="po-select__search"
        />
        <ul class="po-select__list" role="listbox" :aria-label="label">
          <li v-for="option in filteredOptions" :key="String(option.value)" role="option"
            :aria-selected="option.value === modelValue ? 'true' : 'false'">
            <button
              type="button"
              class="po-select__row"
              :class="{ 'po-select__row--selected': option.value === modelValue }"
              :disabled="option.disabled"
              :aria-disabled="option.disabled ? 'true' : undefined"
              @click="choose(option)"
            >
              <span class="po-select__row-label">{{ option.label }}</span>
              <Check v-if="option.value === modelValue" class="po-select__row-check" aria-hidden="true" />
            </button>
          </li>
        </ul>
        <p v-if="filteredOptions.length === 0 && emptyLabel" class="po-select__empty" role="status">
          {{ emptyLabel }}
        </p>
      </PoSheet>
    </template>
    <FieldStatus :error="error" :help="help" :error-id="errorId" :help-id="helpId" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { NSelect, type SelectOption } from 'naive-ui'
import { PhCaretDown as ChevronDown, PhCheck as Check } from '@phosphor-icons/vue'
import PoButton from './PoButton.vue'
import PoInput from './PoInput.vue'
import PoSheet from './PoSheet.vue'
import FieldStatus from './FieldStatus.vue'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'

export interface PoSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  /** Selected value (v-model). */
  modelValue?: string | number | null
  /** Same options on both branches (desktop popover / mobile sheet). */
  options: PoSelectOption[]
  /** Visible label, always rendered. Never placeholder-only. */
  label: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  clearable?: boolean
  /** Label of the in-sheet search field (mobile, > 8 options). Defaults to the field label. */
  searchLabel?: string
  /** Text shown in the mobile sheet when the search matches nothing. Parent passes the i18n string. */
  emptyLabel?: string
}>(), {
  modelValue: null,
  placeholder: undefined,
  error: undefined,
  help: undefined,
  disabled: false,
  clearable: false,
  searchLabel: undefined,
  emptyLabel: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const { isCompact } = useWorkspaceLayout()

const uid = useId()
const triggerId = computed(() => `po-select-${uid}`)
const errorId = computed(() => `po-select-${uid}-error`)
const helpId = computed(() => `po-select-${uid}-help`)
const describedBy = computed(() => (props.error ? errorId.value : props.help ? helpId.value : undefined))

const sheetOpen = ref(false)
const query = ref('')

const selectedLabel = computed(() =>
  props.options.find((o) => o.value === props.modelValue)?.label,
)

// Map to Naive's SelectOption at the boundary: the primitive's own option
// type stays minimal (label / value / disabled) for app code.
const naiveOptions = computed<SelectOption[]>(() =>
  props.options.map((o) => ({ label: o.label, value: o.value, disabled: o.disabled })),
)

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

const onUpdate = (value: string | number | null) => {
  emit('update:modelValue', value)
}

const choose = (option: PoSelectOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  query.value = ''
  sheetOpen.value = false
}
</script>

<style scoped>
.po-field {
  /* 16px select font on every screen/state (design-system §1.2). */
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

.po-select {
  min-height: var(--spacing-9);
  font-size: 16px;
}

.po-select:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.po-select__trigger {
  justify-content: space-between;
}

.po-select__chevron {
  width: var(--text-body);
  height: var(--text-body);
}

.po-select__search {
  margin-bottom: var(--spacing-2);
}

.po-select__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.po-select__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  width: 100%;
  min-height: var(--touch-target-min);
  padding: var(--spacing-1) var(--spacing-2);
  border: 0;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  text-align: left;
  cursor: pointer;
}

.po-select__row:hover {
  background: var(--color-overlay-hover);
}

.po-select__row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.po-select__row:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.po-select__row--selected {
  color: var(--color-accent);
  font-weight: 600;
}

.po-select__row-check {
  font-weight: 700;
}

.po-select__empty {
  margin: var(--spacing-4) 0;
  color: var(--color-text-secondary);
  font-size: var(--text-body);
  text-align: center;
}

@media (pointer: coarse) {
  .po-select {
    min-height: var(--touch-target-min);
  }
}
</style>
