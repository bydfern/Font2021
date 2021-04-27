<template>
  <div id="app">
  <div v-if="image" style="
    max-width:100%;
    height :2600px;
    width : 100%;
    background-size: cover;
    background-position: center center;" :style="{ 'background-image': 'url(' + image + ')' }">

      <v-btn width="10%" outlined color="black" class="startBtn" @click="$router.push({ name: 'login' })">เริ่มต้น</v-btn>
    </div>
</div>
<!-- <div class="circular" v-bind:style="{ 'background-image': 'url(' + image + ')' }"></div> -->
  <!-- <div class="bodyy">
    <v-btn class="startBtn" @click="$router.push({ name: 'login' })">เริ่มต้น</v-btn>
  </div> -->
</template>

<script>

  export default {
        el: "#app",
        data() {
            return {
                image: 'https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/main.png?alt=media&token=447204d1-483d-4ff9-b2d1-07eabeaf05cd'
                
            };
        }
    };
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
  .startBtn {
    top: 23%;
    left: 25%;
  }

</style>