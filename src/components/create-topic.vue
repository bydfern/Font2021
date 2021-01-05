<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto">
        <v-card-title>สร้างกระทู้ของฉัน</v-card-title>
        <v-card-text>
          <v-text-field label="วิชา" v-model="subject" />
          <v-text-field label="หัวข้อ" v-model="title" />
          <div id="contain" v-for="(item, index) in content" :key="index">
              <v-textarea
                placeholder="ข้อความ"
                v-if="item.type == 'text'"
                v-model="content[index].value"
                :readonly="item.readonly"
                :filled="item.readonly"
                :clearable="item.readonly == false"
                solo
                auto-grow
                rows="2"
              >
              <v-icon @click="content[index].readonly = true"  slot="append" color="success" v-if="item.readonly == false">mdi-plus-circle</v-icon>
              <v-icon @click="content[index].readonly = false" slot="append" color="#FBC02D">mdi-pencil-circle</v-icon>
              <v-icon @click="content.splice(index, 1)" slot="append" color="red">mdi-minus-circle</v-icon>
              </v-textarea>
              <v-file-input
                accept="image/*"
                placeholder="เลือกรูป"
                label="รูปโปรไฟล์"
                v-model="item.imageData"
                show-size="true"
                v-if="item.type == 'image' && item.value == ''"
                :loading="item.loadStatus"
                :disabled="item.loadStatus"
              >
                <v-icon @click="saveImage(item, index)"  slot="append" color="success" :disabled="item.loadStatus">mdi-plus-circle</v-icon>
                <v-icon @click="content.splice(index, 1)" slot="append" color="red" :disabled="item.loadStatus">mdi-minus-circle</v-icon>
              </v-file-input>
              <div class="image">
                <v-img
                  v-if="item.type == 'image' && item.value != ''"
                  :src="item.value"
                  class="mx-auto my-1"
                  min-width="400px"
                  min-height="200px"
                  max-height="800px"
                  max-width="400px"
                  width="50%"
                  height="50%"
                  style="position: absouly;"
                >
                </v-img>
                <v-btn v-if="item.type == 'image' && item.value != ''" color="error" block @click="deleteImage(item, index)" class="mb-3">X</v-btn>
              </div>
          </div>
          <div style="width: 100%;">
            <v-icon @click="addTextContent()" color="blue">mdi-plus-circle</v-icon>
            <v-icon class="mx-3" @click="addImageContent()" color="blue">mdi-image-plus</v-icon>
          </div>
        </v-card-text>
        <v-card-actions style="width: 100%;">
          <v-btn color="error" class="mx-3" @click="cancel()" :disabled="loadStatus">ยกเลิก</v-btn>
          <v-btn color="success" @click="save()" :loading="loadStatus" :disabled="loadStatus" >บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
  import menuBar from './menu-bar.vue'
  import firebase from 'firebase'
  import Axios from 'axios'

  export default {
    components: {
      menuBar,
    },
    data() {
      return {
        email: sessionStorage.getItem('email'),
        title: '',
        subject: '',
        content: [],
        loadStatus: false
      }
    },
    methods: {
      addTextContent() {
        this.content.push({
          type: 'text',
          value: '',
          readonly: false
        })
      },
      addImageContent() {
        this.content.push({
          type: 'image',
          value: '',
          name: Date.now().toString(),
          imageData: null,
          loadStatus: false
        })
      },
      async saveImage(item, index) {
        this.content[index].loadStatus = true
        const imageRef = firebase.storage().ref(this.email).child('topic').child(item.name).put(item.imageData)
        const uploadComplete = await Promise.all([imageRef])
        if (uploadComplete) {
          this.content[index].value = await imageRef.snapshot.ref.getDownloadURL()
          this.loadStatus = false
          delete this.content[index].imageData
          delete this.content[index].loadStatus
        }
      },
      async deleteImage(item, index) {
        console.log(index)
        this.content.splice(index, 1)
        firebase.storage().ref(this.email).child('topic').child(item.name).delete()
      },
      cancel() {
        for (let i = 0; i < this.content.length; i++) {
          if (this.content[i].type == 'image') {
            firebase.storage().ref(this.email).child('topic').child(this.content[i].name).delete()
          }
        }
        this.$router.push({ name: 'home' })
      },
      async save() {
        try {
          if (this.title == '' || this.subject == null || this.content.length == 0) {
            throw { messages: 'กรุณากรอกข้อมูลให้ครบถ้วน' }
          }
          const payload = {
            memberId: sessionStorage.getItem('memberId'),
            memberEmail: this.email,
            title: this.title,
            subject: this.subject,
            content: this.content
          }
          const result = await Axios({
            method: 'POST',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics`,
            data: payload
          })
          if (!result) {
            throw { messages: 'มีปัญหาขณะบันทึกข้อมูลกรุณาลองใหม่อีกครั้ง' }
          }
          this.$swal('สำเร็จ', 'สร้างกระทู้สำเร็จ', 'success')
          this.$router.push({ name: 'home' })
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      }
    },
  }
</script>

<style scoped>
  .v-card {
    max-width: 1000px;
  }
  .v-card__actions {
    flex-direction: row-reverse;
  }
</style>