<script setup lang="ts">
import { computed } from 'vue'
import { useEquipmentStore } from '@/store/useEquipmentStore'
import {
  Stepper,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperTrigger,
} from '@/components/ui/stepper'
import { Check, Circle, Dot } from 'lucide-vue-next'

// Acessa a store
const store = useEquipmentStore()

// Computa o timeline com base no equipamento selecionado na store
const timeline = computed(() => {
  if (!store.selectedEquipmentId) return []
  const entries = store.stateHistory[store.selectedEquipmentId] || []
  // Ordena as entradas por data (crescente)
  return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// Define o total de passos (timeline)
const totalSteps = computed(() => timeline.value.length)

// Para cada passo, definimos o estado:
// - Se não há entradas, nenhum passo é exibido.
// - O último passo (índice igual a totalSteps - 1) é "ativo" e os anteriores são "completed".
function getStepState(index: number): 'completed' | 'active' | 'inactive' {
  if (index < totalSteps.value - 1) return 'completed'
  if (index === totalSteps.value - 1) return 'active'
  return 'inactive'
}
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <Stepper orientation="vertical" class="flex flex-col gap-10">
      <StepperItem v-for="(entry, index) in timeline" :key="index" :step="index + 1" v-slot="{ state }"
        class="relative flex w-full items-start gap-6" :data-state="getStepState(index)">
        <!-- Exibe o separador, exceto no último passo -->
        <StepperSeparator v-if="index !== totalSteps - 1"
          class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted" />

        <StepperTrigger as-child>
          <button :class="[
            'z-10 rounded-full shrink-0 p-2',
            getStepState(index) === 'active' ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : '',
            getStepState(index) === 'completed' ? 'bg-primary text-white' : 'bg-outline text-muted'
          ]">
            <Check v-if="getStepState(index) === 'completed'" class="h-5 w-5" />
            <Circle v-else-if="getStepState(index) === 'active'" class="h-5 w-5" />
            <Dot v-else class="h-5 w-5" />
          </button>
        </StepperTrigger>

        <div class="flex flex-col gap-1">
          <StepperTitle :class="getStepState(index) === 'active' ? 'text-primary' : ''"
            class="text-sm font-semibold transition">
            {{ store.getEquipmentStateName(entry.equipmentStateId) }}
          </StepperTitle>
          <StepperDescription class="text-xs text-muted-foreground transition">
            {{ new Date(entry.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) }}
          </StepperDescription>
        </div>
      </StepperItem>
    </Stepper>
  </div>
</template>

<style scoped>
/* Você pode adicionar estilos personalizados se necessário */
</style>
