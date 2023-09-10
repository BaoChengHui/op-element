import type { TableColumnCtx } from 'element-plus'
import type { VNode } from 'vue'
import type { ElTableProps, PickComponentProps } from '../../types'
import type opTableVue from './op-table.vue'

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

export type OpTableColumns<T = any> = OpTableColumn<T>[]
export type OpTableProps = PickComponentProps<typeof opTableVue> & ElTableProps
