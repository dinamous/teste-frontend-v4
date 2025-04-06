<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEquipmentStore } from '@/store/useEquipmentStore'
import { computed } from 'vue'

const store = useEquipmentStore()
const { equipments, selectedEquipmentId, positionHistory } = storeToRefs(store)

const lastPositions = computed(() => {
  const result: Record<string, { lat: number; lon: number } | null> = {}
  for (const equip of equipments.value) {
    const pos = store.getLastPosition(equip.id)
    result[equip.id] = pos ? { lat: pos.lat, lon: pos.lon } : null
  }
  return result
})

const lastStates = computed(() => {
  const result: Record<string, { name: string; color: string } | null> = {}
  for (const equip of equipments.value) {
    const history = store.stateHistory[equip.id]
    if (!history || !history.length) {
      result[equip.id] = null
      continue
    }
    const last = history[history.length - 1]
    const name = store.getEquipmentStateName(last.equipmentStateId)
    const color = store.getEquipmentStateColor(last.equipmentStateId)
    result[equip.id] = { name, color }
  }
  return result
})

const handleSelect = (id: string) => {
  store.selectEquipment(id)
}
</script>

<template>
  <div class="w-full mt-4">
    <div class="rounded-2xl border shadow-sm overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-muted text-muted-foreground text-left border-b">
          <tr>
            <th class="px-4 py-3">Nome</th>
            <th class="px-4 py-3">Modelo</th>
            <th class="px-4 py-3">Última posição</th>
            <th class="px-4 py-3">Última data</th>
            <th class="px-4 py-3">Status</th> <!-- nova coluna -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="equip in equipments" :key="equip.id" :class="[
            'border-b transition-colors cursor-pointer',
            selectedEquipmentId === equip.id ? 'bg-accent' : 'hover:bg-muted/50'
          ]" @click="handleSelect(equip.id)">
            <td class="px-4 py-3 font-medium">{{ equip.name }}</td>
            <td class="px-4 py-3">{{ store.getModelName(equip.equipmentModelId) }}</td>
            <td class="px-4 py-3">
              <template v-if="lastPositions[equip.id]">
                {{ lastPositions[equip.id]?.lat.toFixed(4) }},
                {{ lastPositions[equip.id]?.lon.toFixed(4) }}
              </template>
              <template v-else>–</template>
            </td>
            <td class="px-4 py-3">{{ store.getFormattedLastPosition(equip.id) }}</td>
            <td class="px-4 py-3 flex items-center gap-2">
              <template v-if="lastStates[equip.id]">
                <span class="inline-block w-2 h-2 rounded-full"
                  :style="{ backgroundColor: lastStates[equip.id]?.color }" />
                <span>{{ lastStates[equip.id]?.name }}</span>
              </template>
              <template v-else>–</template>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<style scoped></style>
