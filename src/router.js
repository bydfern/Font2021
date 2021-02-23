import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Register from './components/register.vue'
import Home from './components/home.vue'
import CreateTopic from './components/create-topic.vue'
import Topic from './components/topic.vue'
import MyTopic from './components/my-topic.vue'
import EditProfile from './components/edit-profile.vue'
import EditTopic from './components/edit-topic.vue'
import Neen from './components/neen.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/',
      component: Login     
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    },
    {
      name: 'createTopic',
      path: '/create-topic',
      component: CreateTopic
    },
    {
      name: 'topic',
      path: '/topic/:id',
      component: Topic
    },
    {
      name: 'myTopic',
      path: '/my-topic',
      component: MyTopic
    },
    {
      name: 'editProfile',
      path: '/edit-profile',
      component: EditProfile
    },
    {
      name: 'editTopic',
      path: '/edit-topic/:id',
      component: EditTopic
    },
    {
      name: 'Neen',
      path: '/neen',
      component: Neen
    }
  ],
})
