
<template>
	<div class="panel-container">
		<img class="panel-img" :src="img1" />
		<img class="panel-img" :src="img2" />
	</div>
</template>

<script setup>
import img1 from '/img/F_Disaster Economic Damage Box Plot.png'
import img2 from '/img/F_Disaster Impact Box Plots.png'
</script>

<style scoped>
.panel-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	margin: 0;
	overflow-y: auto;
	overflow-x: hidden;
	gap: 16px;
	padding: 0;
}
.panel-img {
	width: 100%;
	height: auto;
	max-width: 100%;
	object-fit: contain;
	display: block;
}
</style>