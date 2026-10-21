import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles
import './assets/main.scss'

// Locales
import esp from './locales/esp.json'
import ing from './locales/ing.json'

// Importaciones para Iconify offline
import { Icon, addCollection } from '@iconify/vue'
import mdiIcons from '@iconify-json/mdi/icons.json'

// Registramos toda la colección de MDI localmente para el componente <icon>
addCollection(mdiIcons)

const i18n = createI18n({
    legacy: false,
    locale: 'esp', // Español por defecto
    fallbackLocale: 'esp',
    messages: { esp, ing }
})

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

// Registramos el componente global <icon>
app.component('icon', Icon)

app.mount('#app')