import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  return {
    ...actual,
    NButton: defineComponent({
      name: 'NButton',
      props: {
        type: String,
        size: String,
        ghost: Boolean,
        loading: Boolean,
        disabled: Boolean,
        round: Boolean,
        block: Boolean,
        attrType: String,
      },
      setup(props, { slots, attrs }) {
        // Declared props (disabled) do not fall through to attrs, so render
        // them explicitly; aria-* attributes arrive via attrs.
        return () => h('button', { ...attrs, disabled: props.disabled || undefined }, [slots.icon?.(), slots.default?.()])
      },
    }),
  }
})

import PoButton from '../../../../src/components/primitives/PoButton.vue'

describe('PoButton', () => {
  it('maps variants to Naive types', () => {
    const cases: Array<[string, string]> = [
      ['primary', 'primary'],
      ['secondary', 'default'],
      ['ghost', 'tertiary'],
      ['destructive', 'error'],
    ]
    for (const [variant, type] of cases) {
      const wrapper = mount(PoButton, { props: { variant: variant as never } })
      expect(wrapper.findComponent({ name: 'NButton' }).props('type')).toBe(type)
      if (variant === 'ghost') {
        expect(wrapper.findComponent({ name: 'NButton' }).props('ghost')).toBe(true)
      }
      wrapper.unmount()
    }
  })

  it('maps sizes sm/md/lg to Naive small/medium/large', () => {
    const cases: Array<[string, string]> = [['sm', 'small'], ['md', 'medium'], ['lg', 'large']]
    for (const [size, naive] of cases) {
      const wrapper = mount(PoButton, { props: { size: size as never } })
      expect(wrapper.findComponent({ name: 'NButton' }).props('size')).toBe(naive)
      wrapper.unmount()
    }
  })

  it('sets aria-busy and blocks double-activation while loading', async () => {
    const wrapper = mount(PoButton, { props: { loading: true }, slots: { default: 'Save' } })
    const button = wrapper.get('button')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('disabled')).toBeDefined()
    await button.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('emits click when idle', async () => {
    const wrapper = mount(PoButton, { slots: { default: 'Save' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('shows the loading-text slot while loading, and the label otherwise', () => {
    const loading = mount(PoButton, {
      props: { loading: true },
      slots: { default: 'Save', 'loading-text': 'Saving…' },
    })
    expect(loading.text()).toContain('Saving…')
    expect(loading.text()).not.toContain('Save')
    const idle = mount(PoButton, { slots: { default: 'Save' } })
    expect(idle.text()).toContain('Save')
  })

  it('shows the loadingText prop while loading', () => {
    const wrapper = mount(PoButton, {
      props: { loading: true, loadingText: 'Working…' },
      slots: { default: 'Save' },
    })
    expect(wrapper.text()).toContain('Working…')
  })

  it('warns when an icon-only button has no aria-label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(PoButton, { props: { iconOnly: true }, slots: { icon: '★' } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ariaLabel'))
    warn.mockRestore()
  })

  it('passes aria-label through for icon-only buttons', () => {
    const wrapper = mount(PoButton, {
      props: { iconOnly: true, ariaLabel: 'Close' },
      slots: { icon: '★' },
    })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Close')
  })
})
