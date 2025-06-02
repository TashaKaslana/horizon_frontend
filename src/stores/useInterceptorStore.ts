import { create } from 'zustand';

type InterceptorState = {
    initialized: boolean;
    setInitialized: (value: boolean) => void;
};

export const useInterceptorStore = create<InterceptorState>((set) => ({
    initialized: false,
    setInitialized: (value) => set({ initialized: value }),
}));
