import Vue from 'vue'
import Router from 'vue-router'
import SignIn from './components/sign-in.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'sign-in',
      path: '/',
      component: SignIn     
    }
  ],
})
