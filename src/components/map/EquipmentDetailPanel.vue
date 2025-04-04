<script setup lang="ts">
import { computed } from "vue";
import { useEquipmentStore } from "@/store/useEquipmentStore";

const store = useEquipmentStore();

// Computa o equipamento selecionado com base no ID
const selectedEquipment = computed(() =>
  store.equipments.find((e) => e.id === store.selectedEquipmentId)
);

// Computa a última posição do equipamento
const lastPosition = computed(() =>
  store.selectedEquipmentId ? store.getLastPosition(store.selectedEquipmentId) : null
);
</script>

<template>
  <div class="p-4 bg-white shadow-md rounded-xl h-[500px] overflow-y-auto">
    <h2 class="text-xl font-semibold mb-2">Detalhes do Equipamento</h2>

    <div v-if="selectedEquipment">
      <p><strong>ID:</strong> {{ selectedEquipment.id }}</p>
      <p><strong>Nome:</strong> {{ selectedEquipment.name }}</p>
      <p><strong>Modelo:</strong> {{ selectedEquipment.equipmentModelId }}</p>

      <div v-if="lastPosition" class="mt-2">
        <p><strong>Última posição:</strong></p>
        <p>Lat: {{ lastPosition.lat }}</p>
        <p>Lon: {{ lastPosition.lon }}</p>
        <p>Data: {{ lastPosition.date }}</p>
      </div>
    </div>

    <p v-else class="text-gray-500">Selecione um marcador no mapa.</p>
  </div>
</template>
