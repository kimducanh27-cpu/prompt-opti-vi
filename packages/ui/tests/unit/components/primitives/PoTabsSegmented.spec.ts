import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  const NTabsStub = defineComponent({
    name: 'NTabs',
    props: { value: [String, Number], type: String },
    emits: ['update:value'],
    setup(props, { slots, attrs }) {
      return () => h('div', { ...attrs, class: 'n-tabs-stub', 'data-type': props.type }, slots.default?.())
    },
  })
  const NTabPaneStub = defineComponent({
    name: 'NTabPane',
    props: { name: [String, Number], tab: String, disabled: Boolean },
    setup(props, { slots }) {
      return () => h('div', { class: 'n-tab-pane-stub', 'data-tab': props.tab }, slots.default?.())
    },
  })
  return { ...actual, NTabs: NTabsStub, NTabPane: NTabPaneStub }
})

import PoTabs from '../../../../src/components/primitives/PoTabs.vue'
import PoSegmented from '../../../../src/components/primitives/PoSegmented.vue'

const options = [
  { label: 'Basic', value: 'basic' },
  { label: 'Pro', value: 'pro', disabled: true },
]

describe('PoTabs', () => {
  it('renders one pane per option with label, value and disabled state', () => {
    const wrapper = mount(PoTabs, {
      props: { modelValue: 'basic', options, ariaLabel: 'Modes' },
    })
    const tabs = wrapper.findComponent({ name: 'NTabs' })
    expect(tabs.props('value')).toBe('basic')
    expect(tabs.props('type')).toBe('line')
    const panes = wrapper.findAllComponents({ name: 'NTabPane' })
    expect(panes).toHaveLength(2)
    expect(panes[0]!.props('tab')).toBe('Basic')
    expect(panes[0]!.props('name')).toBe('basic')
    expect(panes[1]!.props('disabled')).toBe(true)
  })

  it('forwards tab changes as update:modelValue', async () => {
    const wrapper = mount(PoTabs, { props: { modelValue: 'basic', options } })
    wrapper.findComponent({ name: 'NTabs' }).vm.$emit('update:value', 'pro')
    expect(wrapper.emitted('update:modelValue')).toEqual([['pro']])
  })

  it('renders the panel-<value> slot inside its pane', () => {
    const wrapper = mount(PoTabs, {
      props: { modelValue: 'basic', options },
      slots: { 'panel-basic': '<p>Basic panel</p>' },
    })
    expect(wrapper.text()).toContain('Basic panel')
  })
})

describe('PoSegmented', () => {
  it('renders the segment tab type with the same options contract', () => {
    const wrapper = mount(PoSegmented, {
      props: { modelValue: 'basic', options, ariaLabel: 'Mode' },
      slots: { 'panel-basic': '<p>Basic panel</p>' },
    })
    const tabs = wrapper.findComponent({ name: 'NTabs' })
    expect(tabs.props('type')).toBe('segment')
    expect(tabs.props('value')).toBe('basic')
    expect(wrapper.text()).toContain('Basic panel')
  })

  it('forwards segment changes as update:modelValue', async () => {
    const wrapper = mount(PoSegmented, { props: { modelValue: 'basic', options } })
    wrapper.findComponent({ name: 'NTabs' }).vm.$emit('update:value', 'pro')
    expect(wrapper.emitted('update:modelValue')).toEqual([['pro']])
  })
})
