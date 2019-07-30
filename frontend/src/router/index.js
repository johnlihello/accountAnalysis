import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/Main';
import AppBar from '@/components/AppBar';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
  ],
});
