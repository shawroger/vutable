import Vue from "vue";
import App from "./App.vue";


import { tryGlobalConfig } from "./utils/methods";
import "./plugins/composition-api";
import "./plugins/element-ui";
import "./plugins/axios";

const target = String(tryGlobalConfig(["target"], "#vutable"));
Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount(target);
