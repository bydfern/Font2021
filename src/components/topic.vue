<template>
  <div>
    <menu-bar></menu-bar>
    <div class="container my-5">
      <h1>{{topic.title}}</h1>
      <h3>{{topic.subject}}</h3>
      <hr class="my-5">
      <div v-for="(item, index) in topic.content" :key="index">
        <p v-if="item.type == 'text'">{{item.value}}</p>
        <img v-if="item.type == 'image'" :src="item.value" width="100%;">
        <v-icon v-if="item.type == 'file'">mdi-file-document-outline</v-icon><a v-if="item.type == 'file'" :href="item.value">{{item.name}}</a>
      </div>
      <hr class="my-5">
      <div class="profile">
        <div class="profile-image mx-3">
          <img :src="member.profileUrl" width="100%" height="100%">
        </div>
        <div class="profile-contact">
          <span>{{member.email}}</span>
          <hr>
          <span>{{member.firstName}} {{member.lastName}}</span>
        </div>
      </div>
      <hr class="my-5">
      <h2 class="my-3">ถูกใจ</h2>
      <div class="like">
        <v-icon large @click="like()" :color="likeColor" >mdi-hand-heart</v-icon>
        <b class="mx-3 pt-2">{{topic.like.length}} คน</b>
      </div>
      <div class="favorite">
        <h3 class="mt-5">เพิ่มเป็นรายการโปรด</h3>
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
  import MenuBar from './menu-bar.vue'
  import firebase from 'firebase'

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
        numberFiles: 0
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
          if (!topic) {
            throw { messages: 'ไม่พบกระทู้นี้' }
          }
          this.topic = topic
          if (topic.like.includes(sessionStorage.getItem('memberId'))) {
            this.likeColor = 'red'
          }
          const memberData = await this.getMember(topic.memberId)
          if (!memberData) {
            throw { messages: 'ไม่พบเจ้าของกระทู้' }
          }
          this.member = memberData
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
            name: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
            email: sessionStorage.getItem('email'),
            imageUrl: sessionStorage.getItem('profileUrl'),
            message: this.comment,
            attachment: this.attachment
          }
          comments.push(commentPayload)
          const updatedComment = await Axios({
            method: 'PATCH',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${this.$route.params.id}`,
            data: { comments }
          })
          if (!updatedComment) {
            throw { messages: 'ไม่สามารถเพิ่มความคิดเห็นได้กรุณาลองใหม่อีกครั้ง' }
          }
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
          favorite.push(this.topic._id)
        }
        Axios({
          method: 'PATCH',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${this.profile._id}`,
          data: { favorite }
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
      }
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    max-width: 800px;
    margin: auto;
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
</style>