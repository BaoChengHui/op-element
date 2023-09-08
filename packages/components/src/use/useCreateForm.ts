import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { BindForm } from '../op-form'
import type { Recordable } from '../types'

export function useCreateForm<T extends Recordable, P extends Recordable = T & Recordable >(initData: Partial<P> = {}): BindForm<T> {
  const model = ref({
    ...initData,
  })
  const setModel = (data: Partial<P>) => {
    model.value = cloneDeep(data) as any
  }

  return reactive({
    model,
    setModel,
  }) as BindForm<T>
}
