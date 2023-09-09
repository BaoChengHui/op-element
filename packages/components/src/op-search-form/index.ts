import type { ElForm } from 'element-plus'
import type { OpForm } from '../op-form'
import { withInstall } from '../utils'
import opSearchForm from './src/op-search-form.vue'

export const OpSearchForm = withInstall(opSearchForm)
export * from './src/op-search-form.type'
declare module 'vue' {
  export interface GlobalComponents {
    OpSearchForm: typeof OpSearchForm & typeof OpForm & typeof ElForm
  }
}
