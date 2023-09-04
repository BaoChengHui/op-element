<script lang="ts" setup>
import type { FormInstance, FormItemProp } from 'element-plus'
import { ElForm } from 'element-plus'
import { computed, getCurrentInstance, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { cloneDeep, get, isEmpty, isEqual, omit, set } from 'lodash-es'
import type { Ref } from 'vue'
import { type FieldLayout, OpField, type OpFieldInstance } from '../../op-field'
import { booleanAbleExecuter, isArray, isBoolean, isString } from '../../utils'
import { useChildren, useParent } from '../../use'
import { formDialogKey, formFieldKey } from '../../context'
import type { Arrayable, Recordable } from '../../types'
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

watch(() => props.modelValue, (val) => {
  if (!isEqual(val, formModel.value) && val) {
    formModel.value = cloneDeep(val)
    children.forEach((child) => {
      const valuePaths = (child as OpFieldInstance).valuePaths
      if (valuePaths) {
        if (isString(valuePaths)) {
          const itemVal = get(formModel.value, valuePaths) as unknown
          (child as OpFieldInstance).setModelValue(itemVal)
          set(validModel.value, child.validPath, itemVal)
        }
        else if (isArray(valuePaths)) {
          const itemVal = valuePaths.reduce((prev: unknown[], path) => {
            const curVal = get(formModel.value, path)
            if (isEmpty(curVal)) {
              return prev
            }
            else {
              return [...prev, curVal]
            }
          }, [])
          child.setModelValue(itemVal)
          set(validModel.value, child.validPath, itemVal)
        }
      }
    })
  }
}, {
  deep: true,
})

const formModel = ref<Recordable>({})

const emitFormModel = () => {
  if (!isEqual(formModel.value, props.modelValue)) {
    emit('update:modelValue', cloneDeep(formModel.value))
  }
}

const initialized = ref(false)
const updateModel = (infos: Arrayable<{ path: string; val: unknown }>) => {
  const infoArr = [infos].flat()
  infoArr.forEach((item) => {
    set(formModel.value, item.path, item.val)
  })

  if (initialized.value) {
    emitFormModel()
  }
}

// 保证获取正确的表单校验
const validModel = ref<Recordable>({})
const updateValidModel = (key: string, val: unknown) => {
  validModel.value[key] = val
}

const setChildFieldValue = (childs: OpFieldInstance[]) => {
  childs.forEach((child) => {
    const val = validModel.value[child.validPath]
    child.setModelValue(val)
    const updateInfos = child.getUpdateInfos(val)
    if (updateInfos) {
      [updateInfos].flat().forEach((item) => {
        set(formModel.value, item.path, item.val)
      })
    }
  })
  emitFormModel()
}

const resetChildField = (props?: Arrayable<FormItemProp>) => {
  if (isEmpty(props)) {
    setChildFieldValue(children as OpFieldInstance[])
  }
  else {
    const newProps = [props!].flat()
    const childs = children.filter((child) => {
      return newProps.includes(child.validPath)
    })
    setChildFieldValue(childs as OpFieldInstance[])
  }
}

onMounted(() => {
  if (!isEqual(props.modelValue, formModel.value) && !isEmpty(props.modelValue)) {
    formModel.value = cloneDeep(props.modelValue)
  }
  emitFormModel()
  initialized.value = true
})

const { linkChildren, children } = useChildren(formFieldKey)
linkChildren({ model: formModel, updateModel, updateValidModel, validModel })

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
const resetFields: typeof formRef.value.resetFields = (props) => {
  formRef.value.resetFields(props)
  resetChildField(props)
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
