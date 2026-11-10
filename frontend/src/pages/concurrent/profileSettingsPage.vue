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
                <!-- Avatar con Borde Dinámico según Estado -->
                <div class="avatar-wrapper" :class="clientStore.estado === 'conectado' ? 'status-online' : 'status-offline'">
                    <img v-if="clientStore.avatarUrl" :src="resolvedAvatarUrl" class="avatar-img" />
                    <Icon v-else icon="mdi:account-circle" width="80" height="80" style="color: #9e9e9e;" />
                </div>
                <h3>{{ clientStore.nombre }} {{ clientStore.apellido }}</h3>
                <span class="alias-tag">@{{ clientStore.alias }}</span>
            </div>

            <!-- Selector Rápido de Estado -->
            <div class="status-quick-card">
                <div class="select-wrapper">
                    <select
                        :value="clientStore.estado"
                        @change="onStatusChange"
                        class="status-select w-full"
                    >
                        <option value="conectado">🟢 Conectado</option>
                        <option value="desconectado">🔴 Desconectado</option>
                    </select>
                </div>
            </div>

            <!-- Opciones de Ajuste -->
            <div class="settings-list">
                <div class="setting-item" @click="() => router.push({ name: 'EditPersonalInformationPage' })">
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

                <div class="setting-item" @click="() => router.push({ name: 'HomePage' })">
                    <Icon icon="mdi:account-edit-outline" width="22" height="22" style="color: #0056b3;" />
                    <span>Test P2P</span>
                    <Icon icon="mdi:chevron-right" width="20" height="20" style="color: #ccc;" />
                </div>

                <div class="setting-item" @click="router.push({ name: 'ConfigLanguagePage' })">
                    <Icon icon="mdi:translate" width="22" height="22" style="color: #0056b3;" />
                    <span>Configurar Idioma</span>
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
import { useClientP2PStore } from '@/stores/clientP2PStore'
import { ref, onMounted, watch } from 'vue'

const router = useRouter()
const clientStore = useClientP2PStore()

const resolvedAvatarUrl = ref('')

const goBack = () => {
    router.push({ name: 'ConcurrentUserPage' })
}

const toggleEstado = (nuevoEstado) => {
    if (nuevoEstado === 'conectado') {
        clientStore.setConectado()
    } else {
        clientStore.setDesconectado()
    }
}

const cerrarSesion = () => {
    clientStore.setDesconectado()
    clientStore.nombre = ''
    clientStore.apellido = ''
    clientStore.alias = ''
    clientStore.avatarUrl = ''
    clientStore.id = null
    router.push({ name: 'NewUserPage' })
}

// Imagen por defecto o placeholder vectorial si no hay nada
const defaultAvatar = 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/account-circle.svg'

const resolveAvatar = () => {
    const rawUrl = clientStore.avatarUrl

    // Si está vacío o nulo, mostramos el avatar por defecto
    if (!rawUrl) {
        resolvedAvatarUrl.value = defaultAvatar
        return
    }

    resolvedAvatarUrl.value = rawUrl
}

const onStatusChange = (event) => {
    const nuevoEstado = event.target.value
    if (nuevoEstado === 'conectado') {
        clientStore.setConectado()
    } else {
        clientStore.setDesconectado()
    }
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
    gap: 16px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Borde dinámico según estado */
.avatar-wrapper.status-online {
    border: 4px solid #2e7d32; /* Verde Conectado */
    box-shadow: 0 0 10px rgba(46, 125, 50, 0.35);
}

.avatar-wrapper.status-offline {
    border: 4px solid #d9534f; /* Rojo Desconectado */
    box-shadow: 0 0 10px rgba(217, 83, 79, 0.35);
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

/* Tarjeta de Selección Rápida de Estado */
.status-quick-card {
    background-color: white;
    padding: 16px 20px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.status-label {
    font-size: 14px;
    font-weight: bold;
    color: #444;
}

.status-toggle-buttons {
    display: flex;
    gap: 10px;
}

.status-btn {
    flex: 1;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: #f8fafc;
    color: #666;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.status-btn.btn-online.active {
    background-color: #2e7d32;
    color: white;
    border-color: #2e7d32;
    box-shadow: 0 2px 6px rgba(46, 125, 50, 0.3);
}

.status-btn.btn-offline.active {
    background-color: #d9534f;
    color: white;
    border-color: #d9534f;
    box-shadow: 0 2px 6px rgba(217, 83, 79, 0.3);
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