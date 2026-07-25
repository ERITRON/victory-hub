/**
 * ProjectStatus — A transparent, honest component for Victory Hub.
 *
 * Communicates:
 *   1. The PROBLEM Victory Hub solves for Ethiopian Grade 12 students
 *   2. CURRENT LIMITATIONS (no backend, no accounts, no AI, etc.)
 *   3. WHAT WORKS right now (functional features)
 *   4. FUTURE VISION (planned features)
 *
 * Props:
 *   showLimitations (boolean) — show/hide the Limitations section (default: true)
 *   showVision     (boolean) — show/hide the Future Vision section (default: true)
 *   className       (string)  — additional CSS classes on the wrapper
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Puzzle,
  ListOrdered,
  BarChart3,
  Timer,
  Link2,
  Database,
  UserX,
  BotOff,
  CloudOff,
  Hash,
  Keyboard,
  User,
  CheckCircle2,
  Lock,
  LineChart,
  Sparkles,
  Smartphone,
  Users,
  Download,
  PenTool,
  AlertTriangle,
  Info,
  Target,
  Flame,
  Calendar,
  Clock,
  Heart,
  ShieldCheck,
} from 'lucide-react';

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const headingVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------
   Data: Problems
   ------------------------------------------------------------------ */

const PROBLEMS = [
  {
    icon: Puzzle,
    title: 'Fragmented Study Resources',
    description:
      'Students have textbooks from Grades 9–12 but don’t know how to connect topics across years. The Ethiopian national exam covers ALL four years — 30% from Grades 9–10 and 70% from Grades 11–12.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: ListOrdered,
    title: 'No Systematic Study Method',
    description:
      'Most students cram before the exam without a structured approach. Victory Hub implements the “Chapter Link” method (connecting Grade 12 topics to their Grade 9–11 foundations) and the “Pyramid” method (20% time on Grades 9–10, 30% on Grade 11, 50% on Grade 12).',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: BarChart3,
    title: 'No Progress Tracking',
    description:
      'Students don’t track daily study habits, mock exam scores, or mistakes. Victory Hub provides daily missions, streak tracking, score logging, and mistake logging to build accountability.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Timer,
    title: 'Poor Time Management',
    description:
      'Students don’t use structured study sessions. Victory Hub includes a Pyramid Timer with 50/30/20 minute presets that mirror the recommended study time distribution.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Link2,
    title: 'No Personalized Library',
    description:
      'Students can’t easily see how topics connect across grades. Victory Hub has a Book & Chapter Link Tracker where users manually add textbooks and create cross-grade connections.',
    color: 'from-violet-500 to-violet-600',
  },
];

/* ------------------------------------------------------------------
   Data: Limitations
   ------------------------------------------------------------------ */

const LIMITATIONS = [
  {
    icon: Database,
    title: 'No Backend / Database',
    description:
      'All data is stored in the browser’s localStorage. Clearing cache or using a different device erases all progress.',
    severity: 'high' as const,
  },
  {
    icon: UserX,
    title: 'No User Accounts',
    description:
      'No login system exists. Every visitor sees the same data. You cannot save or transfer work across devices.',
    severity: 'high' as const,
  },
  {
    icon: BotOff,
    title: 'No AI or Automation',
    description:
      'The AI Assistant in the app is a local pattern-matching demo — NOT a real AI. All chapter linking and tracking must be done manually.',
    severity: 'high' as const,
  },
  {
    icon: CloudOff,
    title: 'No Cloud Sync',
    description:
      'Data stays only on the device being used. There is no cloud backup or synchronization.',
    severity: 'medium' as const,
  },
  {
    icon: Hash,
    title: 'Static Demo Numbers',
    description:
      'Statistics like “9 Subjects, 150+ Lessons” on the home page are placeholders and do not update dynamically based on real data.',
    severity: 'low' as const,
  },
  {
    icon: Keyboard,
    title: 'Manual Input Only',
    description:
      'Users must add every book, chapter link, score, and mistake themselves. There is no automatic import or smart suggestions.',
    severity: 'medium' as const,
  },
  {
    icon: User,
    title: 'Single User Only',
    description:
      'Designed as a personal study tool, not a multi-user platform. Only one person can use each browser instance.',
    severity: 'low' as const,
  },
];

/* ------------------------------------------------------------------
   Data: What Works
   ------------------------------------------------------------------ */

const WORKING_FEATURES = [
  { icon: Target, title: 'Daily Missions', description: 'Add, complete, and delete daily study tasks' },
  { icon: Timer, title: 'Pyramid Timer', description: '50 / 30 / 20 minute presets with start, pause, and reset' },
  { icon: Link2, title: 'Book & Chapter Link Tracker', description: 'Manually add textbooks and create cross-grade links' },
  { icon: Flame, title: 'Streak Counter', description: 'Tracks consecutive study days to build consistency' },
  { icon: BarChart3, title: 'Score Tracker', description: 'Log and review mock exam scores over time' },
  { icon: AlertTriangle, title: 'Mistake Log', description: 'Record mistakes and review them before the exam' },
  { icon: ShieldCheck, title: 'Local Data Persistence', description: 'All data saves automatically in browser localStorage' },
];

/* ------------------------------------------------------------------
   Data: Future Vision
   ------------------------------------------------------------------ */

const FUTURE_FEATURES = [
  { icon: Lock, title: 'User Accounts & Cloud Sync', description: 'Login system with data that follows you across devices', color: 'from-blue-500 to-cyan-500' },
  { icon: LineChart, title: 'Interactive Progress Charts', description: 'Dynamic analytics that update with real study data', color: 'from-emerald-500 to-teal-500' },
  { icon: Sparkles, title: 'AI-Powered Chapter Links', description: 'Automatic suggestions for connecting topics across grades', color: 'from-violet-500 to-purple-500' },
  { icon: Smartphone, title: 'Mobile App Version', description: 'Native Android/iOS app for studying on the go', color: 'from-amber-500 to-orange-500' },
  { icon: Users, title: 'Shared Library', description: 'Collaborate and share chapter links with classmates', color: 'from-rose-500 to-pink-500' },
  { icon: Download, title: 'Export / Import Backup', description: 'Backup your data and restore it on any device', color: 'from-sky-500 to-blue-500' },
  { icon: PenTool, title: 'Automated Quiz Generator', description: 'Generate practice quizzes from your recorded mistakes', color: 'from-emerald-500 to-green-500' },
];

/* ------------------------------------------------------------------
   Severity Badge
   ------------------------------------------------------------------ */

function SeverityBadge({ severity }: { severity: 'high' | 'medium' | 'low' }) {
  const config = {
    high: { label: 'High Impact', cls: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20' },
    medium: { label: 'Medium Impact', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    low: { label: 'Low Impact', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  }[severity];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${config.cls}`}>
      {config.label}
    </span>
  );
}

/* ------------------------------------------------------------------
   Section: Problem
   ------------------------------------------------------------------ */

function ProblemSection() {
  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={headingVariant}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              The{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Problem
              </span>{' '}
              We Solve
            </h2>
            <p className="text-sm text-muted-foreground">
              Challenges facing Ethiopian Grade 12 students preparing for the national exam
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={staggerContainer}
        className="grid gap-5 sm:grid-cols-2"
      >
        {PROBLEMS.map((problem, index) => {
          const Icon = problem.icon;
          return (
            <motion.div
              key={problem.title}
              variants={cardVariant}
              className={
                index === PROBLEMS.length - 1 && PROBLEMS.length % 2 !== 0
                  ? 'sm:col-span-2'
                  : ''
              }
            >
              <div className="group relative h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className={`absolute left-6 top-0 h-1 w-12 rounded-b-full bg-gradient-to-r ${problem.color}`} />
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${problem.color} text-white shadow-md`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold mb-1.5">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Section: Limitations
   ------------------------------------------------------------------ */

function LimitationsSection() {
  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={headingVariant}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Current{' '}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Limitations
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Being honest about what Victory Hub cannot do — yet
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Transparency matters.</strong> Victory Hub
              is a student project, not a commercial product. Below are the current
              limitations so you know exactly what you&apos;re getting. No false promises.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={staggerContainer}
        className="grid gap-4 sm:grid-cols-2"
      >
        {LIMITATIONS.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={cardVariant}>
              <div className="group relative h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <SeverityBadge severity={item.severity} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Section: What Works
   ------------------------------------------------------------------ */

function WorksSection() {
  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={headingVariant}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              What{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Works
              </span>{' '}
              Right Now
            </h2>
            <p className="text-sm text-muted-foreground">
              Features that are fully functional and ready to use today
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={staggerContainer}
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl overflow-hidden"
      >
        {WORKING_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const isLast = index === WORKING_FEATURES.length - 1;
          return (
            <motion.div
              key={feature.title}
              variants={cardVariant}
              className={`flex items-center gap-4 p-5 transition-colors hover:bg-emerald-500/5 ${
                !isLast ? 'border-b border-border/30' : ''
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 ml-6">{feature.description}</p>
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Working
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Section: Future Vision
   ------------------------------------------------------------------ */

function VisionSection() {
  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={headingVariant}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Future{' '}
              <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                Vision
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Features planned for upcoming versions of Victory Hub
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={staggerContainer}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FUTURE_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={cardVariant}>
              <div className="group relative h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className={`absolute left-5 top-0 h-1 w-10 rounded-b-full bg-gradient-to-r ${feature.color}`} />
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                <div className="mt-3 ml-[54px]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-500">
                    <Sparkles className="h-2.5 w-2.5" />
                    Planned
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Status Footer
   ------------------------------------------------------------------ */

function StatusFooter() {
  const lastUpdated = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/20">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            Built with{' '}
            <Heart className="inline h-5 w-5 text-rose-500 fill-rose-500" />{' '}
            by a Grade 11 Student
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Victory Hub is a personal project born from the real challenges of
            preparing for the Ethiopian national exam. It&apos;s not perfect — but
            it&apos;s honest, it&apos;s useful, and it&apos;s constantly improving.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Actively Developed
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Calendar className="h-3 w-3" />
            Student Project
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <Clock className="h-3 w-3" />
            Work in Progress
          </span>
        </div>

        <div className="border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground">
            Last updated: <strong className="text-foreground">{lastUpdated}</strong>{' '}
            &middot; This is a transparent project status page &middot; No false
            claims, no hidden limitations
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

/* ------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------ */

interface ProjectStatusProps {
  showLimitations?: boolean;
  showVision?: boolean;
  className?: string;
}

export default function ProjectStatus({
  showLimitations = true,
  showVision = true,
  className = '',
}: ProjectStatusProps) {
  return (
    <div className={`space-y-14 ${className}`}>
      <ProblemSection />
      <WorksSection />
      {showLimitations && <LimitationsSection />}
      {showVision && <VisionSection />}
      <StatusFooter />
    </div>
  );
}
