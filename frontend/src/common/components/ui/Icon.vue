<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    icon: {
        type: String,
        required: true
    },
    customClass: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <Icon :icon="icon" :class="customClass" />
</template>
