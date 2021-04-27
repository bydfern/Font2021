<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style>
  .v-main{
    background-image: url("https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/home.png?alt=media&token=ec0dcdf4-5e73-47e0-9955-2d9e6a6dc6ce");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;  
    padding: 0px 50px 0px 50px;
  }
</style>
