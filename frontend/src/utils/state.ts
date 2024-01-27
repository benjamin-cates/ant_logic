import { create } from "zustand";

interface ActiveNodesState {
  activeNodes: string[];
  setActiveNodes: (activeNodes: string[]) => void;
}

export const useActiveNodes = create<ActiveNodesState>((set) => ({
  activeNodes: [],
  setActiveNodes: (activeNodes: string[]) => set({ activeNodes }),
}));
