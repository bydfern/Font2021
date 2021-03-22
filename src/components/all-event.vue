<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="dobyy">
      <v-row>
        <v-col cols="12">
          <div class="addEvent">
            <v-btn class="my-3" color="success" @click="toCreateEvent()">สร้างกิจกรรม</v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-card>
            <v-img height="150px" src="https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/workplace-with-smartphone-laptop-black-table-top-view-copyspace-background.jpg?alt=media&token=edabe94a-a82e-4419-b05f-bfc30f591c68" >
              <v-card-title class="white--text mt-8">
                <v-avatar size="56">
                  <img
                    alt="user"
                    :src="getProfile"
                  />
                </v-avatar>
                <p class="ml-3" style="color:white">
                  {{getUser}}
                </p>
              </v-card-title>
            </v-img>

            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">
                Event
              </div>

              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="(message, index) in eventsFollowed"
                  :key="`${message.startDate}-${index}`"
                  small
                >
                  <div>
                    <div class="font-weight-normal">
                      <strong>{{ message.name }}</strong> @{{ formatDate(message.startDate) }}
                    </div>
                    <div>{{ message.detail }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="9">
      
          <v-card>
            <v-card-title>กิจกรรม</v-card-title>
            <v-card-text>
              <v-card max-width="100%" class="mx-auto">
                <v-container class="pa-1">
                  <v-item-group multiple>
                    <v-row>
                        <div class="event my-3 mx-3" v-for="event in events" :key="event._id" @click="$router.push(`/event/${event._id}`)">
                          <img :src="event.posterUrl" width="170px" height="200px">
                          <span>วันที่ {{formatDate(event.startDate)}} ถึง {{formatDate(event.endDate)}}</span>
                          <span><b>{{event.name}}</b></span>
                          <span v-if="event.typeEvent">ออนไลน์</span>
                          <span v-else>สถานที่: {{event.location}}</span> 
                        </div>
                    </v-row>
                  </v-item-group>
                </v-container>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
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
        events: [],
        getUser: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
        getProfile : sessionStorage.getItem("profileUrl"),
        eventsFollowed: []
      }
    },
    async created () {
      await Promise.all([
        this.getEvents(),
        this.getFollowedEvents()
      ])
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
      async getFollowedEvents() {
        const { data: { data: events } } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/events?following=${sessionStorage.getItem('memberId')}&endDate[$gte]=${moment().toString()}&$sort[endDate]=1&$limit=3&$skip=0`
        })
        this.eventsFollowed = events
      },
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD')
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
  .dobyy{
    /* display: flex; */
    font-family: 'Athiti', sans-serif;
    color: #fff;
    background-image: url("https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/top-view-person-writing-laptop-with-copy-space.jpg?alt=media&token=d5ba4445-f44b-4562-a39f-08b616965a20");
    min-height: 100%;
    max-width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 0px 50px 0px 50px;
  }
</style>