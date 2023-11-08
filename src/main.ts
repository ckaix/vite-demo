import { createApp } from 'vue'
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'
import App from './App.vue'

import router from './router'
import store from './store'

const app = createApp(App)

BScroll.use(Wheel)

app.use(router)
app.use(store)
app.mount('#app')
