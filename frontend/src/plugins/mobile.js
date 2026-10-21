import { useDisplay } from 'vuetify'

// Exportamos la estructura del plugin requerida por Vue
export default {
    install(app) {
        // Inyecta $mobile de forma segura reactiva mediante getters
        Object.defineProperty(app.config.globalProperties, '$mobile', {
            get: () => useDisplay().mobile.value,
            enumerable: true
        })
    }
}