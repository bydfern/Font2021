<template>
  <div>
    <v-app-bar dense dark>
      <img class="mx-3" src="../../public/book-icon.png" height="30px" width="30px">
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
          <v-list-item @click="removeMember()">ลบบัญชี</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase'
import Axios from 'axios'

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
      },
      async removeMember() {
        try {
          const { isConfirmed } = await this.$swal({
              title: 'ยืนยัน',
              text: 'คุณต้องการลบบัญชีผู้ใช้นี้หรือไม่',
              icon: 'warning',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'ลบ',
              cancelButtonText: 'ยกเลิก',
              confirmButtonColor: '#d14529'
            })
          if (isConfirmed) {
            const deletedMember = await Axios({
              method: 'DELETE',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`
            })
            if (!deletedMember) {
              throw { messages: 'ไม่สามารถลบบัญชีผู้ใช้ได้' }
            }
            await firebase.auth().currentUser.delete()
            this.$swal({
              text: 'ลบบัญชีสำเร็จ',
              icon: 'success',
              iconColor: 'white',
              toast: true,
              position: 'top',
              background: '#44b348',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.replace({ name: 'login' })
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
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