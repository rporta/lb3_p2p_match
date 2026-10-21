<template>
    <div class="match-grid-container">
        <!-- Título y descripción de la sección -->
        <div class="grid-header">
            <h3>Explorar Matches</h3>
            <p>Encuentra usuarios sugeridos cerca de ti</p>
        </div>

        <!-- Grid Responsivo de Tarjetas -->
        <div class="cards-grid">
            <div
                v-for="user in users"
                :key="user.id"
                class="user-card"
            >
                <div class="card-avatar-container">
                    <Icon icon="mdi:account" width="60" height="60" style="color: #0056b3;" />
                </div>
                <div class="card-details">
                    <h4>{{ user.name }}, {{ user.age }}</h4>
                    <span>{{ user.distance }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
    { id: 1, name: 'Usuario 1', age: 24, distance: 'A 5 km de distancia' },
    { id: 2, name: 'Usuario 2', age: 24, distance: 'A 5 km de distancia' },
    { id: 3, name: 'Usuario 3', age: 24, distance: 'A 5 km de distancia' },
    { id: 4, name: 'Usuario 4', age: 24, distance: 'A 5 km de distancia' },
    { id: 5, name: 'Usuario 5', age: 24, distance: 'A 5 km de distancia' },
    { id: 6, name: 'Usuario 6', age: 24, distance: 'A 5 km de distancia' }
])
</script>

<style scoped>
.match-grid-container {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
}

.grid-header {
    margin-bottom: 20px;
}

.grid-header h3 {
    margin: 0 0 4px 0;
    font-size: 20px;
    color: #333;
}

.grid-header p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

/* Grid Responsivo usando CSS Grid con auto-fit */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    width: 100%;
}

.user-card {
    background: white;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.user-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.card-avatar-container {
    width: 100%;
    height: 140px;
    background-color: #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-details {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.card-details h4 {
    margin: 0;
    font-size: 15px;
    color: #333;
}

.card-details span {
    font-size: 12px;
    color: #888;
}
</style>