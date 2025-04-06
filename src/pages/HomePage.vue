<template>
  <div class="flex flex-col gap-4">
    <!-- Filtros futuros -->
    <div class="p-4 bg-white shadow rounded-xl">
      <h2 class="text-lg font-semibold">Filtros (em breve)</h2>
    </div>

    <!-- Mapa -->
    <div class="w-full">
      <EquipmentMap />
    </div>

    <!-- Tabela -->
    <div class="w-full bg-white rounded-xl shadow p-4">
      <h2 class="text-lg font-semibold mb-4">Lista de Equipamentos</h2>
      <table class="w-full text-left table-auto">
        <thead>
          <tr class="text-sm text-gray-500 border-b">
            <th class="py-2 px-3">Nome</th>
            <th class="py-2 px-3">Modelo</th>
            <th class="py-2 px-3">Última posição</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equip in store.equipments" :key="equip.id" @click="handleSelect(equip.id)"
            class="hover:bg-gray-100 cursor-pointer text-sm border-b">
            <td class="py-2 px-3">{{ store.getEquipmentName(equip.id) }}</td>
            <td class="py-2 px-3">{{ store.getModelName(equip.equipmentModelId) }}</td>
            <td class="py-2 px-3">
              <span v-if="lastPositions[equip.id]">
                {{ lastPositions[equip.id]?.lat?.toFixed(4) ?? '–' }},
                {{ lastPositions[equip.id]?.lon?.toFixed(4) ?? '–' }}
              </span>
              <span v-else class="text-gray-400">N/A</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import EquipmentMap from '@/components/map/EquipmentMap.vue';
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
