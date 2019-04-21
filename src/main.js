// @ts-nocheck
import Vue from "vue";
import App from "./App.vue";
import eventHub from './utils/eventHub';

Vue.config.productionTip = false;
Vue.prototype.$eventHub = eventHub; // Global event bus

new Vue({
  render: h => h(App)
}).$mount("#app");
Vue.config.devtools = true;
