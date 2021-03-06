import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import 'fastclick'
import Vant from 'vant';
import 'vant/lib/index.css';
import VueLazyLoad from 'vue-lazyload'
import 'element-ui/lib/theme-chalk/index.css';
import {
  Switch
} from 'element-ui';

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

Vue.use(Vant)
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/lazy2.gif')
})
Vue.use(Switch)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
