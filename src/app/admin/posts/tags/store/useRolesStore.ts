import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {RoleDto, ResponseMetadata} from "@/api/client/types.gen";

export interface RolePage {
    data?: RoleDto[];
    metadata?: ResponseMetadata;
}

type SetInfiniteDataFunction = (data: InfiniteData<RolePage> | null | ((prev: InfiniteData<RolePage> | null) => InfiniteData<RolePage> | null)) => void;

interface RolesState {
    roles: RoleDto[];
    infiniteQueryData: InfiniteData<RolePage> | null;
    actions: {
        setInfiniteQueryData: SetInfiniteDataFunction;
        clearAllData: () => void;
        addRole: (role: RoleDto) => void;
        updateRole: (updatedRole: RoleDto) => void;
        removeRole: (roleId: string | number) => void;
    };
}

const useRolesStore = create<RolesState>()(
    immer((set) => ({
        roles: [],
        infiniteQueryData: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    if (typeof data === 'function') {
                        state.infiniteQueryData = data(state.infiniteQueryData);
                    } else {
                        state.infiniteQueryData = data;
                    }
                    state.roles = state.infiniteQueryData?.pages?.flatMap((page: RolePage) => page.data ?? []) ?? [];
                }),
            addRole: (role) =>
                set((state) => {
                    state.roles = [role, ...state.roles];
                    if (state.infiniteQueryData && state.infiniteQueryData.pages.length > 0) {
                        const updatedFirstPageData = [role, ...(state.infiniteQueryData.pages[0]?.data ?? [])];
                        const updatedFirstPage = {
                            ...(state.infiniteQueryData.pages[0] || {}),
                            data: updatedFirstPageData,
                        };
                        state.infiniteQueryData.pages = [updatedFirstPage, ...state.infiniteQueryData.pages.slice(1)];
                    } else {
                        state.infiniteQueryData = {
                            pages: [{ data: [role], metadata: {} }], // Added metadata placeholder
                            pageParams: [0],
                        };
                    }
                }),
            updateRole: (updatedRole) =>
                set((state) => {
                    state.roles = state.roles.map(r =>
                        r.id === updatedRole.id ? updatedRole : r
                    );
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => r.id === updatedRole.id)) {
                                return {
                                    ...page,
                                    data: pageData.map(r =>
                                        r.id === updatedRole.id ? updatedRole : r
                                    ),
                                };
                            }
                            return page;
                        });
                    }
                }),
            removeRole: (roleId) =>
                set((state) => {
                    state.roles = state.roles.filter(r => r.id !== roleId);
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => r.id === roleId)) {
                                return {
                                    ...page,
                                    data: pageData.filter(r => r.id !== roleId),
                                };
                            }
                            return page;
                        });

                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.filter(page => (page.data?.length ?? 0) > 0);
                    }
                }),
            clearAllData: () =>
                set((state) => {
                    state.roles = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default useRolesStore;

