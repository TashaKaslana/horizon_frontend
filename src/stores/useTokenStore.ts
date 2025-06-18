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
        try {
            const res = await fetch('/api/token');
            if (!res.ok) {
                set({ token: null, isReady: true });
                return;
            }

            const data = await res.json();
            set({ token: data.accessToken.token, isReady: true });
        } catch {
            set({ token: null, isReady: true });
        }
    },
    getToken: async () => {
        const {isReady } = get();
        if (!isReady) {
            await get().loadToken();
        }
        return get().token!;
    },
}));
