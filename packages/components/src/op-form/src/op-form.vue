<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElForm } from 'element-plus'
import { computed, nextTick, ref, toRaw, watch } from 'vue'
import { cloneDeep, get, isEmpty, isEqual, omit, set } from 'lodash-es'
import type { Ref } from 'vue'
import { type FieldLayout, OpField } from '../../op-field'
import { booleanAbleExecuter, isBoolean } from '../../utils'
import { useChildren } from '../../use'
import { formFieldKey } from '../../context'
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
