<template>
  <el-menu :default-active="activeMenu" router mode="horizontal">
    <el-menu-item index="/panel_a">Temporal Map</el-menu-item>
    <el-menu-item index="/panel_b">Interactive Map</el-menu-item>
  </el-menu>
  <div id="main">
    <RouterView />
  </div>
  <div class="icp">
    <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2023033182号-2</a>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style>
:root {
  --vueuse-safe-area-top: 0px;
  --vueuse-safe-area-right: 0px;
  --vueuse-safe-area-bottom: 0px;
  --vueuse-safe-area-left: 0px;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#main {
  flex: 1;
  overflow: auto;
}

.icp {
  z-index: 1000;
  position: fixed;
  right: 10px;
  top: 20px;
  font-size: 14px;
}
.icp a {
  color: gray;
  text-decoration: none;
}
</style>