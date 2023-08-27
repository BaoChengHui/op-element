<script lang="tsx" setup>
import { ElCol, ElFormItem, type FormItemRule } from 'element-plus'
import { computed, h, ref, watch } from 'vue'
import { get, isEqual, isNumber } from 'lodash-es'
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
  const { required, label, rules, prop } = props
  if (required) {
    rules.push({
      required: true,
      message: '请输入',
      trigger: ['blur', 'change'],
    })
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

const modelValue = ref()
const { parent: parentForm } = useParent(formFieldKey)
const { parent: parentArrayField } = useParent(arrayFieldKey)
const arrNames = getArrDestructorKeys(props.prop)
const objNames = getObjDestructorkeys(props.prop)

const initDefault = () => {
  if (!isEmpty(props.defaultValue)) {
    modelValue.value = props.defaultValue
    updateValue(props.defaultValue)
  }
}

const getIndexAndName = () => {
  if (props.prop) {
    const res = props.prop.match(/^((\d+)\.)?(\S+)/)
    if (res) {
      const indexOfArrFiled = res[2]
      const nameWithoutIndex = res[3]
      if (parentArrayField?.prop && !indexOfArrFiled) {
        console.warn(`prop ${props.prop}  is invalid , may like 0.${props.prop}`)
        return
      }
      return {
        indexOfArrFiled,
        nameWithoutIndex,
      }
    }
  }
  console.warn(`prop ${props.prop}  is invalid`)
  return null
}

const parentModelAble = () => {
  return !!(parentForm && props.prop)
}

const updateValue = (val: unknown) => {
  if (parentModelAble()) {
    parentForm?.updateValidModel(props.prop!, val)
    const res = getIndexAndName()
    if (!res) {
      return
    }
    const { indexOfArrFiled, nameWithoutIndex } = res
    modelValue.value = val
    if (arrNames) {
      arrNames.forEach((name, index) => {
        let path = name
        if (parentArrayField?.prop) {
          path = `${parentArrayField.prop}.${indexOfArrFiled}.${name}`
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
          path = `${parentArrayField.prop}.${indexOfArrFiled}.${targetKey}`
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
      let path = nameWithoutIndex
      if (parentArrayField?.prop) {
        path = `${parentArrayField.prop}.${indexOfArrFiled}.${nameWithoutIndex}`
      }

      parentForm!.updateModel(path, val)
    }
  }
}

const initWatchFromModel = () => {
  if (parentModelAble()) {
    const res = getIndexAndName()
    if (!res) {
      return
    }
    watch(() => {
      return parentForm?.validModel.value[props.prop!]
    }, (val) => {
      if (!isEqual(val, modelValue.value)) {
        updateValue(val)
      }
    })

    const { indexOfArrFiled, nameWithoutIndex } = res
    if (arrNames) {
      watch(() => {
        return arrNames.map((name) => {
          let path = name
          if (parentArrayField?.prop) {
            path = `${parentArrayField.prop}.${indexOfArrFiled}.${name}`
          }
          return get(parentForm?.model.value, path)
        })
      },
      (val) => {
        if (!isEqual(val, modelValue.value)) {
          updateValue(val)
        }
      }, {
        immediate: true,
      })
    }
    else if (objNames) {
      watch(() => {
        return objNames.reduce((prev, cur) => {
          let [originKey, targetKey] = cur.split(':')
          if (!targetKey) {
            targetKey = originKey
          }
          let path = targetKey
          if (parentArrayField?.prop) {
            path = `${parentArrayField?.prop}.${indexOfArrFiled}.${targetKey}`
          }
          return {
            ...prev,
            [originKey]: get(parentForm?.model.value, path),
          }
        }, {})
      },
      (val) => {
        if (!isEqual(val, modelValue.value)) {
          updateValue(val)
        }
      }, { immediate: true })
    }
    else {
      watch(() => {
        let path = nameWithoutIndex
        if (parentArrayField?.prop) {
          path = `${parentArrayField.prop}.${indexOfArrFiled}.${nameWithoutIndex}`
        }
        return get(parentForm?.model.value, path)
      },
      (val: unknown) => {
        if (val !== modelValue.value) {
          updateValue(val)
        }
      }, {
        immediate: true,
      })
    }
  }
}

initDefault()
initWatchFromModel()

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
