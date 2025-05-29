'use client'

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {LogEntryDto} from "@/api/client";

export interface LogEntryPage {
    data?: LogEntryDto[];
}

interface LogEntriesState {
    logEntries: LogEntryDto[];
    selectedLogEntry: LogEntryDto | null;
    infiniteQueryData: InfiniteData<LogEntryPage> | null;
    actions: {
        setInfiniteQueryData: (data: InfiniteData<LogEntryPage>) => void;
        setSelectedLogEntries: (logEntries: LogEntryDto | null) => void;
        clearAllData: () => void;
        addLogEntries: (logEntries: LogEntryDto) => void;
        // updateLogEntries: (logEntriesUpdate: UpdateNotificationDto) => void;
        removeLogEntries: (logEntriesId: string) => void;
        setLogEntries: (logEntries: LogEntryDto[]) => void;
    };
}

const useAdminLogEntriesStore = create<LogEntriesState>()(
    immer((set) => ({
        logEntries: [],
        infiniteQueryData: null,
        selectedLogEntry: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.logEntries = data?.pages?.flatMap((page: LogEntryPage) => page.data ?? []) ?? [];
                }),

            setSelectedLogEntries: (logEntries) =>
                set((state) => {
                    state.selectedLogEntry = logEntries;
                }),

            addLogEntries: (newLogEntry) =>
                set((state) => {
                    state.logEntries.unshift(newLogEntry);
                    if (state.infiniteQueryData) {
                        const firstPage = state.infiniteQueryData.pages[0];
                        if (firstPage) {
                            firstPage.data = [newLogEntry, ...(firstPage.data ?? [])];
                        }
                    }
                }),

            // updateLogEntries: (logEntriesUpdate) =>
            //     set((state) => {
            //
            //         if (state.selectedLogEntries?.id === id) {
            //             state.selectedLogEntries = {...state.selectedLogEntries, ...logEntriesUpdate};
            //         }
            //
            //         if (state.infiniteQueryData) {
            //             state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
            //                 ...page,
            //                 data: (page.data ?? []).map((p) =>
            //                     p.id === id ? applyUpdate(p) : p
            //                 ),
            //             }));
            //         }
            //     }),

            removeLogEntries: (logEntryId) =>
                set((state) => {
                    state.logEntries = state.logEntries.filter((p) => p.id !== logEntryId);
                    if (state.selectedLogEntry?.id === logEntryId) {
                        state.selectedLogEntry = null;
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages
                            .map((page) => ({
                                ...page,
                                data: (page.data ?? []).filter((p) => p.id !== logEntryId),
                            }))
                            .filter((page) => (page.data?.length ?? 0) > 0);
                    }
                }),

            setLogEntries: (newLogEntryId) =>
                set((state) => {
                    state.logEntries = newLogEntryId;
                    if (state.infiniteQueryData) { 
                        const remainingLogEntries = [...newLogEntryId];
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageLogEntriesCount = page.data?.length || 0;
                            const logEntriesForThisPage = remainingLogEntries.splice(0, pageLogEntriesCount);
                            return {
                                ...page,
                                data: logEntriesForThisPage
                            };
                        }).filter(page => page.data && page.data.length > 0);

                        if (newLogEntryId.length > 0 && state.infiniteQueryData.pages.length === 0) {
                            state.infiniteQueryData.pages = [{ data: newLogEntryId }];
                            state.infiniteQueryData.pageParams = [0];
                        }
                    }
                }),

            clearAllData: () =>
                set((state) => {
                    state.logEntries = [];
                    state.infiniteQueryData = null;
                    state.selectedLogEntry = null;
                }),
        },
    }))
);

export default useAdminLogEntriesStore;

