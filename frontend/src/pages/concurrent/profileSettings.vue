<template>
    <div class="page-container">
        <!-- Encabezado con Botón FAB Circular -->
        <div class="page-header">
            <button class="icon-fab-back" @click="goBack" title="Volver a la pantalla principal">
                <Icon icon="mdi:arrow-left" width="22" height="22" style="color: white;" />
            </button>
            <h2>Configuración de Perfil</h2>
        </div>

        <div class="content-body">
            <!-- Tarjeta con resumen del usuario cargado desde Pinia -->
            <div class="profile-card">
                <div class="avatar-wrapper">
                    <img v-if="clientStore.avatarUrl" :src="resolvedAvatarUrl" class="avatar-img" />
                    <Icon v-else icon="mdi:account-circle" width="80" height="80" style="color: #9e9e9e;" />
                </div>
                <h3>{{ clientStore.nombre }} {{ clientStore.apellido }}</h3>
                <span class="alias-tag">@{{ clientStore.alias }}</span>
            </div>

            <!-- Opciones de Ajuste -->
            <div class="settings-list">
                <div class="setting-item">
                    <Icon icon="mdi:account-edit-outline" width="22" height="22" style="color: #0056b3;" />
                    <span>Editar información personal</span>
                    <Icon icon="mdi:chevron-right" width="20" height="20" style="color: #ccc;" />
                </div>

                <div class="setting-item">
                    <Icon icon="mdi:shield-lock-outline" width="22" height="22" style="color: #0056b3;" />
                    <span>Privacidad y Seguridad</span>
                    <Icon icon="mdi:chevron-right" width="20" height="20" style="color: #ccc;" />
                </div>

                <div class="setting-item">
                    <Icon icon="mdi:bell-outline" width="22" height="22" style="color: #0056b3;" />
                    <span>Ajustes de Notificaciones</span>
                    <Icon icon="mdi:chevron-right" width="20" height="20" style="color: #ccc;" />
                </div>

                <div class="setting-item" @click="() => router.push({ name: 'Home' })">
                    <Icon icon="mdi:account-edit-outline" width="22" height="22" style="color: #0056b3;" />
                    <span>Test P2P</span>
                    <Icon icon="mdi:chevron-right" width="20" height="20" style="color: #ccc;" />
                </div>

                <div class="setting-item logout" @click="cerrarSesion">
                    <Icon icon="mdi:logout" width="22" height="22" style="color: #d9534f;" />
                    <span class="logout-text">Cerrar Sesión</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useClientP2PStore } from '@/stores/clientP2P'
import { ref, onMounted, watch } from 'vue'
const router = useRouter()
const clientStore = useClientP2PStore()


const resolvedAvatarUrl = ref('')

const goBack = () => {
    router.push({ name: 'ConcurrentUser' })
}

const cerrarSesion = () => {
    clientStore.setDesconectado()
    clientStore.nombre = ''
    clientStore.apellido = ''
    clientStore.alias = ''
    clientStore.avatarUrl = ''
    clientStore.id = null
    router.push({ name: 'NewUser' })
}

// Imagen por defecto o placeholder vectorial si no hay nada
const defaultAvatar = 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/account-circle.svg'

const resolveAvatar = async () => {
    const rawUrl = clientStore.avatarUrl

    // 1. Si está vacío, retornamos la imagen por defecto
    if (!rawUrl) {
        resolvedAvatarUrl.value = defaultAvatar
        return
    }

    // 2. Si es una URL de tipo blob:, la resolvemos y convertimos para renderizar
    if (rawUrl.startsWith('blob:')) {
        try {
            const response = await fetch(rawUrl)
            const blob = await response.blob()

            // Convertimos el blob a Base64 temporal para que el navegador lo renderice sin romperse
            const reader = new FileReader()
            reader.onloadend = () => {
                resolvedAvatarUrl.value = reader.result
            }
            reader.readAsDataURL(blob)
        } catch (error) {
            console.error("Error al resolver el blob del avatar:", error)
            resolvedAvatarUrl.value = defaultAvatar
        }
        return
    }

    // 3. Si ya es un Base64 válido u otra URL correcta, la usamos directamente
    resolvedAvatarUrl.value = rawUrl
}

// Ejecutar al montar el componente
onMounted(() => {
    resolveAvatar()
})

// Escuchar cambios en el store por si se actualiza el avatar
watch(() => clientStore.avatarUrl, () => {
    resolveAvatar()
})
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
    transition: transform 0.1s, background-color 0.2s;
}

.icon-fab-back:hover {
    background-color: #004085;
    transform: scale(1.05);
}

.page-header h2 {
    font-size: 20px;
    margin: 0;
    color: #333;
}

.content-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.profile-card {
    background-color: white;
    padding: 24px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.avatar-wrapper {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 12px;
    border: 3px solid #0056b3;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-card h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.alias-tag {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
}

.settings-list {
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.setting-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
}

.setting-item:last-child {
    border-bottom: none;
}

.setting-item span {
    flex: 1;
    font-size: 15px;
    color: #333;
}

.logout-text {
    color: #d9534f !important;
    font-weight: bold;
}
</style>