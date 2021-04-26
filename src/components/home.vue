<template>
  <div class = "front">
    <menu-bar />
    <div class="bodyy">
      <!-- <div class="container"> -->
      <v-row>
        <v-col cols="3">
          <br>
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
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="13">
          <v-row>
            <v-col cols="12">
              <v-carousel height="400" style="max-width: 1340px;" class="rounded-card">
                <v-carousel-item
                  v-for="(item, i) in event"
                  :key="i"
                  :src="item.coverUrl"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                  @click="$router.push(`/event/${item._id}`)"
                ></v-carousel-item>
              </v-carousel>
            </v-col>
            <!-- <v-col cols="4">
              <v-card class="mx-auto" max-width="100%" height="100%">
                <center>
                  <v-card-title>Discover your Great Experience</v-card-title>
                  <v-card-text>
                    <v-select
                        color="red lighten-3"
                        style="width: 80%;"
                        :items="sortDiscover"
                        label="Outlined style"
                        dense
                        outlined
                        v-model="sortOrder"
                        @change="query()"
                      />
                  </v-card-text>
                  </center>
              </v-card>
              
            </v-col> -->
          </v-row>
          <br />
          <v-card class="mx-auto" max-width="100%">
            <v-card-text>
              <div class="addTopic">
                <v-btn class="my-3" color="success" @click="toCreateTopic()">สร้างกระทู้</v-btn>
              </div>
                <v-chip-group
                  v-model="neighborhoods"
                  column
                  multiple
                  style="text-align: center; max-width: 80% "
                >
                <!-- text-color="white" -->
                <v-chip  outlined color="pink" @click="query('สุขภาพ')"><v-icon left>mdi-weight-lifter</v-icon>   สุขภาพ </v-chip>
                <v-chip  outlined color="red"  @click="query('วิทยาศาสตร์')"><v-icon left>mdi-battlenet</v-icon>  วิทยาศาสตร์ </v-chip>
                <v-chip  outlined color="lime darken-1" @click="query('คณิตศาสตร์')"><v-icon left>mdi-brain</v-icon>  คณิตศาสตร์ </v-chip>
                <v-chip  outlined color="orange accent-4" @click="query('สังคม')"><v-icon left>mdi-human-greeting-proximity</v-icon>  สังคม </v-chip>
                <v-chip  outlined color="cyan lighten-2" @click="query('ศิลปะ')"><v-icon left>mdi-palette</v-icon>  ศิลปะ </v-chip>
                <v-chip  outlined color="light-blue" @click="query('เทคโนโลยี')"><v-icon left>mdi-monitor</v-icon>  เทคโนโลยี </v-chip>
                <v-chip  outlined color="teal accent-3" @click="query('เศรษฐศาสตร์')"><v-icon left>mdi-finance</v-icon>  เศรษฐศาสตร์ </v-chip>
                <v-chip  outlined color="cyan" @click="query('ภาษา')"><v-icon left>mdi-message-text-outline</v-icon>  ภาษา </v-chip>
                <v-chip  outlined color="purple lighten-2" @click="query('แฟชั่น')"><v-icon left>mdi-cards-heart</v-icon>  แฟชั่น </v-chip>
                <v-chip   outlined color="blue-grey darken-2" @click="query('อื่นๆ')"><v-icon left>mdi-dots-horizontal</v-icon>  อื่นๆ </v-chip>
              </v-chip-group>
            </v-card-text>
            <v-card-title>กระทู้ทั้งหมด</v-card-title>
            <!-- <v-card-text>
              <v-app id="inspire">
                <v-combobox
                  v-model="chips"
                  :items="sortByItems"
                  chips
                  clearable
                  label="Your favorite hobbies"
                  multiple
                  prepend-icon="mdi-filter-variant"
                  solo
                >
            </v-card-text> -->
            <v-card-text>
              <div class="dataQuery">
                <v-text-field
                  placeholder="ค้นหา"
                  style="width: 60%;"
                  outlined
                  dense
                  prepend-inner-icon="mdi-magnify"
                  v-model="search"
                  clearable
                  @input="query()"
                />
                <v-select
                  class="mx-2"
                  :items="sortByItems"
                  label="เรียงลำดับ"
                  dense
                  outlined
                  v-model="sortBy"
                  @change="query()"
                />
                <v-select
                  style="width: 10%;"
                  :items="sortOrderItems"
                  label="เรียงลำดับ"
                  dense
                  outlined
                  v-model="sortOrder"
                  @change="query()"
                />
              </div>
              <v-simple-table>
                <thead>
                  <tr>
                    <th style="width: 30%;">เรื่อง</th>
                    <th style="width: 30%">วิชา</th>
                    <th style="width: 20%">หมวดหมู่</th>
                    <th style="width: 10%">ถูกใจ</th>
                    <th style="width: 15%;">เจ้าของกระทู้</th>
                    <th style="width: 5%">สร้างเมื่อ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(topic, index) in topics"
                    :key="index"
                    @click="$router.push(`/topic/${topic._id}`)"
                  >
                    <td>{{ topic.title }}</td>
                    <td>{{ topic.subject }}</td>
                    <td>{{topic.type}}</td>
                    <td>{{ topic.like.length }}</td>
                    <td>{{ topic.memberEmail }}</td>
                    <td>{{ formatDate(topic.createdAt) }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
              <div class="paginate">
                <div class="mr-5" style="width: 50px; margin-left: auto;">
                  <v-select
                    :items="[10, 30, 50]"
                    v-model="pageSize"
                    @change="query()"
                  ></v-select>
                </div>
                <v-pagination
                  class="my-2"
                  :length="totalPage"
                  v-model="currentPage"
                  @input="query()"
                ></v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import Axios from "axios";
import MenuBar from "./menu-bar.vue";
import moment from "moment";

export default {
  components: {
    MenuBar,
  },
  data() {
    return {
      email: sessionStorage.getItem("email"),
      topics: [],
      sortByItems: [
        { text: "เรื่อง", value: "title" },
        { text: "วิชา", value: "subject" },
        { text: "หมวดหมู่", value: "type" },
        { text: "ถูกใจ", value: "like" },
        { text: "วันที่โพส", value: "createdAt" },
      ],
      sortBy: "createdAt",
      sortOrderItems: [
        { text: "▲", value: -1 },
        { text: "▼", value: 1 },
      ],
      sortDiscover: [
        { text: "New Event", value: -1 },
        { text: "Popula", value: 1 },
        { text: "Online Event", value: 2 },
      ],
      sortOrder: -1,
      search: "",
      pageSize: 10,
      currentPage: 1,
      totalPage: 1,
      event: [],
      getUser: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
      getProfile : sessionStorage.getItem("profileUrl"),
      eventsFollowed: []
    };
  },
  created() {
    this.getTopics();
    this.getEvent3();
    this.getFollowedEvents()
  },
  methods: {
    async getTopics() {
      const { data: topicsResult } = await Axios({
        method: "GET",
        url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics?$sort[createdAt]=-1`,
      });
      this.topics = topicsResult.data;
      this.totalPage = Math.ceil(topicsResult.total / this.pageSize);
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    async query(filter) {
      const skip = (this.currentPage - 1) * this.pageSize
      if (!this.search) {
        this.search = ""
      }
      const search = `$or[0][title][$regex]=${this.search}&$or[1][subject][$regex]=${this.search}&$or[2][memberEmail][$regex]=${this.search}`
      filter = (filter) ? `type=${filter}` : ''
      const { data: topicsResult } = await Axios({
        method: "GET",
        url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics?$sort[${this.sortBy}]=${this.sortOrder}&${search}&$limit=${this.pageSize}&$skip=${skip}&${filter}`,
      });
      this.topics = topicsResult.data;
      this.totalPage = Math.ceil(topicsResult.total / this.pageSize);
    },
    async getEvent3() {
      const { data: { data: event } } = await Axios({
        method: "GET",
        url: `${process.env.VUE_APP_SERVER_BASE_URL}/events?endDate[$gte]=${moment().toString()}&$limit=3&$sort[totalFollowing]=-1`,
      })
      this.event = event
    },
    async getFollowedEvents() {
      const { data: { data: events } } = await Axios({
        method: 'GET',
        url: `${process.env.VUE_APP_SERVER_BASE_URL}/events?following=${sessionStorage.getItem('memberId')}&endDate[$gte]=${moment().toString()}&$sort[endDate]=1&$limit=3&$skip=0`
      })
      this.eventsFollowed = events
    },
    toCreateTopic() {
      this.$router.push({ name: 'createTopic' })
    },
  },
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .front {
    font-family: 'Athiti', sans-serif;
  }
  .v-card {
    max-width: 1000px;
  }
  .bodyy {
    display: flex;
    font-family: 'Athiti', sans-serif;
    color: #fff;
    background-image: url("https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/top-view-person-writing-laptop-with-copy-space.jpg?alt=media&token=d5ba4445-f44b-4562-a39f-08b616965a20");
    min-height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 0px 50px 0px 50px;
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
  .menu-bar {
    position: fixed;
  }
  .rounded-card {
    border-radius: 10px;
  }
  .bg{
    background-color: #fff;
    width: 100%;
    height: 100%;
  }
  .addTopic {
    display: flex;
    flex-direction: row-reverse;
  }
  .v-responsive__content {
    max-width: 100px;
  }
</style>
