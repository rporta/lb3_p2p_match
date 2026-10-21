<template>
    <v-card outlined class="pa-3">
        <div class="d-flex align-center justify-space-between mb-2">
            <h3 class="text-subtitle-1 font-weight-bold flex items-center gap-1">
                <icon icon="mdi:webcam" class="text-gray-700" />
                <span>Chat y Sesión con: {{ activePeerId || 'Selecciona un usuario' }}</span>
            </h3>

            <!-- Botón de Cortar Llamada -->
            <v-btn
                v-if="isCallActive"
                color="error"
                size="small"
                variant="flat"
                @click="$emit('hang-up')"
            >
                <icon icon="mdi:phone-hangup" class="mr-1" />
                Cortar Llamada
            </v-btn>
        </div>

        <!-- Streams Multimedia (Videollamada) -->
        <v-row v-if="isVideoCall" class="mb-2">
            <v-col cols="6">
                <small class="font-weight-bold text--secondary flex items-center gap-1 mb-1">
                    <icon icon="mdi:camera" />
                    <span>Mi Cámara</span>
                </small>
                <video ref="localVideo" autoplay muted playsinline class="media-box"></video>
            </v-col>
            <v-col cols="6">
                <small class="font-weight-bold text--secondary flex items-center gap-1 mb-1">
                    <icon icon="mdi:account-video" />
                    <span>Remoto</span>
                </small>
                <video ref="remoteVideo" autoplay playsinline class="media-box"></video>
            </v-col>
        </v-row>

        <!-- Elemento de Audio Remoto (Llamadas de Voz P2P) -->
        <audio ref="remoteAudioElement" autoplay playsinline class="d-none"></audio>

        <!-- Chat P2P -->
        <div class="chat-container">
            <div ref="chatMessages" class="chat-box mb-2">

                <div v-for="(msg, index) in chatLogs" :key="index"
                     :class="['message-row', isMyMessage(msg) ? 'message-right' : 'message-left']">
                    <div class="message-bubble">
                        <div class="text-xs font-bold text-gray-600 mb-0.5">{{ msg.sender }}</div>

                        <!-- 1. Texto / Banderas unificadas -->
                        <div v-if="getMessageType(msg) === 'text'" class="text-sm m-0 text-message-body">
                            <template v-for="(segment, sIdx) in parseTextWithFlags(getMessageText(msg))" :key="sIdx">
                                <img v-if="segment.type === 'flag'" :src="segment.url" alt="Bandera" class="inline-flag-img" />
                                <span v-else>{{ segment.content }}</span>
                            </template>
                        </div>

                        <!-- 2. Audio -->
                        <div v-else-if="getMessageType(msg) === 'audio'" class="voice-note-container">
                            <button class="play-voice-btn" @click="toggleAudioPlayback(msg, index)">
                                <icon :icon="playingAudioIndex === index ? 'mdi:pause' : 'mdi:play'" width="22" height="22" />
                            </button>
                            <div class="voice-waveform-box">
                                <div class="waveform-bars">
                                    <span v-for="n in 22" :key="n" class="bar" :style="{ height: `${Math.sin(n) * 12 + 16}px` }"></span>
                                </div>
                                <div class="voice-info-line">
                                    <span class="voice-duration">Nota de voz</span>
                                    <icon icon="mdi:microphone" width="14" height="14" class="text-blue-400" />
                                </div>
                            </div>
                            <audio :ref="el => { if (el) audioElements[index] = el }" :src="getMessageContent(msg)" @ended="playingAudioIndex = null" class="d-none"></audio>
                        </div>

                        <!-- 3. Imagen -->
                        <div v-else-if="getMessageType(msg) === 'image'" class="media-preview-box clickable" @click="openMediaFullscreen(getMessageContent(msg))">
                            <img :src="getMessageContent(msg)" alt="Imagen enviada" class="chat-media-content" />
                        </div>

                        <!-- 4. Video -->
                        <div v-else-if="getMessageType(msg) === 'video'" class="media-preview-box">
                            <video :src="getMessageContent(msg)" controls playsinline class="chat-media-content"></video>
                        </div>

                        <div class="message-footer flex items-center justify-end gap-1 mt-1">
                            <span class="text-[10px] text-gray-400">{{ msg.time || getCurrentTime() }}</span>
                            <div v-if="isMyMessage(msg)" class="flex items-center">
                                <icon :icon="msg.read ? 'mdi:check-all' : 'mdi:check'"
                                      :class="msg.read ? 'text-blue-500 text-xs' : 'text-gray-400 text-xs'" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Burbuja de Tipeo -->
                <div v-if="remoteTyping" class="message-row message-left mb-2">
                    <div class="message-bubble typing-bubble py-2 px-3">
                        <div class="flex items-center gap-1">
                            <span class="dot animate-bounce">.</span>
                            <span class="dot animate-bounce delay-150">.</span>
                            <span class="dot animate-bounce delay-300">.</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Barra Inferior de Entrada -->
            <div class="chat-input-bar-wrapper">
                <!-- Estado 1: Grabando Nota de Voz -->
                <div v-if="isRecording" class="recording-bar-overlay">
                    <div class="recording-status flex items-center gap-2">
                        <icon icon="mdi:microphone" width="24" height="24" class="text-red-500 animate-pulse" />
                        <span class="font-bold text-sm text-red-600">{{ formatRecordTime(recordingDuration) }}</span>
                        <span class="text-xs text-gray-500 ml-2">Grabando nota de voz...</span>
                    </div>
                    <div class="recording-actions flex gap-2">
                        <v-btn icon size="small" variant="text" color="error" @click="cancelRecording" title="Cancelar">
                            <icon icon="mdi:delete" width="22" height="22" />
                        </v-btn>
                        <v-btn icon size="small" color="success" @click="stopAndSendRecording" title="Enviar audio">
                            <icon icon="mdi:send" width="20" height="20" />
                        </v-btn>
                    </div>
                </div>

                <!-- Estado 2: Escritura Normal -->
                <template v-else>
                    <div class="d-flex align-center gap-1 w-100 position-relative">
                        <!-- Botón Selector de Emojis -->
                        <div>
                            <v-btn icon size="small" variant="text" @click="toggleEmojiPicker" :disabled="!isDataChannelOpen">
                                <icon icon="mdi:emoticon-happy-outline" width="22" height="22" class="text-gray-600" />
                            </v-btn>

                            <!-- Popover de Emojis -->
                            <div v-if="showEmojiPicker" class="emoji-popover-card elevation-4">
                                <div class="emoji-grid">
                                    <template v-for="(item, idx) in currentCategoryEmojis" :key="idx">
                                        <div v-if="typeof item === 'object'" class="emoji-item flag-item" @click="addEmoji(item)" :title="item.name">
                                            <img :src="item.img" :alt="item.name" class="flag-icon-img" />
                                        </div>
                                        <span v-else class="emoji-item" @click="addEmoji(item)">
                                            {{ item }}
                                        </span>
                                    </template>
                                </div>
                                <div class="emoji-tabs-bar">
                                    <button
                                        v-for="tab in emojiCategories"
                                        :key="tab.id"
                                        class="emoji-tab-btn"
                                        :class="{ active: activeEmojiTab === tab.id }"
                                        @click="activeEmojiTab = tab.id"
                                        :title="tab.name"
                                    >
                                        <icon :icon="tab.icon" width="18" height="18" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- NUEVO: Botón de Cámara (Abre cámara de foto/video directamente en móviles) -->
                        <v-btn icon size="small" variant="text" @click="triggerCameraInput" :disabled="!isDataChannelOpen" title="Tomar foto o grabar video">
                            <icon icon="mdi:camera" width="22" height="22" class="text-gray-600" />
                        </v-btn>
                        <input
                            type="file"
                            ref="cameraInputRef"
                            class="d-none"
                            accept="image/*,video/*"
                            capture="environment"
                            @change="handleFileSelected"
                        />

                        <!-- Botón Adjuntar Multimedia (Galería) -->
                        <v-btn icon size="small" variant="text" @click="triggerFileInput" :disabled="!isDataChannelOpen" title="Adjuntar de la galería">
                            <icon icon="mdi:paperclip" width="22" height="22" class="text-gray-600" />
                        </v-btn>
                        <input
                            type="file"
                            ref="fileInputRef"
                            class="d-none"
                            accept="image/*,video/*"
                            @change="handleFileSelected"
                        />

                        <!-- Contenedor Visual Personalizado para el Input y Banderas en Línea -->
                        <div class="custom-input-container flex-grow-1">
                            <div class="input-render-layer">
                                <template v-for="(segment, sIdx) in parseTextWithFlags(chatInput)" :key="sIdx">
                                    <img v-if="segment.type === 'flag'" :src="segment.url" alt="Bandera" class="input-inline-flag" />
                                    <span v-else class="input-text-segment">{{ segment.content }}</span>
                                </template>
                            </div>
                            <input
                                type="text"
                                :value="chatInput"
                                @input="onInputText"
                                :disabled="!isDataChannelOpen"
                                :placeholder="isDataChannelOpen ? 'Escribe un mensaje...' : 'Selecciona un usuario...'"
                                class="hidden-text-input"
                                @keyup.enter="enviarMensajeTexto"
                            />
                        </div>

                        <!-- Botón Dinámico -->
                        <v-btn
                            v-if="hasText"
                            color="primary"
                            icon
                            size="small"
                            :disabled="!isDataChannelOpen"
                            @click="enviarMensajeTexto"
                        >
                            <icon icon="mdi:send" width="18" height="18" />
                        </v-btn>
                        <v-btn
                            v-else
                            color="success"
                            icon
                            size="small"
                            :disabled="!isDataChannelOpen"
                            @click="startRecording"
                            title="Grabar nota de voz"
                        >
                            <icon icon="mdi:microphone" width="20" height="20" />
                        </v-btn>
                    </div>
                </template>
            </div>
        </div>

        <!-- Diálogo con Barra de Progreso y Envío por Chunks -->
        <v-dialog v-model="isUploading" persistent max-width="320">
            <v-card class="pa-4 text-center">
                <div class="text-subtitle-2 font-weight-bold mb-2">Enviando archivo multimedia...</div>
                <v-progress-linear :model-value="uploadProgress" color="primary" height="8" striped class="mb-2"></v-progress-linear>
                <div class="text-xs text-gray-500">{{ uploadProgress }}% completado</div>
            </v-card>
        </v-dialog>

        <!-- Modal para Ver Imagen a Pantalla Completa -->
        <v-dialog v-model="showFullscreenImage" max-width="90vw">
            <v-card class="position-relative bg-black text-center">
                <v-btn icon color="white" variant="text" class="position-absolute top-2 right-2 z-50" @click="showFullscreenImage = false">
                    <icon icon="mdi:close" width="26" height="26" />
                </v-btn>
                <img :src="fullscreenImageUrl" class="fullscreen-media-content pa-2" />
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted, computed } from 'vue'

const props = defineProps({
    activePeerId: String,
    localStream: MediaStream,
    remoteStream: MediaStream,
    chatLogs: Array,
    remoteTyping: Boolean,
    dataChannel: Object,
    isDataChannelOpen: Boolean,
    isCallActive: Boolean,
    isVideoCall: Boolean
})

const emit = defineEmits(['send-message', 'send-typing', 'hang-up'])

const localVideo = ref(null)
const remoteVideo = ref(null)
const remoteAudioElement = ref(null)
const chatMessages = ref(null)
const fileInputRef = ref(null)
const cameraInputRef = ref(null) // Referencia para el input de la cámara

const chatInput = ref('')
let typingTimeout = null

const isUploading = ref(false)
const uploadProgress = ref(0)
const showFullscreenImage = ref(false)
const fullscreenImageUrl = ref('')

const showEmojiPicker = ref(false)
const activeEmojiTab = ref('smiles')

const emojiCategories = [
    { id: 'smiles', name: 'Caritas', icon: 'mdi:emoticon-happy-outline' },
    { id: 'animals', name: 'Animales', icon: 'mdi:paw' },
    { id: 'food', name: 'Comida', icon: 'mdi:food' },
    { id: 'activities', name: 'Deportes', icon: 'mdi:soccer' },
    { id: 'travel', name: 'Viajes', icon: 'mdi:car' },
    { id: 'objects', name: 'Objetos', icon: 'mdi:lightbulb-outline' },
    { id: 'symbols', name: 'Símbolos', icon: 'mdi:format-font' },
    { id: 'flags', name: 'Banderas', icon: 'mdi:flag-outline' }
]

const flagImageMap = {
    AR: 'https://flagcdn.com/w40/ar.png',
    BR: 'https://flagcdn.com/w40/br.png',
    CL: 'https://flagcdn.com/w40/cl.png',
    CO: 'https://flagcdn.com/w40/co.png',
    MX: 'https://flagcdn.com/w40/mx.png',
    PE: 'https://flagcdn.com/w40/pe.png',
    UY: 'https://flagcdn.com/w40/uy.png',
    VE: 'https://flagcdn.com/w40/ve.png',
    EC: 'https://flagcdn.com/w40/ec.png',
    BO: 'https://flagcdn.com/w40/bo.png',
    PY: 'https://flagcdn.com/w40/py.png',
    ES: 'https://flagcdn.com/w40/es.png',
    US: 'https://flagcdn.com/w40/us.png',
    CA: 'https://flagcdn.com/w40/ca.png',
    IT: 'https://flagcdn.com/w40/it.png',
    FR: 'https://flagcdn.com/w40/fr.png',
    DE: 'https://flagcdn.com/w40/de.png',
    GB: 'https://flagcdn.com/w40/gb.png',
    PT: 'https://flagcdn.com/w40/pt.png',
    CH: 'https://flagcdn.com/w40/ch.png',
    NL: 'https://flagcdn.com/w40/nl.png',
    BE: 'https://flagcdn.com/w40/be.png',
    SE: 'https://flagcdn.com/w40/se.png',
    NO: 'https://flagcdn.com/w40/no.png',
    DK: 'https://flagcdn.com/w40/dk.png',
    FI: 'https://flagcdn.com/w40/fi.png',
    PL: 'https://flagcdn.com/w40/pl.png',
    UA: 'https://flagcdn.com/w40/ua.png',
    RU: 'https://flagcdn.com/w40/ru.png',
    JP: 'https://flagcdn.com/w40/jp.png',
    KR: 'https://flagcdn.com/w40/kr.png',
    CN: 'https://flagcdn.com/w40/cn.png',
    IN: 'https://flagcdn.com/w40/in.png',
    AU: 'https://flagcdn.com/w40/au.png',
    NZ: 'https://flagcdn.com/w40/nz.png',
    ZA: 'https://flagcdn.com/w40/za.png',
    EG: 'https://flagcdn.com/w40/eg.png',
    MA: 'https://flagcdn.com/w40/ma.png',
    IL: 'https://flagcdn.com/w40/il.png',
    TR: 'https://flagcdn.com/w40/tr.png',
    SA: 'https://flagcdn.com/w40/sa.png',
    AE: 'https://flagcdn.com/w40/ae.png',
    SG: 'https://flagcdn.com/w40/sg.png',
    TH: 'https://flagcdn.com/w40/th.png',
    ID: 'https://flagcdn.com/w40/id.png',
    PH: 'https://flagcdn.com/w40/ph.png',
    MY: 'https://flagcdn.com/w40/my.png',
    VN: 'https://flagcdn.com/w40/vn.png',
    CU: 'https://flagcdn.com/w40/cu.png',
    DO: 'https://flagcdn.com/w40/do.png',
    PR: 'https://flagcdn.com/w40/pr.png',
    CR: 'https://flagcdn.com/w40/cr.png',
    PA: 'https://flagcdn.com/w40/pa.png',
    SV: 'https://flagcdn.com/w40/sv.png',
    GT: 'https://flagcdn.com/w40/gt.png',
    HN: 'https://flagcdn.com/w40/hn.png',
    NI: 'https://flagcdn.com/w40/ni.png'
}

const emojiToCountryCode = {
    '🇦🇷': 'AR', '🇧🇷': 'BR', '🇨🇱': 'CL', '🇨🇴': 'CO', '🇲🇽': 'MX',
    '🇵🇪': 'PE', '🇺🇾': 'UY', '🇻🇪': 'VE', '🇪🇨': 'EC', '🇧🇴': 'BO',
    '🇵🇾': 'PY', '🇪🇸': 'ES', '🇺🇸': 'US', '🇨🇦': 'CA', '🇮🇹': 'IT',
    '🇫🇷': 'FR', '🇩🇪': 'DE', '🇬🇧': 'GB', '🇵🇹': 'PT', '🇨🇭': 'CH',
    '🇳🇱': 'NL', '🇧🇪': 'BE', '🇸🇪': 'SE', '🇳🇴': 'NO', '🇩🇰': 'DK',
    '🇫🇮': 'FI', '🇵🇱': 'PL', '🇺🇦': 'UA', '🇷🇺': 'RU', '🇯🇵': 'JP',
    '🇰🇷': 'KR', '🇨🇳': 'CN', '🇮🇳': 'IN', '🇦🇺': 'AU', '🇳🇿': 'NZ',
    '🇿🇦': 'ZA', '🇪🇬': 'EG', '🇲🇦': 'MA', '🇮🇱': 'IL', '🇹🇷': 'TR',
    '🇸🇦': 'SA', '🇦🇪': 'AE', '🇸🇬': 'SG', '🇹🇭': 'TH', '🇮🇩': 'ID',
    '🇵🇭': 'PH', '🇲🇾': 'MY', '🇻🇳': 'VN', '🇨🇺': 'CU', '🇩🇴': 'DO',
    '🇵🇷': 'PR', '🇨🇷': 'CR', '🇵🇦': 'PA', '🇸🇻': 'SV', '🇬🇹': 'GT',
    '🇭🇳': 'HN', '🇳🇮': 'NI'
}

const emojiSets = {
    smiles: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🍞', '🥖', '🧀'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛵', '🏍️', '🚲', '🛴', '🛹', '🛺', '🚂', '🚄', '🚅', '🚆', '🚇', '🚝', '🚊', '🚉', '🚁', '🛩️', '✈️'],
    objects: ['💡', '🔦', '🕯️', '🪔', '📱', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💯', '💢', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '💮', '🏁', '🚩', '🏴'],
    flags: Object.keys(flagImageMap).map(code => ({
        code,
        name: code,
        img: flagImageMap[code]
    }))
}

const currentCategoryEmojis = computed(() => {
    return emojiSets[activeEmojiTab.value] || emojiSets.smiles
})

const hasText = computed(() => {
    return chatInput.value && chatInput.value.trim().length > 0
})

const onInputText = (e) => {
    chatInput.value = e.target.value
    notificarTipeo()
}

const isRecording = ref(false)
const recordingDuration = ref(0)
let mediaRecorder = null
let audioChunks = []
let recordingTimerInterval = null

const playingAudioIndex = ref(null)
const audioElements = ref({})

const parseTextWithFlags = (text) => {
    if (typeof text !== 'string') return [{ type: 'text', content: text }]

    let processedText = text
    for (const [emoji, code] of Object.entries(emojiToCountryCode)) {
        processedText = processedText.replaceAll(emoji, `[FLAG:${code}]`)
    }

    const regex = /\[FLAG:([A-Z]{2})\]/g
    const segments = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(processedText)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: processedText.substring(lastIndex, match.index) })
        }
        const countryCode = match[1]
        if (flagImageMap[countryCode]) {
            segments.push({ type: 'flag', url: flagImageMap[countryCode] })
        }
        lastIndex = regex.lastIndex
    }

    if (lastIndex < processedText.length) {
        segments.push({ type: 'text', content: processedText.substring(lastIndex) })
    }

    return segments.length > 0 ? segments : [{ type: 'text', content: text }]
}

const isMyMessage = (msg) => {
    if (!msg) return false
    const sender = (msg.sender || '').toLowerCase()
    return sender === 'tú' || sender === 'tu' || sender === 'me' || sender === 'yo'
}

const getMessageType = (msg) => {
    if (!msg) return 'text'
    if (typeof msg === 'object' && msg.type) return msg.type

    const textVal = msg.text || msg.content || ''
    if (typeof textVal === 'object' && textVal !== null) {
        if (textVal.type) return textVal.type
        if (typeof textVal.text === 'string') {
            if (textVal.text.startsWith('data:image/')) return 'image'
            if (textVal.text.startsWith('data:video/')) return 'video'
            if (textVal.text.startsWith('data:audio/')) return 'audio'
        }
    }

    if (typeof textVal === 'string') {
        if (textVal.startsWith('data:image/')) return 'image'
        if (textVal.startsWith('data:video/')) return 'video'
        if (textVal.startsWith('data:audio/')) return 'audio'

        try {
            const parsed = JSON.parse(textVal)
            if (parsed && parsed.type) return parsed.type
            if (parsed && parsed.text && typeof parsed.text === 'string') {
                if (parsed.text.startsWith('data:image/')) return 'image'
                if (parsed.text.startsWith('data:video/')) return 'video'
                if (parsed.text.startsWith('data:audio/')) return 'audio'
            }
        } catch (e) {
            // No es JSON
        }
    }
    return 'text'
}

const getMessageText = (msg) => {
    if (!msg) return ''
    if (typeof msg === 'string') return msg
    if (typeof msg.text === 'object' && msg.text !== null) return msg.text.text || ''
    if (typeof msg.text === 'string') {
        try {
            const parsed = JSON.parse(msg.text)
            if (parsed && parsed.text !== undefined) return parsed.text
        } catch (e) {
            return msg.text
        }
    }
    return msg.content || msg.text || ''
}

const getMessageContent = (msg) => {
    if (!msg) return ''
    if (typeof msg === 'string') return msg

    if (typeof msg.text === 'object' && msg.text !== null) {
        return msg.text.text || msg.text.content || ''
    }

    const rawVal = msg.text || msg.content || ''
    if (typeof rawVal === 'string') {
        if (rawVal.startsWith('data:image/') || rawVal.startsWith('data:video/') || rawVal.startsWith('data:audio/')) {
            return rawVal
        }
        try {
            const parsed = JSON.parse(rawVal)
            if (parsed && parsed.text !== undefined) {
                return typeof parsed.text === 'string' ? parsed.text : (parsed.text.text || '')
            }
        } catch (e) {
            return rawVal
        }
    }
    return rawVal
}

const openMediaFullscreen = (url) => {
    fullscreenImageUrl.value = url
    showFullscreenImage.value = true
}

const triggerFileInput = () => {
    if (fileInputRef.value) fileInputRef.value.click()
}

const triggerCameraInput = () => {
    if (cameraInputRef.value) cameraInputRef.value.click()
}

const handleFileSelected = (event) => {
    const file = event.target.files[0]
    if (!file) return

    isUploading.value = true
    uploadProgress.value = 0

    const reader = new FileReader()

    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            uploadProgress.value = Math.round((e.loaded / e.total) * 40)
        }
    }

    reader.onload = async (e) => {
        uploadProgress.value = 40
        const fileDataUrl = e.target.result
        const isVideo = file.type.startsWith('video')
        const messageType = isVideo ? 'video' : 'image'

        const mediaMessage = {
            id: 'msg_' + Date.now(),
            sender: 'Tú',
            type: messageType,
            text: fileDataUrl,
            time: getCurrentTime()
        }

        if (props.chatLogs) {
            props.chatLogs.push(mediaMessage)
        }

        if (props.dataChannel && props.isDataChannelOpen) {
            try {
                const jsonString = JSON.stringify({ type: 'chat', text: mediaMessage, id: mediaMessage.id })
                const CHUNK_SIZE = 16384
                const totalChunks = Math.ceil(jsonString.length / CHUNK_SIZE)
                const fileId = 'file_' + Date.now()

                for (let i = 0; i < totalChunks; i++) {
                    while (props.dataChannel.bufferedAmount > 65536) {
                        await new Promise(resolve => setTimeout(resolve, 15))
                    }

                    const chunk = jsonString.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
                    const packet = JSON.stringify({
                        isChunk: true,
                        fileId: fileId,
                        chunkIndex: i,
                        totalChunks: totalChunks,
                        payload: chunk
                    })

                    props.dataChannel.send(packet)
                    uploadProgress.value = 40 + Math.round(((i + 1) / totalChunks) * 60)
                }
            } catch (err) {
                console.error('Error al enviar chunks multimedia:', err)
                alert('El archivo es demasiado grande o la conexión P2P se interrumpió.')
            }
        } else {
            emit('send-message', mediaMessage)
        }

        uploadProgress.value = 100
        setTimeout(() => {
            isUploading.value = false
            uploadProgress.value = 0
        }, 300)
    }

    reader.onerror = () => {
        alert('Error al leer el archivo.')
        isUploading.value = false
        uploadProgress.value = 0
    }

    reader.readAsDataURL(file)
    event.target.value = ''
}

watch(() => props.localStream, (newStream) => {
    if (localVideo.value && newStream) localVideo.value.srcObject = newStream
})

watch(() => props.remoteStream, (newStream) => {
    if (remoteVideo.value && newStream) {
        remoteVideo.value.srcObject = newStream
    }
    if (remoteAudioElement.value && newStream) {
        remoteAudioElement.value.srcObject = newStream
    }
})

watch(() => [props.chatLogs, props.remoteTyping], () => {
    nextTick(() => {
        if (chatMessages.value) {
            chatMessages.value.scrollTop = chatMessages.value.scrollHeight
        }
    })
}, { deep: true })

const notificarTipeo = () => {
    emit('send-typing', true)
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
        emit('send-typing', false)
    }, 1500)
}

const enviarMensajeTexto = () => {
    const text = chatInput.value.trim()
    if (!text) return

    const textMessage = {
        id: 'msg_' + Date.now(),
        sender: 'Tú',
        type: 'text',
        text,
        time: getCurrentTime()
    }

    emit('send-message', textMessage)

    chatInput.value = ''
    emit('send-typing', false)
}

const toggleEmojiPicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value
}

const addEmoji = (item) => {
    let emojiStr = ''
    if (typeof item === 'string') {
        emojiStr = item
    } else if (item && item.code) {
        emojiStr = `[FLAG:${item.code}]`
    }
    if (!emojiStr) return
    chatInput.value += emojiStr
}

const toggleAudioPlayback = (msg, index) => {
    const audioEl = audioElements.value[index]
    if (!audioEl) return

    if (playingAudioIndex.value === index) {
        audioEl.pause()
        playingAudioIndex.value = null
    } else {
        Object.values(audioElements.value).forEach(el => { if (el) el.pause() })
        audioEl.play()
        playingAudioIndex.value = index
    }
}

const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream)
        audioChunks = []

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data)
        }

        mediaRecorder.start()
        isRecording.value = true
        recordingDuration.value = 0

        recordingTimerInterval = setInterval(() => {
            recordingDuration.value++
        }, 1000)
    } catch (error) {
        console.error('Error al acceder al micrófono:', error)
        alert('No se pudo acceder al micrófono.')
    }
}

const stopAndSendRecording = () => {
    if (!mediaRecorder) return

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = (e) => {
            const audioBase64 = e.target.result
            const audioMessage = {
                id: 'msg_' + Date.now(),
                sender: 'Tú',
                type: 'audio',
                text: audioBase64,
                time: getCurrentTime()
            }
            emit('send-message', audioMessage)
        }
        reader.readAsDataURL(audioBlob)
    }

    cleanRecordingState()
}

const cancelRecording = () => {
    cleanRecordingState()
}

const cleanRecordingState = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
        mediaRecorder.stream.getTracks().forEach(track => track.stop())
    }
    clearInterval(recordingTimerInterval)
    isRecording.value = false
    recordingDuration.value = 0
    mediaRecorder = null
}

const formatRecordTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onUnmounted(() => {
    cleanRecordingState()
})
</script>

<style scoped lang="scss">
.media-box {
    width: 100%;
    background: #000;
    border-radius: 6px;
    height: 150px;
    object-fit: cover;
}

.chat-box {
    height: 240px;
    border: 1px solid #e0e0e0;
    background: #efeae2;
    overflow-y: auto;
    padding: 10px;
    border-radius: 8px;
}

.message-row {
    display: flex;
    margin-bottom: 8px;
    &.message-left { justify-content: flex-start; }
    &.message-right { justify-content: flex-end; }
}

.message-bubble {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    .message-right & { background: #dcf8c6; }
}

.text-message-body {
    word-break: break-word;
    white-space: pre-wrap;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.inline-flag-img {
    width: 24px;
    height: 18px;
    object-fit: contain;
    vertical-align: middle;
    border-radius: 2px;
    display: inline-block;
}

.custom-input-container {
    position: relative;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-radius: 4px;
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    transition: border-color 0.2s;

    &:focus-within {
        border-color: #1976d2;
        border-width: 2px;
        padding: 0 11px;
    }

    .input-render-layer {
        position: absolute;
        left: 12px;
        right: 12px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        pointer-events: none;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);

        .input-inline-flag {
            width: 22px;
            height: 16px;
            object-fit: contain;
            vertical-align: middle;
            border-radius: 2px;
        }

        .input-text-segment {
            display: inline;
        }
    }

    .hidden-text-input {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-size: 14px;
        padding: 8px 0;
        z-index: 1;

        &:disabled {
            cursor: not-allowed;
        }
    }
}

.voice-note-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 220px;
    padding: 4px 0;

    .play-voice-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #128c7e;
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: transform 0.1s;
        &:hover { transform: scale(1.05); }
    }

    .voice-waveform-box {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;

        .waveform-bars {
            display: clips;
            display: flex;
            align-items: center;
            gap: 2px;
            height: 20px;
            .bar {
                width: 3px;
                background: #b4b4b4;
                border-radius: 2px;
            }
        }

        .voice-info-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #666;
        }
    }
}

.media-preview-box {
    max-width: 240px;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 4px;
    &.clickable { cursor: pointer; }
    .chat-media-content {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        display: block;
        border-radius: 6px;
    }
}

.fullscreen-media-content {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
}

.chat-input-bar-wrapper {
    position: relative;
    background: #f0f2f5;
    padding: 8px;
    border-radius: 8px;
}

.recording-bar-overlay {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ffcdd2;
}

.emoji-popover-card {
    position: absolute;
    bottom: 55px;
    left: 0;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 8px;
    z-index: 30;
    width: 310px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);

    .emoji-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 6px;
        max-height: 160px;
        overflow-y: auto;
        padding: 4px;

        .emoji-item {
            font-size: 22px;
            cursor: pointer;
            text-align: center;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;

            &:hover { background: #f0f2f5; transform: scale(1.1); }
        }

        .flag-item {
            background: #f8f9fa;
            border: 1px solid #eaeaea;
            border-radius: 6px;
            padding: 2px;

            .flag-icon-img {
                width: 28px;
                height: 20px;
                object-fit: contain;
                border-radius: 2px;
                display: block;
            }
        }
    }

    .emoji-tabs-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top: 1px solid #eee;
        padding-top: 6px;
        margin-top: 6px;

        .emoji-tab-btn {
            background: transparent;
            border: none;
            padding: 6px;
            cursor: pointer;
            color: #666;
            border-radius: 4px;
            transition: background 0.2s;

            &:hover {
                background: #f0f2f5;
                color: #0056b3;
            }

            &.active {
                color: #128c7e;
                border-bottom: 2px solid #128c7e;
            }
        }
    }
}

.typing-bubble {
    background: #ffffff;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    .dot {
        font-size: 20px;
        line-height: 10px;
        color: #888;
        animation: pulse 1.4s infinite ease-in-out both;
        &:nth-child(2) { animation-delay: .2s; }
        &:nth-child(3) { animation-delay: .4s; }
    }
}

@keyframes pulse {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
}
</style>