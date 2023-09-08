import type { OpFiledProps } from '../../op-field'
import type { Booleanable, ElColProps, ElFormItemProps, ElFormProps, PickComponentProps, Recordable } from '../../types'
import type opFormVue from './op-form.vue'

export interface BindForm<T extends object = Recordable> {
  model: T
  setModel: (data: Recordable) => void
}

type OpFieldItem = OpFiledProps & {
  /**
     * @default true
     */
  visible?: Booleanable
} & ElFormItemProps

export type OpFields = OpFieldItem[]
export type OpFormInstance = InstanceType<typeof opFormVue>
export type OpFormProps = PickComponentProps<typeof opFormVue>
