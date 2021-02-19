import Vue from 'vue';
import App from 'Components/App.vue';
import VueRouter from 'vue-router';
import { router } from 'Js/router.js';
import firebase from 'firebase';
import VueSocketIO from 'vue-socket.io';
import socketio from 'socket.io-client'

Vue.use(VueRouter);
Vue.use(new VueSocketIO({
  debug: true,
  connection: socketio('http://localhost:3000', { withCredentials: false }), //options object is Optional
  })
);

const firebaseConfig = {
    apiKey: "AIzaSyD8pWd_kx-CQ2guMgsTu5_wNDuhWloBQCQ",
    authDomain: "test-nt1.firebaseapp.com",
    projectId: "test-nt1",
    storageBucket: "test-nt1.appspot.com",
    messagingSenderId: "270387663997",
    appId: "1:270387663997:web:8f192f5576832b9169cd14"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
    router,
    el: '#app',
    render: h => h(App)
});