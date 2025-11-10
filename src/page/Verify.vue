<template>
    <div class="verity-wrapper">
        <div class="tips">Please verify you are human</div>
        <div id="turnstile-container"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const SITE_KEY = import.meta.env.VITE_SITE_KEY

onMounted(() => {
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
            }
        })
    }
})
</script>

<style scoped>
.verity-wrapper {
    margin: 24px auto 0 auto;
    text-align: center;
}

.tips {
    font-size: 16px;
    margin-bottom: 12px;
}
</style>