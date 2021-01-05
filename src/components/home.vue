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
                <th style="width: 40%;">เรื่อง</th>
                <th style="width: 40%">วิชา</th>
                <th style="width: 20%;">เจ้าของกระทู้</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(topic, index) in topics" :key="index" @click="$router.push(`/topic/${topic._id}`)">
                <td>{{topic.title}}</td>
                <td>{{topic.subject}}</td>
                <td>{{topic.memberEmail}}</td>
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

  export default {
    components: {
      MenuBar
    },
    data() {
      return {
        email: sessionStorage.getItem('email'),
        topics: []
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
      }
    },
  }
</script>

<style scoped>
  .v-card {
    max-width: 1000px;
  }
</style>