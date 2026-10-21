<template>
    <div class="page-container">
        <!-- Encabezado con Botón de Regreso y Botón Global para Eliminar Todas -->
        <div class="page-header">
            <button class="icon-fab-back" @click="goBack" title="Volver a la pantalla principal">
                <Icon icon="mdi:arrow-left" width="22" height="22" style="color: white;" />
            </button>
            <h2>Notificaciones</h2>
            <div class="header-spacer"></div>
            <!-- Botón global para eliminar todas las notificaciones -->
            <button
                v-if="notifStore.notifications.length > 0"
                class="icon-fab-delete-all"
                @click="clearAllNotifications"
                title="Eliminar todas las notificaciones"
            >
                <Icon icon="mdi:trash-can-outline" width="22" height="22" style="color: white;" />
            </button>
        </div>

        <!-- Lista de notificaciones -->
        <div class="content-body">
            <div v-if="notifStore.notifications.length === 0" class="empty-state">
                <Icon icon="mdi:bell-off-outline" width="64" height="64" style="color: #9e9e9e;" />
                <p>No tienes notificaciones pendientes.</p>
            </div>

            <div v-else class="notifications-list">
                <div
                    v-for="item in notifStore.notifications"
                    :key="item.id"
                    class="notification-card"
                    :class="{ unread: !item.read }"
                >
                    <div class="icon-avatar">
                        <Icon :icon="item.icon" width="22" height="22" style="color: #0056b3;" />
                    </div>
                    <div class="notification-info">
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.message }}</p>
                        <span class="time">{{ formatTimeAgo(item.timestamp) }}</span>
                    </div>

                    <!-- Botón FAB Circular Rojo con Tacho de Basura Individual -->
                    <button class="btn-delete-card" @click="deleteNotification(item.id)" title="Eliminar notificación">
                        <Icon icon="mdi:trash-can-outline" width="20" height="20" style="color: white;" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const notifStore = useNotificationStore()

const goBack = () => {
    notifStore.markAllAsRead()
    router.push({ name: 'ConcurrentUser' })
}

const deleteNotification = (id) => {
    notifStore.removeNotification(id)
}

const clearAllNotifications = () => {
    notifStore.clearAll()
}

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return ''

    const now = Date.now()
    const diffInSeconds = Math.floor((now - timestamp) / 1000)

    if (diffInSeconds < 60) {
        return 'Hace un momento'
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} min`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
        return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`
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

.header-spacer {
    flex: 1;
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

/* Botón Circular Rojo en la Cabecera para Borrar Todo */
.icon-fab-delete-all {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: #d9534f;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(217, 83, 79, 0.35);
    transition: transform 0.1s, background-color 0.2s;
}

.icon-fab-delete-all:hover {
    background-color: #c9302c;
    transform: scale(1.05);
}

.page-header h2 {
    font-size: 20px;
    margin: 0;
    color: #333;
}

.content-body {
    padding: 16px;
    flex: 1;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 80px;
    color: #666;
    gap: 12px;
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.notification-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background-color: white;
    padding: 14px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.notification-card.unread {
    border-left: 4px solid #0056b3;
    background-color: #f8fbff;
}

.icon-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: #eef5ff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-info {
    flex: 1;
}

.notification-info h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #333;
}

.notification-info p {
    margin: 0 0 6px 0;
    font-size: 13px;
    color: #666;
}

.notification-info .time {
    font-size: 11px;
    color: #999;
}

/* Botón FAB Circular Rojo con Tacho de Basura */
.btn-delete-card {
    width: 42px;
    height: 42px;
    background-color: #d9534f;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(217, 83, 79, 0.35);
    transition: background-color 0.2s, transform 0.15s ease;
}

.btn-delete-card:hover {
    background-color: #c9302c;
    transform: scale(1.1);
}
</style>