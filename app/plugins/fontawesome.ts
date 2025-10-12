import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faCalendarCheck, 
  faClock, 
  faEye, 
  faEdit, 
  faTrash, 
  faExternalLinkAlt 
} from '@fortawesome/free-solid-svg-icons'

export default defineNuxtPlugin((nuxtApp) => {
  library.add(faCalendarCheck, faClock, faEye, faEdit, faTrash, faExternalLinkAlt)
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})