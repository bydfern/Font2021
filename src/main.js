import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'
import { config } from './firebase/config'
import VueSweetAlert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Bars from 'vuebars'

Vue.config.productionTip = false
Vue.use(VueSweetAlert2)
Vue.use(Bars)
firebase.initializeApp(config)

new Vue({
  store,
  render: h => h(App),
  vuetify,
  router,
  watch:{
    '$route' (page) {
      if(page.name === 'profile'){window.location.reload()}
    }
  },
}).$mount('#app')
