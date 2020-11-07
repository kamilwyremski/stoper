import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlayCircle, faPauseCircle, faStopCircle, faCircleNotch, faChevronUp, faChevronDown, faAdjust, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faPlayCircle, faPauseCircle, faStopCircle, faCircleNotch, faChevronUp, faChevronDown, faAdjust, faArrowsAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.config.productionTip = false

Vue.use(require('vue-cookie'));

Vue.use(require('vue-script2'))

new Vue({
  render: h => h(App),
}).$mount('#app')


