<script lang="tsx" setup generic="T">
import { ElTable, ElTableColumn } from 'element-plus'
import { omit } from 'lodash-es'
import { useSlots } from 'vue'
import type { OpTableColumn, OpTableProps } from './op-table.type'

defineOptions({
  name: 'OpTable',
})

const props = defineProps<OpTableProps<T>>()

const slots = useSlots()

function renderColumns(columns: OpTableColumn<T>[]) {
  return columns.map((col, index) => {
    const colProps = omit(col, ['children', 'renderHeader', 'visible'])
    const columnSlot: Record<string, any> = {
      default: (scope: any) => {
        if (col.children)
          return renderColumns(col.children)

        if (col.slot && slots[col.slot])
          return slots[col.slot]!(scope)

        if (col.renderCell)
          return col.renderCell(scope)
      },
    }
    if (col.renderHeader) {
      columnSlot.header = (scope: any) => {
        return col.renderHeader!(scope)
      }
    }

    if (col.headerSlot && slots[col.headerSlot]) {
      columnSlot.header = (scope: any) => {
        return slots[col.headerSlot!]!(scope)
      }
    }
    return <ElTableColumn {...colProps} key={col.prop ?? `${index}`}>{columnSlot}</ElTableColumn>
  },
  )
}
defineRender(() => {
  return <ElTable >{renderColumns(props.columns)}</ElTable>
})
</script>
