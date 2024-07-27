<template>
  <v-app id="app" >
    <v-locale-provider rtl>
    <v-main  >
      <router-view />
    </v-main>
  </v-locale-provider>
  </v-app>
</template>

<script>


export default {
  name: 'App',



  data: () => ({
    //
  }),
}
</script>
