<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElForm } from 'element-plus'
import { computed, getCurrentInstance, onMounted, ref, toRefs, useAttrs } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import type { Ref } from 'vue'
import { type FieldLayout, OpField, type OpFieldInstance } from '../../op-field'
import { booleanAbleExecuter, isBoolean } from '../../utils'
import { useChildren, useParent } from '../../use'
import { formDialogKey, formFieldKey } from '../../context'
import type { Recordable } from '../../types'
import { OpFormLayout } from '../../op-form-layout'
import type { BindForm, OpFields } from './op-form.type'

defineOptions({
  name: 'OpForm',
})

const props = withDefaults(defineProps<{
  labelSuffix?: string
  fields?: OpFields
  layout?: FieldLayout
  modelValue?: Recordable
  form: BindForm
}>(), {
  labelSuffix: ':',
  fields() {
    return []
  },
  layout: false,
  form() {
    return {
      model: {},
      setModel: () => {},
    }
  },
})

const { model } = toRefs(props.form)
const { setModel } = props.form
let defaultModel: Recordable = {}

onMounted(() => {
  defaultModel = cloneDeep(model.value)
})

// 保证获取正确的表单校验
const validModel = ref<Recordable>({})
const updateValidModel = (key: string, val: unknown) => {
  validModel.value[key] = val
}

const { linkChildren } = useChildren(formFieldKey)
linkChildren({ model, updateValidModel })

const visibleFields = computed(() => {
  const { fields } = props
  return fields.filter(({ visible = true }) => {
    return booleanAbleExecuter(visible)
  }).map((item) => {
    const field = omit(item, ['visible'])
    return field
  })
})

const formRef = ref() as Ref<FormInstance>
const bindLyaout = computed(() => {
  return isBoolean(props.layout) ? undefined : props.layout
})

const validate: typeof formRef.value.validate = (...arg) => {
  return formRef.value.validate(...arg)
}
const validateField: typeof formRef.value.validateField = (...arg) => {
  return formRef.value.validateField(...arg)
}
const resetFields = () => {
  setModel(defaultModel)
  clearValidate()
}
const scrollToField: typeof formRef.value.scrollToField = (...arg) => {
  return formRef.value.scrollToField(...arg)
}
const clearValidate: typeof formRef.value.clearValidate = (...arg) => {
  return formRef.value.clearValidate(...arg)
}
const instance = getCurrentInstance()!
Object.assign(instance.proxy as object, {
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
})

useParent(formDialogKey)

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
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
