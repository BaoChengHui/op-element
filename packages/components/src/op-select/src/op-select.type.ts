import type { ElSelectProps, PickComponentProps, Recordable } from '../../types'
import type opSelect from './op-select.vue'

export type OpSelectValueAble = string | number | Recordable | OpSelectValueAble[]

export interface OpSelectOption {
  label: string
  value: OpSelectValueAble
  [p: string]: any
}

export interface OpSelectGroup {
  label: string
  options: OpSelectOption[]
  [p: string]: any
}

export type OpSelectProps = PickComponentProps<typeof opSelect> & ElSelectProps
