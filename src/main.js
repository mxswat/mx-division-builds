import Vue from "vue";
import App from "./App.vue";
import VModal from "vue-js-modal";
import vSelect from "vue-select";
import VueRouter from "vue-router";
import router from "./router";
import i18n from "./i18n";
Vue.config.productionTip = false;

Vue.use(VModal, {
	dialog: true,
	dynamic: true,
	injectModalsContainer: true,
});

Vue.component("v-select", vSelect);

// This is used by our custom MenuButton component
Vue.component("v-select-open-indicator", vSelect["components"].OpenIndicator);

Vue.use(VueRouter);

var vueInstance = new Vue({
	render: (h) => h(App),
	router,
	i18n,
}).$mount("#app");

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
