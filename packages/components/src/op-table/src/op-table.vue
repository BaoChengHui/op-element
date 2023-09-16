<script lang="tsx" setup>
import { ElTable, ElTableColumn } from 'element-plus'
import { cloneDeep, omit } from 'lodash-es'
import { useSlots } from 'vue'
import type { Recordable } from '../../types'
import type { OpTableColumn } from './op-table.type'
import { tablePlugin } from './plugins'

defineOptions({
  name: 'OpTable',
})

const props = withDefaults(defineProps<{
  columns?: OpTableColumn<any>[]
}>(), {
  columns: () => [],
})

const slots = useSlots()

function renderColumns(columns: OpTableColumn<Recordable>[]) {
  return columns.map((col, index) => {
    const colProps = cloneDeep(col)

    if (tablePlugin.plugin.value) {
      tablePlugin.plugin.value.forEach((item) => {
        const res = item(cloneDeep(col))
        Object.assign(colProps, res)
      })
    }
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

    const bindProps = omit(colProps, ['renderHeader', 'children', 'renderHeader'])

    return <ElTableColumn {...bindProps} key={`${index}-${bindProps.prop}`}>{columnSlot}</ElTableColumn>
  },
  )
}
defineRender(() => {
  return <ElTable >{renderColumns(props.columns)}</ElTable>
})
</script>
