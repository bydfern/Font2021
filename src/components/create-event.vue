<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>สร้างกิจกรรม</v-card-title>
        <v-card-text>
          <v-text-field label="ชื่อกิจกรรม*" v-model="name" />
          <v-textarea
            placeholder="รายละเอียด"
            clearable
            solo
            auto-grow
            rows="4"
            v-model="detail"
          />
          <v-select
            :items="typeEventItem"
            item-value="value"
            v-model="typeEvent"
          />
          <v-text-field label="สถานที่*" v-if="!typeEvent" v-model="location"></v-text-field>
          <v-row>
            <v-cal cols="3">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="วันที่เริ่ม"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-cal>
            <v-cal cols="3">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="วันที่จบ"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-cal>
          </v-row>
          <!-- <v-date-picker v-model="startDate" />
          <v-date-picker class="mx-5" v-model="endDate" /> -->
          <v-text-field label="จำนวนคนที่รับ" v-model="totalRegister"></v-text-field>
          <v-select
            label="อันดับขั้นต่ำที่เข้าร่วมได้"
            :items="ranksItem"
            item-value="value"
            v-model="allowRank"
          />
          <v-file-input
            accept="image/*"
            placeholder="เลือกรูปโปสเตอร์"
            label="รูปภาพ"
            v-model="imageData"
            show-size="true"
            v-if="!posterData.posterUrl"
            :loading="loadPoster"
            :disabled="loadPoster"
          >
            <v-icon @click="savePoster()" slot="append" color="success" :disabled="loadPoster">mdi-plus-circle</v-icon>
          </v-file-input>
          <div>
            <center>
              <img :src="posterData.posterUrl" v-if="posterData.posterUrl" width="250px" height="500px">
            </center>
          </div>
          <v-btn v-if="posterData.posterUrl" color="error" block @click="deletePoster()" class="mb-3">X</v-btn>
          <v-file-input
            accept="image/*"
            placeholder="เลือกรูปปก"
            label="รูปภาพ"
            v-model="imageCoverData"
            show-size="true"
            v-if="!coverData.coverUrl"
            :loading="loadCover"
            :disabled="loadCover"
          >
            <v-icon @click="saveCover()" slot="append" color="success" :disabled="loadCover">mdi-plus-circle</v-icon>
          </v-file-input>
          <div>
            <center>
              <img :src="coverData.coverUrl" v-if="coverData.coverUrl" width="500px" height="250px">
            </center>
          </div>
          <v-btn v-if="coverData.coverUrl" color="error" block @click="deleteCover()" class="mb-3">X</v-btn>
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
              label="รูปภาพ"
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
            <v-file-input
              placeholder="เลือกไฟล์"
              label="ไฟล์แนบ"
              v-model="item.fileData"
              show-size="true"
              v-if="item.type == 'file' && item.value == ''"
              :loading="item.loadStatus"
              :disabled="item.loadStatus"
            >
              <v-icon @click="saveFile(item, index)"  slot="append" color="success" :disabled="item.loadStatus">mdi-plus-circle</v-icon>
              <v-icon @click="content.splice(index, 1)" slot="append" color="red" :disabled="item.loadStatus">mdi-minus-circle</v-icon>
            </v-file-input>
            <div class="file">
              <v-icon class="mx-1 my-2" v-if="item.type == 'file' && item.value != ''">mdi-file-document-outline</v-icon>
              <a v-if="item.type == 'file' && item.value != ''" :href="item.value">{{item.name}}</a>
              <v-btn v-if="item.type == 'file' && item.value != ''" color="error" x-small @click="deleteFile(item, index)" class="my-2 mx-2">X</v-btn>
            </div>
          </div>
          <div class="my-3" style="width: 100%;">
            <v-icon @click="addTextContent()" color="blue">mdi-plus-circle</v-icon>
            <v-icon class="mx-3" @click="addImageContent()" color="blue">mdi-image-plus</v-icon>
            <v-icon @click="addFileContent()" color="blue">mdi-file-plus</v-icon>
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
  import menuBar from './menu-bar'
  import moment from 'moment'
  import firebase from 'firebase'
  import Axios from 'axios'
  import Helper from '../helper/helper'

  export default {
    components: {
      menuBar,
    },
    data() {
      return {
        helper: new Helper(),
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        menu2: false,
        name: '',
        detail: '',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        imageData: null,
        imageCoverData: null,
        loadPoster: false,
        loadCover: false,
        content: [],
        posterData: {
          posterUrl: '',
          posterName: ''
        },
        coverData: {
          coverUrl: '',
          coverName: ''
        },
        typeEvent: 0,
        location: '',
        typeEventItem: [
          { text: 'นอกสถานที่', value: 0 },
          { text: 'ออนไลน์', value: 1 }
        ],
        ranksItem: [
          { text: 'นักเรียนใหม่', value: 0 },
          { text: 'รุ่นพี่', value: 600 },
          { text: 'ครูฝึกสอน', value: 1500 },
          { text: 'อาจารย์', value: 3000 },
          { text: 'ศาสตราจารย์', value: 5000 },
          { text: 'อธิการบดี', value: 150000 },
        ],
        allowRank: 0,
        email: sessionStorage.getItem('email'),
        totalRegister: 20
      }
    },
    created () {
      this.filterRank()
    },
    methods: {
      filterRank() {
        const myRank = this.helper.showRank(Number(sessionStorage.getItem('exp')))
        const rankIndex = this.ranksItem.findIndex(item => item.text === myRank)
        this.ranksItem = this.ranksItem.slice(0, rankIndex+1)
      },
      async savePoster() {
        this.loadPoster = true
        const name = Date.now().toString()
        const imageRef = firebase.storage().ref(this.email).child('event').child(name).put(this.imageData)
        const uploadComplete = await Promise.all([imageRef])
        if (uploadComplete) {
          this.posterData.posterUrl = await imageRef.snapshot.ref.getDownloadURL()
          this.posterData.posterName = name
          this.loadStatus = false
          this.imageData = null
          this.loadPoster = false
        }
      },
      async saveCover() {
        this.loadCover = true
        const name = Date.now().toString()
        const imageRef = firebase.storage().ref(this.email).child('event').child(name).put(this.imageCoverData)
        const uploadComplete = await Promise.all([imageRef])
        if (uploadComplete) {
          this.coverData.coverUrl = await imageRef.snapshot.ref.getDownloadURL()
          this.coverData.coverName = name
          this.loadStatus = false
          this.imageCoverData = null
          this.loadCover = false
        }
      },
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
      addFileContent() {
        this.content.push({
          type: 'file',
          value: '',
          name: Date.now().toString(),
          fileData: null,
          loadStatus: false
        })
      },
      async saveImage(item, index) {
        this.content[index].loadStatus = true
        const imageRef = firebase.storage().ref(this.email).child('event').child(item.name).put(item.imageData)
        const uploadComplete = await Promise.all([imageRef])
        if (uploadComplete) {
          this.content[index].value = await imageRef.snapshot.ref.getDownloadURL()
          this.loadStatus = false
          delete this.content[index].imageData
          delete this.content[index].loadStatus
        }
      },
      async saveFile(item, index) {
        item.name = item.fileData.name
        this.content[index].loadStatus = true
        const fileRef = firebase.storage().ref(this.email).child('event').child(`${item.name}`).put(item.fileData)
        const uploadComplete = await Promise.all([fileRef])
        if (uploadComplete) {
          this.content[index].value = await fileRef.snapshot.ref.getDownloadURL()
          this.loadStatus = false
          delete this.content[index].imageData
          delete this.content[index].loadStatus
        }
      },
      async deleteImage(item, index) {
        this.content.splice(index, 1)
        firebase.storage().ref(this.email).child('event').child(item.name).delete()
      },
      async deleteFile(item, index) {
        this.content.splice(index, 1)
        firebase.storage().ref(this.email).child('event').child(item.name).delete()
      },
      async deletePoster() {
        if (this.posterData.posterName !== 'default') {
          firebase.storage().ref(this.email).child('event').child(this.posterData.posterName).delete()
        }
        this.posterData = {
          posterUrl: '',
          posterName: ''
        }
      },
      async deleteCover() {
        if (this.coverData.coverName !== 'default') {
          firebase.storage().ref(this.email).child('event').child(this.posterData.posterName).delete()
        }
        this.coverData = {
          coverUrl: '',
          coverName: ''
        }
      },
      cancel() {
        for (let i = 0; i < this.content.length; i++) {
          if (this.content[i].type == 'image') {
            firebase.storage().ref(this.email).child('event').child(this.content[i].name).delete()
          }
        }
        this.$router.push({ name: 'event' })
      },
      async save() {
        try {
          if (!this.name || (!this.typeEvent && !this.location)) {
            throw { messages: 'กรุณากรอกข้อมูลให้ครบ' }
          }
          if (this.startDate > this.endDate) {
            throw { messages: 'วันที่เริ่มต้องน้อยกว่าวันสิ้นสุด' }
          }
          if (!this.posterData.posterUrl) {
            this.posterData.posterUrl = 'https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/NEW%20EVENT%20(1).png?alt=media&token=ec2eea93-1d9c-4e87-8c7f-f9e22dfab062'
            this.posterData.posterName = 'default'
          }
          if (!this.coverData.coverUrl) {
            this.coverData.coverUrl = 'https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/New%20Event!%20(1).png?alt=media&token=aa9add48-2024-4be3-a242-aac35535f529'
            this.coverData.coverName = 'default'
          }
          const payload = {
            name: this.name,
            detail: this.detail,
            typeEvent: this.typeEvent,
            location: this.location,
            startDate: this.startDate,
            endDate: this.endDate,
            posterUrl: this.posterData.posterUrl,
            posterName: this.posterData.posterName,
            coverUrl: this.coverData.coverUrl,
            coverName: this.coverData.coverName,
            contents: this.content,
            memberId: sessionStorage.getItem('memberId'),
            totalRegister: this.totalRegister,
            allowRank: this.allowRank
          }
          const result = await Axios({
            method: 'POST',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/events`,
            data: payload
          })
          if (!result) {
            throw { messages: 'สร้างกิจกรรมผิดพลาด' }
          }
          const exp = Number(sessionStorage.getItem('exp')) + 5
          sessionStorage.setItem('exp', exp)
          Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`,
            data: { exp }
          })
          this.$swal('สำเร็จ', 'สร้างกิจกรรม +5 exp', 'success')
          this.$router.push({ name: 'allEvent' })
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      }
    }
  }
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .front
  {
    font-family: 'Athiti', sans-serif;
  }
  .v-card {
    max-width: 1000px;
  }
  .v-card__actions {
    flex-direction: row-reverse;
  }
  .image {
    width: 100%;
  }
</style>