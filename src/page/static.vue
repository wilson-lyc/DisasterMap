<template>
    <div v-loading.fullscreen.lock="loading" element-loading-text="Loading..."></div>
    <div id="map"></div>
    <el-drawer v-model="drawer" title="Setting" direction="btt" @close="drawerClose" size="60%">
        <el-form :model="filter" label-width="auto" style="max-width: 700px;">
            <el-form-item label="View">
                <el-radio-group v-model="filter.view">
                    <el-radio value="economic">economic</el-radio>
                    <el-radio value="population">population</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Disaster Type">
                <el-checkbox-group v-model="filter.disasterTypes" :min="1">
                    <el-checkbox value="Drought" name="disasterTypes">Drought</el-checkbox>
                    <el-checkbox value="Flood" name="disasterTypes">Flood</el-checkbox>
                    <el-checkbox value="Extreme temperature" name="disasterTypes">Extreme temperature</el-checkbox>
                    <el-checkbox value="Volcanic activity" name="disasterTypes">Volcanic activity</el-checkbox>
                    <el-checkbox value="Storm" name="disasterTypes">Storm</el-checkbox>
                    <el-checkbox value="Wildfire" name="disasterTypes">Wildfire</el-checkbox>
                    <el-checkbox value="Earthquake" name="disasterTypes">Earthquake</el-checkbox>
                    <el-checkbox value="Epidemic" name="disasterTypes">Epidemic</el-checkbox>
                    <el-checkbox value="Mass movement (wet)" name="disasterTypes">Mass movement (wet)</el-checkbox>
                    <el-checkbox value="Infestation" name="disasterTypes">Infestation</el-checkbox>
                    <el-checkbox value="Mass movement (dry)" name="disasterTypes">Mass movement (dry)</el-checkbox>
                    <el-checkbox value="Impact" name="disasterTypes">Impact</el-checkbox>
                    <el-checkbox value="Animal incident" name="disasterTypes">Animal incident</el-checkbox>
                    <el-checkbox value="Glacial lake outburst flood" name="disasterTypes">Glacial lake outburst
                        flood</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="Year Range">
                <el-slider v-model="filter.yearRange" range :min="2000" :max="2025" />
            </el-form-item>
        </el-form>
    </el-drawer>

    <div class="legend-box">
        <Legend v-for="item in legendConfig" :color="item.color" :text="item.type"
            :active="filter.disasterTypes.includes(item.type)" @click="onLegendClick(item)" />
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Legend from "@/components/Legend.vue";
import { ElMessage, ElNotification } from 'element-plus'
import { getDisasterData } from "@/api/disaster";

const map = ref(null);
const data = ref([]);
const drawer = ref(false)
const loading = ref(true)
// 筛选条件
const filter = reactive({
    view: 'economic',
    disasterTypes: [
        'Drought',
        'Flood',
        'Extreme temperature',
        'Volcanic activity',
        'Storm',
        'Wildfire',
        'Earthquake',
        'Epidemic',
        'Mass movement (wet)',
        'Infestation',
        'Mass movement (dry)',
        'Impact',
        'Animal incident',
        'Glacial lake outburst flood'
    ],
    yearRange: [2000, 2025]
});
// 图例配置
const legendConfig = [
    { type: 'Drought', color: '#FF8C00' },
    { type: 'Flood', color: '#1E90FF' },
    { type: 'Extreme temperature', color: '#B22222' },
    { type: 'Volcanic activity', color: '#8B0000' },
    { type: 'Storm', color: '#4169E1' },
    { type: 'Wildfire', color: '#FF4500' },
    { type: 'Earthquake', color: '#8B4513' },
    { type: 'Epidemic', color: '#228B22' },
    { type: 'Mass movement (wet)', color: '#2F4F4F' },
    { type: 'Infestation', color: '#556B2F' },
    { type: 'Mass movement (dry)', color: '#A0522D' },
    { type: 'Impact', color: '#696969' },
    { type: 'Animal incident', color: '#483D8B' },
    { type: 'Glacial lake outburst flood', color: '#4682B4' }
]

// 加载数据
async function getData(filter) {
    try {
        const res = await getDisasterData({
            view: filter.view,
            disasterTypes: filter.disasterTypes,
            yearRange: filter.yearRange
        });
        return res.data;
    } catch (error) {
        return [];
    }
}

// 加载标记
function loadMarkers(input) {
    // 删除现有标记
    map.value.eachLayer(function (layer) {
        if (layer instanceof L.Circle) {
            map.value.removeLayer(layer);
        }
    });
    // 添加标记
    input.forEach(item => {
        const circle = L.circle([item.latitude, item.longitude], {
            radius: 200 * item.radius,
            color: item.color,
            fillColor: item.color,
            fillOpacity: 0.3
        }).addTo(map.value);

        // 添加弹窗
        if (filter.view === 'economic') {
            const formattedDamage = (item.total_damage_adjusted_usd != null && !isNaN(item.total_damage_adjusted_usd))
                ? Number(item.total_damage_adjusted_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                : 'N/A';
            circle.bindPopup(`<b>${item.disasterTypes}</b><br>
            Year: ${item.start_year}<br>
            Economic Damage: ${formattedDamage}`);
        } else if (filter.view === 'population') {
            const formattedAffected = (item.total_affected != null && !isNaN(item.total_affected))
                ? Number(item.total_affected).toLocaleString('en-US')
                : 'N/A';
            circle.bindPopup(`<b>${item.disasterTypes}</b><br>
            Year: ${item.start_year}<br>
            Population Affected: ${formattedAffected}`);
        } else
            circle.bindPopup(`<b>${item.disasterTypes}</b><br>
            Year: ${item.start_year}`);
    });
}

// 关闭设置面板
async function drawerClose() {
    loading.value = true;
    // 获取数据
    data.value = await getData(filter);
    // 加载标记
    loadMarkers(data.value);
    loading.value = false;
}

// 点击图例
async function onLegendClick(item) {
    const idx = filter.disasterTypes.indexOf(item.type);
    if (idx > -1) {
        // 只允许在选中数量大于1时取消
        if (filter.disasterTypes.length > 1) {
            filter.disasterTypes.splice(idx, 1);
        } else {
            ElMessage.error('Please keep at least one disaster type selected');
            return;
        }
    } else {
        filter.disasterTypes.push(item.type);
    }
    loading.value = true;
    data.value = await getData(filter);
    loadMarkers(data.value);
    loading.value = false;
}

onMounted(async () => {
    loading.value = true;
    // 初始化地图
    map.value = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map.value);

    // 初始化数据
    data.value = await getData(filter);

    // 初始化标记
    loadMarkers(data.value);

    // 初始化toolbar
    const SettingsControl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = 'white';
            container.style.width = '30px';
            container.style.height = '30px';
            container.style.cursor = 'pointer';
            container.style.textAlign = 'center';
            container.style.lineHeight = '30px';
            container.innerHTML = '⚙️'; // 设置图标
            L.DomEvent.disableClickPropagation(container);

            container.onclick = function () {
                drawer.value = true;
            };
            return container;
        }
    });
    map.value.addControl(new SettingsControl());
    loading.value = false;
});
</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}

.legend-box {
    z-index: 1000;
    position: fixed;
    left: 10px;
    bottom: 10px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
</style>
