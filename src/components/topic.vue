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
      <hr class="my-5">
      <h2 class="my-3">แสดงความคิดเห็น</h2>
      <div class="comment my-5">
        <div class="profile-image">
          <img :src="profileUrl" width="100%" height="auto">
        </div>
        <div class="message mx-3">
          <v-textarea
            placeholder="ข้อความ"
            v-model="comment"
            clearable
            solo
            auto-grow
            rows="5"
            @keydown.enter="saveComment()"
          >
          <v-icon @click="saveComment()" slot="append" color="success">mdi-plus-circle</v-icon>
          </v-textarea>
        </div>
      </div>
      <div>
        <h2 class="my-3">ความคิดเห็น</h2>
        <span class="mx-3" v-if="topic.comments.length == 0" >ไม่มีความคิดเห็นตอนนี้</span>
        <div v-for="(comment, index) in topic.comments" :key="index">
          <div class="comment">
            <div class="profile-image my-1">
              <img :src="comment.imageUrl" width="100%" height="auto">
            </div>
            <div class="message mx-3">
              <span><b>{{comment.name}}</b></span>
              <v-textarea
                v-model="comment.message"
                solo
                auto-grow
                readonly
                rows="2"
              >
              </v-textarea>
            </div>
          </div>
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
        member: {},
        profileUrl: sessionStorage.getItem('profileUrl'),
        comment: null
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
      },
      async saveComment() {
        try {
          const { comments } = this.topic
          const commentPayload = {
            name: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
            email: sessionStorage.getItem('email'),
            imageUrl: sessionStorage.getItem('profileUrl'),
            message: this.comment
          }
          comments.push(commentPayload)
          const updatedComment = await Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`,
            data: { comments }
          })
          if (!updatedComment) {
            throw { messages: 'ไม่สามารถเพิ่มความคิดเห็นได้กรุณาลองใหม่อีกครั้ง' }
          }
          this.comment = null
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
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
  .comment {
    display: flex;
    flex-direction: row;
  }
  .message {
    width: 100%;
    max-width: 100%;
  }
</style>