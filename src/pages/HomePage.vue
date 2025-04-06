
<script setup lang="ts">
import EquipmentMap from '@/components/map/EquipmentMap.vue';
import EquipmentTable from '@/components/map/EquipmentTable.vue';
import { useEquipmentStore } from '@/store/useEquipmentStore';
import { computed, onMounted } from 'vue';

const store = useEquipmentStore();

const lastPositions = computed(() => {
  const result: Record<string, { lat: number; lon: number } | null> = {};
  for (const equip of store.equipments) {
    const posList = store.positionHistory[equip.id] || [];
    const last = posList.slice(-1)[0];
    result[equip.id] = last ?? null;
  }
  return result;
});

onMounted(() => {
  store.loadEquipments();
  store.loadPositionHistory();
  store.loadEquipmentModels();
  store.loadEquipmentStates()
  store.loadStateHistory();
})


function handleSelect(id: string) {
  store.selectEquipment(id);
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Espaço reservado para filtros -->
    <div class="w-full">
      <div class="text-lg font-semibold mb-2">Filtros (em breve)</div>
      <!-- Aqui vão os filtros futuros -->
    </div>

    <!-- Mapa -->
    <div class="rounded-xl overflow-hidden shadow-md">
      <EquipmentMap />
    </div>

    <!-- Tabela de Equipamentos -->
    <div class="rounded-xl border border-border bg-background shadow-sm">
      <EquipmentTable />
    </div>
  </div>
</template>