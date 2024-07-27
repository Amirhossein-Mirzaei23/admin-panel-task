import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('auth_token') || '',
  }),
  actions: {
    async login() {
       // generate a random token
        const array = new Uint8Array(32 / 2);
        window.crypto.getRandomValues(array);
        const response =  Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      try {
       
        this.token = response
        // set expire time on this token in cookies 
        Cookies.set('auth_token', this.token, { expires: 7 }); 
      
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    logout() {
      this.token = '';
      Cookies.remove('auth_token');
    }
    
  },
});
