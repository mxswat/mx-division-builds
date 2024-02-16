import Vue from "vue";
import App from "./App.vue";
import VModal from "vue-js-modal";

// PrimeVue
import PrimeVue from 'primevue/config';
import Panel from 'primevue/panel';
import Dropdown from 'primevue/dropdown';
import ToggleButton from 'primevue/togglebutton';

import VueRouter from "vue-router";
import router from "./router";
Vue.config.productionTip = false;

Vue.use(VModal, {
	dialog: true,
	dynamic: true,
	injectModalsContainer: true,
});

Vue.use(PrimeVue);
Vue.component('Panel', Panel);
Vue.component('Dropdown', Dropdown);
Vue.component('ToggleButton', ToggleButton);

Vue.use(VueRouter);

var vueInstance = new Vue({
	render: (h) => h(App),
	router,
}).$mount("#app");

// make typescript aware of vueInstance property
declare const window: {
	vueInstance: object;
  } & Window;

document.addEventListener(
	"DOMContentLoaded",
	function() {
		window.vueInstance = vueInstance;
	},
	false
);

// document.onkeypress = function (e) {
//   e = e || window.event;
//   if (e.key == 'x') {
//     debugger;
//   }
// }
