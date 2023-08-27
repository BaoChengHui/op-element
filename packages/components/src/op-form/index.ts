import type { ElForm } from 'element-plus'
import { withInstall } from '../utils'
import opForm from './src/op-form.vue'

export const OpForm = withInstall(opForm)
export * from './src/op-from.type'
declare module 'vue' {
  export interface GlobalComponents {
    OpForm: typeof opForm & typeof ElForm
  }
}
