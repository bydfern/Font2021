<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="container">
      <v-card class="mx-auto my-3">
        <v-card-title>สร้างกระทู้ของฉัน</v-card-title>
        <v-card-text>
          <v-text-field label="วิชา" v-model="subject" />
          <v-text-field label="หัวข้อ" v-model="title" />
          <v-select
            class="my-3"
            :items="typeItem"
            label="หมวดหมู่กระทู้"
            dense
            v-model="selectedType"
          />
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
            <div v-if="item.type === 'poll'" class="poll">
              <h4>โพลล์</h4>
              <v-textarea
                placeholder="คำถาม"
                v-model="content[index].question"
                clearable
                auto-grow
                rows="1"
              />
              <div class="answers" v-for="(answer, i) in item.answers" :key="i">
                <v-text-field class="mt-0 pt-0" v-model="content[index].answers[i].text">
                  <v-icon slot="prepend" color="error" @click="content[index].answers.splice(i, 1)">mdi-minus-circle</v-icon>
                </v-text-field>
              </div>
              <div class="mb-5">
                <v-btn class="mx-3" small color="success" @click="addAnswer(index)">เพิ่มคำตอบ</v-btn>
                <v-btn small color="error" @click="content.splice(index, 1)">ลบโพลล์</v-btn>
              </div>
            </div>
          </div>
          <div style="width: 100%;">
            <v-icon @click="addTextContent()" color="blue">mdi-plus-circle</v-icon>
            <v-icon class="mx-3" @click="addImageContent()" color="blue">mdi-image-plus</v-icon>
            <v-icon @click="addFileContent()" color="blue">mdi-file-plus</v-icon>
            <v-icon @click="addPollContent()" class="ml-3" color="blue">mdi-poll-box</v-icon>
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
        loadStatus: false,
        selectedType: 'อื่นๆ',
        typeItem: [
          { text: 'สุขภาพ' },
          { text: 'ศิลปะ' },
          { text: 'เทคโนโลยี' },
          { text: 'วิทยาศาสตร์' },
          { text: 'คณิตศาสตร์' },
          { text: 'สังคม' },
          { text: 'เศรษฐศาสตร์' },
          { text: 'ภาษา' },
          { text: 'แฟชั่น' },
          { text: 'อื่นๆ' }
        ]
      }
    },
    async created () {
      await this.getTopic()
    },
    methods: {
      async getTopic() {
        try {
          const { data: topicData} = await Axios({
            method: 'GET',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`
          })
          if (!topicData) {
            throw { messages: 'ไม่พบกระทู้นี้' }
          }
          this.title = topicData.title
          this.subject = topicData.subject
          this.content = topicData.content
          this.selectedType = topicData.type
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.$router.push({ name: 'myTopic' })
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
      addPollContent() {
        this.content.push({
          type: 'poll',
          question: 'คำถาม',
          answers: [
            { text: 'คำตอบ', answered: [] }
          ]
        })
      },
      addAnswer(index) {
        this.content[index].answers.push({ text: 'คำตอบ', answered: [] })
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
      async saveFile(item, index) {
        item.name = item.fileData.name
        this.content[index].loadStatus = true
        const fileRef = firebase.storage().ref(this.email).child('topic').child(`${item.name}`).put(item.fileData)
        const uploadComplete = await Promise.all([fileRef])
        if (uploadComplete) {
          this.content[index].value = await fileRef.snapshot.ref.getDownloadURL()
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
      async deleteFile(item, index) {
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
            content: this.content,
            type: this.selectedType
          }
          const result = await Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`,
            data: payload
          })
          if (!result) {
            throw { messages: 'มีปัญหาขณะบันทึกข้อมูลกรุณาลองใหม่อีกครั้ง' }
          }
          this.$swal('สำเร็จ', 'แก้ไขกระทู้สำเร็จ', 'success')
          this.$router.go(-1)
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      }
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
    max-width: 1000px;
  }
  .v-card__actions {
    flex-direction: row-reverse;
  }
  .answers {
    display: flex;
    flex-direction: row;
  }
</style>