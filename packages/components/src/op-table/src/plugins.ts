import { ref } from 'vue'
import type { OpTableColumn } from './op-table.type'

export type TablePluginResult = Pick<OpTableColumn, 'formatter' | 'renderCell' | 'renderHeader'>
export type TablePlugin = (col: OpTableColumn) => TablePluginResult

const plugin = ref<TablePlugin[]>([])
export const tablePlugin = {
  plugin,
  use: (val: TablePlugin) => {
    plugin.value.push(val)
  },
}
