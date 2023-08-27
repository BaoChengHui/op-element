import type { ElFormItem } from 'element-plus'
import { withInstall } from '../utils'
import type { PickComponentProps } from '../types'
import opFieldVue from './src/op-field.vue'

export * from './src/op-field.type'

export const OpField = withInstall(opFieldVue)
declare module 'vue' {
  export interface GlobalComponents {
    OpField: typeof OpField & typeof ElFormItem
  }
}

export type OpFiledProps = PickComponentProps<typeof opFieldVue>
