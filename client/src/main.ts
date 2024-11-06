import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import { FaRobot, GiRollingDices, IoPeople, IoPerson, IoStatsChart, IoTriangleSharp } from 'oh-vue-icons/icons';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import './index.css';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

const app = createApp(App);

addIcons(FaRobot, GiRollingDices, IoPeople, IoPerson, IoStatsChart, IoTriangleSharp);

app.component('v-icon', OhVueIcon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);

app.mount('#app');
