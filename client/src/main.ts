import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { IoPerson, IoPeople, IoStatsChart, FaRobot, IoTriangleSharp } from 'oh-vue-icons/icons'
import App from './App.vue'
import router from './router'
import './index.css'

addIcons(IoPerson, IoPeople, IoStatsChart, FaRobot, IoTriangleSharp);

const app = createApp(App);

app.component('v-icon', OhVueIcon);

app.use(createPinia());
app.use(router);

app.mount('#app');
