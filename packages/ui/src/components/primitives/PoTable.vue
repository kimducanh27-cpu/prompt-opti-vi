<!-- PoTable — the only table primitive (design-system §3).
     Wraps Naive NDataTable on desktop; on mobile (<1024px, isCompact)
     renders the SAME data as stacked rows — one block per row, each cell
     labelled with its column title — so a wide table never forces
     page-level horizontal scroll on a phone.
     Props: columns (key + title, in display order), rows (plain objects
       keyed by column key), rowKey (field name, default 'id'; falls back
       to the row index), emptyText, striped (desktop only, default true).
     Slots: cell ({ column, value, row, rowIndex }) — overrides the
       default plain-text rendering of one cell in BOTH presentations.
     States: rest / focus-visible (desktop table keeps Naive focus);
       mobile rows are plain blocks, no fake table semantics.
     No raw hex — tokens only. -->
<template>
  <div class="po-table" :data-testid="testId">
    <PoEmpty v-if="rows.length === 0" :description="emptyText" />

    <NDataTable
      v-else-if="!isCompact"
      :columns="dataTableColumns"
      :data="rows"
      :row-key="dataTableRowKey"
      :bordered="false"
      :striped="striped"
      :single-line="false"
      size="small"
      class="po-table__desktop"
    />

    <div v-else class="po-table__stacked" role="list">
      <div
        v-for="(row, rowIndex) in rows"
        :key="resolveRowKey(row, rowIndex)"
        class="po-table__row"
        role="listitem"
      >
        <div
          v-for="column in columns"
          :key="column.key"
          class="po-table__cell"
        >
          <span class="po-table__label">{{ column.title }}</span>
          <span class="po-table__value">
            <slot name="cell" :column="column" :value="row[column.key]" :row="row" :row-index="rowIndex">
              {{ formatCellValue(row[column.key]) }}
            </slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, useSlots, type VNode } from 'vue'
import { NDataTable, type DataTableColumn } from 'naive-ui'
import { useWorkspaceLayout } from '../../composables/ui/useWorkspaceLayout'
import PoEmpty from './PoEmpty.vue'

export interface PoTableColumn {
  /** Field name in each row object. */
  key: string
  /** Header text on desktop / label on mobile stacked rows. */
  title: string
}

export type PoTableRow = Record<string, unknown>

const props = withDefaults(defineProps<{
  columns: PoTableColumn[]
  rows: PoTableRow[]
  /** Row identity: a field name (default 'id'), or a function. Falls back to the row index. */
  rowKey?: string | ((row: PoTableRow, index: number) => string | number)
  /** Text shown when rows is empty. */
  emptyText?: string
  /** Desktop striping (NDataTable). Default true. */
  striped?: boolean
  testId?: string
}>(), {
  rowKey: 'id',
  emptyText: '',
  striped: true,
  testId: undefined,
})

const slots = useSlots()
const { isCompact } = useWorkspaceLayout()

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  return String(value)
}

const resolveRowKey = (row: PoTableRow, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const key = row[props.rowKey]
  return typeof key === 'string' || typeof key === 'number' ? key : index
}

// NDataTable's row-key takes one argument (the row); resolve through the
// row's position in props.rows so a rowKey function still gets its index.
const dataTableRowKey = (row: PoTableRow): string | number =>
  resolveRowKey(row, props.rows.indexOf(row))

// Always a VNode (never null): the desktop column render passes it straight
// to NDataTable, which needs a renderable node.
const renderCell = (column: PoTableColumn, row: PoTableRow, rowIndex: number): VNode => {
  const value = row[column.key]
  if (slots.cell) {
    return h('span', slots.cell({ column, value, row, rowIndex }))
  }
  return h('span', formatCellValue(value))
}

const dataTableColumns = computed<DataTableColumn<PoTableRow>[]>(() =>
  props.columns.map((column) => ({
    title: column.title,
    key: column.key,
    ellipsis: { tooltip: true },
    render: (row: PoTableRow, rowIndex: number) => renderCell(column, row, rowIndex),
  })),
)
</script>

<style scoped>
.po-table {
  min-width: 0;
  width: 100%;
}

.po-table__desktop {
  min-width: 0;
}

.po-table__stacked {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--spacing-2);
}

.po-table__row {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-container);
  background: var(--color-background-card);
  padding: var(--spacing-3);
}

.po-table__cell {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(84px, 0.8fr) minmax(0, 1.2fr);
  gap: var(--spacing-2);
  align-items: start;
}

.po-table__label {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: var(--text-supporting);
  line-height: var(--text-supporting--line-height);
  color: var(--color-text-secondary);
}

.po-table__value {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
  color: var(--color-text-primary);
}

@media (max-width: 767px) {
  .po-table__cell {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
