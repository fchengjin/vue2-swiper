import Swiper from './vue2-swiper.vue'
import Vue from 'vue'
const vue2Swiper = {}
vue2Swiper.install = function (Vue) {
  Vue.component('Swiper',Swiper)
}
Vue.use(vue2Swiper)