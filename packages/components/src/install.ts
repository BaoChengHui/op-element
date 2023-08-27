import type { App } from 'vue'
import Components from './component'

export function install(app: App) {
  Components.forEach((item) => {
    app.use(item)
  })
}
