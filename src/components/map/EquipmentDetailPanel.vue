<template>
  <div v-if="selectedEquipment" class="p-4 space-y-4">
    <h2 class="text-xl font-bold">{{ selectedEquipment.name }}</h2>
    <p class="text-gray-600">Modelo: {{ modelName }}</p>
    <p class="text-gray-600">Última posição: {{ lastPositionFormatted }}</p>

    <div>
      <h3 class="font-semibold mt-4 mb-2">Histórico de Estados</h3>
      <ul class="space-y-1">
        <li v-for="(entry, index) in stateHistory" :key="index" class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: getEquipmentStateColor(entry.equipmentStateId) }"></span>
          <span class="text-sm">
            {{ getEquipmentStateName(entry.equipmentStateId) }} -
            {{ formatDate(entry.date) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="p-4 text-gray-500">
    Selecione um equipamento no mapa para ver detalhes.
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import { computed } from "vue";

const store = useEquipmentStore();
const {
  selectedEquipmentId,
  equipments,
  equipmentModels,
} = storeToRefs(store);

const selectedEquipment = computed(() => {
  return equipments.value.find((e) => e.id === selectedEquipmentId.value) || null;
});

const modelName = computed(() => {
  if (!selectedEquipment.value) return "-";
  const model = equipmentModels.value.find(
    (m) => m.id === selectedEquipment.value?.equipmentModelId
  );
  return model?.name || "Modelo desconhecido";
});

const lastPositionFormatted = computed(() => {
  if (!selectedEquipmentId.value) return "-";
  return store.getFormattedLastPosition(selectedEquipmentId.value);
});

const stateHistory = computed(() => store.getStateHistoryForSelected());

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getEquipmentStateName(id: string) {
  return store.getEquipmentStateName(id);
}

function getEquipmentStateColor(id: string) {
  return store.getEquipmentStateColor(id);
}
</script>

<style scoped></style>
