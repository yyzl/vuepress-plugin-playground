import './styles/style.styl'
import './styles/code.css'
import VuepressPlaygroud from './components/VuepressPlaygroud.vue'
import Custom from './components/Custom.vue'

export default function({ Vue }) {
  Vue.component('VuepressPlaygroudDefault', VuepressPlaygroud)
  Vue.component('playground-custom', Custom)
}
