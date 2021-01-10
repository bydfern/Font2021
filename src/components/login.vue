<template>
  <div class="container">
    <v-card class="mx-auto">
      <v-card-title>ลงชื่อเข้าใช้</v-card-title>
      <v-card-text>
        <v-text-field label="อีเมล" v-model="email" outlined rounded prepend-icon="mdi-email" @keypress.enter="login()" />
        <v-text-field
          label="รหัสผ่าน"
          outlined
          rounded
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          prepend-icon="mdi-key"
          @keypress.enter="login()"
        />
        <v-btn rounded block color="success" @click="login()" :loading="loadStatus" :disabled="loadStatus" >เข้าสู่ระบบ</v-btn><br>
        <router-link :to="{ name: 'register' }">สมัครสมาชิก</router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import axios from 'axios'

  export default {
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
        loadStatus: false
      }
    },
    methods: {
      async login() {
        try {
          this.loadStatus = true
          if (!this.email || !this.password) {
            throw { messages: 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน' }
          }
          const { data: memberData } = await axios({
            method: 'GET',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members?email=${this.email}`
          })
          if (!memberData.data[0]) {
            throw { message: 'ไม่พบข้อมูลในระบบกรุณาตรวจสอบอีเมล<br>หรือสมัครสมาชิก' }
          }
          const firebaseData = await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          if (!firebaseData.user) {
            throw { message: 'การเข้าสู่ระบบมีปัญหากรุณาลองใหม่อีกครั้ง' }
          }
          sessionStorage.setItem('email', this.email)
          sessionStorage.setItem('profileUrl', memberData.data[0].profileUrl)
          sessionStorage.setItem('memberId', memberData.data[0]._id)
          sessionStorage.setItem('firstName', memberData.data[0].firstName)
          sessionStorage.setItem('lastName', memberData.data[0].lastName)
          this.$swal({
            text: 'เข้าสู่ระบบสำเร็จ',
            icon: 'success',
            iconColor: 'white',
            toast: true,
            position: 'top',
            background: '#44b348',
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.replace({ name: 'home' })
        } catch (error) {
          this.loadStatus = false
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      }
    },
  }
</script>

<style scoped>
  .container {
    height: 100%;
    text-align: center;
    background-color: #ededed;
    max-width: 100%;
  }

  .v-card {
    max-width: 800px;
    top: 45%;
    transform: translate(0, -50%);
  }
</style>