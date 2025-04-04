<script setup lang="ts">
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

import "leaflet/dist/leaflet.css";

import { useEquipmentStore } from "@/store/useEquipmentStore";
import { onMounted } from "vue";
import type { LatLngExpression } from "leaflet";

const store = useEquipmentStore();

// Carrega os dados assim que o componente é montado
onMounted(() => {
  store.loadEquipments();
  store.loadPositionHistory();
});

// Função utilitária que transforma a última posição de um equipamento em uma tupla [lat, lon]
function getLatLng(equipmentId: string): LatLngExpression {
  const pos = store.getLastPosition(equipmentId);
  return pos ? [pos.lat, pos.lon] : [0, 0]; // fallback em caso de dados ausentes
}
</script>

<template>
  <LMap style="height: 500px" class="w-full rounded-xl shadow" :zoom="5" :center="[ -14.2350, -51.9253 ]"
    :use-global-leaflet="false">
    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors" />

    <!-- Itera sobre cada equipamento e adiciona um marcador com sua posição atual -->
    <LMarker v-for="equip in store.equipments" :key="equip.id" :lat-lng="getLatLng(equip.id)" />
  </LMap>
</template>
