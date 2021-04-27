<template>
  <div class="front">
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>รายงาน</v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th style="width: 20%;">ประเภทรายงาน</th>
                <th>เหตุผล</th>
                <th style="width: 20%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in reports" :key="index">
                <td><span v-if="report.typeReport === 0">กระทู้</span><span v-if="report.typeReport === 1">บุคคล</span></td>
                <td>{{report.reason}}</td>
                <td>
                  <v-btn v-if="report.typeReport === 0" color="primary" small @click="$router.push(`/topic/${report.targetId}`)">ดูกระทู้</v-btn>
                  </td>
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
      MenuBar,
    },
    data() {
      return {
        reports: [],
      }
    },
    created () {
      this.getReport()
    },
    methods: {
      async getReport() {
        const { data: reports } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/reports`
        })
        this.reports = reports.data
      }
    },
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .front
  {
    font-family: 'Athiti', sans-serif;
  }
  

  .v-card {
    max-width: 1000px;
  }
  .dataQuery {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>