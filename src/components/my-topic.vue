<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto">
        <v-card-title>กระทู้ทั้งหมด</v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th style="width: 30%;">เรื่อง</th>
                <th style="width: 20%;">วิชา</th>
                <th style="width: 20%;">เจ้าของกระทู้</th>
                <th style="width: 200px;">สร้างเมื่อ</th>
                <th style="width: 200px;">แก้ไขเมื่อ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(topic, index) in topics" :key="index" @click="$router.push(`/topic/${topic._id}`)">
                <td>{{topic.title}}</td>
                <td>{{topic.subject}}</td>
                <td>{{topic.memberEmail}}</td>
                <td>{{formatDate(topic.createdAt)}}</td>
                <td>{{formatDate(topic.updatedAt)}}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  import MenuBar from './menu-bar.vue'
  import moment from 'moment'
  import Axios from 'axios'

  export default {
    components: {
      MenuBar,
    },
    data() {
      return {
        topics: []
      }
    },
    created () {
      this.getMyTopic()
    },
    methods: {
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
      },
      async getMyTopic() {
        const { data: myTopic } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics?memberEmail=${sessionStorage.getItem('email')}`
        })
        this.topics = myTopic.data
      }
    },
  }
</script>

<style scoped>
  .v-card {
    max-width: 1200px;
  }
</style>