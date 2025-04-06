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
  }),

  actions: {
    async loadEquipments() {
      const eq = await fetch("/data/equipment.json").then((res) => res.json());
      this.equipments = eq;
    },

    async loadPositionHistory() {
      const pos = await fetch("/data/equipmentPositionHistory.json").then(
        (res) => res.json()
      );
      this.positionHistory = Object.fromEntries(
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
      this.stateHistory = Object.fromEntries(
        history.map((entry: EquipmentStateHistory) => [
          entry.equipmentId,
          entry.states,
        ])
      );
    },

    getLastPosition(equipmentId: string): Position | null {
      const positions = this.positionHistory[equipmentId];
      if (!positions || positions.length === 0) return null;
      return positions.slice(-1)[0];
    },

    getEquipmentModelName(equipment: Equipment): string {
      const model = this.equipmentModels.find(
        (m) => m.id === equipment.equipmentModelId
      );
      return model ? model.name : "Modelo desconhecido";
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

    setSelectedEquipment(id: string | null) {
      this.selectedEquipmentId = id;
    },
  },
});
