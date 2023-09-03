import { type Component, type ComponentPublicInstance, getCurrentInstance, ref, shallowRef, watch } from 'vue'
import { mountComponent } from '../../utils'
import { type UseFormDialogOptions, useFormDialog } from '../../use'
import type { Recordable } from '../../types'
import OpFormDialog from './op-form-dialog.vue'
import type { OpFormDialogProps } from './op-form-type'

type FormDialogInstance = ComponentPublicInstance<{ uid: number }, any>

const instances: Record<number, FormDialogInstance> = {}

interface Destory {
  destroyOnClosed?: boolean
}

function initInstance() {
  const res = mountComponent({
    setup() {
      const isDestory = ref(false)
      const formComponent = shallowRef()
      const setConfig = (options: UseFormDialogOptions<Recordable> & Destory, component?: Component) => {
        const { destroyOnClosed = false, ...params } = options
        isDestory.value = destroyOnClosed
        config.value = params
        formComponent.value = component
      }
      const uid = getCurrentInstance()!.uid
      const config = ref<Recordable>({})

      const handlerClosed = () => {
        if (isDestory.value) {
          res.unmount()
          delete instances[uid]
        }
      }
      return {
        config,
        setConfig,
        uid,
        handlerClosed,
        formComponent,
      }
    },
    render() {
      const { config, handlerClosed, formComponent } = this
      return <OpFormDialog {...config} onClosed={handlerClosed} formComponent={formComponent}/>
    },
  })

  const instance = res.instance as FormDialogInstance
  instances[instance.uid] = instance
  return instance
}

export function FormDialog<T extends Recordable, P extends T = T & Recordable>(options: Omit<UseFormDialogOptions<T>, 'onSuccess' | 'onCancel'> & Destory) {
  let handlerSuccess: any = () => {}
  let handlerCancel: any = () => {}

  const { formComponent, ...others } = options

  const { callCreate, callModify, config, formRef } = useFormDialog({
    ...others,
    onSuccess() {
      handlerSuccess()
    },
    onCancel() {
      handlerCancel()
    },
  })
  let instance: FormDialogInstance

  const init = (options: OpFormDialogProps = {}, callback: () => void) => {
    return new Promise((resolve, reject) => {
      if (!instances[instance?.uid]) {
        instance = initInstance()
        watch(() => config.value, () => {
          instance.setConfig(Object.assign({}, config.value, options), formComponent)
        })
      }
      handlerSuccess = resolve
      handlerCancel = reject
      callback()
    })
  }

  const create = (options: OpFormDialogProps = {}) => {
    return init(options, () => {
      callCreate()
    })
  }

  const modify = (data: Partial<P>, options: OpFormDialogProps = {}) => {
    return init(options, () => {
      callModify(data)
    })
  }
  return {
    create,
    modify,
    formRef,
  }
}
