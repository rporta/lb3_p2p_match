<template>
    <v-dialog :model-value="dialog" fullscreen persistent transition="dialog-bottom-transition">
        <v-card class="d-flex flex-column align-center justify-center bg-grey-darken-4 text-white pa-6">
            <div class="text-center mb-8">
                <v-avatar size="100" color="primary" class="mb-4 elevation-6 animate-pulse">
                    <icon :icon="isVideo ? 'mdi:video' : 'mdi:phone'" class="text-5xl text-white" />
                </v-avatar>
                <h2 class="text-h4 font-weight-bold mb-2">{{ isVideo ? 'Videollamada Entrante' : 'Llamada Entrante' }}</h2>
                <p class="text-subtitle-1 text-grey-lighten-1">El usuario <span class="text-white font-weight-bold">{{ callerId }}</span> quiere iniciar una {{ isVideo ? 'videollamada' : 'llamada' }} contigo.</p>
            </div>

            <div class="d-flex gap-4">
                <v-btn
                    color="error"
                    size="large"
                    class="px-6 py-3 rounded-xl"
                    @click="rechazar"
                >
                    <icon icon="mdi:phone-hangup" class="mr-2 text-xl" />
                    Rechazar
                </v-btn>

                <v-btn
                    color="success"
                    size="large"
                    class="px-6 py-3 rounded-xl"
                    @click="aceptar"
                >
                    <icon :icon="isVideo ? 'mdi:video' : 'mdi:phone'" class="mr-2 text-xl" />
                    Aceptar Llamada
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
defineProps({
    dialog: Boolean,
    callerId: String,
    isVideo: Boolean
})

const emit = defineEmits(['accept', 'reject'])

const aceptar = () => {
    emit('accept')
}

const rechazar = () => {
    emit('reject')
}
</script>