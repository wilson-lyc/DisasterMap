<template>
    <div class="iframe-wrapper" v-loading="loading" element-loading-text="Loading...">
        <iframe ref="myIframe" src="/html/time.html" class="iframe-content"></iframe>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const loading = ref(true)
const myIframe = ref(null)

function handleIframeLoad() {
    loading.value = false
}

onMounted(() => {
    if (myIframe.value) {
        myIframe.value.addEventListener('load', handleIframeLoad)
    }
})

onBeforeUnmount(() => {
    if (myIframe.value) {
        myIframe.value.removeEventListener('load', handleIframeLoad)
    }
})
</script>

<style scoped>
.iframe-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.iframe-content {
    width: 100%;
    height: 100%;
    border: none;
}
</style>