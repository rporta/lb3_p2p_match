<template>
    <v-app>
        <!-- Barra superior visible únicamente en /home -->
        <v-app-bar v-if="isHomeRoute" app color="primary" dark>
            <v-toolbar-title>P2P Match</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- Opcional: Enlaces de navegación adicionales -->
            <v-btn text to="/">Inicio</v-btn>
        </v-app-bar>

        <v-main>
            <v-container fluid class="pa-0">
                <router-view></router-view>
            </v-container>
        </v-main>

        <!-- SPLASH MODAL FULL SCREEN -->
        <div v-if="appStore.showSplash" class="splash-fullscreen">
            <div class="splash-content">
                <v-icon icon="mdi-heart-pulse" size="80" color="white" class="splash-icon"></v-icon>
                <h1 class="splash-title">P2P Match</h1>
                <div class="splash-loader"></div>
            </div>
        </div>

        <!-- MODAL GLOBAL DE LOADING (SPINNER) -->
        <div v-if="appStore.modalLoading" class="global-loading-modal">
            <div class="spinner-box">
                <div class="spinner"></div>
                <p>Guardando tu perfil y conectando...</p>
            </div>
        </div>
    </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const route = useRoute()

// Propiedad computada que verifica si la ruta actual es exactamente /home
const isHomeRoute = computed(() => {
    return route.path === '/home'
})
</script>

<style scoped>
/* Splash Modal Full Screen */
.splash-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #0056b3 0%, #003366 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.splash-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    animation: fadeIn 0.5s ease-in-out;
}

.splash-title {
    color: white;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 0;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.splash-icon {
    animation: pulse 1.5s infinite ease-in-out;
}

.splash-loader {
    width: 48px;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
}

.splash-loader::after {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 50%;
    height: 100%;
    background: white;
    border-radius: 3px;
    animation: loadingBar 1.2s infinite ease-in-out;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

@keyframes loadingBar {
    0% { left: -50%; }
    100% { left: 100%; }
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

/* Modal Global Loading */
.global-loading-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner-box {
    background: white;
    padding: 30px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0056b3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>