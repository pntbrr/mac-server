import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './routes/Home.vue'
import FeetGrapes from './routes/FeetGrapes.vue'
import Sundial from './routes/Sundial.vue'
import { linkSocketToStore } from './socket'
import { pinia } from './store'

const routes = [
    { path: '/', component: Home },
    { path: '/feet', component: FeetGrapes },
    { path: '/sundial', component: Sundial },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')

linkSocketToStore()
