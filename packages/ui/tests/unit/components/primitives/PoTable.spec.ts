import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'

const compact = ref(false)

vi.mock('../../../../src/composables/ui/useWorkspaceLayout', () => ({
  useWorkspaceLayout: () => ({ isCompact: compact }),
}))

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>()
  const NDataTableStub = defineComponent({
    name: 'NDataTable',
    props: { columns: Array, data: Array, rowKey: [String, Function], striped: Boolean },
    setup(props) {
      return () =>
        h('div', { class: 'n-data-table-stub' }, [
          ...(props.columns as Array<{ title: string; key: string }>).map((column) =>
            h('span', { class: 'col-title' }, column.title),
          ),
          ...((props.data as Array<Record<string, unknown>>) || []).flatMap((row) =>
            (props.columns as Array<{ title: string; key: string }>).map((column) =>
              h('span', { class: 'cell' }, String(row[column.key] ?? '')),
            ),
          ),
        ])
    },
  })
  const NEmptyStub = defineComponent({
    name: 'NEmpty',
    props: { description: String },
    setup(props) {
      return () => h('div', { class: 'n-empty-stub' }, props.description)
    },
  })
  return { ...actual, NDataTable: NDataTableStub, NEmpty: NEmptyStub }
})

import PoTable from '../../../../src/components/primitives/PoTable.vue'

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'value', title: 'Value' },
]
const rows = [
  { id: 'a', name: 'temperature', value: '0.7' },
  { id: 'b', name: 'top_p', value: '0.9' },
]

describe('PoTable', () => {
  it('renders an NDataTable with the same columns and rows on desktop', () => {
    compact.value = false
    const wrapper = mount(PoTable, { props: { columns, rows } })
    const table = wrapper.findComponent({ name: 'NDataTable' })
    expect(table.exists()).toBe(true)
    expect(table.props('data')).toEqual(rows)
    expect((table.props('columns') as Array<{ title: string; key: string }>).map((c) => c.title)).toEqual([
      'Name',
      'Value',
    ])
    expect((table.props('columns') as Array<{ render?: unknown }>).every((c) => typeof c.render === 'function')).toBe(true)
    expect(wrapper.find('.po-table__stacked').exists()).toBe(false)
    expect(wrapper.text()).toContain('temperature')
    expect(wrapper.text()).toContain('0.9')
  })

  it('renders the same data as labelled stacked rows on mobile, with no table', () => {
    compact.value = true
    const wrapper = mount(PoTable, { props: { columns, rows } })
    expect(wrapper.findComponent({ name: 'NDataTable' }).exists()).toBe(false)
    const stackedRows = wrapper.findAll('.po-table__row')
    expect(stackedRows).toHaveLength(2)
    expect(stackedRows[0].findAll('.po-table__label').map((label) => label.text())).toEqual(['Name', 'Value'])
    expect(stackedRows[0].text()).toContain('temperature')
    expect(stackedRows[1].text()).toContain('0.9')
  })

  it('renders the cell slot in both presentations', () => {
    compact.value = true
    const wrapper = mount(PoTable, {
      props: { columns, rows },
      slots: {
        cell: (params: { value: unknown }) => h('span', { class: 'custom-cell' }, `${params.value}!`),
      },
    })
    expect(wrapper.findAll('.custom-cell').map((cell) => cell.text())).toEqual([
      'temperature!',
      '0.7!',
      'top_p!',
      '0.9!',
    ])
  })

  it('shows the empty state when there are no rows', () => {
    compact.value = false
    const wrapper = mount(PoTable, { props: { columns, rows: [], emptyText: 'No variables yet' } })
    expect(wrapper.find('.n-empty-stub').text()).toBe('No variables yet')
    expect(wrapper.findComponent({ name: 'NDataTable' }).exists()).toBe(false)
  })

  it('falls back to the row index when rows carry no id', () => {
    compact.value = true
    const wrapper = mount(PoTable, {
      props: { columns, rows: [{ name: 'seed', value: '42' }] },
    })
    expect(wrapper.findAll('.po-table__row')).toHaveLength(1)
    expect(wrapper.text()).toContain('seed')
  })
})
