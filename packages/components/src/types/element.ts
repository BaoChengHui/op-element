import type { ElDatePicker, ElFormItem, ElInput, ElInputNumber, ElSelect, ElSwitch } from 'element-plus'
import type { PickComponentProps } from './base'

export type ElInputProps = PickComponentProps<typeof ElInput>
export type ElSelectProps = PickComponentProps<typeof ElSelect>
export type ElSwitchProps = PickComponentProps<typeof ElSwitch>
export type ElInputNumberProps = PickComponentProps<typeof ElInputNumber>
export type ElFormItemProps = PickComponentProps<typeof ElFormItem>
export type ElDatePickerProps = PickComponentProps<typeof ElDatePicker>
