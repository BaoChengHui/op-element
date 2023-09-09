import type { ElCol, ElDatePicker, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElPagination, ElSelect, ElSwitch, FormItemProp } from 'element-plus'
import type { PickComponentProps } from './base'

export type ElInputProps = PickComponentProps<typeof ElInput>
export type ElSelectProps = PickComponentProps<typeof ElSelect>
export type ElSwitchProps = PickComponentProps<typeof ElSwitch>
export type ElInputNumberProps = PickComponentProps<typeof ElInputNumber>
export type ElFormItemProps = PickComponentProps<typeof ElFormItem>
export type ElDatePickerProps = PickComponentProps<typeof ElDatePicker>
export type ElFormProps = PickComponentProps<typeof ElForm>
export type ElColProps = PickComponentProps<typeof ElCol>
export type ELDialogProps = PickComponentProps<typeof ElDialog>
export type ElPaginationProps = PickComponentProps<typeof ElPagination>
