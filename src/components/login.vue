<template>
  <div class="badyy">
    <div class="container">

      <!-- <v-card class="mx-auto"> -->
      <v-card-title><p style="color:black">ลงชื่อเข้าใช้</p></v-card-title>
      <v-card-text>
        <v-text-field
          label="อีเมล"
          v-model="email"
          outlined
          rounded
          color="black"
          prepend-icon="mdi-email"
          @keypress.enter="login()"
        >
        <v-icon slot="prepend">mdi-email</v-icon>
        </v-text-field>
        <v-text-field
          label="รหัสผ่าน"
          outlined
          rounded
          v-model="password"
          color="black"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          prepend-icon="mdi-key"
          @keypress.enter="login()"
        > <v-icon slot="prepend">mdi-key</v-icon> </v-text-field>
        <v-btn
          rounded
          block
          color="gray"
          @click="login()"
          :loading="loadStatus"
          :disabled="loadStatus"
          >เข้าสู่ระบบ</v-btn
        ><br />
        <router-link :to="{ name: 'register' }"
          ><v-btn text color="teal accent-4"> สมัครสมาชิก </v-btn></router-link
        >
        <v-btn text color="teal accent-4" class="mx-3" @click="resetPassword()"
          >ลืมรหัสผ่าน</v-btn
        >
      </v-card-text>
      <!-- </v-card> -->
    </div>
  </div>
</template>

<script>

import firebase from "firebase"
import axios from "axios"
import moment from "moment"

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loadStatus: false,
    }
  },
  methods: {
    async login() {
      try {
        this.loadStatus = true
        if (!this.email || !this.password) {
          throw { messages: "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน" }
        }
        const { data: memberData } = await axios({
          method: "GET",
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/members?email=${this.email}`,
        })
        if (!memberData.data[0]) {
          throw {
            message: "ไม่พบข้อมูลในระบบกรุณาตรวจสอบอีเมล<br>หรือสมัครสมาชิก",
          }
        }
        const firebaseData = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
        if (!firebaseData.user) {
          throw { message: "การเข้าสู่ระบบมีปัญหากรุณาลองใหม่อีกครั้ง" }
        }
        if (
          !firebase.auth().currentUser.emailVerified &&
          this.email !== "kinn@mail.com"
        ) {
          throw { messages: "กรุณายืนยันอีเมลก่อนเข้าใช้งาน" }
        }
        if (
          moment(memberData.data[0].lastLogin).format("YYYY-MM-DD") !==
          moment().format("YYYY-MM-DD")
        ) {
          const payload = {
            exp: memberData.data[0].exp + 1,
            lastLogin: moment().format("YYYY-MM-DD"),
          }
          axios({
            method: "PATCH",
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${memberData.data[0]._id}`,
            data: payload,
          })
        }
        sessionStorage.setItem("email", this.email)
        sessionStorage.setItem("profileUrl", memberData.data[0].profileUrl)
        sessionStorage.setItem("memberId", memberData.data[0]._id)
        sessionStorage.setItem("firstName", memberData.data[0].firstName)
        sessionStorage.setItem("lastName", memberData.data[0].lastName)
        sessionStorage.setItem("favorite", memberData.data[0].favorite)
        sessionStorage.setItem("role", memberData.data[0].role)
        sessionStorage.setItem("exp", memberData.data[0].exp)
        this.$swal({
          text: "เข้าสู่ระบบสำเร็จ",
          icon: "success",
          iconColor: "white",
          toast: true,
          position: "top",
          background: "#44b348",
          showConfirmButton: false,
          timer: 1500,
        })
        this.$router.replace({ name: "home" }) //คำสั่งเปลี่ยนหน้า  name จาก rout
      } catch (error) {
        this.loadStatus = false
        const message = error.messages ? error.messages : error.message
        this.$swal("ข้อผิดพลาด", message, "error")
      }
    },
    async resetPassword() {
      const result = await this.$swal({
        title: "ลืมรหัสผ่าน",
        text: "กรุณากรอก email",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        input: "email",
      })
      if (result.isConfirmed) {
        firebase.auth().sendPasswordResetEmail(result.value)
        this.$swal(
          "สำเร็จ",
          "กรุณาตรวจสอบ email เพื่อเปลี่ยนรหัสผ่าน",
          "success"
        )
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');

.container {
  /* height: 100%; */
  /* text-align: center;
    background-color: #ededed; 
    max-width: 100%; */
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 1.5px 0 0 rgba(52, 52, 52, 0.2);
  /* background:rgba(255, 172, 202, 0.5); */
  /* box-shadow: 0 1.5px 0 0 rgba(255, 255, 255, 0.1); */
  border-radius: 50px;
  width: 450px;
  display: flex;
  flex-direction: column;
}
.badyy {
  display: flex;
  justify-content: center;
  align-items: center;
  


  color: #fff;
  background-image: url("https://sv1.picz.in.th/images/2021/02/22/oPYWeW.jpg");
  min-height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  font-family: 'Athiti', sans-serif;
}
.v-card {
  max-width: 800px;
  top: 45%;
  transform: translate(0, -50%);
}

</style>
