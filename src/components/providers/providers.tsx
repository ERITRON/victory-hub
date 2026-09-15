/**
 * Victory Hub - App Providers
 * Wraps the app with session (auth), theme, cloud sync, and toast providers
 */
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { CloudSyncProvider } from './cloud-sync-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <CloudSyncProvider />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </SessionProvider>
  );
}
