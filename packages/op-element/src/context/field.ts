import type { InjectionKey, Ref } from 'vue'
import type { RecordAble } from '../types'

export const formFieldKey = Symbol('FormField') as InjectionKey<{
  model: Ref<RecordAble>
  validModel: Ref<RecordAble>
  updateModel: (path: string, val: unknown, arrKey?: string, arrIndex?: string) => void
  updateValidModel: (key: string, val: unknown) => void
}>

export const arrayFieldKey = Symbol('ArrayFieldKey') as InjectionKey<{
  prop: string
}>
