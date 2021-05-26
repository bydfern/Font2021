<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>แก้ไขโปรไฟล์</v-card-title>
        <v-card-text>
        <div>
          <img v-if="!imageStatus && newProfileUrl" :src="newProfileUrl" class="profile mx-8">
          <img v-if="!imageStatus && !newProfileUrl" :src="profileData.profileUrl" class="profile mx-8">
        </div>
        <v-btn class="mx-8 mb-3" v-if="!imageStatus" @click="imageStatus = !imageStatus">เปลี่ยนรูปโปรไฟล์</v-btn>
        <v-file-input v-if="imageStatus" accept="image/*" placeholder="เลือกรูป" label="รูปโปรไฟล์" prepend-icon="mdi-camera" v-model="imageData" show-size="true">
        </v-file-input>
        <v-btn v-if="imageStatus" class="mx-8 mb-3" @click="uploadImage()" :loading="loadImageStatus" :disabled="loadImageStatus" >อัพโหลด</v-btn>
        <v-text-field label="อีเมล" disabled :rules="[rules.require]" prepend-icon="mdi-email" v-model="profileData.email" @keypress.enter="register()" />
        <v-text-field label="ชื่อ" :rules="[rules.require]" v-model="profileData.firstName" prepend-icon="mdi-account-circle" @keypress.enter="register()" />
        <v-text-field label="นามสกุล" :rules="[rules.require]" v-model="profileData.lastName" prepend-icon="mdi-account-circle" @keypress.enter="register()" />
        <v-text-field label="วันเกิด" v-model="profileData.birthday" @click="datePicker=true" prepend-icon="mdi-cake-variant" @keypress.enter="register()" />
        <v-text-field label="มหาวิทยาลัย" v-model="profileData.university" prepend-icon="mdi-school" @keypress.enter="register()" />
        <v-text-field label="คณะ" v-model="profileData.faculty" prepend-icon="mdi-city" @keypress.enter="register()" />
        <v-text-field label="สาขา" v-model="profileData.department" prepend-icon="mdi-home-city" @keypress.enter="register()" />
        <v-btn class="mx-5 my-3" rounded color="primary" @click="changePassword()" >เปลี่ยนรหัสผ่าน</v-btn><br>
        <v-btn rounded class="px-15 mx-5 my-8" color="success" @click="save()" :loading="loadStatus" :disabled="loadStatus" >บันทึก</v-btn>
        <v-btn rounded class="px-15" color="error" @click="toHomePage()">กลับ</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import MenuBar from './menu-bar.vue'
  import firebase from 'firebase'

  export default {
    components: {
      MenuBar,
    },
    data() {
      return {
        profileData: {},
        newPassword: null,
        confirmNewPassword: null,
        imageStatus: false,
        imageData: null,
        newProfileUrl: null,
        rules: {
          require: value => !!value || 'จำเป็นต้องกรอกข้อมูล',
          min6: value => value.length >= 6 || 'ต้องมีความยาวอย่างน้อย 6 ตัว'
        },
        loadStatus: false,
        loadImageStatus: false
      }
    },
    methods: {
      async getProfile() {
        const { data: profileData } = await Axios({
          methods: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`
        })
        this.profileData = profileData
      },
      toHomePage() {
        this.$router.push({ name: 'home' })
      },
      async save() {
        try {
          this.loadStatus = true
          if (this.newProfileUrl) {
            this.profileData.profileUrl = this.newProfileUrl
          }
          const updatedProfile = await Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`,
            data: this.profileData
          })
          if (!updatedProfile) {
            throw { messages: 'ไม่สามารถอัพเดตข้อมูลได้' }
          }
          this.loadStatus = false
          sessionStorage.setItem('profileUrl', this.newProfileUrl)
          this.$swal('สำเร็จ', 'อัพเดตข้อมูลสำเร็จ', 'success')
        } catch (error) {
          const messages = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', messages, 'error')
          this.loadStatus = false
        }
      },
      async changePassword() {
        try {
          const result = await this.$swal({
            title: 'เปลี่ยนรหัสผ่าน',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            html:
              '<input id="password" class="swal2-input" type="password" placeholder="รหัสผ่านใหม่" >' +
              '<input id="rePassword" class="swal2-input" type="password" placeholder="รหัสผ่านใหม่อีกครั้ง" >',
            focusConfirm: true,
            preConfirm: () => {
              return [
                document.getElementById('password').value,
                document.getElementById('rePassword').value
              ]
            }
          })
          if (result.isConfirmed) {
            const { value: [newPassword, reNewPassword] } = result
            if (newPassword !== reNewPassword) {
              throw { messages: 'ยืนยันรหัสผ่านไม่ตรงกัน' }
            }
            if (newPassword.length < 6) {
              throw { message: 'รหัสผ่านน้อยกว่า 6 ตัว' }
            }
            try {
              const updatedPassword = firebase.auth().currentUser.updatePassword(newPassword)
              if (!updatedPassword) {
                throw { messgaes: 'กรุณาลองใหม่อีกครั้ง' }
              }
              this.$swal('สำเร็จ', 'เปลี่ยนรหัสผ่านสำเร็จ', 'success')
            } catch (error) {
              throw { messages: 'กรุณาลองใหม่อีกครั้ง' }
            }
          }
        } catch (error) {
          const messages = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', messages, 'error')
        }
      },
      async uploadImage() {
        try {
          this.loadImageStatus = true
          if (!this.imageData) {
            throw { messages: 'กรุณาเลือกรูป' }
          }
          const profileImageName = Date.now().toString()
          const imageRef = firebase.storage().ref(this.profileData.email).child('profile').child(profileImageName).put(this.imageData)
          const uploadComplete = await Promise.all([imageRef])
          if (uploadComplete) {
            this.newProfileUrl = await imageRef.snapshot.ref.getDownloadURL()
          }
          this.imageStatus = false
          this.loadImageStatus = false
        } catch (error) {
          const messages = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', messages, 'error')
        }
      }
    },
    created () {
      this.getProfile()
    },
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .front
  {
    font-family: 'Athiti', sans-serif;
  }

  .v-card {
    max-width: 800px;
  }
  .profile {
    max-width: 150px;
    max-height: 150px;
  }
</style>