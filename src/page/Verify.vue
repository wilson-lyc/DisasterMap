<template>
    <div class="verity-wrapper">
        <div class="tips">Please verify you are human</div>
        <div id="turnstile-container"></div>
        <div class="wechat-warning">This site cannot be accessed inside WeChat.</div>
        <div class="wechat">Please use your device's default browser to open it.</div>
        {{ isWeChat }}
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const SITE_KEY = import.meta.env.VITE_SITE_KEY
const isWeChat = ref(false);

const isWeChatBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
}

onMounted(() => {
    isWeChat.value = isWeChatBrowser();

    if (window.turnstile) {
        window.turnstile.render('#turnstile-container', {
            sitekey: SITE_KEY,
            language: 'en',
            callback: (token) => {
                sessionStorage.setItem('verify_token', token)
                const redirectPath = route.query.redirect || '/'
                router.push(redirectPath)
            },
            'error-callback': function (errorCode) {
                console.log('Challenge Error:', errorCode);
            },
            'expired-callback': function () {
                console.log('Token expired');
            },
            'timeout-callback': function () {
                console.log('Challenge timed out');
                ElMessageBox.alert("If you haven't been able to complete verification for an extended period, please try accessing our website using your phone's default browser, such as Safari.", 'Reminder', {
                    confirmButtonText: 'OK',
                })
            }
        })
    }
})
</script>

<style scoped>
.verity-wrapper {
    margin: 24px auto 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.tips {
    font-size: 16px;
}
</style>