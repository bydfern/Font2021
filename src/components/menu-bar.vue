<template>
  <div>
    <v-app-bar dense dark>
      <v-toolbar-title>Education space</v-toolbar-title>
      <v-spacer/>
      <img :src="profileUrl" width="40px;" height="40px;">
      <p class="my-auto mx-3">{{email}}</p>
      <div class="vl mx-2"></div>
      <v-btn @click="toHome()">หน้าหลัก</v-btn>
      <v-btn @click="toCreateTopic()">สร้างกระทู้</v-btn>
      <v-btn @click="toMyTopic()">กระทู้ของฉัน</v-btn>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout()">ออกจากระบบ</v-list-item>
          <v-list-item @click="toEditProfile()">แก้ไขข้อมูลส่วนตัว</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        email: sessionStorage.getItem('email'),
        profileUrl: sessionStorage.getItem('profileUrl')
      }
    },
    methods: {
      async logout() {
        try {
          firebase.auth().signOut()
          sessionStorage.clear()
          this.$router.replace({ name: 'login' })
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      toHome() {
        this.$router.push({ name: 'home' })
      },
      toCreateTopic() {
        this.$router.push({ name: 'createTopic' })
      },
      toMyTopic() {
        this.$router.push({ name: 'myTopic' })
      },
      toEditProfile() {
        this.$router.push({ name: 'editProfile' })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .vl {
    border-left: 2px solid whitesmoke;
    height: 40px;
  }
</style>