import { type ComponentPublicInstance, getCurrentInstance, ref, watch } from 'vue'
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
      const setConfig = (options: UseFormDialogOptions<Recordable> & Destory) => {
        const { destroyOnClosed = false, ...params } = options
        isDestory.value = destroyOnClosed
        config.value = params
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
      }
    },
    render() {
      const { config, handlerClosed } = this
      return <OpFormDialog {...config} onClosed={handlerClosed}/>
    },
  })

  const instance = res.instance as FormDialogInstance
  instances[instance.uid] = instance
  return instance
}

export function FormDialog<T extends Recordable, P extends T = T & Recordable>(options: Omit<UseFormDialogOptions<T>, 'onSuccess' | 'onCancel'> & Destory) {
  let handlerSuccess: any = () => {}
  let handlerCancel: any = () => {}

  const { callCreate, callModify, config } = useFormDialog({
    ...options,
    onSuccess() {
      handlerSuccess()
    },
    onCancel() {
      handlerCancel()
    },
  })
  let instance: FormDialogInstance
  const create = (options: OpFormDialogProps = {}) => {
    return new Promise((resolve, reject) => {
      if (!instances[instance?.uid]) {
        instance = initInstance()
        watch(() => config.value, () => {
          instance.setConfig(Object.assign({}, config.value, options))
        })
      }
      callCreate()
      handlerSuccess = resolve
      handlerCancel = reject
    })
  }

  const modify = (data: Partial<P>, options: OpFormDialogProps = {}) => {
    return new Promise((resolve, reject) => {
      if (!instances[instance?.uid]) {
        instance = initInstance()
        watch(() => config.value, () => {
          instance.setConfig(Object.assign({}, config.value, options))
        })
      }
      callModify(data)
      handlerSuccess = resolve
      handlerCancel = reject
    })
  }

  return {
    create,
    modify,
  }
}
