<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container my-5">
      <h1>{{topic.title}}</h1>
      <h3>{{topic.subject}}</h3>
      <hr class="my-5">
      <div v-for="(item, index) in topic.content" :key="index">
        <p v-if="item.type == 'text'">{{item.value}}</p>
        <img v-if="item.type == 'image'" :src="item.value" width="100%;">
      </div>
      <hr class="my-5">
      <div class="profile">
        <div class="profile-image mx-3">
          <img :src="member.profileUrl" width="100%" height="100%">
        </div>
        <div class="profile-contact">
          <span>{{member.email}}</span>
          <hr>
          <span>{{member.firstName}} {{member.lastName}}</span>
        </div>
      </div>
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
        topic: {},
        member: {}
      }
    },
    created () {
      this.getTopicData()
    },
    methods: {
      async getTopicData() {
        try {
          const { data: topic } = await Axios({
            method: 'GET',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`
          })
          if (!topic) {
            throw { messages: 'ไม่พบกระทู้นี้' }
          }
          this.topic = topic
          const memberData = await this.getMember(topic.memberId)
          if (!memberData) {
            throw { messages: 'ไม่พบเจ้าของกระทู้' }
          }
          this.member = memberData
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.$router.push({ name: 'home' })
        }
      },
      async getMember(id) {
        const { data: member } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${id}`
        })

        return member
      }
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    max-width: 800px;
  }
  .profile {
    display: flex;
    flex-direction: row-reverse;
    height: 50px;
  }
  .profile-image {
    max-width: 50px;
    max-width: 50px;
  }
  .profile-contact {
    display: flex;
    flex-direction: column;
  }
</style>