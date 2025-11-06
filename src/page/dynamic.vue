<template>
    <div class="wrapper">
        <div v-if="showRotateTip" class="rotate-tip">
            <p>Please rotate your device horizontally</p>
            <p>for a better experience</p>
        </div>
        <div v-else class="content">
            <!-- <iframe v-if="!showRotateTip" ref="myIframe" src="/html/time.html" class="iframe-content"></iframe> -->
            <Time />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Time from '@/components/Time.vue';
import { ElMessage } from 'element-plus'

const showRotateTip = ref(false)

function checkOrientation() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        ElMessage.warning('We recommend using a desktop or tablet to visit map.dextea.cn for a better visual experience')
    }
    if (isMobile && window.innerWidth < window.innerHeight) {
        showRotateTip.value = true;
    } else {
        showRotateTip.value = false;
    }
    
}

onMounted(() => {
    window.addEventListener('resize', checkOrientation);
    checkOrientation();
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkOrientation);
})
</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.content {
    width: 100%;
    height: 100%;
}

.iframe-content {
    width: 100%;
    height: 100%;
}

.rotate-tip {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
    text-align: center;
}
</style>