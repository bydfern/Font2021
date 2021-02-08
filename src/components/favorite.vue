<template>
  <div>
    <menu-bar></menu-bar>
        <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>กระทู้ทั้งหมด</v-card-title>
        <v-card-text>
          <!-- <div class="dataQuery">
            <v-text-field placeholder="ค้นหา" style="width: 50%;" outlined prepend-inner-icon="mdi-magnify" v-model="search" clearable @input="query()" />
            <v-select class="mx-2" :items="sortByItems" outlined v-model="sortBy" @change="query()" />
            <v-select :items="sortOrderItems" outlined v-model="sortOrder" @change="query()" />
          </div> -->
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
          <!-- <div class="paginate">
            <div class="mr-5" style="width: 50px; margin-left: auto;">
              <v-select :items="[10, 30, 50]" v-model="pageSize" @change="query()"></v-select>
            </div>
            <v-pagination class="my-2" :length="totalPage" v-model="currentPage" @input="query()"></v-pagination>
          </div> -->
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
        profile: {},
        topics: [],
        sortByItems: [
          { text: 'เรื่อง', value: 'title' },
          { text:  'วิชา', value: 'subject'},
          { text: 'ถูกใจ', value: 'like' },
          { text: 'วันที่โพส', value: 'createdAt' }
        ],
        sortBy: 'createdAt',
        sortOrderItems: [
          { text: 'มาก -> น้อย', value: -1 },
          { text: 'น้อย -> มาก', value: 1 }
        ],
        sortOrder: -1,
        search: '',
        pageSize: 10,
        currentPage: 1,
        totalPage: 1
      }
    },
    created () {
      this.getTopics()
    },
    methods: {
      async getTopics() {
        const { data: topicsResult } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/favorite-topic/${sessionStorage.getItem('memberId')}`
        })
        this.topics = topicsResult
      },
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
      },
      async query() {
        const skip = (this.currentPage - 1) * this.pageSize
        if (!this.search) {
          this.search = ''
        }
        const search = `$or[0][title][$regex]=${this.search}&$or[1][subject][$regex]=${this.search}&$or[2][memberEmail][$regex]=${this.search}`
        const { data: topicsResult } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics?$sort[${this.sortBy}]=${this.sortOrder}&${search}&$limit=${this.pageSize}&$skip=${skip}`
        })
        this.topics = topicsResult.data
        this.totalPage = Math.ceil(topicsResult.total / this.pageSize)
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
  .paginate {
    width: 50%;
    margin-left: auto;
    display: flex;
    flex-direction: row;
  }
</style>