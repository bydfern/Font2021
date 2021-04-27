<template>
    <div class="container front">
      <v-card class="mx-auto mt-3">
        <v-card-title>สมัครสมาชิก</v-card-title>
        <v-card-text>
          <v-text-field label="ชื่อ*" :rules="[rules.require]" v-model="firstName" prepend-icon="mdi-account-circle" />
          <v-text-field label="นามสกุล*" :rules="[rules.require]" v-model="lastName" prepend-icon="mdi-account-circle" />
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="birthday"
                label="วันเกิด"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="birthday"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>
          <!-- <v-text-field label="วันเกิด" v-model="birthday" @click="datePicker=true" prepend-icon="mdi-cake-variant" /> -->
          <v-text-field label="มหาวิทยาลัย" v-model="university" prepend-icon="mdi-school" />
          <v-text-field label="คณะ" v-model="faculty" prepend-icon="mdi-city" />
          <v-text-field label="สาขา" v-model="department" prepend-icon="mdi-home-city" />
          <v-text-field label="อีเมล*" :rules="[rules.require]" prepend-icon="mdi-email" v-model="email" />
          <v-text-field
            label="รหัสผ่าน*"
            :rules="[rules.require, rules.min6]"
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            prepend-icon="mdi-key"
            @keypress.enter="register()"
          />
          <v-text-field
            label="ยืนยันรหัสผ่าน*"
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
        date: null,
        menu: false,
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
        imageData: null,
        showBirthday: false
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
          firebase.auth().currentUser.sendEmailVerification()
          const memberPayload = {
            firstName: this.firstName,
            lastName: this.lastName,
            birthday: this.birthday,
            university: this.university,
            faculty: this.faculty,
            department: this.department,
            email: this.email,
            profileUrl: 'https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/public%2Fphoto_2021-01-22_20-13-35.jpg?alt=media&token=1be8c3d8-31fc-4c94-9562-b97e7cedf1a2'
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
          this.$swal('สำเร็จ', 'กรุณาตรวจสอบอีเมลเพื่อยืนยัน', 'success')
          this.$router.replace({ name: 'login' })
        } catch (error) {
          const messages = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', messages, 'error')
          this.loadStatus = false
        }
      },
      setImageData(event) {
        this.imageData = event.target.file[0]
      },
      save (date) {
        this.$refs.menu.save(date)
      },
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
  }
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .container {
    padding-top: 80px;
    height: 100%;
    width: 800px;
    max-width: 80%;
    text-align: center;
    bottom: 20%;
  }

  

  .bodyy {
    padding-top: 80px;
    display: flex;
    font-family: "lato", sans-serif;
    color: #fff;
    font-family: 'Athiti', sans-serif;
    padding: 0px 50px 0px 50px;
  }

@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  
  .front
  {
    font-family: 'Athiti', sans-serif;
  }
  

</style>