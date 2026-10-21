<template>
    <v-card outlined class="pa-3">
        <div class="d-flex align-center justify-space-between mb-2">
            <h3 class="text-subtitle-1 font-weight-bold flex items-center gap-1">
                <icon icon="mdi:webcam" class="text-gray-700" />
                <span>Chat y Sesión con: {{ activePeerId || 'Selecciona un usuario' }}</span>
            </h3>

            <!-- Botón de Cortar Llamada (Solo visible si hay una llamada activa) -->
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

        <!-- Streams Multimedia (Solo se renderiza si es una videollamada activa) -->
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

        <!-- Chat P2P -->
        <div class="chat-container">
            <div ref="chatMessages" class="chat-box mb-2">
                <div v-for="(msg, index) in chatLogs" :key="index"
                     :class="['message-row', msg.sender === 'Tú' ? 'message-right' : 'message-left']">
                    <div class="message-bubble">
                        <div class="text-xs font-bold text-gray-600 mb-0.5">{{ msg.sender }}</div>
                        <div class="text-sm">{{ msg.text }}</div>
                        <div class="message-footer flex items-center justify-end gap-1 mt-1">
                            <span class="text-[10px] text-gray-400">{{ msg.time }}</span>
                            <div v-if="msg.sender === 'Tú'" class="flex items-center">
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

            <!-- Input de Mensajes -->
            <v-row no-gutters>
                <v-col>
                    <v-text-field
                        v-model="chatInput"
                        :disabled="!isDataChannelOpen"
                        :placeholder="isDataChannelOpen ? 'Escribe un mensaje...' : 'Selecciona un usuario para chatear...'"
                        outlined
                        dense
                        hide-details
                        @input="notificarTipeo"
                        @keyup.enter="enviarMensaje"
                    ></v-text-field>
                </v-col>
                <v-col cols="auto" class="pl-2">
                    <v-btn
                        color="primary"
                        :disabled="!isDataChannelOpen"
                        @click="enviarMensaje"
                    >
                        <icon icon="mdi:send" class="mr-1" />
                        Enviar
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

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
const chatMessages = ref(null)
const chatInput = ref('')
let typingTimeout = null

watch(() => props.localStream, (newStream) => {
    if (localVideo.value && newStream) localVideo.value.srcObject = newStream
})

watch(() => props.remoteStream, (newStream) => {
    if (remoteVideo.value && newStream) {
        remoteVideo.value.srcObject = newStream
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

const enviarMensaje = () => {
    const text = chatInput.value.trim()
    if (!text) return
    emit('send-message', text)
    chatInput.value = ''
    emit('send-typing', false)
}
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
    height: 200px;
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
    max-width: 75%;
    padding: 8px 12px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    .message-right & { background: #dcf8c6; }
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