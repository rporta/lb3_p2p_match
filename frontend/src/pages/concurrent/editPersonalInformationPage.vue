<template>
    <div class="page-container">
        <!-- Encabezado con Botón FAB Circular de retorno -->
        <div class="page-header">
            <button class="icon-fab-back" @click="goBack" title="Volver">
                <Icon icon="mdi:arrow-left" width="22" height="22" style="color: white;" />
            </button>
            <h2>Editar información personal</h2>
        </div>

        <div class="content-body">
            <form @submit.prevent="guardarCambios" class="edit-card">

                <!-- Avatar Principal -->
                <div class="section-block">
                    <label class="section-title">Foto de Perfil Principal</label>
                    <div class="avatar-section">
                        <div class="avatar-circle" @click="triggerAvatarInput">
                            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" />
                            <div v-else class="plus-icon-container">
                                <Icon icon="mdi:camera-plus" width="36" height="36" style="color: #0056b3;" />
                            </div>
                        </div>
                        <input
                            ref="avatarFileInput"
                            type="file"
                            accept="image/*"
                            class="hidden-input"
                            @change="onAvatarSelected"
                        />
                    </div>
                </div>

                <!-- Datos Personales -->
                <div class="input-group">
                    <label>Nombre</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:account" /></span>
                        <input type="text" v-model="nombre" placeholder="Nombre" required />
                    </div>
                </div>

                <div class="input-group">
                    <label>Apellido</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:account-details" /></span>
                        <input type="text" v-model="apellido" placeholder="Apellido" required />
                    </div>
                </div>

                <div class="input-group">
                    <label>Alias</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:at" /></span>
                        <input type="text" v-model="alias" placeholder="Alias" required />
                    </div>
                </div>

                <!-- Fecha de Nacimiento -->
                <div class="input-group">
                    <label>Fecha de Nacimiento (DD/MM/YYYY)</label>
                    <div class="input-with-icon">
                        <span class="input-icon"><Icon icon="mdi:calendar" /></span>
                        <input
                            type="text"
                            v-model="inputValue"
                            @input="onManualInput"
                            placeholder="DD/MM/YYYY"
                            maxlength="10"
                        />
                    </div>

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
                                type="button"
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
                </div>

                <!-- Sexo -->
                <div class="input-group">
                    <label>Sexo</label>
                    <div class="options-grid">
                        <button
                            type="button"
                            v-for="opt in ['Hombre', 'Mujer', 'Otro']"
                            :key="opt"
                            :class="['option-chip', sexo === opt ? 'active' : '']"
                            @click="sexo = opt"
                        >
                            {{ opt }}
                        </button>
                    </div>
                </div>

                <!-- Descripción del perfil -->
                <div class="input-group">
                    <label>Descripción</label>
                    <textarea
                        v-model="descripcion"
                        rows="3"
                        placeholder="Escribe tu descripción..."
                        class="textarea-input"
                    ></textarea>
                </div>

                <!-- Qué estás buscando -->
                <div class="input-group">
                    <label>¿Qué estás buscando?</label>
                    <div class="options-grid vertical">
                        <button
                            type="button"
                            v-for="opt in ['Hombre', 'Mujer', 'Ambos']"
                            :key="opt"
                            :class="['option-chip', buscando === opt ? 'active' : '']"
                            @click="buscando = opt"
                        >
                            {{ opt }}
                        </button>
                    </div>
                </div>

                <!-- Galería de 5 Fotos -->
                <div class="section-block">
                    <label class="section-title">Fotos de Perfil (Hasta 5)</label>
                    <div class="media-grid">
                        <div
                            v-for="(foto, index) in 5"
                            :key="'foto-' + index"
                            class="media-slot"
                            @click="triggerPhotoInput(index)"
                        >
                            <img v-if="fotosPerfil[index]" :src="fotosPerfil[index]" class="media-preview" />
                            <div v-else class="plus-icon-container">
                                <Icon icon="mdi:camera-plus-outline" width="24" height="24" style="color: #0056b3;" />
                            </div>
                            <button
                                v-if="fotosPerfil[index]"
                                type="button"
                                class="btn-remove-media"
                                @click.stop="eliminarFoto(index)"
                            >
                                <Icon icon="mdi:close" width="14" height="14" />
                            </button>
                        </div>
                    </div>
                    <input
                        ref="photoFileInput"
                        type="file"
                        accept="image/*"
                        class="hidden-input"
                        @change="onPhotoSelected"
                    />
                </div>

                <!-- Galería de 5 Videos -->
                <div class="section-block">
                    <label class="section-title">Videos de Perfil (Hasta 5)</label>
                    <div class="media-grid">
                        <div
                            v-for="(video, index) in 5"
                            :key="'video-' + index"
                            class="media-slot"
                            @click="triggerVideoInput(index)"
                        >
                            <video v-if="videosPerfil[index]" :src="videosPerfil[index]" class="media-preview" muted></video>
                            <div v-else class="plus-icon-container">
                                <Icon icon="mdi:video-plus-outline" width="24" height="24" style="color: #0056b3;" />
                            </div>
                            <button
                                v-if="videosPerfil[index]"
                                type="button"
                                class="btn-remove-media"
                                @click.stop="eliminarVideo(index)"
                            >
                                <Icon icon="mdi:close" width="14" height="14" />
                            </button>
                        </div>
                    </div>
                    <input
                        ref="videoFileInput"
                        type="file"
                        accept="video/*"
                        class="hidden-input"
                        @change="onVideoSelected"
                    />
                </div>

                <!-- Botón de Guardar -->
                <div class="actions-footer">
                    <button type="submit" class="btn-primary">
                        <Icon icon="mdi:content-save" width="20" height="20" /> Guardar Cambios
                    </button>
                </div>

            </form>
        </div>

        <!-- Modal de Recorte de Avatar -->
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
                    <button type="button" class="btn-secondary" @click="showCropper = false">
                        <Icon icon="mdi:close" /> Cancelar
                    </button>
                    <button type="button" class="btn-primary" @click="applyCrop">
                        <Icon icon="mdi:crop" /> Aplicar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientP2PStore } from '@/stores/clientP2PStore'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const clientStore = useClientP2PStore()
const appStore = useAppStore()

// Campos Reactivos
const nombre = ref('')
const apellido = ref('')
const alias = ref('')
const edad = ref('')
const sexo = ref('')
const descripcion = ref('')
const buscando = ref('')
const avatarUrl = ref('')
const fotosPerfil = ref(['', '', '', '', ''])
const videosPerfil = ref(['', '', '', '', ''])

// Controles auxiliares de Fecha
const menuDate = ref(false)
const pickerDate = ref(null)
const inputValue = ref('')

// Controles auxiliares de Archivos / Cropper
const avatarFileInput = ref(null)
const photoFileInput = ref(null)
const videoFileInput = ref(null)
let activePhotoIndex = 0
let activeVideoIndex = 0

const showCropper = ref(false)
const cropCanvas = ref(null)
let imageObj = new Image()
let imgX = 0
let imgY = 0
let isDragging = false
let startX = 0
let startY = 0
const zoom = ref(1)

// Cargar datos existentes al montar
onMounted(() => {
    nombre.value = clientStore.nombre || ''
    apellido.value = clientStore.apellido || ''
    alias.value = clientStore.alias || ''
    edad.value = clientStore.edad || ''
    sexo.value = clientStore.sexo || ''
    descripcion.value = clientStore.descripcion || ''
    buscando.value = clientStore.buscando || ''
    avatarUrl.value = clientStore.avatarUrl || ''

    if (clientStore.fotosPerfil && Array.isArray(clientStore.fotosPerfil)) {
        fotosPerfil.value = [...clientStore.fotosPerfil]
        while (fotosPerfil.value.length < 5) fotosPerfil.value.push('')
    }
    if (clientStore.videosPerfil && Array.isArray(clientStore.videosPerfil)) {
        videosPerfil.value = [...clientStore.videosPerfil]
        while (videosPerfil.value.length < 5) videosPerfil.value.push('')
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

const goBack = () => {
    router.push({ name: 'ProfileSettingsPage' })
}

// Lógica de Fecha
const onManualInput = (event) => {
    let val = event.target.value.replace(/\D/g, '')
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
            edad.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            pickerDate.value = new Date(year, month - 1, day)
        }
    }
}

const onMenuToggle = (isOpen) => {
    if (isOpen && inputValue.value) {
        const parts = inputValue.value.split('/')
        if (parts.length === 3) {
            const [day, month, year] = parts
            pickerDate.value = new Date(Number(year), Number(month) - 1, Number(day))
        }
    }
}

const onDateSelected = (date) => {
    if (!date) return
    const d = new Date(date)
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')

    edad.value = `${year}-${month}-${day}`
    inputValue.value = `${day}/${month}/${year}`
    menuDate.value = false
}

// Lógica de Avatar
const triggerAvatarInput = () => avatarFileInput.value.click()

const onAvatarSelected = (event) => {
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

const stopDrag = () => { isDragging = false }

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

    avatarUrl.value = canvas.toDataURL('image/png')
    showCropper.value = false
}

// Lógica de Fotos y Videos adicionales
const triggerPhotoInput = (index) => {
    activePhotoIndex = index
    photoFileInput.value.click()
}

const onPhotoSelected = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        fotosPerfil.value[activePhotoIndex] = e.target.result
    }
    reader.readAsDataURL(file)
    event.target.value = ''
}

const eliminarFoto = (index) => { fotosPerfil.value[index] = '' }

const triggerVideoInput = (index) => {
    activeVideoIndex = index
    videoFileInput.value.click()
}

const onVideoSelected = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        videosPerfil.value[activeVideoIndex] = e.target.result
    }
    reader.readAsDataURL(file)
    event.target.value = ''
}

const eliminarVideo = (index) => { videosPerfil.value[index] = '' }

// Guardar en Store de Pinia
const guardarCambios = () => {
    appStore.setLoading(true)

    clientStore.setDatosPersonales(
        nombre.value,
        apellido.value,
        alias.value,
        edad.value,
        sexo.value,
        descripcion.value,
        buscando.value
    )
    clientStore.avatarUrl = avatarUrl.value
    clientStore.fotosPerfil = fotosPerfil.value
    clientStore.videosPerfil = videosPerfil.value

    setTimeout(() => {
        appStore.setLoading(false)
        router.push({ name: 'ProfileSettingsPage' })
    }, 600)
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

.edit-card {
    background-color: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.section-title {
    font-size: 14px;
    font-weight: bold;
    color: #444;
}

.avatar-section {
    display: flex;
    justify-content: center;
}

.avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f0f0;
    border: 3px dashed #0056b3;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
}

.input-icon {
    padding: 0 12px;
    color: #666;
    display: flex;
    align-items: center;
}

.input-with-icon input {
    flex: 1;
    padding: 10px 10px 10px 0;
    border: none;
    outline: none;
    font-size: 15px;
    background: transparent;
}

.textarea-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
    resize: none;
    font-family: inherit;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.options-grid.vertical {
    grid-template-columns: 1fr;
}

.option-chip {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    color: #333;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    font-size: 13px;
}

.option-chip.active {
    background-color: #0056b3;
    color: white;
    border-color: #0056b3;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
}

.media-slot {
    aspect-ratio: 1;
    border-radius: 8px;
    border: 2px dashed #0056b3;
    background-color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.media-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.btn-remove-media {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(217, 83, 79, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.actions-footer {
    margin-top: 10px;
}

.btn-primary {
    background-color: #0056b3;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-secondary {
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 8px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 13px;
    cursor: pointer;
}

.hidden-input { display: none; }

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

.cropper-actions {
    display: flex;
    gap: 10px;
    width: 100%;
}
</style>