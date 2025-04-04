<script setup lang="ts">
import { onMounted } from "vue"
import { useEquipmentStore } from "@/store/useEquipmentStore"
import EquipmentMap from "@/components/map/EquipmentMap.vue"

// Acessa a store com os dados
const store = useEquipmentStore()

// Carrega os dados ao montar a página
onMounted(() => {
  store.loadEquipments()
  store.loadPositionHistory()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Equipamentos</h1>

    <!-- Mapa (ainda vazio, mas em breve terá os marcadores) -->
    <EquipmentMap />

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Lista de Equipamentos</h2>
      <ul class="list-disc list-inside">
        <li v-for="equip in store.equipments" :key="equip.id">
          {{ equip.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
