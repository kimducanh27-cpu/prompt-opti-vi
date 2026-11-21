import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'

const layout = vi.hoisted(() => ({ compact: null as unknown }))
vi.mock('../../../../src/composables/ui/useWorkspaceLayout', () => ({
  useWorkspaceLayout: () => ({ isCompact: layout.compact }),
}))

const modalHolder = vi.hoisted(() => ({ stub: null as unknown }))
vi.mock('../../../../src/components/common/AdaptiveModal.vue', async () => {
  const { defineComponent, h } = await import('vue')
  // AdaptiveModal stand-in: renders its slots only while open.
  const stub = defineComponent({
    name: 'AdaptiveModal',
    props: {
      show: Boolean,
      preset: String,
      presentation: String,
      compactClass: String,
      title: String,
      maskClosable: Boolean,
      closable: Boolean,
    },
    emits: ['update:show', 'after-leave'],
    setup(props, { slots }) {
      return () => (props.show
        ? h('div', { class: 'adaptive-modal-stub' }, [slots.header?.(), slots.default?.(), slots.footer?.(), slots.action?.()])
        : null)
    },
  })
  modalHolder.stub = stub
  return { default: stub }
})

import PoModal from '../../../../src/components/primitives/PoModal.vue'
import PoSheet from '../../../../src/components/primitives/PoSheet.vue'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function setCompact(value: boolean) {
  layout.compact = ref(value)
}

describe('PoModal', () => {
  it('is a sheet on mobile and a page (desktop card) otherwise', () => {
    setCompact(true)
    wrapper = mount(PoModal, { props: { show: true, title: 'Edit' } })
    const modal = wrapper.findComponent(modalHolder.stub as never)
    expect(modal.props('presentation')).toBe('sheet')
    expect(modal.props('preset')).toBe('card')
    expect(modal.props('compactClass')).toBe('po-modal--compact')
    wrapper.unmount()

    setCompact(false)
    wrapper = mount(PoModal, { props: { show: true, title: 'Edit' } })
    expect(wrapper.findComponent(modalHolder.stub as never).props('presentation')).toBe('page')
  })

  it('forwards update:show and restores focus to the opener on close', async () => {
    setCompact(false)
    const opener = document.createElement('button')
    opener.textContent = 'Open'
    document.body.append(opener)
    opener.focus()
    expect(document.activeElement).toBe(opener)

    wrapper = mount(PoModal, {
      props: { show: false, title: 'Edit' },
      slots: { default: 'Body' },
      attachTo: document.body,
    })
    await wrapper.setProps({ show: true })
    await nextTick()
    expect(wrapper.text()).toContain('Body')
    await wrapper.setProps({ show: false })
    wrapper.findComponent(modalHolder.stub as never).vm.$emit('after-leave')
    await nextTick()
    expect(document.activeElement).toBe(opener)
    opener.remove()
  })

  it('forwards update:show from AdaptiveModal', async () => {
    setCompact(false)
    wrapper = mount(PoModal, { props: { show: true } })
    wrapper.findComponent(modalHolder.stub as never).vm.$emit('update:show', false)
    expect(wrapper.emitted('update:show')).toEqual([[false]])
  })
})

describe('PoSheet', () => {
  it('always uses the sheet presentation with the sheet compact hook', () => {
    setCompact(false)
    wrapper = mount(PoSheet, { props: { show: true, title: 'Pick one' } })
    const sheet = wrapper.findComponent(modalHolder.stub as never)
    expect(sheet.props('presentation')).toBe('sheet')
    expect(sheet.props('compactClass')).toBe('po-sheet--compact')
  })

  it('restores focus to the opener on close', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    wrapper = mount(PoSheet, { props: { show: false }, attachTo: document.body })
    await wrapper.setProps({ show: true })
    await nextTick()
    await wrapper.setProps({ show: false })
    wrapper.findComponent(modalHolder.stub as never).vm.$emit('after-leave')
    await nextTick()
    expect(document.activeElement).toBe(opener)
    opener.remove()
  })
})
