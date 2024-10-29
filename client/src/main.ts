import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { IoPerson, IoPeople, IoStatsChart, FaRobot } from "oh-vue-icons/icons";
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';

const app = createApp(App)

addIcons(IoPerson, IoPeople, IoStatsChart, FaRobot);

app.component("v-icon", OhVueIcon);

app.use(createPinia())
app.use(router)

app.mount('#app')
