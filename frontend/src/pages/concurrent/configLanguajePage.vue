<template>
    <div class="page-container">
        <!-- Encabezado con Botón FAB Circular de retorno -->
        <div class="page-header">
            <button class="icon-fab-back" @click="goBack" title="Volver">
                <Icon icon="mdi:arrow-left" width="22" height="22" style="color: white;" />
            </button>
            <h2>Configurar Idioma</h2>
        </div>

        <div class="content-body">
            <div class="settings-card">
                <p class="subtitle">Selecciona el idioma de preferencia para la interfaz:</p>

                <div class="options-container">
                    <div
                        v-for="lang in availableLanguages"
                        :key="lang.code"
                        :class="['language-item', appStore.locale === lang.code ? 'active' : '']"
                        @click="changeLanguage(lang.code)"
                    >
                        <div class="d-flex align-center gap-3">
                            <span class="flag-icon">{{ lang.flag }}</span>
                            <span class="lang-name">{{ lang.name }}</span>
                        </div>
                        <Icon
                            v-if="appStore.locale === lang.code"
                            icon="mdi:check-circle"
                            width="24"
                            height="24"
                            style="color: #0056b3;"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocale } from 'vuetify'
import { useAppStore } from '@/stores/appStore'
import vuetifyLangMap from '@/locales/vuetifyLangMap.json'

const router = useRouter()
const { locale } = useI18n()
const vuetifyLocale = useLocale()
const appStore = useAppStore()

const availableLanguages = [
    { code: 'esp', name: 'Español', flag: '🇦🇷' },
    // { code: 'ing', name: 'English', flag: '🇺🇸' }
]

const goBack = () => {
    router.push({ name: 'ProfileSettingsPage' })
}

const changeLanguage = (langCode) => {
    // 1. Actualizar el store persistente
    appStore.setLocale(langCode)

    // 2. Cambiar idioma en vue-i18n
    locale.value = langCode

    // 3. Cambiar idioma en Vuetify
    if (vuetifyLocale.current.value) {
        vuetifyLocale.current.value = vuetifyLangMap[langCode] || 'es'
    }
}
</script>

<style scoped>
.page-container {
    min-height: 100vh;
    background-color: #f4f6f9;
    display: flex;
    flex-direction: column;
}

.page-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background-color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.icon-fab-back {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: #0056b3;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 86, 179, 0.3);
}

.page-header h2 {
    font-size: 20px;
    margin: 0;
    color: #333;
}

.content-body {
    padding: 16px;
}

.settings-card {
    background-color: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.language-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.2s;
}

.language-item:hover {
    border-color: #0056b3;
    background-color: #f8fafc;
}

.language-item.active {
    border-color: #0056b3;
    background-color: rgba(0, 86, 179, 0.04);
}

.flag-icon {
    font-size: 22px;
}

.lang-name {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}
</style>