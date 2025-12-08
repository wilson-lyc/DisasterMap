
<template>
	<div class="panel-container">
		<img class="panel-img" src="https://cos.umlyc.com/Visualization-Final-Report/E_Global%20Disaster%20Impact%20Matrix.png" />
		<img class="panel-img" src="https://cos.umlyc.com/Visualization-Final-Report/E_Disaster%20Multi-Dimensional%20Comparison%20Radar%20Chart.png" />
		<img class="panel-img" src="https://cos.umlyc.com/Visualization-Final-Report/E_Disaster%20Event-Level%20Pathways%20Parallel%20Coordinates%20Plot.png" />
	</div>
</template>

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