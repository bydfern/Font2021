<template>
  <div class = "front">
    <menu-bar></menu-bar>
    <div class="container my-5">
      <div class="title-box">
        <h1>{{topic.title}}</h1>
        <v-icon v-if="role === 'member'" color="red" @click="report()">mdi-alert</v-icon>
        <v-icon v-if="role === 'admin'" color="red" @click="removeTopic()">mdi-delete</v-icon>
      </div>
      <h3>{{topic.subject}}</h3>
      <hr class="my-5">
      <div v-for="(item, index) in topic.content" :key="index">
        <p v-if="item.type == 'text'">{{item.value}}</p>
        <img v-if="item.type == 'image'" :src="item.value" width="100%;">
        <v-icon v-if="item.type == 'file'">mdi-file-document-outline</v-icon><a v-if="item.type == 'file'" :href="item.value">{{item.name}}</a>
        <div class="poll" v-if="item.type == 'poll'">
          <span><b>{{item.question}}</b></span>
          <v-radio-group v-if="!item.isAnswered" v-model="topic.content[index].myAnswer">
            <v-radio v-for="(answer, i) in item.answers" :key="i" :label="answer.text"></v-radio>
          </v-radio-group>
          <v-btn v-if="!item.isAnswered" class="mb-5" color="success" small rounded @click="answer(index)" :loading="item.loading">ส่งคำตอบ</v-btn>
          <bars
            v-if="item.isAnswered"
            :data="item.data"
            :labelData="item.label"
            :labelRotate="0"
            :labelSize="0.4"
            :gradient="['#6fa8dc', '#42b983']">
          </bars>
        </div>
      </div>
      <hr class="my-5">
      <div class="profile">
        <div class="profile-image mx-3">
          <img @click="$router.push(`/profile/${member._id}`)" :src="member.profileUrl" width="100%" height="100%">
        </div>
        <div class="profile-contact">
          <span @click="$router.push(`/profile/${member._id}`)">{{member.email}}</span>
          <hr>
          <span @click="$router.push(`/profile/${member._id}`)">{{member.firstName}} {{member.lastName}}</span>
          <span>{{member.rank}}</span>
        </div>
      </div>
      <hr class="my-7">
      <!-- <h2 class="my-3">ถูกใจ</h2> -->
      <div class="like">
        <v-icon large @click="like()" :color="likeColor" >mdi-heart</v-icon>
        <b class="mx-3 pt-2">{{topic.like.length}} คน</b>
      </div>
      <div class="favorite">
        <h4 class="mt-5">เพิ่มเป็นรายการโปรด</h4>
        <v-icon class="mt-4 mx-2" large @click="favorite()" :color="favoriteColor" >mdi-star</v-icon>
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
        <span class="mx-3" v-if="topic.comments.length == 0" >ไม่มีความคิดเห็นตอนนี้</span>
        <div v-for="(comment, index) in topic.comments" :key="index">
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
  /* eslint-disable no-unused-vars */
  import Axios from 'axios'
  import MenuBar from './menu-bar.vue'
  import firebase from 'firebase'
  import Helper from '../helper/helper'

  export default {
    components: {
      MenuBar,
    },
    data() {
      return {
        topic: {},
        member: {},
        profileUrl: sessionStorage.getItem('profileUrl'),
        profile: {},
        comment: null,
        loadSaveCommentStatus: false,
        likeColor: 'gray',
        favoriteColor: 'gray',
        images: [],
        files: [],
        attachment: [],
        numberImages: 0,
        numberFiles: 0,
        role: sessionStorage.getItem('role'),
        helper: new Helper()
      }
    },
    created () {
      this.getTopicData()
      this.getProfile()
    },
    methods: {
      async getTopicData() {
        try {
          const { data: topic } = await Axios({
            method: 'GET',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`
          })
          if (!topic || topic.status !== 1) {
            throw { messages: 'ไม่พบกระทู้นี้' }
          }
          const membersId = []
          topic.comments.map(comment => {
            membersId.push(comment.memberId)
          })
          const { data: membersCommentData } = await Axios({
            method: 'POST',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/comments-member`,
            data: { membersId }
          })
          const comments = topic.comments.map(comment => {
            const memberData = membersCommentData.find(data => data._id === comment.memberId)
            return {
              name: `${memberData.firstName} ${memberData.lastName}`,
              email: memberData.email,
              imageUrl: memberData.profileUrl,
              rank: this.helper.showRank(memberData.exp),
              ...comment
            }
          })
          const id = sessionStorage.getItem('memberId')
          topic.content = topic.content.map(item => {
            if (item.type == 'poll') {
              item.loading = false
              item.data = [0]
              item.label = ['start']
              item.answers.map(answer => {
                const isAnswer = answer.answered.find(x => x == id)
                item.data.push(answer.answered.length)
                item.label.push(answer.text)
                if (!item.isAnswered) {
                  item.isAnswered = Boolean(isAnswer)
                }
              })
            }

            return item
          })
          topic.comments = comments
          this.topic = topic
          if (topic.like.includes(sessionStorage.getItem('memberId'))) {
            this.likeColor = 'red'
          }
          const memberData = await this.getMember(topic.memberId)
          if (!memberData) {
            throw { messages: 'ไม่พบเจ้าของกระทู้' }
          }
          this.member = memberData
          this.member.rank = this.helper.showRank(memberData.exp)
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.$router.push({ name: 'home' })
        }
      },
      async getMember(id) {
        const { data: member } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${id}`
        })

        return member
      },
      async getProfile() {
        const profileData = await this.getMember(sessionStorage.getItem('memberId'))
        if (profileData.favorite.includes(this.topic._id)) {
          this.favoriteColor = '#FCE205'
        }
        this.profile = profileData
      },
      async saveComment() {
        try {
          this.loadSaveCommentStatus = true
          if (!this.comment) {
            throw { messages: 'กรุณากรอกข้อความที่ต้องการแสดงความคิดเห็น' }
          }
          const { comments } = this.topic
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
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`,
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
          this.$swal({
          text: 'แสดงความคิดเห็น +3 exp',
          icon: "success",
          iconColor: "white",
          toast: true,
          position: "top",
          background: "#44b348",
          showConfirmButton: false,
          timer: 1500,
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
      async like() {
        const memberId = sessionStorage.getItem('memberId')
        if (this.topic.like.includes(memberId)) {
          const index = this.topic.like.findIndex(id => id == memberId)
          this.topic.like.splice(index, 1)
          this.likeColor = 'gray'
        } else {
          this.topic.like.push(memberId)
          this.likeColor = 'red'
          const exp = Number(sessionStorage.getItem('exp')) + 1
          sessionStorage.setItem('exp', exp)
          Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${memberId}`,
            data: { exp }
          })
          this.$swal({
            text: 'กดถูกใจ +1 exp',
            icon: "success",
            iconColor: "white",
            toast: true,
            position: "top",
            background: "#44b348",
            showConfirmButton: false,
            timer: 1500,
          })
        }
        Axios({
          method: 'PATCH',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.topic._id}`,
          data: { like: this.topic.like }
        })
      },
      favorite() {
        const favorite = this.profile.favorite
        if (favorite.includes(this.topic._id)) {
          this.favoriteColor = 'gray'
          this.profile.favorite = favorite.filter(id => id !== this.topic._id)
        } else {
          this.favoriteColor = '#FCE205'
          this.profile.favorite.push(this.topic._id)
        }
        Axios({
          method: 'PATCH',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${this.profile._id}`,
          data: { favorite: this.profile.favorite }
        })
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
      async report() {
        try {
          const reportData = await this.$swal({
            title: 'รายงาน',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'รายงาน',
            cancelButtonText: 'ยกเลิก',
            html:
            '<input type="radio" id="typeReport" name="typeReport" value="0" checked>' + ' กระทู้' + '&nbsp;' + '&nbsp;' + '&nbsp;' +
            '<input type="radio" id="typeReport" name="typeReport" value="1">' + ' เจ้าของกระทู้' +
            '<textarea id="reason" class="swal2-input" type="textarea" placeholder="เหตุผล" style="height: 170px;">',
            preConfirm: () => {
              return {
                typeReport: document.getElementById('typeReport').value,
                reason: document.getElementById('reason').value
              }
            }
          })
          if (reportData.isConfirmed) {
            const { typeReport, reason } = reportData.value
            if (!reason) {
              throw { messages: 'กรุณาบอกเหตุผลที่ต้องการแจ้งรายงาน' }
            }
            const targetId = (typeReport) ? this.topic._id : this.member._id
            const result = await Axios({
              method: 'POST',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/reports`,
              data: {
                reporterId: sessionStorage.getItem('memberId'),
                typeReport,
                targetId,
                reason
              }
            })
            if (!result) {
              throw { messages: 'ไม่สามารถรายงานได้กรุณาลองใหม่อีกครั้ง' }
            }
            this.$swal('สำเร็จ', 'แจ้งรายงานสำเร็จแล้วรอการตรวจสอบ', 'success')
          }
          
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      async removeTopic() {
        try {
          const { isConfirmed } = await this.$swal({
            title: 'ยืนยัน',
            text: 'คุณต้องการลบกระทู้นี้หรือไม่',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#d14529'
          })
          if (isConfirmed) {
            const deletedTopic = await Axios({
              method: 'DELETE',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.topic._id}`
            })
            if (!deletedTopic) {
              throw { messages: 'ลบกระทู้ไม่สำเร็จ' }
            }
            this.$router.replace({ name: 'home' })
            this.$swal('สำเร็จ', 'ลบกระทู้สำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      },
      async answer(index) {
        try {
          this.topic.content[index].loading = true
          const pollData = this.topic.content[index]
          if (pollData.myAnswer == undefined) {
            throw { messages: 'กรุณาเลือกคำตอบ' }
          }
          pollData.answers[pollData.myAnswer].answered.push(sessionStorage.getItem('memberId'))
          let content = this.topic.content
          const { myAnswer, loading, isAnswered, data, label, ...payload } = pollData
          content[index] = payload
          Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`,
            data: { content: content }
          })
          this.topic.content[index] = pollData
          this.topic.content[index].isAnswered = true
          this.topic.content[index].loading = false
          this.topic.content[index].data[pollData.myAnswer + 1]++
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Athiti&display=swap');
  .front
  {
    font-family: 'Athiti', sans-serif;
  }
  
  .container {
    max-width: 800px;
    margin: auto;
    background-color: #fff;
  }
  .profile {
    display: flex;
    flex-direction: row-reverse;
    height: 50px;
  }
  .profile-image {
    max-width: 50px;
    max-width: 50px;
  }
  .profile-contact {
    display: flex;
    flex-direction: column;
  }
  .comment {
    display: flex;
    flex-direction: row;
  }
  .message {
    width: 100%;
    max-width: 100%;
  }
  .like {
    height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .actionBtn {
    width: 0px;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: row;
    transform: translate(0, -45px);
  }
  .imageComment {
    max-width: 400px;
    max-height: 200px;
  }
  .filePreview {
    transform: translate(0, -20px);
  }
  .favorite {
    display: flex;
    flex-direction: row;
  }
  .title-box {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>