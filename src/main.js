import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import vuetify from './plugins/vuetify';

Vue.use(Buefy)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  vuetify,
  router
}).$mount('#app')
