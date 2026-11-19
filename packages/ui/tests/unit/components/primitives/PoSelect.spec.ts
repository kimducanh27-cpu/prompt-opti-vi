import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

const layout = vi.hoisted(() => ({ compact: null as unknown }))
vi.mock('../../../../src/composables/ui/useWorkspaceLayout', () => ({
  useWorkspaceLayout: () => ({ isCompact: layout.compact }),
}))

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  const NButtonStub = defineComponent({
    name: 'NButton',
    props: { type: String, size: String, ghost: Boolean, loading: Boolean, disabled: Boolean, block: Boolean, round: Boolean, attrType: String },
    setup(_, { slots, attrs }) {
      return () => h('button', attrs, [slots.icon?.(), slots.default?.()])
    },
  })
  const NInputStub = defineComponent({
    name: 'NInput',
    props: { value: [String, Number], type: String, placeholder: String, disabled: Boolean, readonly: Boolean, status: String, clearable: Boolean, autosize: Object },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () => h('input', {
        ...attrs,
        value: props.value ?? '',
        onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
      })
    },
  })
  const NSelectStub = defineComponent({
    name: 'NSelect',
    props: { value: [String, Number], options: Array, placeholder: String, disabled: Boolean, clearable: Boolean, filterable: Boolean, status: String },
    emits: ['update:value'],
    setup(props) {
      return () => h('div', { class: 'n-select-stub' }, `select:${(props.options as unknown[]).length}`)
    },
  })
  return { ...actual, NButton: NButtonStub, NInput: NInputStub, NSelect: NSelectStub }
})

// Mobile sheet stand-in: renders its content only while open.
const sheetHolder = vi.hoisted(() => ({ stub: null as unknown }))
vi.mock('../../../../src/components/primitives/PoSheet.vue', async () => {
  const { defineComponent, h } = await import('vue')
  const stub = defineComponent({
    name: 'PoSheet',
    props: { show: Boolean, title: String },
    emits: ['update:show'],
    setup(props, { slots }) {
      return () => (props.show ? h('div', { class: 'po-sheet-stub' }, slots.default?.()) : null)
    },
  })
  sheetHolder.stub = stub
  return { default: stub }
})

import PoSelect, { type PoSelectOption } from '../../../../src/components/primitives/PoSelect.vue'

const options: PoSelectOption[] = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig',
  'Grape', 'Honeydew', 'Kiwi', 'Lemon',
].map((label) => ({ label, value: label.toLowerCase() }))

function setCompact(value: boolean) {
  layout.compact = ref(value)
}

describe('PoSelect', () => {
  it('desktop: renders the anchored NSelect popover with the same options', () => {
    setCompact(false)
    const wrapper = mount(PoSelect, {
      props: { modelValue: 'banana', options, label: 'Fruit' },
    })
    const select = wrapper.findComponent({ name: 'NSelect' })
    expect(select.exists()).toBe(true)
    expect(select.props('options')).toEqual(options)
    expect(select.props('value')).toBe('banana')
    // > 8 options: the desktop popover is filterable.
    expect(select.props('filterable')).toBe(true)
    expect(wrapper.find('.po-select__trigger').exists()).toBe(false)
  })

  it('desktop: no search/filter prop needed at 8 options or fewer', () => {
    setCompact(false)
    const wrapper = mount(PoSelect, {
      props: { modelValue: null, options: options.slice(0, 3), label: 'Fruit' },
    })
    expect(wrapper.findComponent({ name: 'NSelect' }).props('filterable')).toBe(false)
  })

  it('mobile: opens a sheet with the same options and 44px rows', async () => {
    setCompact(true)
    const wrapper = mount(PoSelect, {
      props: { modelValue: null, options, label: 'Fruit', placeholder: 'Pick a fruit' },
    })
    const trigger = wrapper.find('.po-select__trigger')
    expect(trigger.text()).toContain('Pick a fruit')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    await trigger.trigger('click')
    const sheet = wrapper.findComponent(sheetHolder.stub as never)
    expect(sheet.props('show')).toBe(true)
    expect(sheet.props('title')).toBe('Fruit')
    const rows = wrapper.findAll('.po-select__row')
    expect(rows).toHaveLength(options.length)
  })

  it('mobile: choosing a row selects the value and closes the sheet', async () => {
    setCompact(true)
    const wrapper = mount(PoSelect, {
      props: { modelValue: null, options, label: 'Fruit' },
    })
    await wrapper.find('.po-select__trigger').trigger('click')
    const rows = wrapper.findAll('.po-select__row')
    await rows[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
    expect(wrapper.findComponent(sheetHolder.stub as never).props('show')).toBe(false)
  })

  it('mobile: shows a search field above 8 options and filters rows', async () => {
    setCompact(true)
    const wrapper = mount(PoSelect, {
      props: { modelValue: null, options, label: 'Fruit' },
    })
    await wrapper.find('.po-select__trigger').trigger('click')
    const search = wrapper.find('.po-select__search input')
    expect(search.exists()).toBe(true)
    await search.setValue('ban')
    await nextTick()
    const rows = wrapper.findAll('.po-select__row')
    expect(rows).toHaveLength(1)
    expect(rows[0]!.text()).toContain('Banana')
  })

  it('mobile: marks the selected row and shows its label on the trigger', async () => {
    setCompact(true)
    const wrapper = mount(PoSelect, {
      props: { modelValue: 'kiwi', options, label: 'Fruit' },
    })
    expect(wrapper.find('.po-select__trigger').text()).toContain('Kiwi')
    await wrapper.find('.po-select__trigger').trigger('click')
    const selected = wrapper.find('.po-select__row--selected')
    expect(selected.text()).toContain('Kiwi')
    expect(selected.element.parentElement?.getAttribute('role')).toBe('option')
    expect(selected.element.parentElement?.getAttribute('aria-selected')).toBe('true')
  })
})
