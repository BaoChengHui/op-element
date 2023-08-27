import type { Component } from 'vue'
import { ElDatePicker, ElInput, ElInputNumber, ElSwitch } from 'element-plus'
import { OpSelect } from '../../op-select'
import type { RecordAble } from '../../types'
import type { FieldType } from './op-field.type'

export interface FieldConfig {
  component: Component
  defaultProps?: RecordAble
}

export const fieldConfigMap = new Map<FieldType, FieldConfig>([
  [
    'input', {
      component: ElInput,
      defaultProps: {
        placeholder: '请输入',
      },
    },
  ],
  [
    'inputNumber', {
      component: ElInputNumber,
      defaultProps: {
        placeholder: '请输入',
      },
    },
  ],
  [
    'select', {
      component: OpSelect,
      defaultProps: {
        placeholder: '请选择',
      },
    },
  ],
  [
    'switch', {
      component: ElSwitch,
    },
  ],
  [
    'datePicker', {
      component: ElDatePicker,
      defaultProps: {
        placeholder: '请选择',
        valueFormat: 'YYYY-MM-DD',
        type: 'date',
      },
    },
  ],
  [
    'daterange', {
      component: ElDatePicker,
      defaultProps: {
        placeholder: '请选择',
        valueFormat: 'YYYY-MM-DD',
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
  ],
])
