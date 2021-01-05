<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>แก้ไขโปรไฟล์</v-card-title>
        <v-card-text>
        <v-text-field label="อีเมล" :rules="[rules.require]" prepend-icon="mdi-email" v-model="profileData.email" @keypress.enter="register()" />
        <v-text-field label="ชื่อ" :rules="[rules.require]" v-model="profileData.firstName" prepend-icon="mdi-account-circle" @keypress.enter="register()" />
        <v-text-field label="นามสกุล" :rules="[rules.require]" v-model="profileData.lastName" prepend-icon="mdi-account-circle" @keypress.enter="register()" />
        <v-text-field label="วันเกิด" v-model="profileData.birthday" @click="datePicker=true" prepend-icon="mdi-cake-variant" @keypress.enter="register()" />
        <v-text-field label="มหาวิทยาลัย" v-model="profileData.university" prepend-icon="mdi-school" @keypress.enter="register()" />
        <v-text-field label="คณะ" v-model="profileData.faculty" prepend-icon="mdi-city" @keypress.enter="register()" />
        <v-text-field label="สาขา" v-model="profileData.department" prepend-icon="mdi-home-city" @keypress.enter="register()" />
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
  //import firebase from 'firebase'

  export default {
    components: {
      MenuBar,
    },
    data() {
      return {
        profileData: {},
        newPassword: null,
        confirmNewPassword: null,
        rules: {
          require: value => !!value || 'จำเป็นต้องกรอกข้อมูล',
          min6: value => value.length >= 6 || 'ต้องมีความยาวอย่างน้อย 6 ตัว'
        },
        loadStatus: false
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
          const updatedProfile = await Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`,
            data: this.profileData
          })
          if (!updatedProfile) {
            throw { messages: 'ไม่สามารถอัพเดตข้อมูลได้' }
          }
          this.loadStatus = false
          this.$swal('สำเร็จ', 'อัพเดตข้อมูลสำเร็จ', 'success')
        } catch (error) {
          const messages = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', messages, 'error')
          this.loadStatus = false
        }
      }
    },
    created () {
      this.getProfile()
    },
  }
</script>

<style scoped>
  .v-card {
    max-width: 800px;
  }
</style>