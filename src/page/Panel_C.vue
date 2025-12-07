<template>
	<div class="panel-container">
		<img class="panel-img" :src="img1"/>
	</div>
</template>

<script setup>
// 你可以根据实际图片路径修改下面的路径
import img1 from '/img/C_Disaster Impact by Type.png'
</script>

<style scoped>
.panel-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	margin: 0;
	overflow: hidden;
}
.panel-img {
	width: 100%;
	height: 100%;
	max-height: 100%;
	object-fit: contain;
	display: block;
}
</style>