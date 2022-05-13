import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

import { createPinia, PiniaVuePlugin } from 'pinia'


Vue.use(PiniaVuePlugin)


Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n


  const pinia = createPinia()
	app.pinia = pinia
}

export { i18n }
