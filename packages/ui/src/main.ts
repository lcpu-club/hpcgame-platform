import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '@/styles/main.css'
import 'github-markdown-css/github-markdown-light.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/utils/sync'

const app = createApp(App)

app.use(router)

app.mount('#app')
