import { defineStore } from "pinia";

interface Position {
  date: string;
  lat: number;
  lon: number;
}

interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
  type: string;
}

interface EquipmentModel {
  id: string;
  name: string;
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentStateHistory {
  equipmentId: string;
  states: { equipmentStateId: string; date: string }[];
}

export const useEquipmentStore = defineStore("equipment", {
  state: () => ({
    equipments: [] as Equipment[],
    positionHistory: {} as Record<string, Position[]>,
    equipmentModels: [] as EquipmentModel[],
    selectedEquipmentId: null as string | null,
    equipmentStates: [] as EquipmentState[],
    stateHistory: {} as Record<
      string,
      { equipmentStateId: string; date: string }[]
    >,
    openTimelineEquipmentId: null as string | null,

    filters: {
      type: null as string | null,
      status: null as string | null,
      period: "custom" as "1d" | "7d" | "30d" | "custom",
      dateRange: {
        start: new Date(0),
        end: new Date(),
      },
    },

    filteredData: {
      equipments: [] as Equipment[],
      positionHistory: {} as Record<string, Position[]>,
      stateHistory: {} as Record<
        string,
        { equipmentStateId: string; date: string }[]
      >,
    },
  }),

  actions: {
    async loadEquipments() {
      const eq = await fetch("/data/equipment.json").then((res) => res.json());
      this.equipments = this.filteredData.equipments = eq;
      
    },

    async loadPositionHistory() {
      const pos = await fetch("/data/equipmentPositionHistory.json").then(
        (res) => res.json()
      );
      this.positionHistory = this.filteredData.positionHistory = Object.fromEntries(
        pos.map((p: any) => [p.equipmentId, p.positions])
      );
    },

    async loadEquipmentModels() {
      const models = await fetch("/data/equipmentModel.json").then((res) =>
        res.json()
      );
      this.equipmentModels = models;
    },

    async loadEquipmentStates() {
      const states = await fetch("/data/equipmentState.json").then((res) =>
        res.json()
      );
      this.equipmentStates = states;
    },

    async loadStateHistory() {
      const history = await fetch("/data/equipmentStateHistory.json").then(
        (res) => res.json()
      );
      this.stateHistory = this.filteredData.stateHistory = Object.fromEntries(
        history.map((entry: EquipmentStateHistory) => [
          entry.equipmentId,
          entry.states,
        ])
      );
    },

   updateFilteredEquipments() {
  const { type, status, dateRange } = this.filters;

  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);

  const filteredEquipments = this.equipments.filter((equipment) => {
    const model = this.equipmentModels.find(
      (m) => m.id === equipment.equipmentModelId
    );
    const modelName = model?.name || null;

    const stateHistory = this.stateHistory[equipment.id] || [];
    const lastStateId = stateHistory[stateHistory.length - 1]?.equipmentStateId;
    const state = this.equipmentStates.find((s) => s.id === lastStateId);
    const stateName = state?.name || null;

    const positions = this.positionHistory[equipment.id] || [];
    const lastPos = positions[positions.length - 1];
    const lastDate = lastPos ? new Date(lastPos.date) : null;
    const inDateRange = lastDate
      ? lastDate >= start && lastDate <= end
      : false;

    return (
      (!type || modelName === type) &&
      (!status || stateName === status) &&
      inDateRange
    );
  });

  this.filteredData.equipments = filteredEquipments;

  // 🎯 Preenche o histórico filtrado por equipamento
  this.filteredData.positionHistory = {};
  this.filteredData.stateHistory = {};

  for (const equip of filteredEquipments) {
    const allPositions = this.positionHistory[equip.id] || [];
    const filteredPositions = allPositions.filter((pos) => {
      const d = new Date(pos.date);
      return d >= start && d <= end;
    });
    this.filteredData.positionHistory[equip.id] = filteredPositions;

    const allStates = this.stateHistory[equip.id] || [];
    const filteredStates = allStates.filter((s) => {
      const d = new Date(s.date);
      return d >= start && d <= end;
    });
    this.filteredData.stateHistory[equip.id] = filteredStates;
  }
},


    getLastPosition(equipmentId: string): Position | null {
      const positions = this.positionHistory[equipmentId];
      if (!positions || positions.length === 0) return null;
      return positions.slice(-1)[0];
    },

    getFormattedLastPosition(equipmentId: string): string {
      const pos = this.getLastPosition(equipmentId);
      if (!pos) return "Data desconhecida";
      return new Date(pos.date).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    },

    getEquipmentStateName(stateId: string): string {
      const state = this.equipmentStates.find((s) => s.id === stateId);
      return state ? state.name : "Estado desconhecido";
    },

    getEquipmentStateColor(stateId: string): string {
      const state = this.equipmentStates.find((s) => s.id === stateId);
      return state ? state.color : "#ccc";
    },

    getStateHistoryForSelected(): { equipmentStateId: string; date: string }[] {
      if (!this.selectedEquipmentId) return [];
      return this.stateHistory[this.selectedEquipmentId] || [];
    },

    getEquipmentName(id: string): string {
      const equip = this.equipments.find((e) => e.id === id);
      return equip?.name ?? "Sem nome";
    },

    getModelName(modelId: string): string {
      const model = this.equipmentModels.find((m) => m.id === modelId);
      return model?.name ?? "Modelo desconhecido";
    },

    selectEquipment(id: string) {
      this.selectedEquipmentId = id;
    },

    setOpenTimelineEquipment(id: string | null) {
      this.openTimelineEquipmentId = id;
    },
  },
});
