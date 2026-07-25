/*
 * Victory Hub - Achievements Page
 * Badge grid with unlock animations, filter tabs, and progress summary
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Trophy, Clock, Calculator, Leaf, Atom, Award, Star,
  FileText, Layers, GraduationCap, Target, Lock, Check,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppStore, type Achievement } from '@/store/app-store';

/* ------------------------------------------------------------------
   Icon mapping
   ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Trophy, Clock, Calculator, Leaf, Atom, Award, Star, FileText, Layers, GraduationCap, Target,
};

/* ------------------------------------------------------------------
   Achievement gradient colours (cycled per badge)
   ------------------------------------------------------------------ */

const GRADIENTS = [
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-lime-500 to-green-500',
];

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' as const },
  }),
};

const popIn = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
};

/* ------------------------------------------------------------------
   Single Achievement Badge
   ------------------------------------------------------------------ */

function AchievementBadge({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = ICON_MAP[achievement.icon] || Award;
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const unlocked = achievement.unlocked;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
    >
      <motion.div
        {...(unlocked ? popIn : {})}
        initial={unlocked ? popIn.initial : { opacity: 0, y: 12 }}
        animate={unlocked ? popIn.animate : { opacity: 1, y: 0, transition: { delay: index * 0.06, duration: 0.4, ease: 'easeOut' as const } }}
        whileHover={unlocked ? popIn.whileHover : { scale: 1.02 }}
      >
        <Card
          className={
            unlocked
              ? `relative overflow-hidden border-0 bg-gradient-to-br ${gradient} text-white shadow-lg`
              : 'relative overflow-hidden border-0 bg-card/60 backdrop-blur-xl opacity-60'
          }
        >
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            {/* Icon container */}
            <div
              className={
                unlocked
                  ? 'relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20'
                  : 'flex h-16 w-16 items-center justify-center rounded-2xl bg-muted'
              }
            >
              <Icon className={unlocked ? 'h-8 w-8' : 'h-8 w-8 text-muted-foreground'} />

              {/* Lock overlay */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/50 backdrop-blur-sm">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
              )}

              {/* Checkmark for unlocked */}
              {unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' as const, stiffness: 400, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md"
                >
                  <Check className="h-3 w-3 text-emerald-600" />
                </motion.div>
              )}
            </div>

            {/* Name & description */}
            <div>
              <h3 className={`text-sm font-semibold ${unlocked ? '' : 'text-muted-foreground'}`}>
                {achievement.name}
              </h3>
              <p className={`mt-1 text-xs leading-relaxed ${unlocked ? 'text-white/80' : 'text-muted-foreground/70'}`}>
                {achievement.description}
              </p>
            </div>

            {/* Status badge */}
            {unlocked ? (
              <Badge className="border-0 bg-white/20 text-white text-[10px] hover:bg-white/30">
                <Sparkles className="mr-1 h-3 w-3" /> Unlocked
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                <Lock className="mr-1 h-3 w-3" /> Locked
              </Badge>
            )}

            {/* Unlocked date */}
            {unlocked && achievement.unlockedAt && (
              <p className="text-[10px] text-white/50">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Achievements Page
   ------------------------------------------------------------------ */

export function AchievementsPage() {
  const achievements = useAppStore((s) => s.achievements);
  const [filter, setFilter] = useState('all');

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const total = achievements.length;
  const progressPercent = total > 0 ? Math.round((unlocked.length / total) * 100) : 0;

  const filtered =
    filter === 'unlocked' ? unlocked : filter === 'locked' ? locked : achievements;

  return (
    <div className="space-y-8">
      {/* ===== Header with summary ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

          <CardContent className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Achievements</h1>
                  <p className="text-sm text-white/80">Track your milestones and earn badges</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
                <span className="text-3xl font-extrabold">{unlocked.length}</span>
                <span className="text-lg text-white/70">/</span>
                <span className="text-lg text-white/70">{total}</span>
                <span className="text-sm text-white/70 hidden sm:inline">unlocked</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Overall Progress</span>
                <span className="font-semibold text-white">{progressPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' as const }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== Filter tabs ===== */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-muted/80">
          <TabsTrigger value="all">All ({total})</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlocked.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({locked.length})</TabsTrigger>
        </TabsList>

        {['all', 'unlocked', 'locked'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-muted-foreground">
                    {filter === 'unlocked' ? 'No unlocked achievements yet' : 'All achievements unlocked!'}
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {filter === 'unlocked'
                      ? 'Start studying to earn your first badge'
                      : "Congratulations! You've completed everything."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={tab}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {filtered.map((achievement, i) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      index={i}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
