<template>
  <div class = "front">
    <v-app-bar>
      <img class="mx-3" src="../../public/book-icon.png" height="30px" width="30px">
      <v-toolbar-title>Education space</v-toolbar-title>
      <v-spacer/>
      <div class="profile" @click="toMyprofile()">
        <img :src="profileUrl" width="40px;" height="40px;">
        <p class="my-auto mx-3">{{email}}</p>
      </div>
      <!-- <div class="vl mx-2"></div> -->
      <v-btn text @click="toHome()">หน้าหลัก</v-btn>
      <v-btn text @click="toEvent()">กิจกรรม</v-btn>
      <v-btn text @click="logout()">ออกจากระบบ</v-btn>
      <v-btn text v-if="role === 'admin'" @click="toReport()">จัดการรายงาน</v-btn>
      <!-- <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </template>
        <v-list> 
          <div class="front">
            <v-list-item @click="logout()">ออกจากระบบ</v-list-item>
            <v-list-item v-if="role === 'admin'" @click="toReport()">จัดการรายงาน</v-list-item>
          </div>
        </v-list>
      </v-menu> -->
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        email: sessionStorage.getItem('email'),
        profileUrl: sessionStorage.getItem('profileUrl'),
        role: sessionStorage.getItem('role')
      }
    },
    methods: {
      async logout() {
        try {
          const { isConfirmed } = await this.$swal({
              title: 'ยืนยัน',
              text: 'ต้องการออกจากระบบใช่หรอไม่',
              icon: 'warning',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'ออกจากระบบ',
              cancelButtonText: 'ยกเลิก',
              confirmButtonColor: '#d14529'
            })
          if (isConfirmed) {
            firebase.auth().signOut()
            sessionStorage.clear()
            this.$router.replace({ name: 'login' })
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      toHome() {
        this.$router.push({ name: 'home' })
      },
      toMyprofile() {
        this.$router.push(`/profile/${sessionStorage.getItem('memberId')}`)
      },
      toReport() {
        this.$router.push({ name: 'report' })
      },
      toEvent() {
        this.$router.push({ name: 'allEvent' })
      }
    },
  }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .vl {
    border-left: 2px solid whitesmoke;
    height: 40px;
  }
  .front {
    font-family: 'Athiti', sans-serif;
  }
  .profile {
    display: flex;
    flex-direction: row;
  }
  .profile:hover {
    cursor: pointer;
    background-color: #ececec;
  }
</style>