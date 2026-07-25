/*
 * Victory Hub - Dashboard Page
 * Central hub with stats, pomodoro timer, schedule, and progress overview
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, CheckCircle2, Brain, Flame, Play, Pause, RotateCcw,
  BookOpen, BarChart3, FileText, Layers, ArrowRight, Target,
  Calendar, TrendingUp, Zap, ListTodo, Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
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
   Motivational quotes
   ------------------------------------------------------------------ */
const QUOTES = [
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"Success is the sum of small efforts repeated day in and day out." — Robert Collier',
  '"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela',
  '"It does not matter how slowly you go as long as you do not stop." — Confucius',
  '"The only way to do great work is to love what you do." — Steve Jobs',
];

/* ------------------------------------------------------------------
   Pomodoro Timer Sub-component
   ------------------------------------------------------------------ */
function PomodoroTimer() {
  const settings = useAppStore((s) => s.settings);
  const [seconds, setSeconds] = useState(settings.pomodoroWork * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (!isBreak) {
              setSessions((s) => s + 1);
              useAppStore.getState().addStudySession(settings.pomodoroWork, 'Pomodoro');
            }
            setIsBreak((b) => !b);
            return (isBreak ? settings.pomodoroWork : settings.pomodoroBreak) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, isBreak, settings.pomodoroWork, settings.pomodoroBreak]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const totalTime = (isBreak ? settings.pomodoroBreak : settings.pomodoroWork) * 60;
  const pct = ((totalTime - seconds) / totalTime) * 100;

  return (
    <Card className="border-0 bg-card/60 backdrop-blur-xl">
      <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /> Pomodoro Timer</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <ProgressRing progress={pct} size={120} strokeWidth={6} ringClass={isBreak ? 'text-emerald-500' : 'text-amber-500'}>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono">{mins}:{secs}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{isBreak ? 'Break' : 'Focus'}</p>
          </div>
        </ProgressRing>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setRunning(!running)} className="rounded-xl">
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause' : 'Start'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setRunning(false); setIsBreak(false); setSeconds(settings.pomodoroWork * 60); }} className="rounded-xl">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i < sessions % 4 ? 'bg-amber-500' : 'bg-muted'}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------
   Weekly Chart Sub-component
   ------------------------------------------------------------------ */
function WeeklyChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const studySessions = useAppStore((s) => s.studySessions);

  useEffect(() => {
    let chart: any = null;
    const load = async () => {
      const { Chart } = await import('chart.js/auto');
      const days = [];
      const mins = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        days.push(d.toLocaleDateString('en', { weekday: 'short' }));
        const ds = d.toISOString().split('T')[0];
        mins.push(studySessions.filter((s) => s.date === ds).reduce((sum, s) => sum + s.minutes, 0));
      }
      if (canvasRef.current) {
        if (chart) chart.destroy();
        const ctx = canvasRef.current.getContext('2d');
        const isDark = document.documentElement.classList.contains('dark');
        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: days,
            datasets: [{ label: 'Minutes', data: mins, backgroundColor: 'rgba(245, 158, 11, 0.6)', borderColor: 'rgba(245, 158, 11, 1)', borderWidth: 1, borderRadius: 8, barPercentage: 0.6 }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: isDark ? '#a1a1aa' : '#71717a', font: { size: 11 } } },
              y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }, ticks: { color: isDark ? '#a1a1aa' : '#71717a', font: { size: 11 } } },
            },
          },
        });
      }
    };
    load();
    return () => { if (chart) chart.destroy(); };
  }, [studySessions]);

  return <div className="h-48"><canvas ref={canvasRef} /></div>;
}

/* ------------------------------------------------------------------
   Dashboard Page
   ------------------------------------------------------------------ */

export function DashboardPage() {
  const { subjects, studySessions, quizScores, currentStreak, profile, plannerTasks, dailyGoal, getSubjectProgress, navigate } = useAppStore();

  /* Computed stats */
  const totalHours = Math.round(studySessions.reduce((s, x) => s + x.minutes, 0) / 60);
  const completedLessons = subjects.flatMap((s) => s.units.flatMap((u) => u.lessons)).filter((l) => l.completed).length;
  const totalProgress = subjects.reduce((sum, s) => sum + getSubjectProgress(s.id), 0) / Math.max(subjects.length, 1);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMinutes = studySessions.filter((s) => s.date === todayStr).reduce((s, x) => s + x.minutes, 0);
  const todayTasks = plannerTasks.filter((t) => t.date === todayStr);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={fadeUp}>
        <Card className="border-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 backdrop-blur-xl overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <h1 className="text-2xl font-bold">Welcome back, {profile.name}! 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground italic">{quote}</p>
          </CardContent>
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        </Card>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Clock, label: 'Study Hours', value: totalHours, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { icon: CheckCircle2, label: 'Lessons Done', value: completedLessons, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: Brain, label: 'Quizzes Taken', value: quizScores.length, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { icon: Flame, label: 'Day Streak', value: currentStreak, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-0 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Timer + Daily Goals + Subject Progress */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <PomodoroTimer />
            <Card className="border-0 bg-card/60 backdrop-blur-xl">
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-amber-500" /> Daily Goals</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Study Time</span><span className="text-muted-foreground">{todayMinutes}/{dailyGoal.studyMinutes} min</span></div>
                  <Progress value={Math.min(100, (todayMinutes / Math.max(dailyGoal.studyMinutes, 1)) * 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Lessons</span><span className="text-muted-foreground">0/{dailyGoal.lessonsCompleted}</span></div>
                  <Progress value={0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Quizzes</span><span className="text-muted-foreground">0/{dailyGoal.quizzesTaken}</span></div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <ProgressRing progress={totalProgress} size={36} strokeWidth={3} ringClass="text-amber-500" showLabel={false}>
                    <span className="text-[9px] font-bold">{Math.round(totalProgress)}%</span>
                  </ProgressRing>
                  <span className="text-xs text-muted-foreground">Overall Progress</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress Grid */}
          <motion.div variants={fadeUp}>
            <Card className="border-0 bg-card/60 backdrop-blur-xl">
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-500" /> Subject Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {subjects.map((s) => {
                    const prog = getSubjectProgress(s.id);
                    return (
                      <button key={s.id} onClick={() => navigate('subjects')} className="group flex items-center gap-3 rounded-xl bg-muted/40 p-3 text-left hover:bg-muted/70 transition-colors">
                        <div className={`h-2 w-2 rounded-full shrink-0`} style={{ backgroundColor: s.color }} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{s.name}</p>
                          <Progress value={prog} className="h-1.5 mt-1" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">{prog}%</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column: Schedule + Activity + Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-amber-500" /> Today&apos;s Schedule</CardTitle></CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No tasks scheduled for today</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {todayTasks.map((t) => {
                    const priorityColor = t.priority === 'urgent' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500';
                    return (
                      <div key={t.id} className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${priorityColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${t.completed ? 'line-through text-muted-foreground' : ''}`}>{t.title}</p>
                          <p className="text-[10px] text-muted-foreground">{t.time} · {t.subject}</p>
                        </div>
                        <Checkbox checked={t.completed} onCheckedChange={() => useAppStore.getState().updateTask(t.id, { completed: !t.completed })} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: 'Start Quiz', icon: Brain, page: 'quiz' as const, color: 'text-violet-500' },
                { label: 'Create Note', icon: FileText, page: 'notes' as const, color: 'text-emerald-500' },
                { label: 'Add Flashcard', icon: Layers, page: 'flashcards' as const, color: 'text-amber-500' },
                { label: 'View Analytics', icon: BarChart3, page: 'analytics' as const, color: 'text-rose-500' },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Button key={a.label} variant="outline" className="h-auto flex-col gap-1.5 py-3 rounded-xl border-dashed" onClick={() => navigate(a.page)}>
                    <Icon className={`h-5 w-5 ${a.color}`} />
                    <span className="text-xs">{a.label}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Weekly Chart */}
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-500" /> This Week</CardTitle></CardHeader>
            <CardContent><WeeklyChart /></CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
