<template>
  <div class="container">
    <v-btn class="startBtn" @click="$router.push({ name: 'login' })">เริ่มต้น</v-btn>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
  .startBtn {
    top: 75%;
    left: 25%;
  }
</style>