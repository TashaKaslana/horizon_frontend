import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MaintenanceState {
  isMaintenanceMode: boolean;
  message: string;
  toggleMaintenanceMode: () => void;
  setMaintenanceMessage: (message: string) => void;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set) => ({
      isMaintenanceMode: false,
      message: 'Our Enterprise administrators are performing scheduled maintenance.',
      toggleMaintenanceMode: () => set((state) => ({ isMaintenanceMode: !state.isMaintenanceMode })),
      setMaintenanceMessage: (message: string) => set({ message }),
    }),
    {
      name: 'maintenance-storage',
    }
  )
);
