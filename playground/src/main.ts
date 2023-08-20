import './assets/main.css'
import OpElement from "op-element";

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

app.use(OpElement).mount('#app')

