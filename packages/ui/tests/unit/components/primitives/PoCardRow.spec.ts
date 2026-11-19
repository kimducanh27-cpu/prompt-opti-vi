import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  const NCardStub = defineComponent({
    name: 'NCard',
    props: { title: String, bordered: Boolean },
    setup(props, { slots, attrs }) {
      return () => h('div', { ...attrs, class: 'n-card-stub' }, [
        props.title ? h('div', { class: 'n-card-header__main' }, props.title) : null,
        slots.header?.(),
        slots['header-extra']?.(),
        slots.default?.(),
        slots.footer?.(),
      ])
    },
  })
  return { ...actual, NCard: NCardStub }
})

import PoCard from '../../../../src/components/primitives/PoCard.vue'
import PoRow from '../../../../src/components/primitives/PoRow.vue'

describe('PoCard', () => {
  it('renders the title and slots (widgets / settings groups only)', () => {
    const wrapper = mount(PoCard, {
      props: { title: 'Settings' },
      slots: { default: 'Body', footer: 'Footer' },
    })
    expect(wrapper.text()).toContain('Settings')
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.text()).toContain('Footer')
    expect(wrapper.findComponent({ name: 'NCard' }).props('title')).toBe('Settings')
  })
})

describe('PoRow', () => {
  it('renders a plain row (div) when not clickable', () => {
    const wrapper = mount(PoRow, { props: { title: 'History item', meta: '2 hours ago' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.text()).toContain('History item')
    expect(wrapper.text()).toContain('2 hours ago')
    expect(wrapper.find('.po-row__chevron').exists()).toBe(false)
  })

  it('renders a button with chevron and emits click when clickable', async () => {
    const wrapper = mount(PoRow, { props: { title: 'History item', clickable: true } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.find('.po-row__chevron').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when not clickable', async () => {
    const wrapper = mount(PoRow, { props: { title: 'History item' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders the action slot instead of the chevron', () => {
    const wrapper = mount(PoRow, {
      props: { title: 'History item', clickable: true },
      slots: { action: '<button class="row-action">Open</button>' },
    })
    expect(wrapper.find('.row-action').exists()).toBe(true)
    expect(wrapper.find('.po-row__chevron').exists()).toBe(false)
  })
})
