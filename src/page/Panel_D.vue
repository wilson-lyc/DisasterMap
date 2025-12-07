<template>
	<div class="panel-container">
		<img class="panel-img" :src="img1"/>
	</div>
</template>

<script setup>
import img1 from '/img/D_Disaster Month Heatmap.png'
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