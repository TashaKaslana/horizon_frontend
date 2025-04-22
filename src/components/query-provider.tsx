"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;