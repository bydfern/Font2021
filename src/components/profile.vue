<template>
  <div class="front">
    <menu-bar></menu-bar>
    <div class="container">
      <v-card>
        <v-card-title>ข้อมูลส่วนตัว</v-card-title>
        <v-card-text>
          <div class="profile">
            <img :src="member.profileUrl" class="profileImage mr-16">
            <div class="profileDetail">
              <h3><i class="mr-3">ชื่อ - นามสกุล: </i>{{member.firstName}} {{member.lastName}}</h3>
              <h3><i class="mr-3">อีเมล: </i>{{member.email}}</h3>
              <h3><i class="mr-3">วันเกิด: </i>{{member.birthday || '-'}}</h3>
              <h3><i class="mr-3">มหาวิทยาลัย: </i>{{member.university || '-'}}</h3>
              <h3><i class="mr-3">คณะ: </i>{{member.faculty || '-'}}</h3>
              <h3><i class="mr-3">สาขาวิชา: </i>{{member.department || '-'}}</h3>
              <h3><i class="mr-3">อันดับ: </i>{{helper.showRank(member.exp)}}  
              <v-progress-linear
                class="mt-3"
                :value= "helper.progressRank(member.exp)"
                color="primary"
                height="4"
              ></v-progress-linear>
              </h3>
              <div class="actionButton" v-if="isMyProfile">
                <v-btn class="my-3 mr-3" small style="max-width: 150px;" color="#f0d42b" @click="$router.push({ name: 'editProfile' })">
                  <v-icon color="white">mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="my-3" v-if="isMyProfile" small style="max-width: 150px;" color="error" @click="removeMember()">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <v-tabs v-model="currentTab">
            <v-tab @click="getTopic()"><span v-if="isMyProfile">กระทู้ของฉัน</span><span v-else>กระทู้</span></v-tab>
            <v-tab @click="getEvent()"><span v-if="isMyProfile">กิจกรรมของฉัน</span><span v-else>กิจกรรม</span></v-tab>
            <v-tab v-if="isMyProfile" @click="getFavoriteTopics()">รายการโปรด</v-tab>
            <v-tab v-if="isMyProfile"  @click="getRegisterEvent()">คำขอเข้าร่วมกิจกรรม</v-tab>
            <v-tab-item>
              <!-- กระทู้ -->
              <v-card flat>
                <v-card-text>
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th style="width: 30%;">เรื่อง</th>
                        <th style="width: 20%;">วิชา</th>
                        <th style="width: 20%;">เจ้าของกระทู้</th>
                        <th style="width: 150px;">สร้างเมื่อ</th>
                        <th style="width: 150px;">แก้ไขเมื่อ</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(topic, index) in data" :key="topic._id">
                        <td @click="$router.push(`/topic/${topic._id}`)" >{{topic.title}}</td>
                        <td @click="$router.push(`/topic/${topic._id}`)" >{{topic.subject}}</td>
                        <td @click="$router.push(`/topic/${topic._id}`)" >{{topic.memberEmail}}</td>
                        <td @click="$router.push(`/topic/${topic._id}`)" >{{formatDate(topic.createdAt)}}</td>
                        <td @click="$router.push(`/topic/${topic._id}`)" >{{formatDate(topic.updatedAt)}}</td>
                        <td class="actionBtn" v-if="isMyProfile">
                          <v-icon @click="$router.push(`/edit-topic/${topic._id}`)" large medium color="#FBC02D">mdi-pencil-circle</v-icon>
                          <v-icon class="mx-1" large @click="removeTopic(topic._id, index)" medium color="red">mdi-delete-circle</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>  
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <!-- กิจกรรม -->
              <v-card flat>
                <v-card-text>
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th style="width: 30%;">ชื่อ</th>
                        <th style="width: 30%;">รายละเอียด</th>
                        <th style="width: 15%;">วันที่เริ่ม</th>
                        <th style="width: 15%;">วันที่สิ้นสุด</th>
                        <th style="width: 10%;">จำนวนคนติดตาม</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(event, index) in data" :key="event._id">
                        <td @click="$router.push(`/event/${event._id}`)">{{event.name}}</td>
                        <td @click="$router.push(`/event/${event._id}`)"><div class="longText">{{event.detail}}</div></td>
                        <td @click="$router.push(`/event/${event._id}`)">{{formatDate(event.startDate)}}</td>
                        <td @click="$router.push(`/event/${event._id}`)">{{formatDate(event.endDate)}}</td>
                        <td @click="$router.push(`/event/${event._id}`)" v-if="event.following">{{event.following.length}}</td>
                        <td class="actionBtn" v-if="isMyProfile">
                          <v-icon @click="$router.push(`/edit-event/${event._id}`)" large medium color="#FBC02D">mdi-pencil-circle</v-icon>
                          <v-icon class="mx-1" large @click="removeEvent(event._id, index)" medium color="red">mdi-delete-circle</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <!-- รายการโปรด -->
              <v-card flat>
                <v-card-text>
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th style="width: 30%;">เรื่อง</th>
                        <th style="width: 30%">วิชา</th>
                        <th style="width: 10%">ถูกใจ</th>
                        <th style="width: 20%;">เจ้าของกระทู้</th>
                        <th style="width: 10%">สร้างเมื่อ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="topic in data"
                        :key="topic._id"
                        @click="$router.push(`/topic/${topic._id}`)"
                      >
                        <td>{{ topic.title }}</td>
                        <td>{{ topic.subject }}</td>
                        <td v-if="topic.like">{{ topic.like.length }}</td>
                        <td>{{ topic.memberEmail }}</td>
                        <td>{{ formatDate(topic.createdAt) }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <!-- คำขอเข้าร่วมกิจกรรม -->
              <v-card flat>
                <v-card-text>
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th style="width: 30%;">เรื่อง</th>
                        <th style="width: 20%;">ชื่อผู้สมัคร</th>
                        <th style="width: 20%;">อีเมลผู้สมัคร</th>
                        <th style="width: 15%">รายละเอียด</th>
                        <th style="width: 15%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(register, index) in data" :key="register._id">
                        <td class="clickable" @click="toEvent(register.eventId)">{{register.eventName}}</td>
                        <td class="clickable" @click="toProfile(register.registerId)">{{register.registerName}}</td>
                        <td class="clickable" @click="toProfile(register.registerId)">{{register.registerEmail}}</td>
                        <td class="clickable" @click="showDetailMore(register.detail)"><div class="longText">{{register.detail}}</div></td>
                        <td>
                          <v-btn class="mx-3" small color="success" @click="accept(register, index)"><v-icon>mdi-check-bold</v-icon></v-btn>
                          <v-btn small color="error" @click="reject(register, index)"><v-icon>mdi-close-thick</v-icon></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import firebase from 'firebase'
  import menuBar from './menu-bar'
  import Helper from '../helper/helper'
  import moment from 'moment'

  export default {
    components: {
      menuBar,
    },
    data() {
      return {
        member: {},
        helper: new Helper(),
        explank : 0,
        isMyProfile: false,
        data: [],
        currentTab: 0
      }
    },
    async created () {
      await this.getMemberData()
      this.getTopic()
    },
    methods: {
      async getMemberData() {
        try {
          const { data } = await Axios({
            method: 'GET',
            url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${this.$route.params.id}`
          })
          if (!data) {
            throw { messages: 'ระบบผิดพลาดกรุณาลองใหม่อีกครั้ง' }
          }
          this.member = data
          this.isMyProfile = data._id === sessionStorage.getItem('memberId')
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
          this.$router.replace({ name: 'home' })
        }
      },
      async removeMember() {
        try {
          const { isConfirmed } = await this.$swal({
              title: 'ยืนยัน',
              text: 'คุณต้องการลบบัญชีผู้ใช้นี้หรือไม่',
              icon: 'warning',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'ลบ',
              cancelButtonText: 'ยกเลิก',
              confirmButtonColor: '#d14529'
            })
          if (isConfirmed) {
            const deletedMember = await Axios({
              method: 'DELETE',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${sessionStorage.getItem('memberId')}`
            })
            if (!deletedMember) {
              throw { messages: 'ไม่สามารถลบบัญชีผู้ใช้ได้' }
            }
            await firebase.auth().currentUser.delete()
            this.$swal({
              text: 'ลบบัญชีสำเร็จ',
              icon: 'success',
              iconColor: 'white',
              toast: true,
              position: 'top',
              background: '#44b348',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.replace({ name: 'login' })
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      async getRegisterEvent() {
        const { data: { data: registerData } } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/register-event?memberId=${sessionStorage.getItem('memberId')}&acceptStatus=2&status=1`
        })
        this.data = registerData
      },
      async getFavoriteTopics() {
        const { data } = await Axios({
          method: "GET",
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/favorite-topic/${sessionStorage.getItem("memberId")}`,
        })
        this.data = data
      },
      toEvent(id) {
        this.$router.push(`/event/${id}`)
      },
      toProfile(id) {
        this.$router.push(`/profile/${id}`)
      },
      showDetailMore(text) {
        this.$swal({
          titleText: 'รายละเอียด',
          text
        })
      },
      async reject(register, index) {
        try {
          const { isConfirmed } = await this.$swal({
            title: 'ยืนยัน',
            text: 'คุณต้องการปฏิเสธการขอเข้าร่วมนี้หรือไม่',
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
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/register-event/${register._id}`,
              data: { acceptStatus: 0 }
            })
            if (!result) {
              throw { messages: 'ไม่สามารดำเนินการได้กรุณาลองใหม่อีกครั้ง' }
            }
            this.data.splice(index, 1)
            Axios({
              method: 'POST',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/send-email`,
              data: {
                email: register.registerEmail,
                message: `เจ้าของกิจกรรม ${register.eventName} ได้ปฎิเสธการเข้าร่วมของคุณ`
              }
            })
            this.$swal('สำเร็จ', 'ปฏิเสธการขอเข้าร่วมสำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      async accept(register, index) {
        try {
          const { isConfirmed } = await this.$swal({
            title: 'ยืนยัน',
            text: 'คุณต้องการอุนมัติการขอเข้าร่วมนี้หรือไม่',
            icon: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#d14529'
          })
          if (isConfirmed) {
            const registerData = await Axios({
              method: 'GET',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${register.registerId}?status=1`,
            })
            if (!registerData) {
              throw { messages: 'ไม่พบข้อมูลผู้สมัคร' }
            }
            Axios({
              method: 'PATCH',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/members/${registerData._id}`,
              data: { exp: registerData.exp + 3 }
            })
            const result = await Axios({
              method: 'PATCH',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/register-event/${register._id}`,
              data: { acceptStatus: 1 }
            })
            if (!result) {
              throw { messages: 'ไม่สามารดำเนินการได้กรุณาลองใหม่อีกครั้ง' }
            }
            this.data.splice(index, 1)
            Axios({
              method: 'POST',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/send-email`,
              data: {
                email: register.registerEmail,
                message: `เจ้าของกิจกรรม ${register.eventName} ได้อนุมัติให้คุณเข้าร่วมกิจกรรมแล้ว`
              }
            })
            this.$swal('สำเร็จ', 'อนุมัติการขอเข้าร่วมสำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด', message, 'error')
        }
      },
      formatDate(date) {
        return moment(date).format("DD/MM/YYYY");
      },
      async getTopic() {
        const { data: { data: myTopic } } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics?memberEmail=${this.member.email}`
        })
        this.data = myTopic
      },
      async getEvent() {
        const { data: { data: myEvent } } = await Axios({
          method: 'GET',
          url: `${process.env.VUE_APP_SERVER_BASE_URL}/events?memberId=${this.member._id}&$sort[endDate]=-1`
        })
        this.data = myEvent
      },
      async removeTopic(id, index) {
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
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/topics/${id}`
            })
            if (!deletedTopic) {
              throw { messages: 'ลบกระทู้ไม่สำเร็จ' }
            }
            this.data.splice(index, 1)
            this.$swal('สำเร็จ', 'ลบกระทู้สำเร็จ', 'success')
          }
        } catch (error) {
          const message = (error.messages) ? error.messages : error.message
          this.$swal('ข้อผิดพลาด',  message, 'error')
        }
      },
      async removeEvent(id, index) {
        try {
          const { isConfirmed } = await this.$swal({
            title: 'ยืนยัน',
            text: 'คุณต้องการลบกิจกรรมนี้หรือไม่',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#d14529'
          })
          if (isConfirmed) {
            const deletedEvent = await Axios({
              method: 'DELETE',
              url: `${process.env.VUE_APP_SERVER_BASE_URL}/events/${id}`
            })
            if (!deletedEvent) {
              throw { messages: 'ลบกิจกรรมไม่สำเร็จ' }
            }
            this.data.splice(index, 1)
            this.$swal('สำเร็จ', 'ลบกิจกรรมสำเร็จ', 'success')
          }
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
  .front {
    font-family: 'Athiti', sans-serif;
  }
  .container {
    max-width: 1200px;
    height: 100%;
  }
  .profile {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .profileImage {
    max-width: 150px;
    max-height: 150px;
  }
  .profileDetail {
    display: flex;
    flex-direction: column;
  }
  .clickable {
    cursor: pointer;
  }
  .longText {
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis; 
  }
  .actionBtn {
    display: flex;
    flex-direction: row;
  }
</style>