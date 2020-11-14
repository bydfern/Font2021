<template>
  <div class="container">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title" >เข้าสู่ระบบ</p>
      </header>
      <div class="card-content">
        <b-input placeholder="อีเมล" rounded></b-input><br>
        <b-input placeholder="รหัสผ่าน" rounded></b-input><br>
        <b-button type="is-success">เข้าสู่ระบบ</b-button><br>
        <router-link :to="{name: 'SignUp'}">สมัครสมาชิก</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
  }
</script>

<style>
  .container {
    margin-top: 20px;
    text-align: center;
    height: 100%;
  }
</style>