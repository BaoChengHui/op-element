<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElForm } from 'element-plus'
import { computed, getCurrentInstance, nextTick, ref, toRaw, watch } from 'vue'
import { cloneDeep, get, isEmpty, isEqual, omit, set } from 'lodash-es'
import type { Ref } from 'vue'
import { type FieldLayout, OpField } from '../../op-field'
import { booleanAbleExecuter, isBoolean } from '../../utils'
import { useChildren, useParent } from '../../use'
import { formDialogKey, formFieldKey } from '../../context'
import type { Recordable } from '../../types'
import { OpFormLayout } from '../../op-form-layout'
import type { OpFields } from './op-form.type'

defineOptions({
  name: 'OpForm',
})

const props = withDefaults(defineProps<{
  labelSuffix?: string
  fields?: OpFields
  layout?: FieldLayout
  modelValue?: Recordable
}>(), {
  labelSuffix: ':',
  fields() {
    return []
  },
  layout: false,
})
const emit = defineEmits(['update:modelValue'])

const innerModel = ref<Recordable>({})
const model = computed({
  get: () => {
    if (props.modelValue) {
      return props.modelValue
    }
    else {
      return innerModel.value
    }
  },
  set: (val) => {
    if (props.modelValue) {
      innerModel.value = val
    }
    else {
      emit('update:modelValue', val)
    }
  },
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

let initModel = {}

const updateModel = (path: string, val: unknown) => {
  if (isEqual(get(initModel, path), val) && !isEmpty(initModel)) {
    nextTick(() => {
      set(model.value, path, val)
    })
  }
  else {
    set(model.value, path, val)
  }
}

watch(() => model.value, (val) => {
  if (isEmpty(initModel)) {
    initModel = cloneDeep(val)
  }
  emit('update:modelValue', val)
}, {
  deep: true,
})

// 保证获取正确的表单校验
const validModel = ref<Recordable>({})
const updateValidModel = (key: string, val: unknown) => {
  validModel.value[key] = val
}

const { linkChildren } = useChildren(formFieldKey)
linkChildren({ model, updateModel, updateValidModel, validModel })

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
const resetFields: typeof formRef.value.resetFields = (...arg) => {
  return formRef.value.resetFields(...arg)
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
