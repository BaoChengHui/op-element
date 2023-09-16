<script lang="tsx" setup>
import { ElCol, ElFormItem, type FormItemRule } from 'element-plus'
import { computed, getCurrentInstance, h, reactive } from 'vue'
import { get, isNumber, isString, set } from 'lodash-es'
import { useParent } from '../../use'
import { arrayFieldKey, formFieldKey, formLayoutKey } from '../../context'
import { getArrDestructorKeys, isArray, isEmpty, isPlainObject } from '../../utils'
import type { Recordable } from '../../types'
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
  default?: unknown
  layout?: FieldLayout
  modelValue?: unknown
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

const emit = defineEmits(['update:modelValue'])

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

const getUpdateInfos = (val: unknown) => {
  if (validPath.value) {
    if (isString(valuePaths.value)) {
      return [
        {
          path: valuePaths.value, val,
        },
      ]
    }
    else if (isArray(valuePaths.value)) {
      return valuePaths.value.map((path, index) => {
        return { path, val: isArray(val) ? val[index] : undefined }
      })
    }
  }
}

const modelValue = computed({
  get: () => {
    if (parentForm) {
      const paths = valuePaths.value
      if (paths) {
        if (isString(paths)) {
          return get(parentForm?.model.value, paths)
        }
        else if (isArray(paths)) {
          return paths.map((path) => {
            return get(parentForm?.model.value, path)
          }).filter(val => !isEmpty(val))
        }
      }
      return null
    }
    else {
      return props.modelValue
    }
  },
  set: (val) => {
    if (parentForm) {
      const updateInfos = getUpdateInfos(val)
      if (updateInfos) {
        updateInfos.forEach((item) => {
          set(parentForm!.model.value, item.path, item.val)
        })
      }
    }
    else {
      emit('update:modelValue', val)
    }
  },
})

const updateModelValue = (val: unknown) => {
  modelValue.value = val
  parentForm?.updateValidModel(validPath.value, val)
}

const initModelValue = () => {
  if (props.default) {
    modelValue.value = props.default
  }
  updateModelValue(modelValue.value)
}

initModelValue()

const instance = getCurrentInstance()!

const validInfo = computed(() => {
  return {
    [validPath.value]: modelValue.value,
  } as Recordable
})

Object.assign(instance.proxy as object, reactive({
  validInfo,
}))

defineExpose({
  validInfo,
})

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

const renderItem = () => {
  if (parentForm) {
    return <ElFormItem {...formItemProps.value} >{renderComponent()}</ElFormItem>
  }
  else {
    return renderComponent()
  }
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
