/*
 * Victory Hub - App Layout
 * Main application shell with sidebar, header, and content area
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Sidebar } from './sidebar';
import { BackToTop } from '@/components/shared/back-to-top';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { AuthMenu } from '@/components/shared/auth-menu';
import { useAppStore, type PageId } from '@/store/app-store';

/* ------------------------------------------------------------------
   Page title map
   ------------------------------------------------------------------ */

const PAGE_TITLES: Record<PageId, string> = {
  home: 'Home',
  dashboard: 'Dashboard',
  subjects: 'Subjects',
  quiz: 'Quiz',
  flashcards: 'Flashcards',
  notes: 'Notes',
  planner: 'Study Planner',
  analytics: 'Analytics',
  achievements: 'Achievements',
  resources: 'Resources',
  profile: 'Profile',
  settings: 'Settings',
  'ai-assistant': 'AI Assistant',
  about: 'About',
};

/* ------------------------------------------------------------------
   Search Dialog
   ------------------------------------------------------------------ */

function SearchDialog() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery, navigate } = useAppStore();
  const [localQuery, setLocalQuery] = useState('');

  const allPages: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'notes', label: 'Notes' },
    { id: 'planner', label: 'Study Planner' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'resources', label: 'Resources' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
    { id: 'about', label: 'About' },
  ];

  const filtered = localQuery
    ? allPages.filter((p) => p.label.toLowerCase().includes(localQuery.toLowerCase()))
    : allPages;

  const handleSelect = (id: PageId) => {
    navigate(id);
    setSearchOpen(false);
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setLocalQuery(''); }}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-4 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { setSearchOpen(false); setLocalQuery(''); }
                  if (e.key === 'Enter' && filtered.length > 0) handleSelect(filtered[0].id);
                }}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {page.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------
   Header Bar
   ------------------------------------------------------------------ */

function Header() {
  const { currentPage, toggleSidebar, setSearchOpen } = useAppStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h2 className="text-lg font-semibold">{PAGE_TITLES[currentPage]}</h2>

      <div className="ml-auto flex items-center gap-2">
        {/* Search shortcut */}
        <button
          onClick={() => setSearchOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 hidden dark:block" />
          <Moon className="h-5 w-5 block dark:hidden" />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        {/* Account / cloud sync */}
        <AuthMenu />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------
   App Layout (exported)
   ------------------------------------------------------------------ */

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* Simulate minimum loading time for splash screen effect */
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  /* Keyboard shortcut: Ctrl+K for search */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      useAppStore.getState().setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!loaded) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={useAppStore.getState().currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BackToTop />
      <SearchDialog />
    </div>
  );
}
