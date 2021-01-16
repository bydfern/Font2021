<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>กระทู้ทั้งหมด</v-card-title>
        <v-card-text>
          <div class="dataQuery">
            <v-text-field placeholder="ค้นหา" outlined prepend-inner-icon="mdi-magnify" v-model="search" clearable @input="query()" />
            <v-select class="mx-2" :items="sortItems" outlined v-model="sortBy" @change="query()" />
            <v-select :items="['มาก -> น้อย', 'น้อย -> มาก']" outlined v-model="sortOrder" @change="query()" />
          </div>
          <v-simple-table>
            <thead>
              <tr>
                <th style="width: 30%;">เรื่อง</th>
                <th style="width: 30%">วิชา</th>
                <th style="width: 10%">ถูกใจ</th>
                <th style="width: 20%;">เจ้าของกระทู้</th>
                <th style="width: 10%">สร้างเมื่อ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(topic, index) in topics" :key="index" @click="$router.push(`/topic/${topic._id}`)">
                <td>{{topic.title}}</td>
                <td>{{topic.subject}}</td>
                <td>{{topic.like.length}}</td>
                <td>{{topic.memberEmail}}</td>
                <td>{{formatDate(topic.createdAt)}}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import MenuBar from './menu-bar.vue'
  import moment from 'moment'

  export default {
    components: {
      MenuBar
    },
    data() {
      return {
        email: sessionStorage.getItem('email'),
        topics: [],
        sortItems: ['เรื่อง', 'วิชา', 'ถูกใจ', 'วันที่โพส'],
        sortItemsVariable: ['title', 'subject', 'like', 'createdAt'],
        sortBy: 'วันที่โพส',
        sortOrder: 'มาก -> น้อย',
        search: ''
      }
    },
    created () {
      this.getTopics()
    },
    methods: {
      async getTopics() {
        const { data: topicsResult } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics`
        })
        this.topics = topicsResult.data
      },
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
      },
      async query() {
        const indexSort = this.sortItems.findIndex(text => text == this.sortBy)
        const sortBy = this.sortItemsVariable[indexSort]
        const sortOrder = (this.sortOrder == 'มาก -> น้อย') ? -1 : 1
        if (!this.search) {
          this.search = ''
        }
        const search = `$or[0][title][$regex]=${this.search}&$or[1][subject][$regex]=${this.search}&$or[2][memberEmail][$regex]=${this.search}`
        const { data: topicsResult } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics?$sort[${sortBy}]=${sortOrder}&${search}`
        })
        this.topics = topicsResult.data
      }
    },
  }
</script>

<style scoped>
  .v-card {
    max-width: 1000px;
  }
  .dataQuery {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>