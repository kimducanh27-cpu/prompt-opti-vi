import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  const NEmptyStub = defineComponent({
    name: 'NEmpty',
    props: { description: String },
    setup(props, { slots, attrs }) {
      return () => h('div', { ...attrs, class: 'n-empty-stub' }, [
        slots.icon?.(),
        h('p', { class: 'n-empty-description' }, props.description),
        slots.extra?.(),
      ])
    },
  })
  const NSkeletonStub = defineComponent({
    name: 'NSkeleton',
    props: { text: Boolean, round: Boolean, width: [String, Number], height: [String, Number] },
    setup(_, { attrs }) {
      return () => h('div', { ...attrs, class: 'n-skeleton-stub' })
    },
  })
  const NButtonStub = defineComponent({
    name: 'NButton',
    props: { type: String, size: String, ghost: Boolean, loading: Boolean, disabled: Boolean, block: Boolean, round: Boolean, attrType: String },
    setup(_, { slots, attrs }) {
      return () => h('button', attrs, [slots.icon?.(), slots.default?.()])
    },
  })
  return { ...actual, NEmpty: NEmptyStub, NSkeleton: NSkeletonStub, NButton: NButtonStub }
})

import PoEmpty from '../../../../src/components/primitives/PoEmpty.vue'
import PoLoading from '../../../../src/components/primitives/PoLoading.vue'
import PoError from '../../../../src/components/primitives/PoError.vue'

describe('PoEmpty', () => {
  it('renders icon + text + CTA slot', () => {
    const wrapper = mount(PoEmpty, {
      props: { description: 'No favourites yet' },
      slots: { icon: '<span class="empty-icon">☆</span>', cta: '<button>Add one</button>' },
    })
    expect(wrapper.text()).toContain('No favourites yet')
    expect(wrapper.find('.empty-icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Add one')
  })
})

describe('PoLoading', () => {
  it('renders skeletons with role=status and aria-busy while loading', () => {
    const wrapper = mount(PoLoading, { props: { loading: true, rows: 3, ariaLabel: 'Loading' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
    expect(wrapper.findAll('.n-skeleton-stub')).toHaveLength(3)
  })

  it('renders the card block for the card shape', () => {
    const wrapper = mount(PoLoading, { props: { loading: true, shape: 'card', rows: 2 } })
    // 1 card block + 2 text lines.
    expect(wrapper.findAll('.n-skeleton-stub')).toHaveLength(3)
  })

  it('renders thumb + line rows for the list shape', () => {
    const wrapper = mount(PoLoading, { props: { loading: true, shape: 'list', rows: 2 } })
    expect(wrapper.findAll('.po-loading__list-row')).toHaveLength(2)
    expect(wrapper.findAll('.n-skeleton-stub')).toHaveLength(4)
  })

  it('shows the real content when not loading', () => {
    const wrapper = mount(PoLoading, {
      props: { loading: false },
      slots: { default: '<p>Loaded content</p>' },
    })
    expect(wrapper.text()).toContain('Loaded content')
    expect(wrapper.find('.n-skeleton-stub').exists()).toBe(false)
  })
})

describe('PoError', () => {
  it('renders error text with role=alert and a Retry button that emits retry', async () => {
    const wrapper = mount(PoError, {
      props: { message: 'Failed to load', retryLabel: 'Retry' },
    })
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.text()).toContain('Failed to load')
    const retry = wrapper.find('button')
    expect(retry.text()).toBe('Retry')
    await retry.trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('renders no button without retryLabel, and renders the actions slot', () => {
    const wrapper = mount(PoError, {
      props: { message: 'Failed to load' },
      slots: { actions: '<button>Go back</button>' },
    })
    expect(wrapper.find('button').text()).toBe('Go back')
  })
})
