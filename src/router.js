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
import Favorite from './components/favorite.vue'
import Report from './components/report.vue'
import AllEvent from './components/all-event.vue'
import CreateEvent from './components/create-event.vue'
import Event from './components/event.vue'
import profile from './components/profile.vue'
import EditEvent from './components/edit-event.vue'


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
      name: 'favorite',
      path: '/favorite',
      component: Favorite
    },
    {
      name: 'report',
      path: '/report',
      component: Report
    },
    {
      name: 'allEvent',
      path: '/events',
      component: AllEvent
    },
    {
      name: 'createEvent',
      path: '/create-event',
      component: CreateEvent
    },
    {
      name: 'event',
      path: '/event/:id',
      component: Event
    },
    {
      name: 'profile',
      path: '/profile/:id',
      component: profile
    },
    {
      name: 'editEvent',
      path: '/edit-event/:id',
      component: EditEvent
    }
  ],
})
