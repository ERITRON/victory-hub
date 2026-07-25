/*
 * Victory Hub - About Page
 * Branding, mission, features, tech stack, credits,
 * and the honest ProjectStatus transparency section
 */

'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, WifiOff, Award, Bot,
  Sparkles, Heart, Code, ExternalLink, Users,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/app-store';
import ProjectStatus from '@/components/ProjectStatus';

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ------------------------------------------------------------------
   Static data
   ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Comprehensive Learning',
    desc: '9 subjects with structured lessons, quizzes, flashcards, and notes — everything you need in one place.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: WifiOff,
    title: 'Offline First',
    desc: 'Works completely offline. All data is stored locally in your browser — no accounts, no servers, no tracking.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Award,
    title: 'Achievement System',
    desc: '12 unlockable badges, streak tracking, and progress bars to keep you motivated and engaged.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Bot,
    title: 'Study Assistant',
    desc: 'Built-in study assistant to answer questions, explain concepts, and provide study guidance.',
    color: 'from-violet-500 to-purple-500',
  },
];

const TECH_STACK = [
  { name: 'Next.js', color: 'bg-black text-white dark:bg-white dark:text-black' },
  { name: 'TypeScript', color: 'bg-blue-600 text-white' },
  { name: 'Tailwind CSS', color: 'bg-cyan-500 text-white' },
  { name: 'Chart.js', color: 'bg-rose-500 text-white' },
  { name: 'LocalStorage', color: 'bg-amber-500 text-white' },
  { name: 'Framer Motion', color: 'bg-violet-600 text-white' },
];

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export function AboutPage() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-12 pb-8">
      {/* ===== Hero ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 md:p-14 text-white"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20"
          >
            <GraduationCap className="h-9 w-9" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            About <span className="underline decoration-4 decoration-white/40 underline-offset-4">Victory Hub</span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-white/90">
            A personal study tool built for Ethiopian Grade 12 students preparing for the national exam.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Badge variant="secondary" className="border-0 bg-white/20 text-white hover:bg-white/30">
              v1.0.0
            </Badge>
            <Badge variant="secondary" className="border-0 bg-white/20 text-white hover:bg-white/30">
              <Sparkles className="mr-1 h-3 w-3" /> Student Project
            </Badge>
          </div>
        </div>
      </motion.section>

      {/* ===== Mission Statement ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
              We believe every student deserves structured, effective study tools — regardless of internet connectivity or financial resources.
              Victory Hub implements proven study methods like the &ldquo;Chapter Link&rdquo; and &ldquo;Pyramid&rdquo; methods specifically designed for the
              Ethiopian national exam format.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* ===== Feature Highlights ===== */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Built for{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Students
          </span>
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== Tech Stack ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Tech Stack</h2>
                <p className="text-xs text-muted-foreground">The technologies powering Victory Hub</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {TECH_STACK.map((tech) => (
                <Badge key={tech.name} className={`${tech.color} border-0 px-3 py-1.5 text-sm font-medium`}>
                  {tech.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ===== Divider ===== */}
      <Separator />

      {/* ===== Honest Project Status ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Honest{' '}
            <span className="bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
              Project Status
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            What this tool does, what it doesn&apos;t, and where it&apos;s headed
          </p>
        </div>
        <ProjectStatus showLimitations={true} showVision={true} />
      </motion.div>

      {/* ===== Credits / Navigation ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold mb-3">Credits</h2>
            <p className="max-w-lg mx-auto text-sm text-muted-foreground leading-relaxed mb-6">
              Victory Hub is made with care for Ethiopian students everywhere. Thank you to the open-source community and all the educators who inspire better learning tools.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate('home')}
              >
                <GraduationCap className="mr-2 h-4 w-4" /> Back to Home
              </Button>
              <Button
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90"
                onClick={() => navigate('dashboard')}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ===== App Footer ===== */}
      <footer className="border-t border-border pt-6 pb-4 text-center text-xs text-muted-foreground">
        <p>
          Victory Hub v1.0.0 &middot; Built with{' '}
          <Heart className="inline h-3 w-3 text-rose-500" />{' '}
          by a Grade 11 Student &middot; &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
