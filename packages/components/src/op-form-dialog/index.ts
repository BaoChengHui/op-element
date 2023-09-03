import type { ElDialog } from 'element-plus'
import type { OpDialog } from '../op-dialog'
import { withInstall } from '../utils'
import opFormDialogVue from './src/op-form-dialog.vue'

export const OpFormDialog = withInstall(opFormDialogVue)
export * from './src/op-form-type'
declare module 'vue' {
  export interface GlobalComponents {
    OpFormDialog: typeof OpFormDialog & typeof OpDialog & typeof ElDialog
  }
}
