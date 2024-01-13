import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCamera,
  faCircleStop,
  faRobot,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'

library.add(faCamera, faCircleStop, faRobot, faSpinner)

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
