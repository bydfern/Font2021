<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="container">
      <div class="title_1">
        <div class="poster">
          <img :src="event.posterUrl" width="200" height="250px">
        </div>
        <div class="datail mx-5">
          <h3>{{event.name}}</h3>
          <span class="mt-3">{{event.detail}}</span>
          <span>วันที่ {{formatDate(event.startDate)}} ถึง {{formatDate(event.endDate)}}</span>
          <span>จำนวนผู้ติดตาม: {{event.following.length}}</span>
          <span>จำนวนผู้เข้าร่วม: {{totalAccept}} / {{event.totalRegister}}</span>
          <v-btn
              color="primary"
              icon
              v-if="!isFollowed" @click="follow()"
            >
              <v-icon>
                mdi mdi-account-multiple-plus
              </v-icon>
          </v-btn>

          <v-btn
              icon
              color="red"
              v-if="isFollowed" @click="follow()"
          >
            <v-icon>
              mdi mdi-account-minus-outline
            </v-icon> 
          </v-btn>
        </div>
      </div>
      <hr class="my-5">
      <div v-for="(item, index) in event.contents" :key="index">
        <p v-if="item.type == 'text'">{{item.value}}</p>
        <img v-if="item.type == 'image'" :src="item.value" width="100%;">
        <v-icon v-if="item.type == 'file'">mdi-file-document-outline</v-icon><a v-if="item.type == 'file'" :href="item.value">{{item.name}}</a>
      </div>
      <div v-if="!myEvent" class="getTicket mt-8">
        <v-btn v-if="statusRegister === 1" disabled rounded>สมัครเข้าร่วมแล้ว</v-btn>
        <v-btn v-else-if="totalAccept == event.totalRegister" disabled rounded>เต็มแล้ว</v-btn>
        <v-btn v-else-if="statusRegister === -1 || statusRegister === 0" rounded color="success" @click="registerEvent()">สมัครเข้าร่วม</v-btn>
        <v-btn v-else-if="statusRegister === 2" color="#FFE12B" rounded @click="cancelRegister()">กำลังรออนุมัติ</v-btn>
      </div>
      <h2 class="my-3">แสดงความคิดเห็น</h2>
      <div class="comment my-5">
        <div class="profile-image">
          <img :src="profileUrl" width="100%" height="auto">
        </div>
        <div class="message mx-3">
          <v-textarea
            placeholder="ข้อความ"
            v-model="comment"
            clearable
            solo
            auto-grow
            rows="5"
            @keydown.enter="saveComment()"
          >
            <v-icon @click="saveComment()" slot="append" color="success" :disabled="loadSaveCommentStatus" >mdi-plus-circle</v-icon>
          </v-textarea>
          <div class="filePreview" v-for="(attr, index) in attachment" :key="index">
            <img v-if="attr.type === 'image'" :src="attr.imageUrl" class="imageComment">
            <v-icon v-if="attr.type == 'file'">mdi-file-document-outline</v-icon><a v-if="attr.type === 'file'" :href="attr.fileUrl">{{attr.name}}</a>
            <v-btn color="error" block @click="deleteAttachment(attr, index)" class="mb-3">X</v-btn>
          </div>
          <div class="actionBtn">
            <v-file-input
              accept="image/*"
              show-size="true"
              prepend-icon="mdi-image-plus"
              multiple
              v-model="images"
              @change="uploadImage()"
            />
            <v-file-input
              accept="*"
              show-size="true"
              prepend-icon="mdi-file-plus"
              class="mx-8"
              multiple
              v-model="files"
              @change="uploadFile()"
            />
          </div>
        </div>
      </div>
      <div>
        <h2 class="my-3">ความคิดเห็น</h2>
        <span class="mx-3" v-if="event.comments.length == 0" >ไม่มีความคิดเห็นตอนนี้</span>
        <div v-for="(comment, index) in event.comments" :key="index">
          <div class="comment">
            <div class="profile-image my-1">
              <img :src="comment.imageUrl" width="100%" height="auto">
            </div>
            <div class="message mx-3">
              <span><b>{{comment.name}}</b></span>
              <span class="mx-2">{{comment.rank}}</span>
              <v-textarea
                v-model="comment.message"
                solo
                auto-grow
                readonly
                rows="2"
              >
              </v-textarea>
              <div v-for="(attr, index) in comment.attachment" :key="index">
                <img v-if="attr.type === 'image'" :src="attr.imageUrl" class="imageComment">
                <v-icon v-if="attr.type == 'file'">mdi-file-document-outline</v-icon><a v-if="attr.type === 'file'" :href="attr.fileUrl">{{attr.name}}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import menuBar from './menu-bar'
import moment from 'moment'
import firebase from 'firebase'
import Helper from '../helper/helper'

  export default {
    components: {
      menuBar,
    },
    data() {
      return {
        event: {},
        profileUrl: sessionStorage.getItem('profileUrl'),
        comment: '',
        images: [],
        files: [],
        numberImages: 0,
        numberFiles: 0,
        attachment: [],
        loadSaveCommentStatus: false,
        helper: new Helper(),
        isFollowed: false,
        register: [],
        statusRegister: -1,
        totalAccept: 0,
        myRegister: '',
        myEvent: true
      }
    },
    async created () {
      this.getEvent()
      this.getRegisterData()
    },
    methods: {
      async getEvent() {
        const { data: events } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/events/${this.$route.params.id}`
        })
        const membersId = []
        events.comments.map(comment => {
          membersId.push(comment.memberId)
        })
        const { data: membersCommentData } = await Axios({
          method: 'POST',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/comments-member`,
          data: { membersId }
        })
        const comments = events.comments.map(comment => {
          const memberData = membersCommentData.find(data => data._id === comment.memberId)
          return {
            name: `${memberData.firstName} ${memberData.lastName}`,
            email: memberData.email,
            imageUrl: memberData.profileUrl,
            rank: this.helper.showRank(memberData.exp),
            ...comment
          }
        })
        events.comments = comments
        this.event = events
        this.isFollowed = events.following.includes(sessionStorage.getItem('memberId'))
        this.myEvent = events.memberId == sessionStorage.getItem('memberId')
      },
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD')
      },
      async uploadImage() {
        try {
          const images = this.images
          this.images = []
          if ((images.length + this.numberImages) > 5) {
            throw { messages: 'จำนวนของภาพเกินกำหนด' }
          }
          this.loadSaveCommentStatus = true
          const task = []
          images.map(image => {
            task.push(firebase.storage().ref(sessionStorage.getItem('email')).child('comment').child(Date.now().toString()).put(image))
          })
          const uploadComplete = await Promise.all(task)
          if (uploadComplete) {
            task.map(async imageRef => {
              const payload = {
                type: 'image',
                name: imageRef.snapshot.ref.name,
                imageUrl: await imageRef.snapshot.ref.getDownloadURL()
              }
              this.attachment.push(payload)
            })
          }
          this.numberImages += images.length
          this.loadSaveCommentStatus = false
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.loadSaveCommentStatus = false
        }
      },
      async uploadFile() {
        try {
          const files = this.files
          this.files = []
          if ((files.length + this.numberFiles) > 5) {
            throw { messages: 'จำนวนของไฟล์เกินกำหนด' }
          }
          this.loadSaveCommentStatus = true
          const task = []
          files.map(file => {
            task.push(firebase.storage().ref(sessionStorage.getItem('email')).child('comment').child(file.name).put(file))
          })
          const uploadComplete = await Promise.all(task)
          console.log(uploadComplete)
          if (uploadComplete) {
            task.map(async fileRef => {
              const payload = {
                type: 'file',
                name: fileRef.snapshot.ref.name,
                fileUrl: await fileRef.snapshot.ref.getDownloadURL()
              }
              this.attachment.push(payload)
            })
          }
          this.numberFiles += files.length
          this.loadSaveCommentStatus = false
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.loadSaveCommentStatus = false
        }
      },
      async deleteAttachment(attr, index) {
        this.attachment.splice(index, 1)
        if (attr.type === 'image') {
          -- this.numberImages
        } else {
          -- this.numberFiles
        }
        firebase.storage().ref(sessionStorage.getItem('email')).child('comment').child(attr.name).delete()
      },
      async saveComment() {
        try {
          this.loadSaveCommentStatus = true
          if (!this.comment) {
            throw { messages: 'กรุณากรอกข้อความที่ต้องการแสดงความคิดเห็น' }
          }
          const { comments } = this.event
          const commentPayload = {
            memberId: sessionStorage.getItem('memberId'),
            message: this.comment,
            attachment: this.attachment
          }
          comments.push({
            name: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
            imageUrl: sessionStorage.getItem('profileUrl'),
            ...commentPayload
          })
          const updatedComment = await Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/events/${this.$route.params.id}`,
            data: { comments }
          })
          if (!updatedComment) {
            throw { messages: 'ไม่สามารถเพิ่มความคิดเห็นได้กรุณาลองใหม่อีกครั้ง' }
          }
          const exp = Number(sessionStorage.getItem('exp')) + 3
          sessionStorage.setItem('exp', exp)
          Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`,
            data: { exp }
          })
          this.comment = null
          this.attachment = []
          this.loadSaveCommentStatus = false
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.comment = null
          this.loadSaveCommentStatus = false
        }
      },
      async follow() {
        if (this.isFollowed) {
          const index = this.event.following.findIndex(id => id === sessionStorage.getItem('memberId'))
          this.event.following.splice(index, 1)
          this.isFollowed = false
        } else {
          this.event.following.push(sessionStorage.getItem('memberId'))
          this.isFollowed = true
        }
        Axios({
          method: 'PATCH',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/events/${this.$route.params.id}`,
          data: { following: this.event.following }
        })
      },
      async registerEvent() {
        try {
          const { isConfirmed, value } = await this.$swal({
            icon: 'info',
            input: 'textarea',
            inputLabel: 'ข้อความเพิ่มเติม',
            inputPlaceholder: 'ข้อความที่ต้องการส่งให้เจ้าของกิจกรรมเพิ่มเติม',
            showCancelButton: true,
            confirmButtonText: 'สมัคร',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#d14529'
          })
          if (isConfirmed) {
            const payload = {
              eventId: this.event._id,
              eventName: this.event.name,
              memberId: this.event.memberId,
              registerId: sessionStorage.getItem('memberId'),
              registerName: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
              registerEmail: sessionStorage.getItem('email'),
              detail: value
            }
            const result = await Axios({
              method: 'POST',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/register-event`,
              data: payload
            })
            if (!result) {
              throw { messages: 'สมัครเข้าร่วมกิจกรรมล้มเหลวกรุณาลองใหม่อีกครั้ง' }
            }
            this.statusRegister = 2
            this.myRegister = result
            this.$swal('สำเร็จ', 'สมัครเข้าร่วมกิจกรรมสำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      async getRegisterData() {
        const { data: { data: registerData } } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/register-event?eventId=${this.$route.params.id}&$sort[createdAt]=-1`
        })
        this.register = registerData
        this.totalAccept = registerData.filter(register => register.acceptStatus === 1).length
        const myRegister = registerData.find(register => register.registerId === sessionStorage.getItem('memberId'))
        if (myRegister) {
          this.statusRegister = myRegister.acceptStatus
          this.myRegister = myRegister
        }
      },
      async cancelRegister () {
        try {
          const { isConfirmed } = await this.$swal({
            title: 'ยืนยัน',
            text: 'คุณต้องการยกเลิกการสมัครกิจกรรมหรือไม่',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#d14529'
          })
          if (isConfirmed) {
            const result = await Axios({
              method: 'PATCH',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/register-event/${this.myRegister._id}`,
              data: { status: 0, acceptStatus: 0 }
            })
            if (!result) {
              throw { messages: 'ยกเลิกล้มเหลวกรุณาลองใหม่อีกครั้ง' }
            }
            this.statusRegister = -1
            this.myRegister = ''
            this.$swal('สำเร็จ', 'ยกเลิกสมัครกิจกรรมสำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
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

  .container {
    max-width: 800px;
    margin: auto;
  }
  .title_1 {
    display: flex;
    flex-direction: row;
    font-family: 'Athiti', sans-serif;
  }
  .datail {
    display: flex;
    flex-direction: column;
  }
  .comment {
    display: flex;
    flex-direction: row;
  }
  .profile-image {
    max-width: 50px;
    max-width: 50px;
  }
  .message {
    width: 100%;
    max-width: 100%;
  }
  .imageComment {
    max-width: 400px;
    max-height: 200px;
  }
  .filePreview {
    transform: translate(0, -20px);
  }
  .actionBtn {
    width: 0px;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: row;
    transform: translate(0, -45px);
  }
  .getTicket {
    display: flex;
    flex-direction: row-reverse;
  }
</style>