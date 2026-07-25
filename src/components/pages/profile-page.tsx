/*
 * Victory Hub - Profile Page
 * User profile with editable info, stats grid, favorite subjects, and recent activity
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User, Calendar, Clock, BookOpen, Award, Layers,
  FileText, Flame, Save, Edit3, X, Check,
  Star, GraduationCap, Activity, Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/app-store';

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
};

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const studySessions = useAppStore((s) => s.studySessions);
  const subjects = useAppStore((s) => s.subjects);
  const quizScores = useAppStore((s) => s.quizScores);
  const flashcards = useAppStore((s) => s.flashcards);
  const notes = useAppStore((s) => s.notes);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const achievements = useAppStore((s) => s.achievements);
  const recentActivity = useAppStore((s) => s.recentActivity);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [saved, setSaved] = useState(false);

  /* --- Computed stats --- */
  const stats = useMemo(() => {
    const totalMinutes = studySessions.reduce((acc, s) => acc + s.minutes, 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    const lessonsDone = subjects.reduce(
      (acc, subj) =>
        acc +
        subj.units.reduce(
          (uAcc, u) => uAcc + u.lessons.filter((l) => l.completed).length,
          0,
        ),
      0,
    );

    const quizzesTaken = quizScores.length;
    const flashcardCount = flashcards.length;
    const noteCount = notes.length;
    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    return [
      { icon: Clock, label: 'Study Hours', value: totalHours, color: 'from-amber-500 to-orange-500' },
      { icon: BookOpen, label: 'Lessons Done', value: lessonsDone, color: 'from-emerald-500 to-teal-500' },
      { icon: GraduationCap, label: 'Quizzes', value: quizzesTaken, color: 'from-violet-500 to-purple-500' },
      { icon: Layers, label: 'Flashcards', value: flashcardCount, color: 'from-sky-500 to-cyan-500' },
      { icon: FileText, label: 'Notes', value: noteCount, color: 'from-rose-500 to-pink-500' },
      { icon: Flame, label: 'Streak', value: `${currentStreak}d`, color: 'from-orange-500 to-red-500' },
      { icon: Award, label: 'Achievements', value: `${unlockedCount}/${achievements.length}`, color: 'from-yellow-500 to-amber-500' },
    ];
  }, [
    studySessions, subjects, quizScores, flashcards,
    notes, currentStreak, achievements,
  ]);

  /* --- Subject name lookup --- */
  const subjectNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    subjects.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [subjects]);

  /* --- Profile handlers --- */
  const handleStartEdit = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setIsEditing(true);
    setSaved(false);
  };

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;
    updateProfile({ name: trimmedName, bio: editBio.trim() });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setIsEditing(false);
  };

  /* --- Avatar letter --- */
  const avatarLetter = profile.name.charAt(0).toUpperCase();

  /* --- Join date --- */
  const joinDate = new Date(profile.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /* --- Activity time ago --- */
  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ===== PROFILE HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl overflow-hidden">
          {/* Banner gradient strip */}
          <div className="h-28 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 relative">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          </div>

          <CardContent className="relative px-6 pb-6">
            {/* Avatar overlapping the banner */}
            <div className="-mt-14 mb-4 flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-4xl font-bold shadow-xl ring-4 ring-background">
                {avatarLetter}
              </div>

              <div className="flex-1 pt-2">
                {!isEditing ? (
                  <>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold">{profile.name}</h1>
                      {saved && (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">
                          <Check className="mr-1 h-3 w-3" /> Saved
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">{profile.bio}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinDate}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-lg"
                      onClick={handleStartEdit}
                    >
                      <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold text-muted-foreground">Edit Profile</h1>
                    </div>
                    <div className="space-y-3 max-w-md">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Your name"
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                        <Textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Tell us about yourself"
                          className="rounded-lg resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90"
                          onClick={handleSave}
                          disabled={!editName.trim()}
                        >
                          <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={handleCancel}
                        >
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== STATS GRID ===== */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="text-2xl font-bold mb-4"
        >
          Your <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Statistics</span>
        </motion.h2>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <Card className="border-0 bg-card/60 backdrop-blur-xl hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-4 text-center">
                    <div className={`mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== FAVORITE SUBJECTS & RECENT ACTIVITY ===== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Favorite Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          <Card className="border-0 bg-card/60 backdrop-blur-xl h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-rose-500" />
                Favorite Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.favoriteSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Star className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">No favorite subjects yet</p>
                  <p className="text-xs mt-1">Start exploring to add favorites</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.favoriteSubjects.map((subjectId) => (
                    <Badge
                      key={subjectId}
                      variant="secondary"
                      className="rounded-lg px-3 py-1.5 text-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-400 border-0"
                    >
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                      {subjectNameMap[subjectId] || subjectId}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
        >
          <Card className="border-0 bg-card/60 backdrop-blur-xl h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-emerald-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <User className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">No activity yet</p>
                  <p className="text-xs mt-1">Start studying to see your activity</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                  {recentActivity.slice(0, 20).map((activity, i) => (
                    <div
                      key={activity.timestamp + '-' + i}
                      className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {timeAgo(activity.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ===== QUICK ACHIEVEMENT PREVIEW ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-amber-500" />
              Achievements Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">
                    {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {Math.round((achievements.filter((a) => a.unlocked).length / achievements.length) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}%`,
                    }}
                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <div
                    className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10'
                        : 'bg-muted/50 opacity-50'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{achievement.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
