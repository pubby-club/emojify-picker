import Vue from "vue";
import App from "./App.vue";
import "./scss/index.scss";
import EmojifyPicker from "./index"

Vue.config.productionTip = false;

Vue.use(EmojifyPicker)

new Vue({
  render: (h) => h(App),
}).$mount("#app");
