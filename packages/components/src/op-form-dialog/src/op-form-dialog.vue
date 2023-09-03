<script lang="ts" setup>
import { type Component, computed } from 'vue'
import { OpDialog } from '../../op-dialog'
import { OpForm } from '../../op-form'
import type { OpFormInstance, OpFormProps } from '../../op-form'
import type { Recordable } from '../../types'
import { useChildren } from '../../use'
import { formDialogKey } from '../../context'

defineOptions({
  name: 'OpFormDialog',
})

withDefaults(defineProps<
{
  formProps?: OpFormProps
  formComponent?: Component
}
>(), {
  formProps: () => ({}),
})
const { children, linkChildren } = useChildren(formDialogKey)

linkChildren()

const formRef = computed(() => {
  if (children.length > 0) {
    return children[0] as OpFormInstance
  }
  else {
    return undefined
  }
})

defineExpose({
  formRef,
})

const modelValue = defineModel({ default: false })
const model = defineModel<Recordable>('model', { default: {} })
</script>

<template>
  <OpDialog v-model="modelValue">
    <slot>
      <component :is="formComponent" v-if="formComponent" v-bind="formProps" v-model="model" />
      <OpForm v-else v-bind="formProps" v-model="model" />
    </slot>
  </OpDialog>
</template>
