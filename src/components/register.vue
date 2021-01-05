<template>
  <div class="container">
    <v-card class="mx-auto mt-3">
      <v-card-title>สมัครสมาชิก</v-card-title>
      <v-card-text>
        <v-text-field label="ชื่อ" :rules="[rules.require]" v-model="firstName" prepend-icon="mdi-account-circle" />
        <v-text-field label="นามสกุล" :rules="[rules.require]" v-model="lastName" prepend-icon="mdi-account-circle" />
        <v-text-field label="วันเกิด" v-model="birthday" @click="datePicker=true" prepend-icon="mdi-cake-variant" />
        <v-text-field label="มหาวิทยาลัย" v-model="university" prepend-icon="mdi-school" />
        <v-text-field label="คณะ" v-model="faculty" prepend-icon="mdi-city" />
        <v-text-field label="สาขา" v-model="department" prepend-icon="mdi-home-city" />
        <v-text-field label="อีเมล" :rules="[rules.require]" prepend-icon="mdi-email" v-model="email" />
        <v-text-field
          label="รหัสผ่าน"
          :rules="[rules.require, rules.min6]"
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          prepend-icon="mdi-key"
          @keypress.enter="register()"
        />
        <v-text-field
          label="ยืนยันรหัสผ่าน"
          :rules="[rules.require, rules.min6]"
          v-model="confirmPassword"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append="showConfirmPassword = !showConfirmPassword"
          prepend-icon="mdi-key"
          @keypress.enter="register()"
        />
        <v-file-input accept="image/*" placeholder="เลือกรูป" label="รูปโปรไฟล์" prepend-icon="mdi-camera" v-model="imageData" show-size="true">
        </v-file-input>
        <v-btn rounded class="px-15 mx-5" color="success" large @click="register()" :loading="loadStatus" :disabled="loadStatus" >ตกลง</v-btn>
        <v-btn rounded class="px-15" color="error" large @click="toLoginPage()">ยกเลิก</v-btn>
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
        datePicker: false,
        firstName: null,
        lastName: null,
        birthday: null,
        university: null,
        faculty: null,
        department: null,
        email: null,
        password: null,
        confirmPassword: null,
        rules: {
          require: value => !!value || 'จำเป็นต้องกรอกข้อมูล',
          min6: value => value.length >= 6 || 'ต้องมีความยาวอย่างน้อย 6 ตัว'
        },
        showPassword: false,
        showConfirmPassword: false,
        loadStatus: false,
        imageData: null
      }
    },
    methods: {
      toLoginPage() {
        this.$router.replace({ name: 'login' })
      },
      async register() {
        try {
          this.loadStatus = true
          if (this.firstName === null || this.lastName === null || this.birthday === null || this.email === null || this.password === null) {
            throw { message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }
          }
          if (this.password.length < 6) {
            throw { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัว' }
          }
          if (this.password !== this.confirmPassword) {
            throw { message: 'ยืนยันรหัสผ่านไม่ตรงกรุณาลองใหม่อีกครั้ง' }
          }
          const {data: memberData} = await axios({
            method: 'GET',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members?email=${this.email}`,
          })
          if (memberData.data[0]) {
            throw { messages: 'E-mail นี้ถูกใช้งานแล้ว' }
          }
          const firebaseResults = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          if (!firebaseResults) {
            throw { messages: 'การสร้างข้อมูลมีปัญหากรุณาลองใหม่อีกครั้ง' }
          }
          const memberPayload = {
            firstName: this.firstName,
            lastName: this.lastName,
            birthday: this.birthday,
            university: this.university,
            faculty: this.faculty,
            department: this.department,
            email: this.email,
          }
          if (this.imageData !== null) {
            const profileImageName = Date.now().toString()
            const imageRef = firebase.storage().ref(this.email).child('profile').child(profileImageName).put(this.imageData)
            const uploadComplete = await Promise.all([imageRef])
            if (uploadComplete) {
              memberPayload.profileUrl = await imageRef.snapshot.ref.getDownloadURL()
            }
          }
          const createdMember = await axios({
              method: 'POST',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/members`,
              data: memberPayload
          })
          if (!createdMember) {
            throw { messages: 'การสร้างข้อมูลมีปัญหากรุณาลองใหม่อีกครั้ง' }
          }
          this.$swal('สำเร็จ', 'คุณสมัครสมาชิกสำเร็จ', 'success')
          this.$router.replace({ name: 'login' })
        } catch (error) {
          const messages = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', messages, 'error')
          this.loadStatus = false
        }
      },
      setImageData(event) {
        this.imageData = event.target.file[0]
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