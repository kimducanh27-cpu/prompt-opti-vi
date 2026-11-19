import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import PoStatus from '../../../../src/components/primitives/PoStatus.vue'
import PoBadge from '../../../../src/components/primitives/PoBadge.vue'

describe('PoStatus', () => {
  it('renders status as text + dot, never colour alone', () => {
    const kinds = ['info', 'success', 'warning', 'error', 'neutral'] as const
    for (const kind of kinds) {
      const wrapper = mount(PoStatus, { props: { kind, label: 'Running' } })
      expect(wrapper.classes()).toContain(`po-status--${kind}`)
      expect(wrapper.find('.po-status__dot').exists()).toBe(true)
      expect(wrapper.find('.po-status__text').text()).toBe('Running')
      wrapper.unmount()
    }
  })
})

describe('PoBadge', () => {
  it('renders the count, capped with + above max', () => {
    expect(mount(PoBadge, { props: { count: 3 } }).text()).toBe('3')
    expect(mount(PoBadge, { props: { count: 120 } }).text()).toBe('99+')
    expect(mount(PoBadge, { props: { count: 120, max: 9 } }).text()).toBe('9+')
    expect(mount(PoBadge, { props: { count: 0 } }).text()).toBe('0')
  })

  it('exposes the accessible name when given', () => {
    const wrapper = mount(PoBadge, { props: { count: 3, ariaLabel: '3 favourites' } })
    expect(wrapper.attributes('aria-label')).toBe('3 favourites')
  })
})
