<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElForm } from 'element-plus'
import { computed, ref } from 'vue'
import { get, isEqual, omit, set } from 'lodash-es'
import type { Ref } from 'vue'
import { type FieldLayout, OpField } from '../../op-field'
import { booleanAbleExecuter, isBoolean } from '../../utils'
import { useChildren } from '../../use'
import { formFieldKey } from '../../context'
import type { RecordAble } from '../../types'
import { OpFormLayout } from '../../op-form-layout'
import type { OpFields } from './op-form.type'

defineOptions({
  name: 'OpForm',
})

const props = withDefaults(defineProps<{
  labelSuffix?: string
  fields?: OpFields
  layout?: FieldLayout
}>(), {
  labelSuffix: ':',
  fields() {
    return []
  },
  layout: false,
})
const visibleFields = computed(() => {
  const { fields } = props
  return fields.filter(({ visible = true }) => {
    return booleanAbleExecuter(visible)
  }).map((item) => {
    const field = omit(item, ['visible'])
    return field
  })
})
const modelValue = defineModel<RecordAble>({ default: {} })
const updateModel = (path: string, val: unknown) => {
  if (!isEqual(get(modelValue.value, path), val)) {
    set(modelValue.value, path, val)
  }
}
// 保证获取正确的表单校验
const validModel = ref<RecordAble>({})
const updateValidModel = (key: string, val: unknown) => {
  validModel.value[key] = val
}

const { linkChildren } = useChildren(formFieldKey)
linkChildren({ model: modelValue, updateModel, updateValidModel, validModel })

const formRef = ref() as Ref<FormInstance>

const bindLyaout = computed(() => {
  return isBoolean(props.layout) ? undefined : props.layout
})

defineExpose({
  validate: computed(() => formRef.value.validate),
  validateField: computed(() => formRef.value.validateField),
  resetFields: computed(() => formRef.value.resetFields),
  scrollToField: computed(() => formRef.value.scrollToField),
  clearValidate: computed(() => formRef.value.clearValidate),
})
</script>

<template>
  <ElForm ref="formRef" :label-suffix="labelSuffix" :model="validModel">
    <slot>
      <OpFormLayout v-if="layout" :layout="bindLyaout">
        <OpField v-for="(field, index) in visibleFields" :key="`${index}-${field.prop}`" v-bind="field" />
      </OpFormLayout>
      <template v-else>
        <OpField v-for="(field, index) in visibleFields" :key="`${index}-${field.prop}`" v-bind="field" />
      </template>
    </slot>
  </ElForm>
</template>
