<script lang="tsx" setup>
import { ElCol, ElFormItem, type FormItemRule } from 'element-plus'
import { computed, getCurrentInstance, h, reactive, ref, watch } from 'vue'
import { get, isNumber, isString } from 'lodash-es'
import { useParent } from '../../use'
import { arrayFieldKey, formFieldKey, formLayoutKey } from '../../context'
import { getArrDestructorKeys, getObjDestructorkeys, isArray, isEmpty, isPlainObject } from '../../utils'
import type { FieldCompoent, FieldLayout } from './op-field.type'
import { fieldConfigMap } from './map'

defineOptions({
  name: 'OpField',
})

const props = withDefaults(defineProps<{
  component?: FieldCompoent
  required?: boolean
  prop?: string
  rules?: FormItemRule[]
  label?: string
  defaultValue?: unknown
  layout?: FieldLayout
}>(), {
  component: () => {
    return {
      type: 'input',
    }
  },
  required: false,
  rules() {
    return []
  },
  layout: true,
})

const formItemProps = computed(() => {
  const { required, label, rules, component } = props
  if (required) {
    const trigger = component.type === 'input' ? 'blur' : 'change'
    rules.push({
      required: true,
      message: '请输入',
      trigger,
    })
  }
  let prop = props.prop
  if (parentArrayField?.prop) {
    prop = `${parentArrayField?.prop}.${prop}`
  }
  return {
    rules,
    label,
    prop,
  }
})

const target = computed(() => {
  const { type, props: targetProps = {} } = props.component
  const { component, defaultProps = {} } = fieldConfigMap.get(type)!
  return {
    TargetComponent: component,
    props: {
      ...defaultProps,
      ...targetProps,
    },
  }
})

const { parent: parentForm } = useParent(formFieldKey)
const { parent: parentArrayField } = useParent(arrayFieldKey)

const valuePaths = computed(() => {
  if (props.prop) {
    const paths = props.prop.split('.')
    const ends = paths[paths.length - 1]
    const arrNames = getArrDestructorKeys(ends)
    if (arrNames) {
      return arrNames.reduce((prev: string[], name) => {
        if (parentArrayField?.prop) {
          return [...prev, `${parentArrayField.prop}.${paths[0]}.${name}`]
        }
        else {
          return [...prev, name]
        }
      }, [])
    }
    else {
      if (parentArrayField?.prop) {
        return `${parentArrayField.prop}.${paths[0]}.${ends}`
      }
      else {
        return ends
      }
    }
  }
  else {
    return ''
  }
})

const validPath = computed(() => {
  if (props.prop) {
    if (parentArrayField?.prop) {
      return `${parentArrayField.prop}.${props.prop}`
    }
    else {
      return props.prop
    }
  }
  else {
    return ''
  }
})

const modelValue = ref<unknown>()

const getUpdateInfos = (val: unknown) => {
  if (validPath.value) {
    if (isString(valuePaths.value)) {
      return {
        path: valuePaths.value, val,
      }
    }
    else if (isArray(valuePaths.value)) {
      return valuePaths.value.map((path, index) => {
        return { path, val: isArray(val) ? val[index] : undefined }
      })
    }
  }
}

function updateParentModel(val: unknown) {
  const updateInfo = getUpdateInfos(val)
  if (updateInfo) {
    parentForm?.updateModel(updateInfo)
  }
}
const updateModelValue = (val: unknown) => {
  modelValue.value = val
  if (validPath.value) {
    parentForm?.updateValidModel(validPath.value, val)
  }
  updateParentModel(val)
}

const setModelValue = (val: unknown) => {
  modelValue.value = val
}

const initValue = () => {
  if (props.defaultValue) {
    updateModelValue(props.defaultValue)
  }
  else {
    updateModelValue(undefined)
  }
}

initValue()

const { parent: parentLayout } = useParent(formLayoutKey)

const useLayout = computed(() => {
  return !!(parentLayout?.layout && props.layout)
})

const innerLayout = computed(() => {
  const { layout } = props
  if (isNumber(layout)) {
    return {
      span: layout,
    }
  }
  if (isPlainObject(layout)) {
    return layout
  }
  const { layout: pLayout } = parentLayout || {}

  if (isNumber(pLayout)) {
    return {
      span: pLayout,
    }
  }
  if (isPlainObject(pLayout)) {
    return pLayout
  }
  return {}
})

const instance = getCurrentInstance()!

Object.assign(instance.proxy as object, reactive({
  validPath,
  setModelValue,
  getUpdateInfos,
  valuePaths,
}))

defineExpose({
  validPath,
  setModelValue,
  getUpdateInfos,
  valuePaths,
})

const renderItem = () => {
  return <ElFormItem {...formItemProps.value} >{renderComponent()}</ElFormItem>
}

function renderComponent() {
  return h(target.value.TargetComponent, {
    ...target.value.props,
    'modelValue': modelValue.value,
    'onUpdate:modelValue': updateModelValue,
  })
}

defineRender(() => {
  return useLayout.value ? <ElCol {...innerLayout.value}>{renderItem()}</ElCol> : renderItem()
})
</script>
