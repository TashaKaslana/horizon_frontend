import { create } from 'zustand';

type AuthTokenStore = {
    token: string | null;
    isReady: boolean;
    setToken: (token: string) => void;
    loadToken: () => Promise<void>;
    getToken: () => Promise<string>;
};

export const useAuthTokenStore = create<AuthTokenStore>((set, get) => ({
    token: null,
    isReady: false,
    setToken: (token) => set({ token, isReady: true }),
    loadToken: async () => {
        const res = await fetch('/api/token');
        const data = await res.json();
        set({ token: data.accessToken.token, isReady: true });
    },
    getToken: async () => {
        const {isReady } = get();
        if (!isReady) {
            await get().loadToken();
        }
        return get().token!;
    },
}));
