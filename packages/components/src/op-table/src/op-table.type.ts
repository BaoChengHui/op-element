import type { TableColumnCtx } from 'element-plus'
import type { VNode } from 'vue'

declare interface CRI<T = any> {
  row: T
  column: TableColumnCtx<T>
  $index: number
}

export interface OpTableColumn<Row = any> extends Partial<Omit<TableColumnCtx<Row>, 'renderCell' | 'children' | 'type'>> {
  type?: 'selection' | 'index' | 'expand'
  visible?: boolean | (() => boolean)
  renderCell?: (data: CRI<Row>) => VNode
  children?: OpTableColumn<Row>[]
  slot?: string
  headerSlot?: string
}

export interface OpTableProps<Row> {
  columns: (OpTableColumn<Row>)[]
}
