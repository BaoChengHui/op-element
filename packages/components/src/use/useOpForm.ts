import { type MaybeRef, type Ref, type UnwrapRef, computed, onMounted, reactive, ref, unref } from 'vue'
import type { OpFields, OpFormInstance, OpFormProps } from '../op-form'
import type { Promisable, Recordable } from '../types'
import { isEmpty, isPromise, promiseAbelExcuter } from '../utils'

export interface UseOpFormOptions<P, D = Partial<P & Recordable>> {
  fields?: MaybeRef<OpFields>
  formProps?: MaybeRef<OpFormProps>
  onSubmit?: (params: Readonly<Partial<D>>) => Promise<void> | void
  onSuccess?: () => void
  /**
   * 初始化表单数据
   * @returns
   */
  init?: () => Promisable<D>
  /**
   *
   */
  assignAll?: boolean
}
export function useOpForm<T extends Recordable>(options: UseOpFormOptions<T>) {
  const { fields = [], onSubmit, formProps = {}, onSuccess, init } = options

  const model = ref({}) as Ref<T>

  const formRef = ref() as Ref<OpFormInstance>

  const bindRef = (val: unknown) => {
    formRef.value = val as OpFormInstance
  }

  const config = computed<OpFormProps>(() => {
    return {
      'fields': unref(fields),
      ...unref(formProps),
      'ref': bindRef,
      'modelValue': model.value,
      'onUpdate:modelValue': (val: T) => model.value = val,
    }
  })

  const getSubmitData = () => {
    return Object.keys(model.value).reduce((prev, cur) => {
      const val = model.value[cur]
      if (isEmpty(val)) {
        return prev
      }
      else {
        return { ...prev, [cur]: val }
      }
    }, {}) as Readonly<Partial<T>>
  }

  const submitLoading = ref(false)
  const handlerSubmit = async () => {
    if (submitLoading.value) {
      return
    }
    await validate()
    if (!onSubmit) {
      console.warn('未配置提交方法')
      return
    }
    try {
      submitLoading.value = true
      await promiseAbelExcuter(onSubmit, getSubmitData())
      if (onSuccess) {
        onSuccess()
      }
    }
    finally {
      submitLoading.value = false
    }
  }

  const initLoading = ref(false)
  const initData = async () => {
    if (!init) {
      return
    }
    initLoading.value = true
    const res = await promiseAbelExcuter(init)
    initLoading.value = false
    Object.keys(res).forEach((key) => {
      const val = res[key]
      if (!isEmpty(val) && Reflect.has(model.value, key)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        model.value[key] = val
      }
    })
  }

  onMounted(() => {
    initData()
  })

  const validate: typeof formRef.value.validate = (...arg) => {
    return formRef.value?.validate(...arg)
  }
  const validateField: typeof formRef.value.validateField = (...arg) => {
    return formRef.value?.validateField(...arg)
  }
  const resetFields: typeof formRef.value.resetFields = (...arg) => {
    return formRef.value?.resetFields(...arg)
  }
  const scrollToField: typeof formRef.value.scrollToField = (...arg) => {
    return formRef.value?.scrollToField(...arg)
  }
  const clearValidate: typeof formRef.value.clearValidate = (...arg) => {
    return formRef.value?.clearValidate(...arg)
  }

  return {
    config,
    formRef,
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate,
    model,
    handlerSubmit,
    submitLoading,
    initLoading,
  }
}
