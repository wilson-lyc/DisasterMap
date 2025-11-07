<template>
    <div class="legend-item">
        <span class="legend-line" :style="{ background: color }"></span>
        <span class="legend-label">{{ text }}</span>
    </div>
</template>
<script setup>
defineProps({
    color: {
        type: String,
        default: '#409EFF'
    },
    text: {
        type: String,
        default: ''
    }
})
</script>
<style scoped>

.legend-item {
    display: flex;
    align-items: center;
    user-select: none;
}

.legend-line {
    width: 12px;
    height: 3px;
    border-radius: 2px;
    margin-right: 6px;
    transition: background 0.2s;
    background: #ccc;
}

.legend-label {
    font-size: 14px;
    color: #000;
}
</style>