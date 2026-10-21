import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => {
        const now = Date.now()
        return {
            notifications: [
                {
                    id: 1,
                    title: '¡Tienes un nuevo Match!',
                    message: 'A alguien le ha gustado tu perfil. ¡Inicia una conversación!',
                    icon: 'mdi:heart-flash',
                    timestamp: now - 5 * 60 * 1000,
                    read: false
                },
                {
                    id: 2,
                    title: 'Nuevo Mensaje',
                    message: 'Carlos te ha enviado un mensaje.',
                    icon: 'mdi:message-text',
                    timestamp: now - 60 * 60 * 1000,
                    read: false
                },
                {
                    id: 3,
                    title: 'Bienvenido a P2P Match',
                    message: 'Tu perfil ha sido verificado con éxito.',
                    icon: 'mdi:check-decagram',
                    timestamp: now - 24 * 60 * 60 * 1000,
                    read: false
                }
            ]
        }
    },
    actions: {
        removeNotification(id) {
            this.notifications = this.notifications.filter(item => item.id !== id)
        },
        markAsRead(id) {
            const notif = this.notifications.find(item => item.id === id)
            if (notif) {
                notif.read = true
            }
        },
        markAllAsRead() {
            this.notifications.forEach(item => {
                item.read = true
            })
        },
        clearAll() {
            this.notifications = []
        }
    },
    persist: true
})