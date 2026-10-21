<template>
    <div class="encounters-container">
        <div class="cards-stack">
            <!-- Si no hay más perfiles -->
            <div v-if="profiles.length === 0" class="no-more-profiles">
                <Icon icon="mdi:account-off" width="64" height="64" style="color: #ccc;" />
                <p>No hay más perfiles cercanos</p>
            </div>

            <template v-else>
                <!-- Tarjeta de fondo (siguiente perfil) -->
                <div v-if="profiles[1]" class="encounter-card background-card">
                    <div class="card-image-placeholder">
                        <Icon icon="mdi:account" width="80" height="80" style="color: #aaa;" />
                    </div>
                    <div class="card-info">
                        <h3>{{ profiles[1].name }}, {{ profiles[1].age }}</h3>
                        <p>{{ profiles[1].distance }}</p>
                    </div>
                </div>

                <!-- Tarjeta principal interactiva con soporte de arrastre (Swipe) -->
                <div
                    class="encounter-card active-card"
                    :class="[animationClass, { 'is-dragging': isDragging }]"
                    :style="cardStyle"
                    @mousedown="startDrag"
                    @mousemove="onDrag"
                    @mouseup="stopDrag"
                    @mouseleave="stopDrag"
                    @touchstart="startDrag"
                    @touchmove="onDrag"
                    @touchend="stopDrag"
                >
                    <div class="card-image-placeholder">
                        <Icon icon="mdi:account" width="100" height="100" style="color: #0056b3;" />
                    </div>
                    <div class="card-info">
                        <h3>{{ profiles[0].name }}, {{ profiles[0].age }}</h3>
                        <p>{{ profiles[0].distance }}</p>

                        <!-- Botones integrados en la parte inferior de la tarjeta -->
                        <div class="card-actions-overlay">
                            <button class="action-fab btn-reject" @click.stop="triggerSwipe('right')" title="Rechazar">
                                <Icon icon="mdi:close" width="28" height="28" style="color: #ff4d4d;" />
                            </button>
                            <button class="action-fab btn-like" @click.stop="triggerSwipe('left')" title="Me gusta">
                                <Icon icon="mdi:heart" width="28" height="28" style="color: #28a745;" />
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const profiles = ref([
    { id: 1, name: 'Valentina', age: 24, distance: 'A 4 km de distancia' },
    { id: 2, name: 'Chloe', age: 25, distance: 'A 3 km de distancia' },
    { id: 3, name: 'Sofía', age: 23, distance: 'A 5 km de distancia' },
    { id: 4, name: 'Lucía', age: 26, distance: 'A 2 km de distancia' }
])

const animationClass = ref('')
const translateX = ref(0)
const translateY = ref(0)
const rotation = ref(0)
const isDragging = ref(false)
let startX = 0
let startY = 0

const cardStyle = computed(() => {
    if (isDragging.value || translateX.value !== 0) {
        return {
            transform: `translate(${translateX.value}px, ${translateY.value}px) rotate(${rotation.value}deg)`,
            transition: isDragging.value ? 'none' : 'transform 0.3s ease'
        }
    }
    return {}
})

const triggerSwipe = (direction) => {
    if (animationClass.value) return

    if (direction === 'left') {
        // Corazón: Inclinación y salida a la izquierda
        animationClass.value = 'slide-left-inverse'
    } else {
        // X: Inclinación y salida a la derecha
        animationClass.value = 'slide-right-inverse'
    }

    setTimeout(() => {
        profiles.value.shift()
        animationClass.value = ''
        translateX.value = 0
        translateY.value = 0
        rotation.value = 0
    }, 350)
}

// Lógica de Arrastre (Drag / Swipe con Mouse o Touch)
const startDrag = (e) => {
    isDragging.value = true
    startX = e.clientX || e.touches[0].clientX
    startY = e.clientY || e.touches[0].clientY
}

const onDrag = (e) => {
    if (!isDragging.value) return
    const currentX = e.clientX || e.touches[0].clientX
    const currentY = e.clientY || e.touches[0].clientY

    translateX.value = currentX - startX
    translateY.value = currentY - startY
    rotation.value = translateX.value * 0.08 // Inclinar según el movimiento
}

const stopDrag = () => {
    if (!isDragging.value) return
    isDragging.value = false

    const threshold = 100 // Distancia mínima para considerar un swipe
    if (translateX.value > threshold) {
        // Movido a la derecha -> Acción X (Rechazar)
        triggerSwipe('right')
    } else if (translateX.value < -threshold) {
        // Movido a la izquierda -> Acción Match (Corazón)
        triggerSwipe('left')
    } else {
        // Volver al centro si no se superó el umbral
        translateX.value = 0
        translateY.value = 0
        rotation.value = 0
    }
}
</script>

<style scoped>
.encounters-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
}

.cards-stack {
    position: relative;
    width: 340px;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.no-more-profiles {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #666;
    height: 100%;
}

.encounter-card {
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    user-select: none;
    cursor: grab;
}

.encounter-card.is-dragging {
    cursor: grabbing;
}

/* Tarjeta de fondo asomándose ligeramente abajo y escalada */
.background-card {
    transform: scale(0.94) translateY(18px);
    z-index: 1;
    opacity: 0.75;
}

.active-card {
    z-index: 2;
}

.card-image-placeholder {
    flex: 1;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-info {
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.75) 20%, rgba(0,0,0,0.3) 70%, transparent);
    color: white;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-info h3 {
    margin: 0;
    font-size: 24px;
}

.card-info p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
}

/* Botones integrados en la parte inferior de la tarjeta (Estilo exacto de referencia) */
.card-actions-overlay {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 10px 20px;
    border-radius: 40px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    margin-top: 5px;
}

.action-fab {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.15s ease;
}

.action-fab:hover {
    transform: scale(1.1);
}

/* Animaciones de deslizamiento con inclinación inversa */
.slide-left-inverse {
    transform: translateX(-130%) rotate(-25deg) !important;
    opacity: 0;
    transition: transform 0.35s ease, opacity 0.35s ease !important;
}

.slide-right-inverse {
    transform: translateX(130%) rotate(25deg) !important;
    opacity: 0;
    transition: transform 0.35s ease, opacity 0.35s ease !important;
}
</style>