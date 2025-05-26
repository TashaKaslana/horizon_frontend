import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import { PermissionDto } from "@/api/client/types.gen";

export interface PermissionPage {
    data?: PermissionDto[];
    // Add other properties that might be part of your page structure
}

type SetInfiniteDataFunction = (data: InfiniteData<PermissionPage> | null | ((prev: InfiniteData<PermissionPage> | null) => InfiniteData<PermissionPage> | null)) => void;

interface PermissionsState {
    permissions: PermissionDto[];
    infiniteQueryData: InfiniteData<PermissionPage> | null;
    actions: {
        setInfiniteQueryData: SetInfiniteDataFunction;
        clearAllData: () => void;
        addPermission: (permission: PermissionDto) => void;
        updatePermission: (updatedPermission: PermissionDto) => void; // New action
        removePermission: (permissionId: string | number) => void; // New action
    };
}

const usePermissionsStore = create<PermissionsState>()(
    immer((set) => ({
        permissions: [],
        infiniteQueryData: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    if (typeof data === 'function') {
                        state.infiniteQueryData = data(state.infiniteQueryData);
                    } else {
                        state.infiniteQueryData = data;
                    }
                    state.permissions = state.infiniteQueryData?.pages?.flatMap((page: PermissionPage) => page.data ?? []) ?? [];
                }),
            addPermission: (permission) =>
                set((state) => {
                    state.permissions = [permission, ...state.permissions];
                    if (state.infiniteQueryData && state.infiniteQueryData.pages.length > 0) {
                        const updatedFirstPageData = [permission, ...(state.infiniteQueryData.pages[0]?.data ?? [])];
                        const updatedFirstPage = {
                            ...(state.infiniteQueryData.pages[0] || {}),
                            data: updatedFirstPageData,
                        };
                        state.infiniteQueryData.pages = [updatedFirstPage, ...state.infiniteQueryData.pages.slice(1)];
                    } else {
                        // Handles case where infiniteQueryData is null or has no pages
                        state.infiniteQueryData = {
                            pages: [{ data: [permission] }],
                            pageParams: [0], // Default initial page param; adjust if your pagination needs otherwise
                        };
                    }
                }),
            updatePermission: (updatedPermission) =>
                set((state) => {
                    state.permissions = state.permissions.map(p =>
                        p.id === updatedPermission.id ? updatedPermission : p
                    );
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(p => p.id === updatedPermission.id)) {
                                return {
                                    ...page,
                                    data: pageData.map(p =>
                                        p.id === updatedPermission.id ? updatedPermission : p
                                    ),
                                };
                            }
                            return page;
                        });
                    }
                }),
            removePermission: (permissionId) =>
                set((state) => {
                    state.permissions = state.permissions.filter(p => p.id !== permissionId);
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(p => p.id === permissionId)) {
                                return {
                                    ...page,
                                    data: pageData.filter(p => p.id !== permissionId),
                                };
                            }
                            return page;
                        });
                        // Optionally, filter out empty pages if desired, though often not necessary
                        // state.infiniteQueryData.pages = state.infiniteQueryData.pages.filter(page => (page.data?.length ?? 0) > 0);
                    }
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

