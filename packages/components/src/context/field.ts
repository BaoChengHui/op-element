import type { InjectionKey, Ref } from 'vue'
import type { Arrayable, ElColProps, Recordable } from '../types'

export const formFieldKey = Symbol('FormField') as InjectionKey<{
  model: Ref<Recordable>
  validModel: Ref<Recordable>
  updateModel: (infos: Arrayable<{
    path: string
    val: unknown
  }>) => void
  updateValidModel: (key: string, val: unknown) => void
}>

export const arrayFieldKey = Symbol('ArrayFieldKey') as InjectionKey<{
  prop: string
}>

export const formLayoutKey = Symbol('FormLayoutKey') as InjectionKey<{
  layout: number | ElColProps
}>
