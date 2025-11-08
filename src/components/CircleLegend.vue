<template>
    <div class="legend-item" @click="onClick" :title="active?'cancel':'show'">
        <span class="legend-dot" :style="{
            background: active ? color : '#ccc'
        }"></span>
        <span class="legend-label" :style="{ color: active ? '#000' : '#aaa' }">{{ text }}</span>
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
    },
    active: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['click'])
function onClick() {
    emit('click')
}
</script>
<style scoped>
.legend-item {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 6px;
}
</style>