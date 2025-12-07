
<template>
	<div class="panel-container">
		<img class="panel-img" :src="img1" />
		<img class="panel-img" :src="img2" />
		<img class="panel-img" :src="img3" />
	</div>
</template>

<script setup>
import img1 from '/img/E_Global Disaster Impact Matrix.png'
import img2 from '/img/E_Disaster Multi-Dimensional Comparison Radar Chart.png'
import img3 from '/img/E_Disaster Event-Level Pathways Parallel Coordinates Plot.png'
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