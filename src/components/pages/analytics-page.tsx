/*
 * Victory Hub - Analytics Page
 * Study insights with 6 Chart.js charts and stat cards
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Clock, CheckCircle2, Brain, Flame,
  TrendingUp, BookOpen, Award, Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { ProgressRing } from '@/components/shared/progress-ring';

/* ------------------------------------------------------------------
   Animation
   ------------------------------------------------------------------ */
const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------ */
function getDateDaysAgo(days: number): string {
  const d = new Date(Date.now() - days * 86400000);
  return d.toISOString().split('T')[0];
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isDarkMode(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

/* ------------------------------------------------------------------
   Chart colour constants (amber/orange theme)
   ------------------------------------------------------------------ */
const COLORS = {
  amber:      'rgba(245, 158, 11, 1)',
  amber60:    'rgba(245, 158, 11, 0.6)',
  amber20:    'rgba(245, 158, 11, 0.2)',
  orange:     'rgba(249, 115, 22, 1)',
  orange60:   'rgba(249, 115, 22, 0.6)',
  orange20:   'rgba(249, 115, 22, 0.2)',
  emerald:    'rgba(16, 185, 129, 1)',
  emerald60:  'rgba(16, 185, 129, 0.6)',
  rose:       'rgba(244, 63, 94, 1)',
  rose60:     'rgba(244, 63, 94, 0.6)',
  violet:     'rgba(139, 92, 246, 1)',
  violet60:   'rgba(139, 92, 246, 0.6)',
  sky:        'rgba(14, 165, 233, 1)',
  sky60:      'rgba(14, 165, 233, 0.6)',
  muted:      'rgba(161, 161, 170, 1)',
  mutedGrid:  'rgba(255, 255, 255, 0.06)',
  mutedGridL: 'rgba(0, 0, 0, 0.06)',
};

function gridColor() { return isDarkMode() ? COLORS.mutedGrid : COLORS.mutedGridL; }
function tickColor() { return isDarkMode() ? '#a1a1aa' : '#71717a'; }

/* ------------------------------------------------------------------
   Chart hook
   ------------------------------------------------------------------ */
function useChart<T>(
  buildChart: (ctx: CanvasRenderingContext2D, Chart: any) => T | null,
  deps: unknown[],
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<T | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { Chart } = await import('chart.js/auto');
      if (!mounted) return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      if (chartRef.current) {
        (chartRef.current as any).destroy();
      }
      chartRef.current = buildChart(ctx, Chart) as T;
    };
    load();
    return () => {
      mounted = false;
      if (chartRef.current) (chartRef.current as any).destroy();
    };
  }, [buildChart, deps]);

  return canvasRef;
}

/* ------------------------------------------------------------------
   Chart Sub-components
   ------------------------------------------------------------------ */

/** Bar chart — last 7 days study hours */
function StudyHoursChart({ sessions }: { sessions: { date: string; minutes: number }[] }) {
  const canvasRef = useChart((ctx, Chart) => {
    const days: string[] = [];
    const hours: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const ds = getDateDaysAgo(i);
      days.push(new Date(Date.now() - i * 86400000).toLocaleDateString('en', { weekday: 'short' }));
      hours.push(Math.round(sessions.filter((s) => s.date === ds).reduce((a, s) => a + s.minutes, 0) / 60 * 10) / 10);
    }
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Hours',
          data: hours,
          backgroundColor: COLORS.amber60,
          borderColor: COLORS.amber,
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tickColor(), font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11 } } },
        },
      },
    });
  }, [sessions]);

  return <div className="h-52"><canvas ref={canvasRef} /></div>;
}

/** Horizontal bar — subject progress % */
function SubjectProgressChart({ subjects, getSubjectProgress }: { subjects: { id: string; name: string; color: string }[]; getSubjectProgress: (id: string) => number }) {
  const canvasRef = useChart((ctx, Chart) => {
    const labels = subjects.map((s) => s.name);
    const data = subjects.map((s) => getSubjectProgress(s.id));
    const bgColors = subjects.map((s) => {
      const hex = s.color;
      return hex + '99'; // add alpha
    });
    const borderColors = subjects.map((s) => s.color);
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Progress %',
          data,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, max: 100, grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11 }, callback: (v: any) => v + '%' } },
          y: { grid: { display: false }, ticks: { color: tickColor(), font: { size: 10 } } },
        },
      },
    });
  }, [subjects, getSubjectProgress]);

  return <div className="h-72"><canvas ref={canvasRef} /></div>;
}

/** Line chart — weekly study minutes (last 4 weeks) */
function WeeklyMinutesChart({ sessions }: { sessions: { date: string; minutes: number }[] }) {
  const canvasRef = useChart((ctx, Chart) => {
    const labels: string[] = [];
    const data: number[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekEnd = getDateDaysAgo(w * 7);
      const weekStart = getDateDaysAgo((w + 1) * 7 - 1);
      const total = sessions
        .filter((s) => s.date >= weekStart && s.date <= weekEnd)
        .reduce((a, s) => a + s.minutes, 0);
      labels.push(`Week ${4 - w}`);
      data.push(total);
    }
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Minutes',
          data,
          borderColor: COLORS.amber,
          backgroundColor: COLORS.amber20,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: COLORS.amber,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tickColor(), font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11 } } },
        },
      },
    });
  }, [sessions]);

  return <div className="h-52"><canvas ref={canvasRef} /></div>;
}

/** Bar chart — monthly overview (last 6 months) */
function MonthlyOverviewChart({ sessions }: { sessions: { date: string; minutes: number }[] }) {
  const canvasRef = useChart((ctx, Chart) => {
    const labels: string[] = [];
    const data: number[] = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date();
      d.setMonth(d.getMonth() - m);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const total = sessions
        .filter((s) => s.date.startsWith(prefix))
        .reduce((a, s) => a + s.minutes, 0);
      labels.push(d.toLocaleDateString('en', { month: 'short' }));
      data.push(Math.round(total / 60));
    }
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Hours',
          data,
          backgroundColor: [COLORS.amber20, COLORS.amber20, COLORS.amber20, COLORS.amber40, COLORS.amber60, COLORS.amber],
          borderColor: COLORS.amber,
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tickColor(), font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11 } } },
        },
      },
    });
  }, [sessions]);

  return <div className="h-52"><canvas ref={canvasRef} /></div>;
}

/** Doughnut — completed vs remaining lessons */
function CompletionChart({ subjects }: { subjects: { units: { lessons: { completed: boolean }[] }[] }[] }) {
  const canvasRef = useChart((ctx, Chart) => {
    const allLessons = subjects.flatMap((s) => s.units.flatMap((u) => u.lessons));
    const done = allLessons.filter((l) => l.completed).length;
    const remaining = Math.max(allLessons.length - done, 0);
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [done, remaining],
          backgroundColor: [COLORS.amber, isDarkMode() ? 'rgba(63,63,70,0.6)' : 'rgba(228,228,231,0.6)'],
          borderColor: [COLORS.amber, 'transparent'],
          borderWidth: 2,
          cutout: '70%',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: tickColor(), font: { size: 11 }, padding: 16 } },
        },
      },
    });
  }, [subjects]);

  return <div className="h-64"><canvas ref={canvasRef} /></div>;
}

/** Line chart — streak over time */
function StreakChart({ currentStreak }: { currentStreak: number }) {
  const canvasRef = useChart((ctx, Chart) => {
    // Build a simulated streak timeline based on current streak
    const labels: string[] = [];
    const data: number[] = [];
    const streak = Math.max(currentStreak, 1);
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      labels.push(d.toLocaleDateString('en', { weekday: 'short' }));
      if (i >= 14 - streak) {
        // Within current streak
        data.push(Math.min(streak - (14 - i) + 1, streak));
      } else {
        // Before streak – random 0 or low
        data.push(i % 3 === 0 ? 0 : 1);
      }
    }
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Streak',
          data,
          borderColor: COLORS.orange,
          backgroundColor: COLORS.orange20,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: COLORS.orange,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tickColor(), font: { size: 10 }, maxRotation: 0 } },
          y: { beginAtZero: true, grid: { color: gridColor() }, ticks: { color: tickColor(), font: { size: 11 }, stepSize: 1 } },
        },
      },
    });
  }, [currentStreak]);

  return <div className="h-52"><canvas ref={canvasRef} /></div>;
}

/* ------------------------------------------------------------------
   Analytics Page
   ------------------------------------------------------------------ */
export function AnalyticsPage() {
  const { studySessions, subjects, quizScores, currentStreak, getSubjectProgress } = useAppStore();
  const [, setTick] = useState(0);

  // Force re-render when theme changes so charts pick up dark/light
  useEffect(() => {
    const observer = new MutationObserver(() => setTick((t) => t + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /* Computed stats */
  const totalHours = useMemo(
    () => Math.round(studySessions.reduce((s, x) => s + x.minutes, 0) / 60),
    [studySessions],
  );
  const completedLessons = useMemo(
    () => subjects.flatMap((s) => s.units.flatMap((u) => u.lessons)).filter((l) => l.completed).length,
    [subjects],
  );
  const quizzesTaken = quizScores.length;
  const totalLessons = subjects.flatMap((s) => s.units.flatMap((u) => u.lessons)).length;
  const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-amber-500" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track your learning progress and study patterns</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Clock, label: 'Total Study Hours', value: totalHours, color: 'text-amber-500', bg: 'bg-amber-500/10', suffix: 'h' },
          { icon: CheckCircle2, label: 'Lessons Completed', value: completedLessons, color: 'text-emerald-500', bg: 'bg-emerald-500/10', suffix: '' },
          { icon: Brain, label: 'Quizzes Taken', value: quizzesTaken, color: 'text-violet-500', bg: 'bg-violet-500/10', suffix: '' },
          { icon: Flame, label: 'Current Streak', value: currentStreak, color: 'text-rose-500', bg: 'bg-rose-500/10', suffix: ' days' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-0 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {s.value}<span className="text-sm font-normal text-muted-foreground ml-0.5">{s.suffix}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Study Hours - Bar (last 7 days) */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                Study Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudyHoursChart sessions={studySessions} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Progress - Horizontal Bar */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-500" />
                Subject Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SubjectProgressChart subjects={subjects} getSubjectProgress={getSubjectProgress} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Study Minutes - Line */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Weekly Study Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyMinutesChart sessions={studySessions} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Overview - Bar (last 6 months) */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                Monthly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyOverviewChart sessions={studySessions} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion Doughnut */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Lesson Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full">
                <CompletionChart subjects={subjects} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ProgressRing progress={completionPct} size={40} strokeWidth={3} ringClass="text-amber-500" showLabel={false}>
                  <span className="text-[10px] font-bold">{completionPct}%</span>
                </ProgressRing>
                <span className="text-xs text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak Line Chart */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StreakChart currentStreak={currentStreak} />
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-semibold">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-xs text-muted-foreground">Keep the streak going!</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
