<template>

    <div v-loading.fullscreen.lock="loading"
        element-loading-text="Loading...Please wait patiently or reduce the number of disaster types"></div>
    <div id="map"></div>

    <!-- Setting Panel -->
    <el-drawer v-model="drawer" title="Setting" direction="btt" size="60%" @open="onSettingOpen"
        @close="onSettingClose">
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
            <el-form-item label="Plate Boundaries">
                <el-switch v-model="filter.plate" />
            </el-form-item>
        </el-form>
    </el-drawer>

    <!-- Bottom Left -->
    <div class="bl-container">
        <div class="box time-box" title="setting" @click="drawer = true">
            <div v-if="filter.yearRange[0] === filter.yearRange[1]">
                Time: {{ filter.yearRange[0] }}
            </div>
            <div v-else>
                Time: {{ filter.yearRange[0] }} - {{ filter.yearRange[1] }}
            </div>
        </div>
        <div class="box">
            <LineLegend color="#ff0000" text="Plate Boundaries" v-if="filter.plate" />
            <CircleLegend v-for="item in legendConfig" :color="item.color" :text="item.type"
                :active="filter.disasterTypes.includes(item.type)" @click="onLegendClick(item)" />
        </div>
    </div>

    <!-- Detail -->
    <div>
        <el-dialog v-model="detailVisible" title="Disaster Details" class="detail-dialog">
            <template v-if="detailData && Object.keys(detailData).length">
                <el-table :data="Object.entries(detailData)" border height="300" style="width:100%;min-width:200px;">
                    <el-table-column label="Key" prop="0">
                        <template #default="scope">
                            {{ keyMap[scope.row[0]] || scope.row[0] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Value" prop="1">
                        <template #default="scope">
                            {{ (scope.row[1] === null || scope.row[1] === undefined || scope.row[1] === '') ? 'No record' : scope.row[1] }}
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-else>
                <span>No detail data.</span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import CircleLegend from "@/components/CircleLegend.vue";
import LineLegend from "@/components/LineLegend.vue";
import { ElMessage } from 'element-plus'
import { getDisasterData, getDisasterDetail } from "@/api/disaster";

// 变量
const map = ref(null);          // 地图实例
let circlesGroup = ref(null);   // 圆圈组
let plateLayer = ref(null);     // 大陆板块图层
const data = ref([]);           // 数据
const drawer = ref(false)       // 设置面板状态
const loading = ref(true)       // 加载状态
let oldFilter = null;           // 旧过滤器
const detailVisible = ref(false);   // 详情对话框可见性
let detailData = ref(null);         // 详情数据

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

// 数据过滤器
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
    cluster: false,
    plate: false
});

// 字段映射字典
const keyMap = {
    id: "ID",
    d: "Disaster Type",
    y: "Latitude",
    x: "Longitude",
    r: "Region",
    c: "Country",
    l: "Location",
    sy: "Start Year",
    sm: "Start Month",
    sd: "Start Day",
    ey: "End Year",
    em: "End Month",
    ed: "End Day",
    p: "Population Affected",
    e: "Economic Demage (USD'000)"
};

// 获取数据
async function getData(filter) {
    try {
        const res = await getDisasterData({
            view: filter.view,
            disasterTypes: filter.disasterTypes,
            yearRange: filter.yearRange
        });
        if (res.data.length === 0) {
            ElMessage.warning('No data. Please adjust your settings.');
        }

        return res.data;
    } catch (error) {
        return [];
    }
}

// 格式化数字
function formattedNumber(value) {
    if (value != null && !isNaN(value)) {
        return Number(value).toLocaleString('en-US');
    } else {
        return 'No record';
    }
}

function getColor(type) {
    const item = legendConfig.find(i => i.type === type);
    return item ? item.color : '#000000';
}

// 创建地图
function createMap() {
    if (map.value)
        return
    map.value = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data from OpenStreetMap | Disaster data from EM-DAT"
    }).addTo(map.value);
}

// 创建大陆板块图层
async function createPlateLayer() {
    if (plateLayer.value)
        return;
    // 加载板块数据
    const response = await fetch('/config/PB2002_plates.json');
    const data = await response.json();
    plateLayer.value = L.geoJSON(data, {
        style: () => ({
            color: "red",
            weight: 2,
            fillOpacity: 0
        }),
        onEachFeature: (feature, layer) => {
        },
    });
    // 添加到地图
    if (map.value) {
        plateLayer.value.addTo(map.value);
    }
}

// 移除大陆板块图层
function removePlateLayer() {
    if (plateLayer.value) {
        map.value.removeLayer(plateLayer.value);
        plateLayer.value = null;
    }
}

// 绘制标记
function drawCircles(data) {
    // 清除现有标记
    if (circlesGroup.value) {
        map.value.removeLayer(circlesGroup.value);
        circlesGroup.value = null;
    }
    // 创建新的标记组
    if (filter.cluster) {
        circlesGroup.value = L.markerClusterGroup(); // 聚合模式
    } else {
        circlesGroup.value = L.layerGroup(); // 非聚合模式
    }
    // 创建标记
    data.forEach(item => {
        // 创建圆圈
        let circle = L.circle([item.y, item.x], {
            color: getColor(item.d),
            fillColor: getColor(item.d),
        })
        // 设置半径
        if (filter.view === 'none') {
            circle.setRadius(1000);
        } else {
            circle.setRadius(90000 * item.r);
        }
        // 添加弹窗
        circle.bindPopup(`<b>${item.d}</b><br>
            ID: ${item.id}<br>
            Year: ${item.t}<br>
            Population Affected: ${formattedNumber(item.p)}<br>
            Economic Damage (USD'000): ${formattedNumber(item.e)}<br>
            <a href="javascript:void(0)" onclick="window.__showDisasterDetail && window.__showDisasterDetail('${item.id}')">More</a>`);
        // 加入标记组
        circlesGroup.value.addLayer(circle);
    });
    map.value.addLayer(circlesGroup.value);
}

// 打开设置面板
function onSettingOpen() {
    oldFilter = JSON.parse(JSON.stringify(filter));
}

// 关闭设置面板
async function onSettingClose() {
    loading.value = true;
    // 判断过滤条件是否变化
    if (JSON.stringify(oldFilter) === JSON.stringify(filter)) {
        loading.value = false;
        return;
    }
    // 重新绘制板块
    if (filter.plate) {
        await createPlateLayer();
    } else {
        removePlateLayer();
    }
    // 获取新数据
    data.value = await getData(filter);
    // 重新绘制标记
    drawCircles(data.value);
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
    drawCircles(data.value);
    loading.value = false;
}

// detail dialog
async function showDetail(id) {
    // 获取数据
    detailData.value = null;
    try {
        const res = await getDisasterDetail(id);
        detailData.value = res.data;
    } catch (error) {
        return;
    }
    detailVisible.value = true;
}


onMounted(async () => {
    loading.value = true;

    // 初始化地图
    createMap();

    // 初始化板块图层
    if (filter.plate) {
        await createPlateLayer();
    }

    // 获取数据
    data.value = await getData(filter);

    // 绘制标记
    drawCircles(data.value);

    // 右上角 - 设置
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

    window.__showDisasterDetail = showDetail;

    // 结束加载
    loading.value = false;
});
</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}

.bl-container {
    z-index: 1000;
    position: fixed;
    left: 10px;
    bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.bl-container .box {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 14px;
}

.time-box {
    cursor: pointer;
}

.detail-dialog {
    /* 默认宽度 */
    max-width: 500px;
    width: 100%;
}

@media (max-width: 600px) {
    .detail-dialog {
        max-width: 98vw !important;
        width: 98vw !important;
        left: 1vw !important;
    }
    .el-table {
        font-size: 12px;
    }
    .el-dialog {
        padding: 0 !important;
    }
}
</style>
