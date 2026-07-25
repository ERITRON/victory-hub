/*
 * Victory Hub - Sidebar Navigation
 * Responsive sidebar with navigation links, user info, and collapse support
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Brain,
  Layers,
  FileText,
  CalendarDays,
  BarChart3,
  Award,
  Library,
  User,
  Settings,
  Bot,
  Info,
  GraduationCap,
  ChevronLeft,
  X,
  Search,
} from 'lucide-react';
import { useAppStore, type PageId } from '@/store/app-store';
import { ProgressRing } from '@/components/shared/progress-ring';

/* ------------------------------------------------------------------
   Navigation items definition
   ------------------------------------------------------------------ */

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, section: 'Main' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main' },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, section: 'Learn' },
  { id: 'quiz', label: 'Quiz', icon: Brain, section: 'Learn' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, section: 'Learn' },
  { id: 'notes', label: 'Notes', icon: FileText, section: 'Learn' },
  { id: 'planner', label: 'Planner', icon: CalendarDays, section: 'Organize' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Organize' },
  { id: 'achievements', label: 'Achievements', icon: Award, section: 'Organize' },
  { id: 'resources', label: 'Resources', icon: Library, section: 'Library' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, section: 'Library' },
  { id: 'profile', label: 'Profile', icon: User, section: 'Account' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'Account' },
  { id: 'about', label: 'About', icon: Info, section: 'Account' },
];

/* ------------------------------------------------------------------
   Sidebar Component
   ------------------------------------------------------------------ */

export function Sidebar() {
  const {
    currentPage,
    navigate,
    sidebarOpen,
    toggleSidebar,
    setSearchOpen,
    profile,
    subjects,
    currentStreak,
    getSubjectProgress,
  } = useAppStore();

  /* Compute overall progress */
  const totalProgress = subjects.reduce(
    (sum, s) => sum + getSubjectProgress(s.id),
    0
  ) / Math.max(subjects.length, 1);

  /* Group nav items by section */
  const sections: Record<string, NavItem[]> = {};
  for (const item of NAV_ITEMS) {
    const sec = item.section || 'Other';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(item);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Victory Hub</h1>
            <p className="text-[11px] text-muted-foreground">Learn &middot; Practice &middot; Achieve</p>
          </div>
        </div>
        {/* Close button (mobile) */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search button */}
      <div className="px-3 mb-2">
        <button
          onClick={() => { setSearchOpen(true); toggleSidebar(); }}
          className="flex w-full items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto hidden rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border sm:inline-block">Ctrl+K</kbd>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-primary text-primary-foreground -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User card / stats at bottom */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <ProgressRing progress={totalProgress} size={42} strokeWidth={4} ringClass="text-amber-500" showLabel={false}>
            <span className="text-[10px] font-bold text-foreground">{Math.round(totalProgress)}%</span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
              {currentStreak} day streak
            </div>
          </div>
          <button
            onClick={() => navigate('profile')}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-border bg-card/80 backdrop-blur-xl h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 z-50 flex w-72 flex-col border-r border-border bg-card backdrop-blur-xl h-screen lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
