import { useEffect, useState, useCallback, useRef } from 'react';
import { useAbly } from '@/components/ably-provider';
import * as Ably from 'ably';

type MessageCallback = (message: Ably.Message) => void;

interface UseChannelOptions {
  channelName: string;
  eventName?: string;
}

export function useChannel(options: UseChannelOptions, callback?: MessageCallback) {
  const { channelName, eventName } = options;
  const { getOrCreateChannel, isConnected } = useAbly();

  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const callbackRef = useRef<MessageCallback | undefined>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Attach to channel
  useEffect(() => {
    if (!isConnected) return;

    const ablyChannel = getOrCreateChannel(channelName);
    if (!ablyChannel) {
      setError(new Error('Unable to create Ably channel'));
      return;
    }

    channelRef.current = ablyChannel;

    ablyChannel.attach()
        .then(() => {
          console.debug(`[Ably] Attached to ${channelName}`);
        })
        .catch(err => {
          console.error(`[Ably] Failed to attach to ${channelName}`, err);
          setError(err instanceof Error ? err : new Error(`Attach error: ${channelName}`));
        });

    return () => {
      ablyChannel.detach().catch(console.error);
      channelRef.current = null;
    };
  }, [channelName, isConnected, getOrCreateChannel]);

  // Subscribe to messages
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel || !callbackRef.current) return;

    const onMessage = (msg: Ably.Message) => callbackRef.current?.(msg);

    if (eventName) {
      channel.subscribe(eventName, onMessage).then(
            () => console.debug(`[Ably] Subscribed to ${eventName} on ${channelName}`),
            (err) => {
                console.error(`[Ably] Failed to subscribe to ${eventName} on ${channelName}`, err);
                setError(err instanceof Error ? err : new Error(`Subscribe error: ${eventName}`));
            }
      );
    } else {
      channel.subscribe(onMessage).then(
            () => console.debug(`[Ably] Subscribed to all messages on ${channelName}`),
            (err) => {
                console.error(`[Ably] Failed to subscribe to messages on ${channelName}`, err);
                setError(err instanceof Error ? err : new Error(`Subscribe error: ${channelName}`));
            }
      );
    }

    return () => {
      if (eventName) {
        channel.unsubscribe(eventName, onMessage);
      } else {
        channel.unsubscribe(onMessage);
      }
    };
  }, [channelName, eventName]);

  const publish = useCallback(
      async (name: string, data: unknown) => {
        const channel = channelRef.current;
        if (!channel) {
          console.warn('Ably channel not ready for publish');
          return false;
        }
        try {
          await channel.publish(name, data);
          return true;
        } catch (err) {
          console.error('Publish error:', err);
          setError(err instanceof Error ? err : new Error('Publish error'));
          return false;
        }
      },
      []
  );

  return {
    channel: channelRef.current,
    publish,
    error,
  };
}


interface UsePresenceOptions {
  channelName: string;
}

export function usePresence({ channelName }: UsePresenceOptions, initialData?: unknown) {
  const { getOrCreateChannel, isConnected } = useAbly();

  const [presenceData, setPresenceData] = useState<Ably.PresenceMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel>(null);

  useEffect(() => {
    if (!isConnected) return;

    const channel = getOrCreateChannel(channelName);
    channelRef.current = channel;

    const attachAndEnter = async () => {
      try {
        await channel?.attach();

        if (initialData !== undefined) {
          await channel?.presence.enter(initialData);
        }

        const members = await channel?.presence.get();
        setPresenceData(members ?? []);

      } catch (err) {
        console.error('Presence attach/enter error:', err);
        setError(err instanceof Error ? err : new Error('Presence error'));
      }
    };

    attachAndEnter().then();

    const updatePresence = async () => {
      try {
        const members = await channel?.presence.get();
        setPresenceData(members ?? []);
      } catch (err) {
        console.error('Failed to refresh presence data:', err);
      }
    };

    channel?.presence.subscribe(['enter', 'leave', 'update'], updatePresence);

    return () => {
      if (initialData !== undefined) {
        channel?.presence.leave().catch(console.error);
      }

      channel?.presence.unsubscribe();
      channel?.detach().catch(console.error);
      channelRef.current = null;
    };
  }, [channelName, isConnected, getOrCreateChannel, initialData]);

  const updateStatus = useCallback(async (data: unknown) => {
    const channel = channelRef.current;
    if (!channel) return false;

    try {
      await channel.presence.update(data);
      return true;
    } catch (err) {
      console.error('Presence update failed:', err);
      setError(err instanceof Error ? err : new Error('Presence update error'));
      return false;
    }
  }, []);

  return {
    presenceData,
    updateStatus,
    error,
  };
}


