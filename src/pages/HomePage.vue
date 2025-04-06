<script setup lang="ts">
import EquipmentMap from '@/components/map/EquipmentMap.vue'
import { useEquipmentStore } from '@/store/useEquipmentStore'
import { onMounted } from 'vue'
import EquipmentDetailPanel from '@/components/map/EquipmentDetailPanel.vue'
const store = useEquipmentStore()

onMounted(() => {
  store.loadEquipments();
  store.loadPositionHistory();
  store.loadEquipmentModels();
  store.loadEquipmentStates()
  store.loadStateHistory();
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Equipamentos</h1>

    <div class="grid grid-cols-2 gap-6 min-h-[500px]">
      <!-- Mapa -->
      <div>
        <EquipmentMap />
        <EquipmentDetailPanel />
      </div>

      <!-- Lista de equipamentos -->
      <div class="bg-white shadow rounded-xl p-4 space-y-2 overflow-y-auto max-h-[500px]">
        <h2 class="text-xl font-semibold mb-2">Lista</h2>
        <ul>
          <li v-for="equip in store.equipments" :key="equip.id"
            class="border p-2 rounded hover:bg-gray-100 cursor-pointer">
            {{ equip.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>
