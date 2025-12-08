
<template>
	<div class="panel-container">
		<img class="panel-img" src="https://cos.umlyc.com/Visualization-Final-Report/F_Disaster%20Economic%20Damage%20Box%20Plot.png" />
		<img class="panel-img" src="https://cos.umlyc.com/Visualization-Final-Report/F_Disaster%20Impact%20Box%20Plots.png" />
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