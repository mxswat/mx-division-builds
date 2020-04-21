import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal';
import vSelect from 'vue-select'

Vue.config.productionTip = false
Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
})
Vue.component('v-select', vSelect)

var vueInstance = new Vue({
  render: h => h(App),
}).$mount('#app')

document.addEventListener('DOMContentLoaded', function () {
  window.vueInstance = vueInstance
}, false);


document.onkeypress = function (e) {
  e = e || window.event;
  if (e.key == 'x') {
    debugger;
  }
}