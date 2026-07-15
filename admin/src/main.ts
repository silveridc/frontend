import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AntdvNext from 'antdv-next'
import 'antdv-next/dist/reset.css'
import './style/tailwind.css'
import App from './App.vue'
import router from './router'
import i18n from './locale'
import './permission'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(AntdvNext)

app.mount('#app')
