import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia';
 import router from './router';
 import Toaster from "@meforma/vue-toaster";
 import 'sweetalert2/src/sweetalert2.scss'
 import '../src/assets/css/style.css'
const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
 app.use(router);

 app.use(Toaster,{
    duration:2000
 })
loadFonts()

app.use(vuetify).mount('#app')
