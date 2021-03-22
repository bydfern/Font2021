<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="container">

      <v-card class="mx-auto my-3">
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(topic, index) in topics" :key="index">
                <td @click="$router.push(`/topic/${topic._id}`)" >{{topic.title}}</td>
                <td @click="$router.push(`/topic/${topic._id}`)" >{{topic.subject}}</td>
                <td @click="$router.push(`/topic/${topic._id}`)" >{{topic.memberEmail}}</td>
                <td @click="$router.push(`/topic/${topic._id}`)" >{{formatDate(topic.createdAt)}}</td>
                <td @click="$router.push(`/topic/${topic._id}`)" >{{formatDate(topic.updatedAt)}}</td>
                <td class="actionBtn">
                  <v-icon @click="$router.push(`/edit-topic/${topic._id}`)" large medium color="#FBC02D">mdi-pencil-circle</v-icon>
                  <v-icon class="mx-1" large @click="removeTopic(topic._id, index)" medium color="red">mdi-delete-circle</v-icon>
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
      },
      async removeTopic(id, index) {
        try {
          const { isConfirmed } = await this.$swal({
            title: 'ยืนยัน',
            text: 'คุณต้องการลบกระทู้นี้หรือไม่',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#d14529'
          })
          if (isConfirmed) {
            const deletedTopic = await Axios({
              method: 'DELETE',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${id}`
            })
            if (!deletedTopic) {
              throw { messages: 'ลบกระทู้ไม่สำเร็จ' }
            }
            this.topics.splice(index, 1)
            this.$swal('สำเร็จ', 'สร้างกระทู้สำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      }
    },
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .v-card {
    max-width: 1200px;
  }
  .actionBtn {
    display: flex;
    flex-direction: row;
  }
  .front
  {
    font-family: 'Athiti', sans-serif;
  }
</style>