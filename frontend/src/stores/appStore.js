import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        locale: 'esp',
        socketConnected: false,
        activeUsers: []
    }),
    actions: {
        setLocale(lang) {
            this.locale = lang
        },
        setSocketStatus(status) {
            this.socketConnected = status
        },
        setActiveUsers(users) {
            this.activeUsers = users
        }
    }
})