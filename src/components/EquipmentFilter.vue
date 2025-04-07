<script setup lang="ts">
import { computed, watch } from 'vue'
import { useEquipmentStore } from '@/store/useEquipmentStore'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const store = useEquipmentStore()
const filters = store.filters

// Última data real baseada nas posições
const latestDate = computed(() => {
  const allDates = Object.values(store.positionHistory)
    .flat()
    .map(p => new Date(p.date).getTime())

  return allDates.length ? new Date(Math.max(...allDates)) : new Date()
})

// Atualiza o range de datas com base no período selecionado
watch(
  () => filters.period,
  (period) => {
    const end = new Date(latestDate.value)
    const start = new Date(end)

    if (period === '1d') start.setDate(end.getDate() - 1)
    else if (period === '7d') start.setDate(end.getDate() - 7)
    else if (period === '30d') start.setDate(end.getDate() - 30)
    else start.setTime(0)

    filters.dateRange.start = start
    filters.dateRange.end = end

    store.updateFilteredEquipments()
  },
  { immediate: true }
)

// Atualiza ao mudar status ou tipo
watch(
  () => [filters.status, filters.type],
  () => {
    store.updateFilteredEquipments()
  }
)
</script>

<template>
  <div class="flex flex-wrap gap-4 items-end p-4">
    <!-- Status -->
    <div class="w-40">
      <label class="text-sm text-gray-500 mb-1 block">Status</label>
      <Select v-model="filters.status">
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="null">Todos</SelectItem>
          <SelectItem v-for="status in store.equipmentStates" :key="status.id" :value="status.name">
            {{ status.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Modelo -->
    <div class="w-50">
      <label class="text-sm text-gray-500 mb-1 block">Modelo</label>
      <Select v-model="filters.type">
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="null">Todos</SelectItem>
          <SelectItem v-for="type in store.equipmentModels" :key="type.id" :value="type.name">
            {{ type.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Período -->
    <div class="w-60">
      <label class="text-sm text-gray-500 mb-1 block">Período</label>
      <ToggleGroup v-model="filters.period" variant="outline">
        <ToggleGroupItem value="1d">1d</ToggleGroupItem>
        <ToggleGroupItem value="7d">7d</ToggleGroupItem>
        <ToggleGroupItem value="30d">30d</ToggleGroupItem>
        <ToggleGroupItem value="custom">Todo</ToggleGroupItem>
      </ToggleGroup>
    </div>
  </div>
</template>
