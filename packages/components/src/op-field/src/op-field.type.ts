import type { OpSelectProps } from '../../op-select'
import type { ElColProps, ElDatePickerProps, ElInputNumberProps, ElInputProps, ElSelectProps, ElSwitchProps, PickComponentProps } from '../../types'
import type opFieldVue from './op-field.vue'

export type FieldType = 'input' | 'switch' | 'inputNumber' | 'select' | 'datePicker' | 'daterange'

export type InputFieldProps = ElInputProps
export type InputNumberFieldProps = ElInputNumberProps
export type SwitchFieldProps = ElSwitchProps
export type SelectFieldProps = ElSelectProps & OpSelectProps
export type DatePickFieldProps = ElDatePickerProps
export type DaterangeFieldProps = ElDatePickerProps

export interface FieldCompoentProps {
  input: InputFieldProps
  inputNumber: InputNumberFieldProps
  switch: SwitchFieldProps
  select: SelectFieldProps
  datePicker: DatePickFieldProps
  daterange: DaterangeFieldProps
}

export type PFC<T extends FieldType> = T extends FieldType ? { type: T; props?: FieldCompoentProps[T] } : never

export type FieldCompoent = PFC<FieldType>
export type OpFieldProps = PickComponentProps<typeof opFieldVue>
export type FieldLayout = boolean | number | ElColProps
export type OpFieldInstance = InstanceType<typeof opFieldVue>
