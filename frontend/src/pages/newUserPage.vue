<template>
    <div class="new-user-fullscreen">
        <!-- Pantalla de Bienvenida Inicial con estilo moderno -->
        <div v-if="!started" class="welcome-screen">
            <div class="welcome-card-glow">
                <Icon icon="mdi:heart-pulse" width="64" height="64" class="welcome-pulse-icon" />
                <h1 class="welcome-title">P2P Match</h1>
                <p class="welcome-subtitle">Bienvenido, vamos a crear tu usuario</p>
                <button class="btn-primary start-btn" @click="started = true">
                    <Icon icon="mdi:rocket-launch" width="20" height="20" /> Comencemos
                </button>
            </div>
        </div>

        <!-- Carrusel de Sub-vistas centrado -->
        <div v-else class="carousel-container">

            <!-- SUB-VIEW 1: Datos Personales con Iconos y Centrado -->
            <div v-if="currentStep === 1" class="sub-view-card">
                <h2>Completa tus datos</h2>

                <div class="input-group">
                    <label>Nombre</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:account" /></span>
                        <input type="text" v-model="nombre" placeholder="Ingresa tu nombre" />
                    </div>
                    <span class="error-msg">{{ errors.nombre }}</span>
                </div>

                <div class="input-group">
                    <label>Apellido</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:account-details" /></span>
                        <input type="text" v-model="apellido" placeholder="Ingresa tu apellido" />
                    </div>
                    <span class="error-msg">{{ errors.apellido }}</span>
                </div>

                <div class="input-group">
                    <label>Alias</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:at" /></span>
                        <input type="text" v-model="alias" placeholder="Ingresa tu alias" />
                    </div>
                    <span class="error-msg">{{ errors.alias }}</span>
                </div>

                <div class="actions-footer">
                    <button
                        v-if="nombre || apellido || alias"
                        class="btn-clear"
                        @click="limpiarSubView1"
                    >
                        <Icon icon="mdi:broom" /> Limpiar
                    </button>
                    <button
                        class="btn-primary"
                        :disabled="!isStep1Valid"
                        @click="currentStep = 2"
                    >
                        Siguiente <Icon icon="mdi:arrow-right" />
                    </button>
                </div>
            </div>

            <!-- SUB-VIEW 2: Edad / Fecha de Nacimiento -->
            <div v-if="currentStep === 2" class="sub-view-card">
                <h2>¿Qué edad tienes?</h2>

                <div class="input-group">
                    <label>Fecha de Nacimiento (DD/MM/YYYY)</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:calendar" /></span>
                        <!-- Input formateado en tiempo real con tipeo continuo (ej. 14081990) -->
                        <input
                            type="text"
                            v-model="inputValue"
                            @input="onManualInput"
                            placeholder="DD/MM/YYYY"
                            maxlength="10"
                        />
                    </div>

                    <!-- Menú de Vuetify Date Picker -->
                    <v-menu
                        v-model="menuDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        @update:model-value="onMenuToggle"
                    >
                        <template v-slot:activator="{ props }">
                            <button
                                v-bind="props"
                                class="btn-secondary mt-2"
                                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;"
                            >
                                <Icon icon="mdi:calendar-search" /> Abrir Calendario
                            </button>
                        </template>
                        <v-date-picker
                            v-model="pickerDate"
                            color="primary"
                            locale="es"
                            @update:model-value="onDateSelected"
                        ></v-date-picker>
                    </v-menu>
                    <!-- Mostramos el error de Vee-Validate solo si la fecha no está completa -->
                    <span class="error-msg" v-if="!isDateComplete">{{ errors.edad }}</span>
                </div>

                <div class="actions-footer">
                    <button class="btn-secondary" @click="currentStep = 1">
                        <Icon icon="mdi:arrow-left" /> Atrás
                    </button>
                    <button
                        v-if="edad || inputValue"
                        class="btn-clear"
                        @click="limpiarFecha"
                    >
                        <Icon icon="mdi:broom" /> Limpiar
                    </button>
                    <button
                        class="btn-primary"
                        :disabled="!isStep2Valid"
                        @click="currentStep = 3"
                    >
                        Siguiente <Icon icon="mdi:arrow-right" />
                    </button>
                </div>
            </div>

            <!-- SUB-VIEW 3: Foto de Perfil -->
            <div v-if="currentStep === 3" class="sub-view-card">
                <h2>Carga una foto de perfil</h2>

                <div class="avatar-section">
                    <div class="avatar-circle" @click="triggerFileInput">
                        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                        <div v-else class="plus-icon-container">
                            <Icon icon="mdi:camera-plus" width="40" height="40" style="color: #0056b3;" />
                        </div>
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="hidden-input"
                        @change="onFileSelected"
                    />
                </div>
                <span class="error-msg text-center">{{ errors.avatarUrl }}</span>

                <div class="actions-footer">
                    <button class="btn-secondary" @click="currentStep = 2">
                        <Icon icon="mdi:arrow-left" /> Atrás
                    </button>
                    <button
                        v-if="avatarUrl || avatarBlob"
                        class="btn-clear"
                        @click="limpiarAvatar"
                    >
                        <Icon icon="mdi:broom" /> Limpiar
                    </button>
                    <button
                        class="btn-primary"
                        :disabled="!isStep3Valid"
                        @click="completarRegistro"
                    >
                        Completar <Icon icon="mdi:check" />
                    </button>
                </div>
            </div>

        </div>

        <!-- Modal de Recorte Circular de Avatar -->
        <div v-if="showCropper" class="cropper-modal">
            <div class="cropper-box">
                <h3>Ajusta tu Avatar</h3>
                <div
                    class="canvas-container"
                    @mousedown="startDrag"
                    @mousemove="onDrag"
                    @mouseup="stopDrag"
                    @touchstart="startDrag"
                    @touchmove="onDrag"
                    @touchend="stopDrag"
                >
                    <canvas ref="cropCanvas" width="280" height="280"></canvas>
                    <div class="circular-mask-overlay"></div>
                </div>
                <div class="cropper-controls">
                    <label>Zoom:</label>
                    <input type="range" min="0.5" max="3" step="0.05" v-model.number="zoom" @input="drawCanvas" />
                </div>
                <div class="cropper-actions">
                    <button class="btn-secondary" @click="showCropper = false">
                        <Icon icon="mdi:close" /> Cancelar
                    </button>
                    <button class="btn-primary" @click="applyCrop">
                        <Icon icon="mdi:crop" /> Aplicar y Recortar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useClientP2PStore } from '@/stores/clientP2P'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const clientStore = useClientP2PStore()
const appStore = useAppStore()

const started = ref(false)
const currentStep = ref(1)

const fileInput = ref(null)
const showCropper = ref(false)
const cropCanvas = ref(null)
const menuDate = ref(false)
const pickerDate = ref(null)
const inputValue = ref('')

let imageObj = new Image()
let imgX = 0
let imgY = 0
let isDragging = false
let startX = 0
let startY = 0
const zoom = ref(1)

const schema = yup.object({
    nombre: yup.string().required('El nombre es obligatorio').min(2, 'Mínimo 2 caracteres'),
    apellido: yup.string().required('El apellido es obligatorio').min(2, 'Mínimo 2 caracteres'),
    alias: yup.string().required('El alias es obligatorio').min(2, 'Mínimo 2 caracteres'),
    edad: yup.string().required('La fecha de nacimiento es obligatoria'),
    avatarUrl: yup.string().required('La foto de perfil es obligatoria')
})

const { errors, handleSubmit, setFieldValue } = useForm({
    validationSchema: schema,
    initialValues: {
        nombre: clientStore.nombre || '',
        apellido: clientStore.apellido || '',
        alias: clientStore.alias || '',
        edad: clientStore.edad || '',
        avatarUrl: clientStore.avatarUrl || ''
    }
})

const { value: nombre } = useField('nombre')
const { value: apellido } = useField('apellido')
const { value: alias } = useField('alias')
const { value: edad } = useField('edad')
const { value: avatarUrl } = useField('avatarUrl')

const avatarBlob = ref(null)

// Validación robusta y directa basada en los componentes extraídos del string
const isDateComplete = computed(() => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = inputValue.value.match(regex)
    if (!match) return false

    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)

    if (year < 1900 || year > new Date().getFullYear()) return false
    if (month < 1 || month > 12) return false

    const daysInMonth = new Date(year, month, 0).getDate()
    if (day < 1 || day > daysInMonth) return false

    return true
})

onMounted(() => {
    if (clientStore.nombre || clientStore.apellido || clientStore.alias) {
        started.value = true
    }
    if (edad.value) {
        const parts = edad.value.split('-')
        if (parts.length === 3) {
            const [year, month, day] = parts
            inputValue.value = `${day}/${month}/${year}`
            pickerDate.value = new Date(Number(year), Number(month) - 1, Number(day))
        }
    }
})

// Tipeo fácil con autocompletado automático y sincronización con Vee-Validate
const onManualInput = (event) => {
    let val = event.target.value.replace(/\D/g, '') // Extraer solo dígitos

    if (val.length > 8) val = val.slice(0, 8)

    let formatted = ''
    if (val.length > 4) {
        formatted = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`
    } else if (val.length > 2) {
        formatted = `${val.slice(0, 2)}/${val.slice(2)}`
    } else {
        formatted = val
    }

    inputValue.value = formatted

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = formatted.match(regex)
    if (match) {
        const day = parseInt(match[1], 10)
        const month = parseInt(match[2], 10)
        const year = parseInt(match[3], 10)

        const daysInMonth = new Date(year, month, 0).getDate()
        if (year >= 1900 && year <= new Date().getFullYear() && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth) {
            const formattedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            edad.value = formattedDateStr
            setFieldValue('edad', formattedDateStr) // Sincroniza explícitamente con Vee-Validate
            pickerDate.value = new Date(year, month - 1, day)
        } else {
            edad.value = ''
        }
    } else {
        edad.value = ''
    }
}

// Sincronizar el picker al desplegar el menú de Vuetify
const onMenuToggle = (isOpen) => {
    if (isOpen && isDateComplete.value) {
        const [day, month, year] = inputValue.value.split('/')
        pickerDate.value = new Date(Number(year), Number(month) - 1, Number(day))
    }
}

// Cierre automático del calendario al seleccionar un día
const onDateSelected = (date) => {
    if (!date) return
    const d = new Date(date)

    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')

    const formattedDateStr = `${year}-${month}-${day}`
    edad.value = formattedDateStr
    setFieldValue('edad', formattedDateStr) // Sincroniza explícitamente con Vee-Validate
    inputValue.value = `${day}/${month}/${year}`
    menuDate.value = false
}

const limpiarFecha = () => {
    inputValue.value = ''
    edad.value = ''
    setFieldValue('edad', '')
    pickerDate.value = null
}

const isStep1Valid = computed(() => {
    return nombre.value && apellido.value && alias.value && !errors.value.nombre && !errors.value.apellido && !errors.value.alias
})

const isStep2Valid = computed(() => {
    return isDateComplete.value
})

const isStep3Valid = computed(() => {
    return avatarUrl.value && !errors.value.avatarUrl
})

const limpiarSubView1 = () => {
    nombre.value = ''
    apellido.value = ''
    alias.value = ''
}

const limpiarAvatar = () => {
    avatarUrl.value = ''
    avatarBlob.value = null
}

const triggerFileInput = () => {
    fileInput.value.click()
}

const onFileSelected = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        imageObj.src = e.target.result
        imageObj.onload = () => {
            zoom.value = 1
            imgX = (280 - imageObj.width) / 2
            imgY = (280 - imageObj.height) / 2
            showCropper.value = true
            setTimeout(drawCanvas, 50)
        }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
}

const drawCanvas = () => {
    if (!cropCanvas.value) return
    const ctx = cropCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, 280, 280)

    ctx.save()
    ctx.translate(140, 140)
    ctx.scale(zoom.value, zoom.value)
    ctx.translate(-140, -140)
    ctx.drawImage(imageObj, imgX, imgY)
    ctx.restore()
}

const startDrag = (e) => {
    isDragging = true
    startX = (e.clientX || e.touches[0].clientX) - imgX
    startY = (e.clientY || e.touches[0].clientY) - imgY
}

const onDrag = (e) => {
    if (!isDragging) return
    imgX = (e.clientX || e.touches[0].clientX) - startX
    imgY = (e.clientY || e.touches[0].clientY) - startY
    drawCanvas()
}

const stopDrag = () => {
    isDragging = false
}

const applyCrop = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.arc(100, 100, 100, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillRect(0, 0, 200, 200)

    ctx.save()
    ctx.translate(100, 100)
    ctx.scale(zoom.value * (200 / 280), zoom.value * (200 / 280))
    ctx.translate(-140, -140)
    ctx.drawImage(imageObj, imgX, imgY)
    ctx.restore()

    canvas.toBlob((blob) => {
        avatarBlob.value = blob
        avatarUrl.value = URL.createObjectURL(blob)
        showCropper.value = false
    }, 'image/png')
}

const completarRegistro = handleSubmit(async (formValues) => {
    appStore.setLoading(true)

    try {
        clientStore.setDatosPersonales(formValues.nombre, formValues.apellido, formValues.alias, formValues.edad)

        if (avatarBlob.value) {
            await clientStore.agregarFoto(avatarBlob.value)
            clientStore.avatarUrl = avatarUrl.value
        }

        setTimeout(() => {
            appStore.setLoading(false)
            router.push({ name: 'ConcurrentUser' })
        }, 1200)

    } catch (error) {
        console.error("Error al completar el registro:", error)
        appStore.setLoading(false)
    }
})
</script>

<style scoped>
.new-user-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f6f9;
    overflow: hidden;
    font-family: sans-serif;
}

.welcome-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #0056b3 0%, #003366 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.welcome-card-glow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px;
    border-radius: 20px;
    animation: fadeIn 0.5s ease-in-out;
    text-align: center;
}

.welcome-title {
    color: white;
    font-size: 38px;
    font-weight: bold;
    letter-spacing: 1.5px;
    margin: 0;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.welcome-subtitle {
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
    margin: 0 0 10px 0;
}

.welcome-pulse-icon {
    color: white;
    animation: pulse 1.5s infinite ease-in-out;
}

.start-btn {
    background-color: white !important;
    color: #0056b3 !important;
    padding: 14px 28px !important;
    font-size: 16px !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s, background-color 0.2s;
}

.start-btn:hover {
    background-color: #f0f4f8 !important;
    transform: scale(1.05);
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.carousel-container {
    width: 100%;
    max-width: 440px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
}

.sub-view-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
}

.sub-view-card h2 {
    font-size: 22px;
    color: #0056b3;
    margin-bottom: 5px;
    text-align: center;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}

.input-group label {
    font-size: 14px;
    font-weight: bold;
    color: #444;
}

.input-with-icon {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    overflow: hidden;
    transition: border-color 0.2s;
}

.input-with-icon:focus-within {
    border-color: #0056b3;
    box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.15);
}

.input-icon {
    padding: 0 12px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-with-icon input {
    flex: 1;
    padding: 12px 12px 12px 0;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
}

.error-msg {
    color: #d9534f;
    font-size: 12px;
    min-height: 16px;
}

.text-center {
    text-align: center;
}

.actions-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    gap: 8px;
    width: 100%;
}

.btn-primary {
    background-color: #0056b3;
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
}

.btn-primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
}

.btn-secondary.btn-disabled {
    background-color: #e0e0e0 !important;
    color: #999 !important;
    opacity: 0.6;
    cursor: not-allowed !important;
    box-shadow: none !important;
}

.btn-clear {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 10px 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
}

.avatar-section {
    display: flex;
    justify-content: center;
    margin: 10px 0;
}

.avatar-circle {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f0f0;
    border: 3px dashed #0056b3;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.plus-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.hidden-input {
    display: none;
}

.cropper-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.cropper-box {
    background: white;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 320px;
}

.canvas-container {
    position: relative;
    width: 280px;
    height: 280px;
    cursor: grab;
    overflow: hidden;
    background: #111;
    border-radius: 8px;
}

.circular-mask-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 280px;
    height: 280px;
    box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.75);
    border-radius: 50%;
    pointer-events: none;
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.cropper-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.cropper-controls input[type="range"] {
    width: 100%;
}

.cropper-actions {
    display: flex;
    gap: 10px;
    width: 100%;
}
</style>