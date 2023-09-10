import { withInstall } from '../utils'
import opTablePage from './src/op-table-page.vue'

export const OpTablePage = withInstall(opTablePage)
declare module 'vue' {
  export interface GlobalComponents {
    OpTablePage: typeof opTablePage
  }
}
