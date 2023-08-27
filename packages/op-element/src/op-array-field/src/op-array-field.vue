<script lang="ts" setup>
import { computed, toRaw, toRef, unref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { arrayFieldKey, formFieldKey } from '../../context'
import { useChildren, useParent } from '../../use'

defineOptions({
  name: 'OpArrayField',
})

const props = defineProps<{
  prop: string
}>()

defineSlots<{
  default(props: { field: typeof field }): any
}>()

const { linkChildren } = useChildren(arrayFieldKey)

linkChildren({ prop: props.prop })
const { parent: parentForm } = useParent(formFieldKey)
const field = {
  remove: (index: number) => {
    const newVal = field.get().filter((item, curIndex) => {
      return index !== curIndex
    })
    parentForm?.updateModel(props.prop, newVal)
  },
  moveUp: (index: number) => {
    const curVal = cloneDeep(field.get())

    if (index !== 0) {
      curVal[index] = curVal.splice(index - 1, 1, curVal[index])[0]
    }
    parentForm?.updateModel(props.prop, curVal)
  },
  moveDown: (index: number) => {
    const curValue = cloneDeep(field.get())
    if (index !== curValue.length - 1) {
      curValue[index] = curValue.splice(index + 1, 1, curValue[index])[0]
    }

    parentForm?.updateModel(props.prop, curValue)
  },
  add: (data: unknown) => {
    parentForm?.updateModel(props.prop, toRaw(field.get()).concat(data))
  },
  get: () => {
    return (parentForm?.model.value[props.prop] || []) as unknown[]
  },
  value: (parentForm?.model.value[props.prop] || []) as unknown[],
}
</script>

<template>
  <slot :field="field" />
</template>
