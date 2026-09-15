import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupAxiosInterceptors } from './services/axiosInterceptor.js'

const app = createApp(App)
const pinia = createPinia()

setupAxiosInterceptors(router)

app.use(pinia)
app.use(router)
app.mount('#app')
