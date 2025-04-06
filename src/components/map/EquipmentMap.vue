<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEquipmentStore } from '@/store/useEquipmentStore';
import {
  LMap,
  LTileLayer,
  LMarker,
  LTooltip,
  LPolyline,
  LCircleMarker,
} from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

type Position = {
  lat: number;
  lon: number;
  date: string;
};

const mapRef = ref();
const zoom = ref(6);
const center = ref<[number, number]>([-19.9, -44.0]);
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
  'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

const store = useEquipmentStore();
const {
  equipments,
  selectedEquipmentId,
  positionHistory,
} = storeToRefs(store);

const getLastPosition = (equipmentId: string): [number, number] => {
  const positions = positionHistory.value[equipmentId] || [];
  const last = positions.length ? positions[positions.length - 1] : null;
  return last ? [last.lat, last.lon] as [number, number] : [0, 0] as [number, number];
};

const trajectoryCoordinates = computed(() => {
  if (!selectedEquipmentId.value) return [];
  return (positionHistory.value[selectedEquipmentId.value] || [])
    .filter((p): p is Position => !!p)
    .map((p) => [p.lat, p.lon] as [number, number]);
});

const lastPosition = computed(() => {
  if (!selectedEquipmentId.value) return null;
  const positions = positionHistory.value[selectedEquipmentId.value] || [];
  return positions.length ? positions[positions.length - 1] : null;
});

const lastPositions = computed(() => {
  const result: Record<string, Position | null> = {};
  for (const equip of equipments.value) {
    const pos = positionHistory.value[equip.id];
    result[equip.id] = pos?.length ? pos[pos.length - 1] : null;
  }
  return result;
});

const selectEquipment = (id: string) => {
  store.selectedEquipmentId = id;
  const pos = getLastPosition(id);
  if (mapRef.value && pos) {
    mapRef.value.leafletObject.setView(pos, 13);
  }
};

onMounted(() => {
  const allPositions = Object.values(positionHistory.value)
    .flat()
    .filter((p): p is Position => !!p);
  if (allPositions.length > 0 && mapRef.value) {
    const bounds = L.latLngBounds(allPositions.map((p) => [p.lat, p.lon] as [number, number]));
    mapRef.value.leafletObject.fitBounds(bounds, { padding: [50, 50] });
  }
});
</script>

<template>
  <LMap ref="mapRef" :zoom="zoom" :center="center" style="height: 400px; width: 100%">
    <LTileLayer :url="url" :attribution="attribution" />

    <LMarker v-for="equipment in equipments" :key="equipment.id" :lat-lng="getLastPosition(equipment.id)"
      @click="selectEquipment(equipment.id)">
      <LTooltip>
        {{ equipment.name }}<br />
        {{ lastPositions[equipment.id]?.lat?.toFixed(4) ?? '–' }},
        {{ lastPositions[equipment.id]?.lon?.toFixed(4) ?? '–' }}
      </LTooltip>
    </LMarker>

    <LPolyline v-if="selectedEquipmentId && trajectoryCoordinates.length" :lat-lngs="trajectoryCoordinates" color="blue"
      :weight="3" :opacity="0.5" />

    <LCircleMarker v-if="lastPosition" :lat-lng="[lastPosition.lat, lastPosition.lon]" :radius="10" color="green" />
  </LMap>
</template>

<style scoped></style>