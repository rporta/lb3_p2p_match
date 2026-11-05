import { defineStore } from 'pinia'

export const useSocialStore = defineStore('social', {
    state: () => ({
        conversations: [],  // Lista de conversaciones existentes
        likes: [],          // Lista de likes (P2P que me dieron like pero aún no hay match)
        matches: [],        // Lista de matches mutuos
        matchesOnline: [],  // Lista de matches conectados actualmente
        matchesBlocked: []  // Lista de matches o usuarios bloqueados
    }),

    actions: {
        // Acciones para gestionar conversaciones
        setConversations(list) {
            this.conversations = list
        },
        addConversation(uuid) {
            if (!this.conversations.some(conversation => conversation === uuid)) {
                this.conversations.push(uuid)
            }
        },

        // Acciones para Likes
        setLikes(list) {
            this.likes = list
        },
        addLike(uuid) {
            if (!this.likes.some(like => like === uuid)) {
                this.likes.push(uuid)
            }
        },

        // Acciones para Matches
        setMatches(list) {
            this.matches = list
        },
        addMatch(uuid) {
            if (!this.matches.some(match => match === uuid)) {
                this.matches.push(uuid)
            }
        },

        // Acciones para Matches Online
        setMatchesOnline(list) {
            this.matchesOnline = list
        },
        addMatchOnline(uuid) {
            if (!this.matchesOnline.some(matchOnline => matchOnline === uuid)) {
                this.matchesOnline.push(uuid)
            }
        },

        // Acciones para Bloqueos
        blockMatch(uuid) {
            const index = this.matches.findIndex(m => m.uuid === uuid)
            if (index !== -1) {
                const [blockedUser] = this.matches.splice(index, 1)
                if (!this.matchesBlocked.some(m => m.uuid === uuid)) {
                    this.matchesBlocked.push(blockedUser)
                }
            }
        },
        unblockMatch(uuid) {
            const index = this.matchesBlocked.findIndex(m => m.uuid === uuid)
            if (index !== -1) {
                const [unblockedUser] = this.matchesBlocked.splice(index, 1)
                this.matches.push(unblockedUser)
            }
        }
    },

    persist: true
})