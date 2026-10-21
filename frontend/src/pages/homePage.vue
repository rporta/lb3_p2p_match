<template>
    <v-container class="pa-6" style="max-width: 900px;">
        <v-card class="pa-5 elevation-3 rounded-lg">
            <v-card-title class="text-h5 font-weight-bold justify-center mb-2 flex items-center gap-2">
                <icon icon="mdi:video-wireless" class="text-blue-600 text-3xl" />
                <span>WebRTC P2P - Videollamada y Chat</span>
            </v-card-title>

            <!-- Barra de estado -->
            <v-alert type="info" text dense class="mb-4">
                <div class="flex items-center gap-2">
                    <icon icon="mdi:information-outline" class="text-xl" />
                    <span>{{ statusMessage }}</span>
                </div>
            </v-alert>

            <v-row>
                <!-- Panel Izquierdo: Conexión y Lista de Peers -->
                <v-col cols="12" md="4">
                    <v-card outlined class="pa-3 mb-4">
                        <h3 class="text-subtitle-1 font-weight-bold mb-2 flex items-center gap-1">
                            <icon icon="mdi:lan-connect" class="text-gray-700" />
                            <span>Conectar al Servidor</span>
                        </h3>
                        <v-text-field
                            v-model="ngrokUrl"
                            label="URL WSS"
                            placeholder="http://localhost:5000"
                            outlined
                            dense
                            hide-details
                            class="mb-3"
                        ></v-text-field>
                        <v-btn
                            :color="isConnected ? 'success' : 'error'"
                            block
                            depressed
                            @click="toggleConexion"
                        >
                            <template #prepend>
                                <icon :icon="isConnected ? 'mdi:server-network' : 'mdi:server-off'" class="mr-1" />
                            </template>
                            {{ isConnected ? 'Conectado (Desconectar)' : 'Desconectado (Conectar)' }}
                        </v-btn>
                    </v-card>

                    <v-card outlined class="pa-3">
                        <h3 class="text-subtitle-1 font-weight-bold mb-2 flex items-center gap-1">
                            <icon icon="mdi:account-group" class="text-gray-700" />
                            <span>Usuarios Disponibles</span>
                        </h3>
                        <v-list dense>
                            <v-list-item v-if="clients.length === 0">
                                <v-list-item-title class="text--secondary flex items-center gap-1">
                                    <icon icon="mdi:account-off-outline" />
                                    <span>Sin usuarios en la red</span>
                                </v-list-item-title>
                            </v-list-item>

                            <v-list-item
                                v-for="id in clients"
                                :key="id"
                                class="cursor-pointer hover:bg-gray-100 rounded mb-1 px-2"
                            >
                                <div class="d-flex align-center justify-space-between w-100" style="width: 100%;">
                                    <!-- Clic en contacto (Zona Celeste): Abre chat P2P puro sin llamada -->
                                    <div class="d-flex align-center flex-grow-1 text-truncate mr-2" @click="iniciarChatP2P(id)" style="max-width: 140px;" title="Iniciar chat P2P">
                                        <icon icon="mdi:account" class="text-blue-500 mr-2 flex-shrink-0" />
                                        <span class="font-weight-medium text-body-2 text-truncate">{{ id }}</span>
                                    </div>

                                    <!-- Grupo de Botones de Acción -->
                                    <div class="d-flex align-center flex-shrink-0" style="gap: 2px;">
                                        <!-- Botón de Llamada de Voz -->
                                        <v-btn
                                            color="info"
                                            variant="text"
                                            icon
                                            x-small
                                            @click.stop="iniciarLlamada(id, false)"
                                            title="Llamar"
                                        >
                                            <icon icon="mdi:phone" class="text-blue-600 text-lg" />
                                        </v-btn>

                                        <!-- Botón de Videollamada -->
                                        <v-btn
                                            color="success"
                                            variant="text"
                                            icon
                                            x-small
                                            @click.stop="iniciarLlamada(id, true)"
                                            title="Llamar por video"
                                        >
                                            <icon icon="mdi:video" class="text-green-600 text-lg" />
                                        </v-btn>

                                        <!-- Botón de Tacho de Basura -->
                                        <v-btn
                                            color="error"
                                            variant="text"
                                            icon
                                            x-small
                                            @click.stop="removerUsuario(id)"
                                            title="Eliminar usuario de la lista"
                                        >
                                            <icon icon="mdi:delete" class="text-red-500 text-lg" />
                                        </v-btn>
                                    </div>
                                </div>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <!-- Panel Derecho: Componente Modular de Sesión Activa P2P -->
                <v-col cols="12" md="8">
                    <ActiveSessionP2P
                        :active-peer-id="targetId"
                        :local-stream="localStream"
                        :remote-stream="remoteStream"
                        :chat-logs="chatLogsPorPeer[targetId] || []"
                        :remote-typing="isRemoteTyping"
                        :data-channel="dataChannel"
                        :is-data-channel-open="isDataChannelOpen"
                        :is-call-active="isCallActive"
                        :is-video-call="isVideoCall"
                        @send-message="enviarMensaje"
                        @send-typing="enviarTipeo"
                        @hang-up="cortarLlamada(true)"
                    />
                </v-col>
            </v-row>
        </v-card>

        <!-- Modal de Llamada Entrante -->
        <IncomingCallModal
            :dialog="incomingCallModal"
            :caller-id="pendingCallerId"
            :is-video="pendingIsVideo"
            @accept="aceptarLlamadaEntrante"
            @reject="rechazarLlamadaEntrante"
        />
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { io } from 'socket.io-client'
import ActiveSessionP2P from '@/components/ActiveSessionP2P.vue'
import IncomingCallModal from '@/components/IncomingCallModal.vue'

const ngrokUrl = ref('https://192.168.0.142:5000')
const statusMessage = ref('Mi ID: Desconectado')
const myId = ref(null)
const targetId = ref(null)
const clients = ref([])
const chatLogsPorPeer = ref({})
const isRemoteTyping = ref(false)
const isDataChannelOpen = ref(false)
const isCallActive = ref(false)

const incomingCallModal = ref(false)
const pendingCallerId = ref(null)
const pendingIsVideo = ref(true)
const isVideoCall = ref(false)

let pendingOfferPayload = null

let ws = null
let pc = null
const localStream = ref(null)
let remoteStream = ref(null)
let dataChannel = null

const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
const isConnected = computed(() => myId.value !== null)

const toggleConexion = () => {
    if (isConnected.value) {
        if (ws) { ws.disconnect(); ws = null; }
        myId.value = null
        clients.value = []
        statusMessage.value = 'Mi ID: Desconectado'
        isDataChannelOpen.value = false
        isCallActive.value = false
    } else {
        conectarServidor()
    }
}

const conectarServidor = () => {
    const urlInput = ngrokUrl.value.trim()
    if (!urlInput) {
        alert("Por favor ingresa la URL del servidor")
        return
    }

    // Opciones para evitar reintentos infinitos si el servidor está apagado
    ws = io(urlInput, {
        reconnection: false,          // Evita bucles automáticos de reconexión
        timeout: 5000                 // Tiempo límite de espera en ms (5 segundos)
    })

    ws.on('connect', () => {
        statusMessage.value = 'Conectado al servidor de señalización.'
    })

    // Capturar error de conexión fallida para evitar el volcado crudo en consola
    ws.on('connect_error', (err) => {
        console.warn("No se pudo establecer conexión con el servidor de señalización.")
        statusMessage.value = 'Mi ID: Error de conexión (Servidor apagado)'
        if (ws) {
            ws.disconnect()
            ws = null
        }
    })

    ws.on('WELCOME', (data) => {
        myId.value = data.id
        statusMessage.value = `Mi ID: ${myId.value} (Conectado)`
    })

    ws.on('CLIENT_LIST', (data) => {
        clients.value = data.clients.filter(id => id !== myId.value)
    })

    ws.on('SIGNAL', async (data) => {
        await manejarSenal(data.senderId, data.payload)
    })

    ws.on('disconnect', () => {
        myId.value = null
        clients.value = []
        statusMessage.value = 'Mi ID: Desconectado'
        isDataChannelOpen.value = false
        isCallActive.value = false
    })
}

const removerUsuario = (id) => {
    clients.value = clients.value.filter(item => item !== id)
    if (targetId.value === id) {
        cortarLlamada(true)
    }
}

// Iniciar Chat P2P Puro (Al hacer clic en el rectángulo celeste del contacto)
const iniciarChatP2P = async (id) => {
    targetId.value = id
    if (!chatLogsPorPeer.value[id]) chatLogsPorPeer.value[id] = []

    // No se activan streams multimedia ni botón de colgar llamada
    isCallActive.value = false

    pc = await crearPeerConnection(id)

    dataChannel = pc.createDataChannel("chat")
    configurarDataChannel()

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    enviarSenal(id, { type: 'offer', sdp: pc.localDescription, isChatOnly: true })
}

const iniciarLlamada = async (id, withVideo) => {
    targetId.value = id
    if (!chatLogsPorPeer.value[id]) chatLogsPorPeer.value[id] = []

    isVideoCall.value = withVideo // <--- Define si es video o solo voz
    await iniciarMedia(withVideo)
    pc = await crearPeerConnection(id)

    dataChannel = pc.createDataChannel("chat")
    configurarDataChannel()

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    enviarSenal(id, { type: 'offer', sdp: pc.localDescription, withVideo, isChatOnly: false })
    isCallActive.value = true
}

const iniciarMedia = async (withVideo) => {
    try {
        // Intentamos solicitar los medios según lo requerido (video y audio)
        localStream.value = await navigator.mediaDevices.getUserMedia({
            video: withVideo,
            audio: true
        })
    } catch (e) {
        console.warn("No se pudo acceder a la cámara o micrófono (probablemente por falta de hardware):", e)

        // Plan B: Si falló con video (ej. PC sin webcam), intentamos pedir al menos audio para no romper la llamada
        try {
            if (withVideo) {
                console.log("Intentando iniciar solo con audio...")
                localStream.value = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true
                })
            }
        } catch (audioErr) {
            console.warn("Tampoco se pudo acceder al micrófono:", audioErr)
            localStream.value = null
        }
    }
}

const crearPeerConnection = async (remotePeerId) => {
    const connection = new RTCPeerConnection(rtcConfig)

    // 🔴 CAMBIO AQUÍ: Solo agregamos pistas si localStream.value realmente tiene tracks válidos
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => {
            connection.addTrack(track, localStream.value)
        })
    }

    connection.ontrack = (event) => {
        remoteStream.value = event.streams[0]
    }

    connection.onicecandidate = (event) => {
        if (event.candidate) {
            enviarSenal(remotePeerId, { type: 'candidate', candidate: event.candidate })
        }
    }

    return connection
}

const manejarSenal = async (senderId, payload) => {
    if (payload.type === 'offer') {
        if (payload.isChatOnly) {
            targetId.value = senderId
            if (!chatLogsPorPeer.value[senderId]) chatLogsPorPeer.value[senderId] = []

            pc = await crearPeerConnection(senderId)

            pc.ondatachannel = (event) => {
                dataChannel = event.channel
                configurarDataChannel()
            }

            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp || payload))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            enviarSenal(senderId, { type: 'answer', sdp: pc.localDescription })
            isCallActive.value = false
        } else {
            pendingCallerId.value = senderId
            pendingIsVideo.value = payload.withVideo !== false
            pendingOfferPayload = payload
            incomingCallModal.value = true
        }
    } else if (payload.type === 'bye') {
        // Cierra el modal de llamada entrante si estaba abierto en el receptor
        incomingCallModal.value = false
        pendingCallerId.value = null
        pendingOfferPayload = null

        cortarLlamada(false)
    } else if (pc) {
        if (payload.type === 'answer') {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp || payload))
        } else if (payload.type === 'candidate') {
            if (payload.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(payload.candidate))
            }
        }
    }
}

const aceptarLlamadaEntrante = async () => {
    incomingCallModal.value = false
    const senderId = pendingCallerId.value
    targetId.value = senderId
    if (!chatLogsPorPeer.value[senderId]) chatLogsPorPeer.value[senderId] = []

    isVideoCall.value = pendingIsVideo.value // <--- Hereda si el emisor llamó con video o voz
    await iniciarMedia(pendingIsVideo.value)
    pc = await crearPeerConnection(senderId)

    pc.ondatachannel = (event) => {
        dataChannel = event.channel
        configurarDataChannel()
    }

    await pc.setRemoteDescription(new RTCSessionDescription(pendingOfferPayload.sdp || pendingOfferPayload))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    enviarSenal(senderId, { type: 'answer', sdp: pc.localDescription })
    isCallActive.value = true
}

const rechazarLlamadaEntrante = () => {
    incomingCallModal.value = false
    if (pendingCallerId.value) {
        enviarSenal(pendingCallerId.value, { type: 'bye' })
    }
    pendingCallerId.value = null
    pendingOfferPayload = null
}

const cortarLlamada = (notificarRemoto = true) => {
    if (notificarRemoto && targetId.value) {
        enviarSenal(targetId.value, { type: 'bye' })
    }

    incomingCallModal.value = false
    pendingCallerId.value = null
    pendingOfferPayload = null

    if (pc) {
        pc.close()
        pc = null
    }
    if (dataChannel) {
        dataChannel.close()
        dataChannel = null
    }
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop())
        localStream.value = null
    }
    remoteStream.value = null
    isDataChannelOpen.value = false
    isCallActive.value = false
    isVideoCall.value = false // <--- Oculta los cuadros de video al cortar
    targetId.value = null
}

const enviarSenal = (destId, payload) => {
    ws.emit('SIGNAL', { targetId: destId, payload })
}

const configurarDataChannel = () => {
    if (!dataChannel) return

    if (dataChannel.readyState === 'open') {
        isDataChannelOpen.value = true
        console.log("El canal de datos ya estaba abierto.")
    }

    dataChannel.onopen = () => {
        isDataChannelOpen.value = true
        console.log("¡Canal de datos abierto exitosamente (onopen)!")
    }

    dataChannel.onclose = () => {
        isDataChannelOpen.value = false
        console.log("Canal de datos cerrado.")
    }

    dataChannel.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.type === 'chat') {
                agregarChatLog(targetId.value, data.text, false, data.id)
                dataChannel.send(JSON.stringify({ type: 'read', id: data.id }))
            } else if (data.type === 'read') {
                const msgs = chatLogsPorPeer.value[targetId.value]
                if (msgs) {
                    const msg = msgs.find(m => m.id === data.id)
                    if (msg) msg.read = true
                }
            } else if (data.type === 'typing') {
                isRemoteTyping.value = data.typing
            }
        } catch (e) {
            console.error("Error al procesar mensaje:", e)
        }
    }
}

const enviarMensaje = (text) => {
    if (!dataChannel || dataChannel.readyState !== 'open') {
        alert("El canal de datos P2P aún no está abierto con este usuario.")
        return
    }

    const msgId = Date.now()
    const msgObj = { type: 'chat', text, id: msgId }
    dataChannel.send(JSON.stringify(msgObj))

    if (!chatLogsPorPeer.value[targetId.value]) chatLogsPorPeer.value[targetId.value] = []
    chatLogsPorPeer.value[targetId.value].push({
        sender: 'Tú',
        text,
        read: false,
        id: msgId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
}

const enviarTipeo = (typingState) => {
    if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(JSON.stringify({ type: 'typing', typing: typingState }))
    }
}

const agregarChatLog = (peerId, texto, readStatus, msgId) => {
    if (!chatLogsPorPeer.value[peerId]) chatLogsPorPeer.value[peerId] = []
    chatLogsPorPeer.value[peerId].push({
        sender: peerId,
        text: texto,
        read: readStatus,
        id: msgId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
}
</script>