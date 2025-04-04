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

export const useEquipmentStore = defineStore("equipment", {
  // Lista de equipamentos
  // Histórico de posições por equipamento (chave = equipmentId)
  state: () => ({
    equipments: [] as Equipment[],
    positionHistory: {} as Record<string, Position[]>,
  }),

  actions: {
    // Carrega os dados dos equipamentos
    async loadEquipments() {
      const eq = await fetch("/data/equipment.json").then((res) => res.json());
      this.equipments = eq;
    },

    // Carrega o histórico de posições e reorganiza por ID
    async loadPositionHistory() {
      const pos = await fetch("/data/equipmentPositionHistory.json").then(
        (res) => res.json()
      );
      // transforma em objeto com chave por equipmentId
      this.positionHistory = Object.fromEntries(
        pos.map((p: any) => [p.equipmentId, p.positions])
      );
    },

    getLastPosition(equipmentId: string): Position | null {
      const positions = this.positionHistory[equipmentId];
      if (!positions || positions.length === 0) return null;
      return positions.slice(-1)[0];
    },
  },
});
