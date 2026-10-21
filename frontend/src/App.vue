<template>
    <v-app>
        <!-- Aquí puedes colocar componentes globales como v-app-bar o v-navigation-drawer si los necesitas -->
        <v-app-bar app color="primary" dark>
            <v-toolbar-title>P2P Match</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- Navegación usando componentes de Vuetify como enlaces de Router -->
            <!-- <v-btn text to="/">Inicio</v-btn> -->
        </v-app-bar>

        <v-main>
            <!-- v-container ayuda a centrar y dar un espaciado limpio a tus vistas -->
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
// Ya no necesitamos importar io ni onMounted aquí,
// porque toda la lógica de conexión queda exclusivamente bajo el control manual de homePage.vue
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
</script>