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
    background-image: url("https://firebasestorage.googleapis.com/v0/b/member-educate-space.appspot.com/o/top-view-person-writing-laptop-with-copy-space.jpg?alt=media&token=d5ba4445-f44b-4562-a39f-08b616965a20");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;  
    padding: 0px 50px 0px 50px;
  }
</style>
