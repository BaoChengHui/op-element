import type { ElFormItem } from 'element-plus'
import { withInstall } from '../utils'
import type { PickComponentProps } from '../types'
import opArrayField from './src/op-array-field.vue'

export const OpArrayField = withInstall(opArrayField)
declare module 'vue' {
  export interface GlobalComponents {
    OpArrayField: typeof OpArrayField
  }
}
