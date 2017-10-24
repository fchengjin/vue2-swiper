import Swiper from './vue2-swiper.vue'
const install = function (Vue) {
  if(install.installed) return
  Vue.component('Swiper',Swiper)
}
export {
  install,
  Swiper
}
export default install