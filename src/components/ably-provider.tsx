'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Ably from 'ably';
import { useAuthTokenStore } from '@/stores/useTokenStore';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';

interface AblyContextType {
  client: Ably.Realtime | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  getOrCreateChannel: (channelName: string, requireAuth?: boolean) => Ably.RealtimeChannel | null;
}

const AblyContext = createContext<AblyContextType>({
  client: null,
  isConnected: false,
  isAuthenticated: false,
  getOrCreateChannel: () => null,
});

export const useAbly = () => useContext(AblyContext);

// Flag to temporarily disable authentication requirement
const TEMP_DISABLE_AUTH = true;

interface AblyProviderProps {
  children: React.ReactNode;
  redirectUnauthenticated?: boolean;
  loginPath?: string;
}

export function AblyProvider({
  children,
  redirectUnauthenticated = false,
  loginPath = '/login'
}: AblyProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Ably.Realtime | null>(null);
  const router = useRouter();

  const getToken = useAuthTokenStore(state => state.getToken);
  const { user, isLoading: isAuthLoading } = useUser();
  const isAuthenticated = TEMP_DISABLE_AUTH || !!user; // Allow authentication bypass

  useEffect(() => {
    // Skip initialization check when authentication is disabled
    if (!TEMP_DISABLE_AUTH) {
      if (isAuthLoading) return;

      // Handle redirect for protected pages
      if (redirectUnauthenticated && !isAuthenticated) {
        router.push(loginPath);
        return;
      }

      // For unauthenticated users, don't initialize Ably
      if (!isAuthenticated) {
        setIsConnected(false);
        return;
      }
    }

    let mounted = true;

    const init = async () => {
      let clientOptions: Ably.ClientOptions;

      if (TEMP_DISABLE_AUTH) {
        // Use API key directly when auth is disabled (for testing only)
        clientOptions = {
          key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
          clientId: 'test-user',
        };
        console.warn('[Ably] Auth temporarily disabled for testing');
      } else {
        // Normal authenticated flow
        const accessToken = await getToken();
        if (!mounted || !accessToken) return;

        const clientId = user?.sub || '';
        clientOptions = {
          clientId,
          authUrl: '/api/ably-token',
          authHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      }

      // Always set autoConnect
      clientOptions.autoConnect = typeof window !== 'undefined';

      const client = new Ably.Realtime(clientOptions);

      client.connection.on('connecting', () => {
        console.debug('[Ably] Connecting...');
      });

      client.connection.on('connected', () => {
        console.debug('[Ably] Connected with clientId:', client.auth.clientId);
        setIsConnected(true);
      });

      client.connection.on('failed', (err) => {
        console.error('[Ably] Connection failed', err);
        setIsConnected(false);
      });

      client.connection.on('disconnected', () => {
        console.log('[Ably] Disconnected');
        setIsConnected(false);
      });

      clientRef.current = client;
    };

    init().catch(error => {
      console.error('[Ably] Initialization error:', error);
    });

    return () => {
      mounted = false;
      clientRef.current?.connection.off();
      clientRef.current?.close();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [getToken, user, isAuthenticated, isAuthLoading, redirectUnauthenticated, router, loginPath]);

  const getOrCreateChannel = (channelName: string, requireAuth = false): Ably.RealtimeChannel | null => {
    // Skip auth check if temporarily disabled
    if (TEMP_DISABLE_AUTH) {
      return clientRef.current?.channels.get(channelName) ?? null;
    }

    // If authentication is required for this channel but user isn't authenticated
    if (requireAuth && !isAuthenticated) {
      if (redirectUnauthenticated) {
        // Redirect to login if configured to do so
        router.push(loginPath);
      }
      return null;
    }

    return clientRef.current?.channels.get(channelName) ?? null;
  };

  return (
    <AblyContext.Provider
      value={{
        client: clientRef.current,
        isConnected,
        isAuthenticated,
        getOrCreateChannel
      }}
    >
      {children}
    </AblyContext.Provider>
  );
}
