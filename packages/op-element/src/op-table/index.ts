import type { ElTable } from 'element-plus'
import { withInstall } from '../utils'
import OpTableVue from './src/op-table.vue'

export const OpTable = withInstall(OpTableVue)
export * from './src/op-table.type'

declare module 'vue' {
  export interface GlobalComponents {
    OpTable: typeof OpTable & typeof ElTable
  }
}
