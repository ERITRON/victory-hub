/**
 * CloudSyncProvider
 * When signed in, pulls saved state from the server once, then keeps pushing
 * local changes up (debounced) so progress syncs across devices. When signed
 * out, the app behaves exactly as before (localStorage only).
 */
'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore, SYNC_KEYS, type SyncableState } from '@/store/app-store';

function pickSyncState(state: ReturnType<typeof useAppStore.getState>): SyncableState {
  const out = {} as SyncableState;
  for (const key of SYNC_KEYS) {
    (out as unknown as Record<string, unknown>)[key] = state[key];
  }
  return out;
}

export function CloudSyncProvider() {
  const { status } = useSession();
  const pulledForSession = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pushingRef = useRef(false);
  const lastPushedRef = useRef<string | null>(null);

  /* Pull once per sign-in */
  useEffect(() => {
    if (status !== 'authenticated') {
      pulledForSession.current = false;
      return;
    }
    if (pulledForSession.current) return;
    pulledForSession.current = true;

    (async () => {
      try {
        const res = await fetch('/api/sync');
        if (!res.ok) return;
        const json = await res.json();
        if (json.data) {
          /* Cloud already has data for this account - it wins. */
          useAppStore.getState().hydrateFromCloud(json.data);
          lastPushedRef.current = JSON.stringify(pickSyncState(useAppStore.getState()));
        } else {
          /* First time this account syncs - upload whatever is local
             (e.g. progress made before signing in) so nothing is lost. */
          const current = pickSyncState(useAppStore.getState());
          await fetch('/api/sync', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: current }),
          });
          lastPushedRef.current = JSON.stringify(current);
        }
      } catch {
        /* Offline or server unreachable - keep using local data silently. */
      }
    })();
  }, [status]);

  /* Push whenever the syncable slice actually changes (debounced).
     Ignores unrelated store changes like navigation/sidebar/search. */
  useEffect(() => {
    if (status !== 'authenticated') return;

    const unsubscribe = useAppStore.subscribe((state) => {
      const payload = pickSyncState(state);
      const serialized = JSON.stringify(payload);
      if (serialized === lastPushedRef.current) return; // nothing sync-relevant changed

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (pushingRef.current) return;
        pushingRef.current = true;
        try {
          await fetch('/api/sync', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: payload }),
          });
          lastPushedRef.current = serialized;
          useAppStore.setState({ lastSyncedAt: Date.now() });
        } catch {
          /* Will retry on next change */
        } finally {
          pushingRef.current = false;
        }
      }, 1500);
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [status]);

  return null;
}
