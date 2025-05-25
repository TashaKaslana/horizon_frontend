import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import { PermissionDto } from "@/api/client/types.gen"; // Assuming this type exists, adjust if necessary

export interface PermissionPage {
    data?: PermissionDto[];
    // Add other properties that might be part of your page structure
}

interface PermissionsState {
    permissions: PermissionDto[];
    infiniteQueryData: InfiniteData<PermissionPage> | null;
    actions: {
        setInfiniteQueryData: (data: InfiniteData<PermissionPage> | null) => void;
        clearAllData: () => void;
        // Future actions like addPermission, updatePermission, removePermission can be added here
    };
}

const usePermissionsStore = create<PermissionsState>()(
    immer((set) => ({
        permissions: [],
        infiniteQueryData: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.permissions = data?.pages?.flatMap((page: PermissionPage) => page.data ?? []) ?? [];
                }),
            clearAllData: () =>
                set((state) => {
                    state.permissions = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default usePermissionsStore;