'use client'

import {AblyProvider} from 'ably/react';
import * as Ably from 'ably';
import React from "react";

const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY, clientId: 'me' });

export const AblyProviderComponent = ({ children }: { children: React.ReactNode }) => {

    return (
        <AblyProvider client={client}>
            {children}
        </AblyProvider>
    );
}