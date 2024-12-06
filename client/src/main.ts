import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import {
	FaRobot,
	GiRollingDices,
	IoHomeSharp,
	IoTrophySharp,
	IoPerson,
	IoStatsChart,
	IoTriangleSharp,
	IoMailSharp,
	FaUserCircle,
	IoCloseSharp,
	IoHourglassSharp,
	BiCircle,
	BiCircleFill,
	FaMedal,
	FaDiceD20,
	FaEllipsisH, IoLogoWhatsapp, IoLogoFacebook, IoLogoTwitter
} from 'oh-vue-icons/icons'
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import './index.css';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

import PieChart from 'vue-pie-chart/src/PieChart.vue'

const app = createApp(App);

app.component('pie-chart', PieChart)

addIcons(
	IoPerson,
	IoTrophySharp,
	IoStatsChart,
	FaRobot,
	IoTriangleSharp,
	IoHomeSharp,
	GiRollingDices,
	IoMailSharp,
	FaUserCircle,
	IoCloseSharp,
	IoHourglassSharp,
	BiCircle,
	BiCircleFill,
	FaMedal,
	FaEllipsisH,
	FaDiceD20,
	IoLogoWhatsapp,
	IoLogoFacebook,
	IoLogoTwitter
);

app.component('v-icon', OhVueIcon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);

app.mount('#app');
