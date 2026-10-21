import { createRouter, createWebHistory } from 'vue-router'
import { useClientP2PStore } from '@/stores/clientP2P'
import { useAppStore } from '@/stores/appStore'
import HomePage from '@/pages/homePage.vue'
import NewUserPage from '@/pages/newUserPage.vue'
import UserPage from '@/pages/concurrent/userPage.vue'
import NotificationPage from '@/pages/concurrent/notificationPage.vue'
import ProfileSettings from '@/pages/concurrent/profileSettings.vue'

function  delay (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function showSplash () {
    const appStore = useAppStore()

    // Activar Splash Screen
    appStore.setSplash(true)

    // Retardo para mostrar el Splash Modal
    await delay(1800)

    // Desactivar Splash Screen antes de redirigir
    appStore.setSplash(false)
}

function tieneDatosCompletos ()  {
    const clientStore = useClientP2PStore()
    return (
        clientStore.nombre
        && clientStore.apellido
        && clientStore.avatarUrl
    );
}

const routes = [
    {
        path: '/',
        name: 'Root',
        beforeEnter: async (to, from) => {
            const appStore = useAppStore()

            // Activar Splash Screen
            await showSplash()

            if (tieneDatosCompletos()) {
                return { name: 'ConcurrentUser' }
            } else {
                return { name: 'NewUser' }
            }
        }
    },
    {
        path: '/new-user',
        name: 'NewUser',
        component: NewUserPage,
        beforeEnter: async (to, from) => {

            // Activar Splash Screen
            await showSplash()

            if (tieneDatosCompletos()) {
                return { name: 'ConcurrentUser' }
            }
            return true // Si es nuevo, se queda en esta página
        }
    },
{
        path: '/concurrent-user',
        name: 'ConcurrentUser',
        component: UserPage,
        beforeEnter: async (to, from) => {
            const clientStore = useClientP2PStore()
            const appStore = useAppStore()

            // Si no venimos de notificación o configuración, activamos el splash
            if (!['NotificationPage', 'ProfileSettings'].includes(from.name)) {
                await showSplash()
            }

            if (tieneDatosCompletos()) {
                return true
            } else {
                return { name: 'NewUser' }
            }
        }
    },
    {
        path: '/notifications',
        name: 'NotificationPage',
        component: NotificationPage,
        beforeEnter: (to, from) => {
            if (tieneDatosCompletos()) {
                return true
            } else {
                return { name: 'NewUser' }
            }
        }
    },
    {
        path: '/profile-settings',
        name: 'ProfileSettings',
        component: ProfileSettings,
        beforeEnter: (to, from) => {
            if (tieneDatosCompletos()) {
                return true
            } else {
                return { name: 'NewUser' }
            }
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router