import VueRouter from 'vue-router';
import List from 'Components/List.vue';
import Login from 'Components/Login.vue';
import { checkAuth as checkAuthHTTP } from 'Services/user.js';
// front router
const router = new VueRouter({

  routes: [
    { 
      path: '/', component: List,
      name: 'list',
      beforeEnter: async (to, from, next) => {
        try {
          await checkAuthHTTP();
          next();
        } catch(e) {
          next({ name: 'login' });
        }
      } 
    },
    { path: '/login', component: Login, name: 'login' }
  ],

  /**
   * @description scroll to top on route change
   * @param {Object} _to unused
   * @param {Object} _from unused
   * @param {Object} _savedPosition unused
   * @return {Object} xPos, Ypos
   */
  scrollBehavior (_to, _from, _savedPosition) {
    return { x: 0, y: 0 }
  }
})

export { router }