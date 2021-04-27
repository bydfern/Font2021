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
                image: 'https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/wallpaper.png?alt=media&token=e152f5e1-1b4e-4390-b45d-f490572f6f3a'
                
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