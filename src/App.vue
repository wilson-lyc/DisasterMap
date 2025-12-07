<template>
  <el-menu :default-active="activeMenu" router mode="horizontal">
    <el-menu-item index="/panel_a">Panel A - Temporal Map</el-menu-item>
    <el-menu-item index="/panel_b">Panel B - Interactive Map</el-menu-item>
    <el-menu-item index="/panel_c">Panel C</el-menu-item>
    <el-menu-item index="/panel_d">Panel D</el-menu-item>
    <el-menu-item index="/panel_e">Panel E</el-menu-item>
    <el-menu-item index="/panel_f">Panel F</el-menu-item>
    <el-menu-item index="/panel_g">Panel G</el-menu-item>
    <el-menu-item>
      <template #default>
        <a href="https://beian.miit.gov.cn" target="_blank">粤ICP备2023033182号</a>
      </template>
    </el-menu-item>
    <el-menu-item>
      <template #default>
        <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank">粤公网安备44020402000374号</a>
      </template>
    </el-menu-item>
  </el-menu>
  <div id="main">
    <RouterView />
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

a {
  text-decoration: none;
}
</style>