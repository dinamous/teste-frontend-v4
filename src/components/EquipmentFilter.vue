<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { getLocalTimeZone, today } from '@internationalized/date'
import { type DateRange } from 'reka-ui'

// Mock: substituir pelo intervalo real do histórico
const startOfData = today(getLocalTimeZone()).subtract({ days: 30 })
const endOfData = today(getLocalTimeZone())

const selectedPeriod = ref<'1d' | '7d' | '30d' | 'custom'>('7d')

const dateRange = ref({
  start: endOfData.subtract({ days: 7 }),
  end: endOfData,
}) as Ref<DateRange>

const statusOptions = ['Online', 'Offline', 'Manutenção']
const typeOptions = ['Sensor', 'Gateway', 'Controlador']

const selectedStatus = ref<string | undefined>()
const selectedType = ref<string | undefined>()
</script>

<template>
  <div class="w-full border-b bg-background px-4 py-2 flex flex-wrap gap-4 items-center">
    <!-- Select: Tipo de equipamento -->
    <Select v-model="selectedType">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Tipo de equipamento" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tipo</SelectLabel>
          <SelectItem
            v-for="type in typeOptions"
            :key="type"
            :value="type"
          >
            {{ type }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <!-- Select: Status do equipamento -->
    <Select v-model="selectedStatus">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem
            v-for="status in statusOptions"
            :key="status"
            :value="status"
          >
            {{ status }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Separator orientation="vertical" class="h-6" />

    <!-- ToggleGroup: Período rápido -->
    <ToggleGroup v-model="selectedPeriod" type="single" class="gap-1">
      <ToggleGroupItem value="1d">1 dia</ToggleGroupItem>
      <ToggleGroupItem value="7d">1 semana</ToggleGroupItem>
      <ToggleGroupItem value="30d">1 mês</ToggleGroupItem>
      <ToggleGroupItem value="custom">Personalizado</ToggleGroupItem>
    </ToggleGroup>

    <!-- RangeCalendar: período personalizado -->
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <div>
            <RangeCalendar
              v-if="selectedPeriod === 'custom'"
              v-model="dateRange"
              class="rounded-md border"
              :minValue="startOfData"
              :maxValue="endOfData"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Selecione o intervalo desejado (limitado ao histórico)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<style scoped>
/* Garante que o calendário não quebre o layout da barra */
.range-calendar-wrapper {
  position: relative;
  z-index: 50;
}
</style>
