<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container">
      <div class="addEvent">
        <v-btn class="my-3" color="success" @click="toCreateEvent()">สร้างกิจกรรม</v-btn>
      </div>
      <v-card>
        <v-card-title>กิจกรรม</v-card-title>
        <v-card-text>
          <div class="event my-3 mx-3" v-for="event in events" :key="event._id" @click="$router.push(`/event/${event._id}`)">
            <img :src="event.posterUrl" width="200px" height="250px">
            <span>วันที่ {{formatDate(event.startDate)}} ถึง {{formatDate(event.endDate)}}</span>
            <span><b>{{event.name}}</b></span>
            <span v-if="event.typeEvent">ออนไลน์</span>
            <span v-else>สถานที่: {{event.location}}</span>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import menuBar from './menu-bar'
import moment from 'moment'

  export default {
    components: {
      menuBar,
    },
    data() {
      return {
        events: []
      }
    },
    async created () {
      await this.getEvents()
    },
    methods: {
      toCreateEvent() {
        this.$router.push({ name: 'createEvent' })
      },
      async getEvents() {
        const { data: { data: events } } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/events`
        })
        this.events = events
      },
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD')
      }
    },
  }
</script>

<style scoped>
  .addEvent {
    display: flex;
    flex-direction: row-reverse;
  }
  .event {
    width: 200px;
    display: flex;
    flex-direction: column;
  }
  .v-card__text {
    display: flex;
    flex-direction: row;
  }
</style>