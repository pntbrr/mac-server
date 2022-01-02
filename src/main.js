import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './routes/Home.vue'
import FeetGrapes from './routes/FeetGrapes.vue'
import Sundial from './routes/Sundial.vue'
import Dashboard from './routes/Dashboard.vue'
import { pinia } from './store'
import './assets/styles.css'

const routes = [
    { path: '/', component: Home },
    { path: '/feet', component: FeetGrapes },
    { path: '/sundial', component: Sundial },
    { path: '/dashboard', component: Dashboard },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
