import type { App } from "vue";
import Components from "./component";


export const install = (app:App)=>{
    Components.forEach(item=>{
        app.use(item)
    })
}