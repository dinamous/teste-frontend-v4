<script setup lang="ts">
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
  LCircleMarker,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import AntPath from "@/components/map/AntPath.vue";

import { useEquipmentStore } from "@/store/useEquipmentStore";
import { ref, onMounted, computed } from "vue";
import type { LatLngExpression } from "leaflet";

const store = useEquipmentStore();
const mapRef = ref<any>(null);

// Carrega os dados ao montar o componente
onMounted(() => {
  store.loadEquipments();
  store.loadPositionHistory();
});

// Última posição de um equipamento
function getLatLng(equipmentId: string): LatLngExpression {
  const pos = store.getLastPosition(equipmentId);
  return pos ? [pos.lat, pos.lon] : [0, 0];
}

// Trajetória completa do equipamento selecionado
const trajectory = computed(() => {
  if (!store.selectedEquipmentId) return [];
  const positions = store.positionHistory[store.selectedEquipmentId] || [];
  return positions.map((p) => [p.lat, p.lon]) as [number, number][];
});
</script>

<template>
  <LMap ref="mapRef" style="height: 500px" :zoom="5" :center="[-14.235, -51.9253]" :use-global-leaflet="false"
    class="rounded-xl shadow">
    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors" />

    <!-- Marcadores de cada equipamento -->
    <LMarker v-for="equip in store.equipments" :key="equip.id" :lat-lng="getLatLng(equip.id)"
      @click="store.setSelectedEquipment(equip.id)" />

    <!-- Ponto de partida da trajetória -->
    <LCircleMarker v-if="store.selectedEquipmentId && trajectory.length" :lat-lng="trajectory[0]" :radius="6"
      color="green" fill-color="green" :fill-opacity="0.8" />

    <!-- Trajetória do equipamento selecionado -->
    <AntPath v-if="store.selectedEquipmentId && trajectory.length" :lat-lngs="trajectory"
      :map-object="mapRef?.leafletObject" />
  </LMap>
</template>
