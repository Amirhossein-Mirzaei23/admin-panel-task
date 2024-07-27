<template>
  <!-- Container to center the card both vertically and horizontally -->
  <v-container class="d-flex  justify-center align-center h-screen  w-screen pa-0 pa-md-4 pa-xxl-6 " fill-height>
      <!-- Card -->
      <v-card class="w-sm-75 w-md-66 w-xxl-50 w-100 rounded-lg h-sm-75 h-100 elevation-16" max-width="1100">
          <!-- Row to arrange columns in a responsive manner -->
          <v-row no-gutters class="h-sm-100 d-flex w-100 flex-sm-row flex-column-reverse">
              <!-- Column for the login form -->
              <v-col cols="12" sm="6" class="d-flex flex-column justify-center pa-3 py-7">
                  <!-- Form container -->
                  <v-form class="d-flex flex-column justify-space-between h-100">
                      <div>
                          <!-- Header with icon and title -->
                          <div class="d-flex ga-2 align-center mb-4">
                              <v-icon class="mdi-rotate-180" icon="mdi-login-variant"></v-icon>
                              <h5 class="font-light">ورود</h5>
                          </div>
                          <!-- Username input field -->
                          <v-text-field dir="rtl" class="h-10 text-md-right" label="نام کاربری" v-model="username" 
                                        variant="outlined" density="compact"></v-text-field>
                          <!-- Password input field -->
                          <v-text-field density="compact" dir="rtl" class="h-10 text-md-right" label="رمز عبور" 
                                        v-model="password" type="password" variant="outlined"></v-text-field>
                      </div>
                      <!-- Login button -->
                      <v-btn variant="tonal" class="mt-4" @click="singIn">ورود</v-btn>
                  </v-form>
              </v-col>
              
              <v-col cols="12" sm="6" class="purple-background">
                  <div class="text-center card-text pa-10 h-100 d-flex flex-column justify-space-between">
                      <div>
                          <!-- Logo and title -->
                          <v-img src="@/assets/images/badesaba_icon.svg" max-height="80" class="mb-4"></v-img>
                          <h4 class="mb-4 text-h5 font-bold">پیشخوان مدیریت کاربران</h4>
                          <p class="font-light text-body-1">نرم‌افزار بادصبا</p>
                      </div>
                      <!-- Footer with rights information -->
                      <div class="align-self-end">
                          <h6 class="font-light text-body-2">
                              کلیه حقوق این وب سایت متعلق به<strong> شرکت پیشگامان موج تلفن همراه</strong> است.
                          </h6>
                      </div>
                  </div>
              </v-col>
          </v-row>
      </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// import authentication store and router
const authStore = useAuthStore();
const router = useRouter();

// import toaster for notifications
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({});

// define reactive variables for username and password
const username = ref('')
const password = ref('')

// function to handle login
function singIn() {
  // show success toaster notification
  toaster.show("با موفقیت وارد شدید", {
      type: "success",
  });

  // navigate to addNewRole page on success login
  authStore.login().then(() => {
      router.push({ path: '/addNewRole' });
  });
}
</script>

<style scoped>
.purple-background {
  background-color: #402066;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-text {
  color: #ffffff;
}
</style>
