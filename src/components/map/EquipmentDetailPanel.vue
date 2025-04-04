<script setup lang="ts">
import { computed } from "vue";
import { useEquipmentStore } from "@/store/useEquipmentStore";

const store = useEquipmentStore();

const selectedEquipment = computed(() => {
  return store.equipments.find(e => e.id === store.selectedEquipmentId) || null;
});

const modelName = computed(() => {
  return selectedEquipment.value
    ? store.getEquipmentModelName(selectedEquipment.value)
    : "";
});

const lastUpdate = computed(() => {
  return selectedEquipment.value
    ? store.getFormattedLastPosition(selectedEquipment.value.id)
    : "";
});

const lastPosition = computed(() =>
  selectedEquipment.value
    ? store.getLastPosition(selectedEquipment.value.id)
    : null
);
</script>

<template>
  <div v-if="selectedEquipment" class="p-4 border rounded-xl shadow bg-white space-y-2">
    <h2 class="text-lg font-semibold">{{ selectedEquipment.name }}</h2>
    <p class="text-sm text-gray-600">Modelo: <strong>{{ modelName }}</strong></p>
    <p class="text-sm text-gray-500">Última atualização: <strong>{{ lastUpdate }}</strong></p>
    <p v-if="lastPosition" class="text-sm text-gray-500">
      Posição atual: <strong>{{ lastPosition.lat.toFixed(5) }}, {{ lastPosition.lon.toFixed(5) }}</strong>
    </p>
  </div>

  <div v-else class="text-gray-500 italic">Selecione um equipamento no mapa para ver os detalhes.</div>
</template>
