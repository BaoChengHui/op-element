import type { ElDialog } from 'element-plus'
import { withInstall } from '../utils'
import opDialog from './src/op-dialog.vue'

export const OpDialog = withInstall(opDialog)
export * from './src/op-dialog.type'
declare module 'vue' {
  export interface GlobalComponents {
    OpDialog: typeof OpDialog & typeof ElDialog
  }
}
