<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentStore } from '@/store/useEquipmentStore'
import { Button } from '@/components/ui/button'

const store = useEquipmentStore()
const { equipments, positionHistory, selectedEquipmentId } = storeToRefs(store)

// Computa as últimas posições para cada equipamento
const lastPositions = computed(() => {
  const result: Record<string, { lat: number; lon: number } | null> = {}
  for (const equip of equipments.value) {
    const posList = store.positionHistory[equip.id] || []
    result[equip.id] = posList.length ? { lat: posList[posList.length - 1].lat, lon: posList[posList.length - 1].lon } : null
  }
  return result
})

// Função para selecionar um equipamento (ao clicar na linha)
const handleSelect = (id: string) => {
  store.selectEquipment(id)
}

// Função para abrir a timeline para um equipamento específico
const openTimelineFor = (id: string) => {
  store.setOpenTimelineEquipment(id)
}
</script>

<template>
  <div class="mt-6">
    <div class="rounded-2xl border shadow bg-white dark:bg-black overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="border-b bg-gray-100 dark:bg-gray-900 text-gray-600">
          <tr>
            <th class="px-4 py-2 text-left">Nome</th>
            <th class="px-4 py-2 text-left">Modelo</th>
            <th class="px-4 py-2 text-left">Última Posição</th>
            <th class="px-4 py-2 text-left">Última Data</th>
            <th class="px-4 py-2 text-left">Histórico</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="equip in equipments" :key="equip.id"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition" @click="handleSelect(equip.id)">
            <td class="px-4 py-3 font-medium text-gray-800">{{ equip.name }}</td>
            <td class="px-4 py-3">{{ store.getModelName(equip.equipmentModelId) }}</td>
            <td class="px-4 py-3">
              <template v-if="lastPositions[equip.id]">
                {{ lastPositions[equip.id]?.lat.toFixed(4) }}, {{ lastPositions[equip.id]?.lon.toFixed(4) }}
              </template>
              <template v-else>–</template>
            </td>
            <td class="px-4 py-3">{{ store.getFormattedLastPosition(equip.id) }}</td>
            <td class="px-4 py-3">
              <Button variant="outline" size="sm" @click.stop="openTimelineFor(equip.id)">
                Histórico
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
