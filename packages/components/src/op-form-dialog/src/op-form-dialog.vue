<script lang="ts" setup>
import { OpDialog } from '../../op-dialog'
import { OpForm } from '../../op-form'
import type { OpFormProps } from '../../op-form'
import type { Recordable } from '../../types'

defineOptions({
  name: 'OpFormDialog',
})

withDefaults(defineProps<
{
  formProps?: OpFormProps
}
>(), {
  formProps: () => ({}),
})
const modelValue = defineModel({ default: false })
const model = defineModel<Recordable>('model', { default: {} })
</script>

<template>
  <OpDialog v-model="modelValue">
    <slot>
      <OpForm v-bind="formProps" v-model="model" />
    </slot>
  </OpDialog>
</template>
