import { type MaybeRef, type Ref, computed, nextTick, ref, toRaw, unref } from 'vue'
import { cloneDeep, omit, pick } from 'lodash-es'
import type { OpFields, OpFormInstance } from '../op-form'
import type { OpFormDialogProps } from '../op-form-dialog'
import type { Arrayable, Promisable, Recordable } from '../types'
import { isEmpty, promiseAbelExcuter } from '../utils'

export type UseFormDialogOptions<T, P extends T = T & Recordable> = OpFormDialogProps & {
  fields?: MaybeRef<OpFields>
  title?: string
  fullTitle?: string
  modelKeys?: Arrayable<string>
  assignAll?: boolean
  onCreate?: (params: P) => Promisable<unknown>
  onModify?: (params: P) => Promisable<unknown>
  onSubmit?: (params: P) => Promisable<unknown>
  beforeSubmit?: (params: P) => Promisable<boolean>
  onSuccess?: () => void
}

export function useFormDialog<T extends Recordable, P extends T = T & Recordable>(options: UseFormDialogOptions<T>) {
  const {
    fields = [],
    title,
    fullTitle,
    modelKeys = 'id',
    assignAll = false,
    onCreate,
    onModify,
    onSubmit,
    beforeSubmit,
    onOpen,
    ...others
  } = options

  const visible = ref(false)
  const model = ref<Recordable>({})
  const isModify = ref(false)
  const formRef = ref<OpFormInstance>()
  let modifyData: Recordable = {}

  const getSubmitData = () => {
    if (assignAll) {
      return {
        ...modifyData,
        ...cloneDeep(model.value),
      }
    }
    return {
      ...cloneDeep(model.value),
      ...pick(modifyData, modelKeys),
    }
  }

  const loading = ref(false)
  const handlerConfirm = async () => {
    if (loading.value) {
      return
    }
    await formRef.value?.validate()
    const fn = onSubmit ?? (isModify.value ? onModify : onCreate)
    if (!fn) {
      return
    }
    try {
      const submitData = getSubmitData()
      if (beforeSubmit) {
        const prevent = !await promiseAbelExcuter(beforeSubmit, submitData)
        if (prevent) {
          return
        }
      }
      loading.value = true
      await promiseAbelExcuter(fn, submitData)
      options.onSuccess?.()
      visible.value = false
    }
    catch (error) {
      loading.value = false
    }
  }

  const reset = () => {
    visible.value = false
    loading.value = false
    modifyData = {}
    formRef.value?.resetFields()
  }

  const config = computed<UseFormDialogOptions<T>>(() => {
    return {
      'modelValue': visible.value,
      'onUpdate:modelValue': val => visible.value = val,
      'title': fullTitle ?? (isModify.value ? `编辑${title}` : `新增${title}`),
      'model': model.value,
      'onUpdate:model': (val: Recordable) => {
        model.value = val
      },
      'onConfirm': handlerConfirm,
      'onClosed': reset,
      onOpen() {
        onOpen?.()
        if (isModify.value) {
          nextTick(() => {
            Object.keys(modifyData).forEach((key) => {
              const val = modifyData[key]
              if (Object.hasOwn(model.value, key) && !isEmpty(val)) {
                model.value[key] = val
              }
            })
          })
        }
      },
      'confirmButtonLoading': loading.value,
      'cancelButtonDisabled': loading.value,
      'formProps': {
        fields: unref(fields),
        ref(ref) {
          formRef.value = ref as OpFormInstance
        },
      },
      ...omit(others),
    }
  })

  const setState = (state: boolean) => {
    isModify.value = state
    visible.value = true
  }

  const callCreate = () => {
    setState(false)
  }

  const callModify = (data: Partial<P>) => {
    modifyData = data
    setState(true)
  }

  return {
    visible,
    config,
    model: model as Ref<T>,
    callCreate,
    callModify,
    formRef,
  }
}
