<template>
    <div class="subpage-container">
        <h3>Tus Likes</h3>
        <p class="subtitle">Personas que han interactuado con tu perfil</p>

        <div class="likes-list">
            <div v-for="i in 3" :key="i" class="like-item">
                <div class="avatar-box">
                    <v-icon icon="mdi-heart" color="error"></v-icon>
                </div>
                <div class="like-details">
                    <h4>Persona {{ i }}</h4>
                    <p>Le gustó tu foto de perfil</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.subpage-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.subpage-container h3 {
    margin: 0;
    color: #333;
}

.subtitle {
    margin: 0 0 8px 0;
    color: #666;
    font-size: 14px;
}

.likes-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.like-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.avatar-box {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #ffeef0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.like-details h4 {
    margin: 0;
    font-size: 15px;
    color: #333;
}

.like-details p {
    margin: 2px 0 0 0;
    font-size: 13px;
    color: #666;
}
</style>