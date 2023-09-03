<script lang="tsx" setup>
import { ElCol, ElFormItem, type FormItemRule } from 'element-plus'
import { computed, h, watch } from 'vue'
import { get, isNumber } from 'lodash-es'
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
const arrNames = getArrDestructorKeys(props.prop)
const objNames = getObjDestructorkeys(props.prop)

const getIndexAndName = () => {
  let baseName = ''
  let arrIndex = ''
  if (props.prop) {
    const res = props.prop.match(/^((\d+)\.)?(\S+)/)
    if (res) {
      arrIndex = res[2]
      baseName = res[3]
      if (parentArrayField?.prop && !arrIndex) {
        console.warn(`prop ${props.prop}  is invalid , may like 0.${props.prop}`)
      }
    }
  }
  else {
    console.warn(`prop ${props.prop}  is invalid`)
  }
  return {
    baseName,
    arrIndex,
  }
}

const parentModelAble = () => {
  return !!(parentForm && props.prop)
}

const modelValue = computed({
  get: () => {
    if (parentModelAble()) {
      const { arrIndex, baseName } = getIndexAndName()
      if (arrNames) {
        return arrNames.reduce((prev: unknown[], name) => {
          let path = name
          if (parentArrayField?.prop) {
            path = `${parentArrayField.prop}.${arrIndex}.${name}`
          }
          const val = get(parentForm?.model, path)
          if (isEmpty(val)) {
            return prev
          }
          else {
            return [...prev, val]
          }
        }, [])
      }
      else if (objNames) {
        return objNames.reduce((prev, name) => {
          let [originKey, targetKey] = name.split(':')
          if (!targetKey) {
            targetKey = originKey
          }
          let path = targetKey
          if (parentArrayField?.prop) {
            path = `${parentArrayField?.prop}.${arrIndex}.${targetKey}`
          }
          const val = get(parentForm?.model.value, path)
          return {
            ...prev,
            [originKey]: val,
          }
        }, {})
      }
      else {
        let path = baseName
        if (parentArrayField?.prop) {
          path = `${parentArrayField.prop}.${arrIndex}.${path}`
        }
        return get(parentForm?.model.value, path)
      }
    }
    else {
      return null
    }
  },
  set: (val) => {
    if (parentModelAble()) {
      const { arrIndex, baseName } = getIndexAndName()
      if (arrNames) {
        arrNames.forEach((name, index) => {
          let path = name
          if (parentArrayField?.prop) {
            path = `${parentArrayField.prop}.${arrIndex}.${name}`
          }
          if (isArray(val)) {
            parentForm!.updateModel(path, val[index])
          }
          else {
            parentForm!.updateModel(path, undefined)
          }
        })
      }
      else if (objNames) {
        objNames.forEach((name) => {
          let [originKey, targetKey] = name.split(':')

          if (!targetKey) {
            targetKey = originKey
          }
          let path = targetKey
          if (parentArrayField?.prop) {
            path = `${parentArrayField.prop}.${arrIndex}.${targetKey}`
          }
          if (isPlainObject(val)) {
            parentForm!.updateModel(path, val[originKey as keyof typeof val])
          }
          else {
            parentForm!.updateModel(path, undefined)
          }
        })
      }
      else {
        let path = baseName
        if (parentArrayField?.prop) {
          path = `${parentArrayField.prop}.${arrIndex}.${path}`
        }
        parentForm!.updateModel(path, val)
      }
    }
  },
})

const updateValidModel = () => {
  if (parentModelAble()) {
    let path = props.prop!
    if (parentArrayField?.prop) {
      path = `${parentArrayField?.prop}.${path}`
    }
    parentForm?.updateValidModel(path, modelValue.value)
  }
}

const updateValue = (val: unknown) => {
  modelValue.value = val
  updateValidModel()
}

updateValue(null)

watch(() => modelValue.value, () => {
  updateValidModel()
})

watch(() => parentForm?.validModel.value[props.prop!], (val) => {
  modelValue.value = val
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
  return <ElFormItem {...formItemProps.value} >{renderComponent()}</ElFormItem>
}

function renderComponent() {
  return h(target.value.TargetComponent, {
    ...target.value.props,
    'modelValue': modelValue.value,
    'onUpdate:modelValue': updateValue,
  })
}

defineRender(() => {
  return useLayout.value ? <ElCol {...innerLayout.value}>{renderItem()}</ElCol> : renderItem()
})
</script>
