<template>
    <div class="concurrent-container">
        <!-- Barra Superior Flotante -->
        <div class="top-header">
            <!-- Esquina Superior Izquierda: Contadores -->
            <div class="top-counters">
                <div class="counter-badge">
                    <Icon icon="mdi:eye" width="18" height="18" style="color: #0056b3;" />
                    <span>{{ clientStore.billetera.ojos || 0 }}</span>
                </div>
                <div class="counter-badge">
                    <Icon icon="mdi:heart" width="18" height="18" style="color: #ff4d4d;" />
                    <span>{{ clientStore.billetera.corazon || 0 }}</span>
                </div>
                <div class="counter-badge credit-badge">
                    <Icon icon="mdi:alpha-c-circle" width="18" height="18" style="color: #f59e0b;" />
                    <span>{{ clientStore.billetera.creditos || 0 }}</span>
                </div>
            </div>

            <!-- Elemento Verde de Ubicación -->
            <div
                v-if="activeTab === 'matchGrid' || activeTab === 'encounters'"
                class="location-badge-green"
                @click="openLocationModal"
                title="Editar Ubicación"
            >
                <div class="location-icon-box">
                    <Icon icon="mdi:map-marker" width="20" height="20" style="color: white;" />
                </div>
                <div class="location-text-line">
                    <span>{{ locationString }}</span>
                </div>
            </div>

            <!-- Esquina Superior Derecha: Botones FAB -->
            <div class="top-actions">
                <button
                    class="icon-fab"
                    :class="{ 'has-unread': hasUnreadNotifications }"
                    @click="goToNotifications"
                    title="Notificaciones"
                >
                    <Icon icon="mdi:bell" width="22" height="22" style="color: white;" />
                </button>
                <button class="icon-fab" @click="goToSettings" title="Configuración de Perfil">
                    <Icon icon="mdi:cog" width="22" height="22" style="color: white;" />
                </button>
            </div>
        </div>

        <!-- Área Central de Contenido Dinámico -->
        <div class="content-viewport">
            <component :is="currentSubViewComponent" />
        </div>

        <!-- Pie de Página: v-tabs -->
        <div class="bottom-tabs-footer">
            <v-tabs
                v-model="activeTab"
                bg-color="primary"
                grow
                slider-color="white"
            >
                <v-tab value="matchGrid">
                    <Icon icon="mdi:account-heart" width="26" height="26" style="color: white;" />
                </v-tab>
                <v-tab value="encounters">
                    <Icon icon="mdi:card-account-details" width="26" height="26" style="color: white;" />
                </v-tab>
                <v-tab value="likes">
                    <Icon icon="mdi:heart" width="26" height="26" style="color: white;" />
                </v-tab>
                <v-tab value="chat">
                    <Icon icon="mdi:chat" width="26" height="26" style="color: white;" />
                </v-tab>
            </v-tabs>
        </div>

        <!-- Modal Local de Pantalla Completa para Ubicación en Cascada -->
        <div v-if="showLocationModal" class="local-fullscreen-modal">
            <div class="modal-content-card">
                <h2>Configurar Ubicación</h2>
                <p>Selecciona tu zona o escríbela directamente (letras, números y espacios).</p>

                <!-- Selector de País -->
                <div class="input-group">
                    <label>País</label>
                    <select v-model="tempPaisCode" @change="onCountryChange">
                        <option value="" disabled>Selecciona un país</option>
                        <option v-for="c in countriesList" :key="c.isoCode" :value="c.isoCode">
                            {{ c.name }}
                        </option>
                    </select>
                </div>

                <!-- Selector de Provincia / Estado -->
                <div class="input-group">
                    <label>Provincia / Estado</label>
                    <select v-model="tempProvinciaCode" @change="onStateChange" :disabled="!tempPaisCode">
                        <option value="" disabled>Selecciona provincia</option>
                        <option v-for="s in statesList" :key="s.isoCode" :value="s.isoCode">
                            {{ s.name }}
                        </option>
                    </select>
                </div>

                <!-- Localidad (Select si hay listado, o Input de texto libre si está vacío) -->
                <div class="input-group">
                    <label>Localidad</label>
                    <select
                        v-if="citiesList.length > 0"
                        v-model="tempLocalidad"
                        @change="onCityChange"
                        :disabled="!tempProvinciaCode"
                    >
                        <option value="" disabled>Selecciona localidad</option>
                        <option v-for="city in citiesList" :key="city.name" :value="city.name">
                            {{ city.name }}
                        </option>
                    </select>
                    <input
                        v-else
                        type="text"
                        v-model="tempLocalidad"
                        @blur="formatTitleCase('localidad')"
                        @input="filterSpecialChars('localidad')"
                        placeholder="Ingresa localidad"
                        :disabled="!tempProvinciaCode"
                    />
                </div>

                <!-- Barrio (Select si hay listado, o Input de texto libre si está vacío) -->
                <div class="input-group">
                    <label>Barrio</label>
                    <select
                        v-if="barriosList.length > 0"
                        v-model="tempBarrio"
                        :disabled="!tempLocalidad"
                    >
                        <option value="" disabled>Selecciona un barrio / zona</option>
                        <option v-for="b in barriosList" :key="b" :value="b">
                            {{ b }}
                        </option>
                    </select>
                    <input
                        v-else
                        type="text"
                        v-model="tempBarrio"
                        @blur="formatTitleCase('barrio')"
                        @input="filterSpecialChars('barrio')"
                        placeholder="Ingresa barrio"
                        :disabled="!tempLocalidad"
                    />
                </div>

                <div class="modal-actions">
                    <button class="btn-gps" @click="detectarGPS" :disabled="loadingGPS">
                        <Icon icon="mdi:crosshairs-gps" width="20" height="20" />
                        <span>{{ loadingGPS ? 'Detectando...' : 'Obtener por GPS / Restablecer' }}</span>
                    </button>
                    <div class="footer-buttons">
                        <button class="btn-secondary" @click="showLocationModal = false">Cancelar</button>
                        <button class="btn-primary" @click="guardarUbicacion">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useClientP2PStore } from '@/stores/clientP2P'
import { useNotificationStore } from '@/stores/notificationStore'
import { Country, State, City } from 'country-state-city'

const router = useRouter()
const clientStore = useClientP2PStore()
const notifStore = useNotificationStore()

const activeTab = ref('matchGrid')
const showLocationModal = ref(false)
const loadingGPS = ref(false)

const countriesList = Country.getAllCountries()
const statesList = ref([])
const citiesList = ref([])
const barriosList = ref([])

const tempPaisCode = ref('')
const tempProvinciaCode = ref('')
const tempPaisName = ref('')
const tempProvinciaName = ref('')
const tempLocalidad = ref('')
const tempBarrio = ref('')

const MatchGrid = defineAsyncComponent(() => import('@/pages/concurrent/userPage/matchGrid.vue'))
const EncountersPage = defineAsyncComponent(() => import('@/pages/concurrent/userPage/encountersPage.vue'))
const LikesPage = defineAsyncComponent(() => import('@/pages/concurrent/userPage/likesPage.vue'))
const ChatPage = defineAsyncComponent(() => import('@/pages/concurrent/userPage/chatPage.vue'))

const currentSubViewComponent = computed(() => {
    switch (activeTab.value) {
        case 'encounters':
            return EncountersPage
        case 'likes':
            return LikesPage
        case 'chat':
            return ChatPage
        case 'matchGrid':
        default:
            return MatchGrid
    }
})

const hasUnreadNotifications = computed(() => {
    return notifStore.notifications.some(item => !item.read)
})

const locationString = computed(() => {
    const u = clientStore.ubicacion
    const partes = [u.barrio, u.localidad, u.provincia, u.pais].filter(Boolean)
    return partes.length > 0 ? partes.join(', ') : 'Seleccionar ubicación GPS'
})

// Filtrar puntos y caracteres especiales en tiempo real (solo letras, números y espacios)
const filterSpecialChars = (field) => {
    const regex = /[^a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ]/g
    if (field === 'localidad') {
        tempLocalidad.value = tempLocalidad.value.replace(regex, '')
    } else if (field === 'barrio') {
        tempBarrio.value = tempBarrio.value.replace(regex, '')
    }
}

// Formatear al salir de foco (@blur) en formato "Título Título"
const formatTitleCase = (field) => {
    let val = ''
    if (field === 'localidad') {
        val = tempLocalidad.value
    } else if (field === 'barrio') {
        val = tempBarrio.value
    }

    if (!val) return

    const formatted = val
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    if (field === 'localidad') {
        tempLocalidad.value = formatted
    } else if (field === 'barrio') {
        tempBarrio.value = formatted
    }
}

const openLocationModal = () => {
    const u = clientStore.ubicacion
    tempPaisName.value = u.pais || ''
    tempProvinciaName.value = u.provincia || ''
    tempLocalidad.value = u.localidad || ''
    tempBarrio.value = u.barrio || ''

    const foundCountry = countriesList.find(c => c.name === u.pais)
    if (foundCountry) {
        tempPaisCode.value = foundCountry.isoCode
        statesList.value = State.getStatesOfCountry(foundCountry.isoCode)

        const foundState = statesList.value.find(s => s.name === u.provincia)
        if (foundState) {
            tempProvinciaCode.value = foundState.isoCode
            citiesList.value = City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode)
            barriosList.value = []
        }
    }

    showLocationModal.value = true
}

const onCountryChange = () => {
    const countryObj = Country.getCountryByCode(tempPaisCode.value)
    tempPaisName.value = countryObj ? countryObj.name : ''

    statesList.value = State.getStatesOfCountry(tempPaisCode.value)
    tempProvinciaCode.value = ''
    tempProvinciaName.value = ''
    citiesList.value = []
    tempLocalidad.value = ''
    barriosList.value = []
    tempBarrio.value = ''
}

const onStateChange = () => {
    const stateObj = statesList.value.find(s => s.isoCode === tempProvinciaCode.value)
    tempProvinciaName.value = stateObj ? stateObj.name : ''

    citiesList.value = City.getCitiesOfState(tempPaisCode.value, tempProvinciaCode.value)
    tempLocalidad.value = ''
    barriosList.value = []
    tempBarrio.value = ''
}

const onCityChange = () => {
    barriosList.value = []
    tempBarrio.value = ''
}

const guardarUbicacion = () => {
    formatTitleCase('localidad')
    formatTitleCase('barrio')
    clientStore.setUbicacion(tempPaisName.value, tempProvinciaName.value, tempLocalidad.value, tempBarrio.value)
    showLocationModal.value = false
}

const detectarGPS = async () => {
    loadingGPS.value = true
    await clientStore.detectarUbicacionGPS()

    const u = clientStore.ubicacion
    tempPaisName.value = u.pais
    tempProvinciaName.value = u.provincia
    tempLocalidad.value = u.localidad
    tempBarrio.value = u.barrio

    const foundCountry = countriesList.find(c => c.name === u.pais)
    if (foundCountry) {
        tempPaisCode.value = foundCountry.isoCode
        statesList.value = State.getStatesOfCountry(foundCountry.isoCode)

        const foundState = statesList.value.find(s => s.name === u.provincia)
        if (foundState) {
            tempProvinciaCode.value = foundState.isoCode
            citiesList.value = City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode)
            barriosList.value = citiesList.value.length > 0 ? [] : []
        }
    }
    loadingGPS.value = false
}

const goToNotifications = () => {
    router.push({ name: 'NotificationPage' })
}

const goToSettings = () => {
    router.push({ name: 'ProfileSettings' })
}
</script>

<style scoped>
.concurrent-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f4f6f9;
    overflow: hidden;
    font-family: sans-serif;
}

.top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    z-index: 10;
    gap: 12px;
}

.top-counters {
    display: flex;
    gap: 8px;
}

.counter-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #f0f2f5;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
    color: #333;
    border: 1px solid #e2e8f0;
}

.location-badge-green {
    flex: 1;
    max-width: 380px;
    height: 40px;
    background-color: #2e7d32;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.35);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.location-badge-green:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(46, 125, 50, 0.45);
}

.location-icon-box {
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
}

.location-text-line {
    flex: 1;
    color: white;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.top-actions {
    display: flex;
    gap: 10px;
}

.icon-fab {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #0056b3;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 86, 179, 0.3);
    transition: background-color 0.2s, transform 0.15s ease;
}

.icon-fab.has-unread {
    background-color: #d9534f;
    box-shadow: 0 4px 10px rgba(217, 83, 79, 0.4);
}

.icon-fab.has-unread:hover {
    background-color: #c9302c;
    transform: scale(1.05);
}

.content-viewport {
    flex: 1;
    overflow-y: auto;
    position: relative;
}

.bottom-tabs-footer {
    width: 100%;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 10;
}

.local-fullscreen-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content-card {
    background: white;
    width: 90%;
    max-width: 400px;
    padding: 24px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-content-card h2 {
    margin: 0;
    font-size: 20px;
    color: #2e7d32;
}

.modal-content-card p {
    margin: 0;
    font-size: 13px;
    color: #666;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.input-group label {
    font-size: 12px;
    font-weight: bold;
    color: #444;
}

.input-group select,
.input-group input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    background-color: #fff;
    width: 100%;
}

.input-group select:disabled,
.input-group input:disabled {
    background-color: #f0f0f0;
    color: #999;
    cursor: not-allowed;
}

.modal-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}

.btn-gps {
    background-color: #2e7d32;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
}

.btn-gps:disabled {
    background-color: #81c784;
    cursor: not-allowed;
}

.footer-buttons {
    display: flex;
    gap: 10px;
}

.btn-secondary {
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
    flex: 1;
    cursor: pointer;
}

.btn-primary {
    background-color: #0056b3;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
    flex: 1;
    cursor: pointer;
}
</style>