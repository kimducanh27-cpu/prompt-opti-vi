// Slice 8: ActionButton was deleted — its only importers were the two test
// files, and both now cover PoButton instead. These assertions are the
// converted ActionButton.spec.ts: attribute passthrough + loading guard.
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()

  return {
    ...actual,
    NButton: defineComponent({
      name: 'NButton',
      setup(_, { slots, attrs }) {
        return () => h('button', attrs, slots.default?.())
      },
    }),
  }
})

import PoButton from '../../../src/components/primitives/PoButton.vue'

describe('PoButton (replaces ActionButton)', () => {
  it('passes accessibility and testing attributes to the underlying button', () => {
    const wrapper = mount(PoButton, {
      props: {
        variant: 'primary',
        ariaLabel: 'Favorite Library',
      },
      attrs: {
        'data-testid': 'header-favorites-page-action',
        'aria-current': 'page',
        title: 'Favorite Library',
      },
      slots: {
        default: 'Favorite Library',
      },
    })

    const button = wrapper.get('button')
    expect(button.attributes('data-testid')).toBe('header-favorites-page-action')
    expect(button.attributes('aria-current')).toBe('page')
    expect(button.attributes('title')).toBe('Favorite Library')
    expect(button.attributes('aria-label')).toBe('Favorite Library')
    expect(button.text()).toContain('Favorite Library')
  })

  it('sets aria-busy while loading and does not emit a second click', async () => {
    const wrapper = mount(PoButton, {
      props: { variant: 'primary', loading: false },
      slots: { default: 'Save' },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    await wrapper.setProps({ loading: true })
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
