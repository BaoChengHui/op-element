import { withInstall } from "../utils";
import OpTableVue from "./src/op-table.vue";


export const OpTable = withInstall(OpTableVue)


declare module 'vue' {
    export interface GlobalComponents {
        OpTable: typeof OpTable
    }
  }


