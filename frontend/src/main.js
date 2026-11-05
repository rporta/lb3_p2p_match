import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { useAppStore } from '@/stores/appStore'

// Vuetify
import 'vuetify/styles'
import { createVuetify, useDisplay } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles & Tailwind
import './assets/main.scss'

// Locales
import esp from './locales/esp.json'
import ing from './locales/ing.json'
import vuetifyLangMap from './locales/vuetifyLangMap.json' // Mapeo de códigos de idioma personalizados hacia Vuetify ('esp' -> 'es', 'ing' -> 'en')
import { es, en } from 'vuetify/locale' // Idiomas de Vuetify

// Importaciones para Iconify offline
import { Icon, addCollection } from '@iconify/vue'
import mdiIcons from '@iconify-json/mdi/icons.json'

// importaciones custom plugins
import mobile from './plugins/mobile'
import platform from './plugins/platform'

// Registramos toda la colección de MDI localmente para el componente <icon>
addCollection(mdiIcons)

// 1. Inicializamos la aplicación y Pinia primero para recuperar el estado persistido
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// 2. Obtenemos el idioma guardado en el appStore (por defecto 'esp')
const appStore = useAppStore()
const savedLocale = appStore.locale || 'esp'



const i18n = createI18n({
    legacy: false,
    locale: savedLocale, // Sincronizado con el store persistente
    fallbackLocale: 'esp',
    messages: { esp, ing }
})

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        locale: vuetifyLangMap[savedLocale] || 'es',
        fallback: 'en',
        messages: { es, en }
    }
})

// Registramos el router, i18n y vuetify
app.use(router)
app.use(vuetify)
app.use(i18n)

// Registramos el componente global <icon>
app.component('icon', Icon)

// Registramos plugins custom de plataforma y móvil
app.use(mobile)
app.use(platform)

app.mount('#app')