<template>
    <div class="subpage-container">
        <h3>Conversaciones</h3>
        <p class="subtitle">Chatea con tus matches</p>

        <div class="chat-list">
            <div v-for="i in 4" :key="i" class="chat-item">
                <div class="chat-avatar">
                    <v-icon icon="mdi-account" color="grey"></v-icon>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <h4>Contacto {{ i }}</h4>
                        <span class="chat-time">12:30 PM</span>
                    </div>
                    <p class="last-message">¡Hola! ¿Cómo estás?</p>
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

.chat-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.chat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.chat-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-info {
    flex: 1;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h4 {
    margin: 0;
    font-size: 15px;
    color: #333;
}

.chat-time {
    font-size: 11px;
    color: #999;
}

.last-message {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #666;
}
</style>