import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MaintenanceState {
  isMaintenanceMode: boolean;
  message: string;
  activatedAt: string | null;
  completionDateTime: string | null;
  toggleMaintenanceMode: () => void;
  setMaintenanceMessage: (message: string) => void;
  setCompletionDateTime: (datetime: string | null) => void;
  setActivatedAt: (datetime: string | null) => void;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set) => ({
      isMaintenanceMode: false,
      message: 'Our Enterprise administrators are performing scheduled maintenance.',
      activatedAt: null,
      completionDateTime: null,
      toggleMaintenanceMode: () => set((state) => ({
        isMaintenanceMode: !state.isMaintenanceMode,
        activatedAt: !state.isMaintenanceMode ? new Date().toISOString() : null
      })),
      setMaintenanceMessage: (message: string) => set({ message }),
      setCompletionDateTime: (datetime: string | null) => set({ completionDateTime: datetime }),
      setActivatedAt: (datetime: string | null) => set({ activatedAt: datetime }),
    }),
    {
      name: 'maintenance-storage',
    }
  )
);
