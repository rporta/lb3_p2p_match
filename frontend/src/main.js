import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
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
import { es } from 'vuetify/locale' // Importar idioma español

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
    locale: {
        locale: 'es',
        fallback: 'en',
        messages: { es }
    }
})

const app = createApp(App)

const pinia = createPinia()

// Habilitar persistencia global en Pinia
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

// Registramos el componente global <icon>
app.component('icon', Icon)

app.mount('#app')