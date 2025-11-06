<template>
    <div class="loading-c" v-loading="loading" element-loading-text="Loading...">
        <iframe ref="myIframe" src="/html/time.html" class="iframe-content"></iframe>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const myIframe = ref(null)
const loading = ref(true)

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
.iframe-content {
    width: 100%;
    height: 100%;
}

.loading-c {
    width: 100%;
    height: 100%;
}
</style>