import { withInstall } from '../utils'
import opSelectVue from './src/op-select.vue'

export * from './src/op-select.type'

export const OpSelect = withInstall(opSelectVue)
declare module 'vue' {
  export interface GlobalComponents {
    OpSelect: typeof OpSelect
  }
}
