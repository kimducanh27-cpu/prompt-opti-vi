import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  // Minimal NInput stand-in: renders a native control and emits update:value.
  const NInputStub = defineComponent({
    name: 'NInput',
    props: {
      value: [String, Number],
      type: String,
      placeholder: String,
      disabled: Boolean,
      readonly: Boolean,
      status: String,
      clearable: Boolean,
      autosize: Object,
      inputProps: Object,
    },
    emits: ['update:value'],
    setup(props, { emit, slots, attrs }) {
      return () => {
        const tag = props.type === 'textarea' ? 'textarea' : 'input'
        return h(tag, {
          ...attrs,
          ...((props.inputProps as Record<string, unknown> | undefined) ?? {}),
          value: props.value ?? '',
          placeholder: props.placeholder,
          disabled: props.disabled,
          readonly: props.readonly,
          onInput: (event: Event) =>
            emit('update:value', (event.target as HTMLInputElement).value),
        }, slots.default?.())
      }
    },
  })
  return { ...actual, NInput: NInputStub }
})

import PoInput from '../../../../src/components/primitives/PoInput.vue'
import PoTextarea from '../../../../src/components/primitives/PoTextarea.vue'

describe('PoInput', () => {
  it('always renders its label (never placeholder-only)', () => {
    const wrapper = mount(PoInput, {
      props: { label: 'Prompt name', placeholder: 'Name it…' },
    })
    expect(wrapper.find('label').text()).toBe('Prompt name')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Name it…')
  })

  it('links the label to the native input via input-props id', () => {
    const wrapper = mount(PoInput, { props: { label: 'Name', modelValue: '' } })
    const input = wrapper.find('input')
    expect(input.attributes('id')).toBeTruthy()
    expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(PoInput, { props: { label: 'Name', modelValue: '' } })
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])
  })

  it('shows inline errors with aria-invalid and wires aria-describedby', () => {
    const wrapper = mount(PoInput, {
      props: { label: 'Name', modelValue: '', error: 'Required' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    const error = wrapper.find('[role="alert"]')
    expect(error.text()).toContain('Required')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(wrapper.findComponent({ name: 'NInput' }).props('status')).toBe('error')
  })

  it('shows help text when there is no error', () => {
    const wrapper = mount(PoInput, {
      props: { label: 'Name', modelValue: '', help: 'Shown in the list' },
    })
    expect(wrapper.text()).toContain('Shown in the list')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('passes disabled and readonly through', () => {
    const disabled = mount(PoInput, { props: { label: 'Name', disabled: true } })
    expect(disabled.find('input').attributes('disabled')).toBeDefined()
    const readonly = mount(PoInput, { props: { label: 'Name', readonly: true } })
    expect(readonly.find('input').attributes('readonly')).toBeDefined()
  })
})

describe('PoTextarea', () => {
  it('renders a textarea with a label and autosize bounds', () => {
    const wrapper = mount(PoTextarea, {
      props: { label: 'Notes', minRows: 2, maxRows: 5 },
    })
    expect(wrapper.find('label').text()).toBe('Notes')
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NInput' }).props('autosize')).toEqual({ minRows: 2, maxRows: 5 })
  })

  it('emits update:modelValue and shows inline errors', async () => {
    const wrapper = mount(PoTextarea, {
      props: { label: 'Notes', modelValue: '', error: 'Too long' },
    })
    await wrapper.find('textarea').setValue('abc')
    expect(wrapper.emitted('update:modelValue')).toEqual([['abc']])
    expect(wrapper.find('[role="alert"]').text()).toContain('Too long')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
  })
})
