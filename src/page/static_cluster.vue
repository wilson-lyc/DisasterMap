<template>
    <div v-loading.fullscreen.lock="loading"
        element-loading-text="Loading...Please wait patiently or reduce the number of disaster types"></div>
    <div id="map"></div>
    <el-drawer v-model="drawer" title="Setting" direction="btt" @close="drawerClose" size="60%">
        <el-form :model="filter" label-width="auto" style="max-width: 700px;">
            <el-form-item label="View">
                <el-radio-group v-model="filter.view">
                    <el-radio value="none">None</el-radio>
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
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="Year Range">
                <el-slider v-model="filter.yearRange" range :min="2000" :max="2025" />
            </el-form-item>
            <el-form-item label="Cluster Mode">
                <el-switch v-model="filter.cluster" />
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
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Legend from "@/components/Legend.vue";
import { ElMessage, ElNotification } from 'element-plus'
import { getDisasterData } from "@/api/disaster";

const map = ref(null);
let markers = ref(null);
const data = ref([]);
const drawer = ref(false)
const loading = ref(true)
// 筛选条件
const filter = reactive({
    view: 'none',
    disasterTypes: [
        'Epidemic',
        'Drought',
        'Flood',
        'Extreme temperature',
        'Volcanic activity',
        'Storm',
        'Wildfire',
        'Earthquake'
    ],
    yearRange: [2000, 2025],
    cluster: false
});
// 图例配置
const legendConfig = [
    { type: 'Drought', color: '#FBC02D' },
    { type: 'Flood', color: '#1976D2' },
    { type: 'Extreme temperature', color: '#E53935' },
    { type: 'Volcanic activity', color: '#8E24AA' },
    { type: 'Storm', color: '#00ACC1' },
    { type: 'Wildfire', color: '#FF7043' },
    { type: 'Earthquake', color: '#6D4C41' },
    { type: 'Epidemic', color: '#43A047' }
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

// 绘制标记点
function loadMarkers(input) {
    // 删除现有circles
    map.value.eachLayer(function (layer) {
        if (layer instanceof L.Circle) {
            map.value.removeLayer(layer);
        }
    });
    // 删除现有clusters
    if (markers.value) {
        map.value.removeLayer(markers.value);
        markers.value = null;
    }
    // 判断是否聚合
    if (filter.cluster) {
        markers.value = L.markerClusterGroup(); // 创建新的标记聚合器
    }
    // 创建新坐标
    input.forEach(item => {
        // 创建circle
        let circle = null
        if (filter.view === 'none') {
            circle = L.circle([item.y, item.x], {
                radius: 1000,
                color: item.c,
                fillColor: item.c,
                fillOpacity: 0.3
            })
        }
        else {
            circle = L.circle([item.y, item.x], {
                // radius: 50000 + 20000 * item.r * item.r,
                radius: 90000 * item.r,
                color: item.c,
                fillColor: item.c,
                fillOpacity: 0.2
            })
        }
        // 添加弹窗
        if (filter.view === 'economic') {
            const formattedDamage = (item.e != null && !isNaN(item.e))
                ? Number(item.e).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                : 'No record';
            circle.bindPopup(`<b>${item.d}</b><br>
            Year: ${item.t}<br>
            Economic Damage (USD'000): ${formattedDamage}`);
        } else if (filter.view === 'population') {
            const formattedAffected = (item.p != null && !isNaN(item.p))
                ? Number(item.p).toLocaleString('en-US')
                : 'No record';
            circle.bindPopup(`<b>${item.d}</b><br>
            Year: ${item.t}<br>
            Population Affected: ${formattedAffected}`);
        } else {
            const formattedDamage = (item.e != null && !isNaN(item.e))
                ? Number(item.e).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                : 'No record';
            const formattedAffected = (item.p != null && !isNaN(item.p))
                ? Number(item.p).toLocaleString('en-US')
                : 'No record';
            circle.bindPopup(`<b>${item.d}</b><br>
            Year: ${item.t}<br>
            Population Affected: ${formattedAffected}<br>
            Economic Damage (USD'000): ${formattedDamage}`);
        }
        // 加入map
        if (filter.cluster) {
            markers.value.addLayer(circle); // 聚合模式
        } else {
            circle.addTo(map.value); // 非聚合模式
        }
    });
    if (filter.cluster) {
        map.value.addLayer(markers.value);
    }
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

    // 加载板块数据
    fetch('/config/PB2002_boundaries.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: "red",
                        weight: 2,
                        fillOpacity: 0
                    };
                },
                onEachFeature: function (feature, layer) {
                }
            }).addTo(map.value);
        });

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
