import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'

// Toast stand-in: renders its slot (the real provider is not duplicated).
const toastHolder = vi.hoisted(() => ({ stub: null as unknown }))
vi.mock('../../../../src/components/Toast.vue', async () => {
  const { defineComponent, h } = await import('vue')
  const stub = defineComponent({
    name: 'Toast',
    setup(_, { slots }) {
      return () => h('div', { class: 'toast-stub' }, slots.default?.())
    },
  })
  toastHolder.stub = stub
  return { default: stub }
})

import PoToast from '../../../../src/components/primitives/PoToast.vue'
import PoBanner from '../../../../src/components/primitives/PoBanner.vue'
import { useToast } from '../../../../src/composables/ui/useToast'

describe('PoToast', () => {
  it('renders the existing provider (no second message provider) with its slot', () => {
    const wrapper = mount(PoToast, { slots: { default: '<p>App</p>' } })
    expect(wrapper.findComponent(toastHolder.stub as never).exists()).toBe(true)
    expect(wrapper.text()).toContain('App')
  })

  it('re-exports the existing useToast API as usePoToast from index.ts', () => {
    const index = readFileSync(resolve(process.cwd(), 'src/index.ts'), 'utf8')
    expect(index).toContain('export { useToast as usePoToast }')
    expect(index).toContain('PoButtonUI')
    // The alias is the same function, not a second implementation.
    expect(typeof useToast).toBe('function')
  })
})

describe('PoBanner', () => {
  it('uses role=alert for errors and role=status for info, with icon + text', () => {
    const error = mount(PoBanner, { props: { type: 'error' }, slots: { default: 'Failed to save' } })
    expect(error.attributes('role')).toBe('alert')
    expect(error.find('svg').exists()).toBe(true)
    expect(error.text()).toContain('Failed to save')

    const info = mount(PoBanner, { props: { type: 'info' }, slots: { default: 'Saved' } })
    expect(info.attributes('role')).toBe('status')
  })

  it('renders the title and emits dismiss from the close button', async () => {
    const wrapper = mount(PoBanner, {
      props: { type: 'warning', title: 'Heads up', dismissible: true, dismissLabel: 'Dismiss' },
      slots: { default: 'Check this' },
    })
    expect(wrapper.text()).toContain('Heads up')
    const close = wrapper.find('.po-banner__close')
    expect(close.attributes('aria-label')).toBe('Dismiss')
    await close.trigger('click')
    // M2 dismiss fades out first (S7-4): the emit lands in GSAP's
    // onComplete ~130ms after the click, so wait for the fade.
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('warns when a dismissible banner has no dismiss label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(PoBanner, { props: { type: 'info', dismissible: true }, slots: { default: 'Hi' } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('dismissLabel'))
    warn.mockRestore()
  })
})
