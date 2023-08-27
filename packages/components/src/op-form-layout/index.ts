import type { ElRow } from 'element-plus'
import { withInstall } from '../utils'
import opFormLayout from './src/op-form-layout.vue'

export const OpFormLayout = withInstall(opFormLayout)
declare module 'vue' {
  export interface GlobalComponents {
    OpFormLayout: typeof OpFormLayout & typeof ElRow
  }
}
