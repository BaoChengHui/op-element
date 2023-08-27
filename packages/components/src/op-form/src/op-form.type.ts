import type { OpFiledProps } from '../../op-field'
import type { BooleanAble, ElColProps, ElFormItemProps, ElFormProps, PickComponentProps } from '../../types'
import type opFormVue from './op-form.vue'

type OpFieldItem = OpFiledProps & {
  /**
     * @default true
     */
  visible?: BooleanAble
} & ElFormItemProps

export type OpFields = OpFieldItem[]
export type OpFormInstance = InstanceType<typeof opFormVue>
export type OpFormProps = PickComponentProps<typeof opFormVue> & ElFormProps
