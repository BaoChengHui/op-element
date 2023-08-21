import 'normalize.css'

import OpElement, { tablePlugin } from 'op-element'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(OpElement).use(ElementPlus).mount('#app')

tablePlugin.use((col) => {
  if (col.customType === 'aaa') {
    return {
      formatter: (row) => {
        return 'aaaaaa'
      },
    }
  }
  else {
    return {}
  }
})
