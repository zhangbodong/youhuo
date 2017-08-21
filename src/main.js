// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

import '@/assets/css/base'
import '@/assets/css/login'
import '@/assets/css/checkout'	
import '@/assets/css/product'
Vue.config.productionTip = false

Vue.use(VueLazyLoad);
  loading:'/static/loading/loading-bars.svg'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
