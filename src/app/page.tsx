/*
 * Victory Hub - Main Entry Point
 * Client-side SPA router that renders the correct page component
 * based on Zustand store navigation state
 */

'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useAppStore } from '@/store/app-store';
import { HomePage } from '@/components/pages/home-page';
import { DashboardPage } from '@/components/pages/dashboard-page';
import { SubjectsPage } from '@/components/pages/subjects-page';
import { QuizPage } from '@/components/pages/quiz-page';
import { FlashcardsPage } from '@/components/pages/flashcards-page';
import { NotesPage } from '@/components/pages/notes-page';
import { PlannerPage } from '@/components/pages/planner-page';
import { AnalyticsPage } from '@/components/pages/analytics-page';
import { AchievementsPage } from '@/components/pages/achievements-page';
import { ResourcesPage } from '@/components/pages/resources-page';
import { ProfilePage } from '@/components/pages/profile-page';
import { SettingsPage } from '@/components/pages/settings-page';
import { AIAssistantPage } from '@/components/pages/ai-assistant-page';
import { AboutPage } from '@/components/pages/about-page';

/* ------------------------------------------------------------------
   Page component map
   ------------------------------------------------------------------ */

const PAGE_MAP: Record<string, React.ComponentType> = {
  home: HomePage,
  dashboard: DashboardPage,
  subjects: SubjectsPage,
  quiz: QuizPage,
  flashcards: FlashcardsPage,
  notes: NotesPage,
  planner: PlannerPage,
  analytics: AnalyticsPage,
  achievements: AchievementsPage,
  resources: ResourcesPage,
  profile: ProfilePage,
  settings: SettingsPage,
  'ai-assistant': AIAssistantPage,
  about: AboutPage,
};

/* ------------------------------------------------------------------
   Root Component
   ------------------------------------------------------------------ */

export default function VictoryHub() {
  const currentPage = useAppStore((s) => s.currentPage);

  /* Home page renders without the app shell (sidebar/header) */
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
          <HomePage />
        </main>
      </div>
    );
  }

  const PageComponent = PAGE_MAP[currentPage] || DashboardPage;

  return (
    <AppLayout>
      <PageComponent />
    </AppLayout>
  );
}
