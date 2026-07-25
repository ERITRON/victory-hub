/*
 * Victory Hub - Subjects Page
 * Browse all 9 subjects with units, lessons, progress tracking, and bookmarks
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Monitor,
  TrendingUp, Landmark, Globe, Search, Grid3X3, List, Video,
  FileText, Dumbbell, Brain, Bookmark, BookmarkCheck, ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { useAppStore } from '@/store/app-store';
import { ProgressRing } from '@/components/shared/progress-ring';

/* ------------------------------------------------------------------
   Icon mapping
   ------------------------------------------------------------------ */
const ICON_MAP: Record<string, React.ElementType> = {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Monitor, TrendingUp, Landmark, Globe,
};

const TYPE_ICONS: Record<string, React.ElementType> = { video: Video, reading: FileText, exercise: Dumbbell, quiz: Brain };

/* ------------------------------------------------------------------
   Animation
   ------------------------------------------------------------------ */
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */
export function SubjectsPage() {
  const { subjects, toggleLesson, toggleBookmark, getSubjectProgress } = useAppStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    if (!search) return subjects;
    const q = search.toLowerCase();
    return subjects.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [subjects, search]);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Toolbar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl bg-card/60 backdrop-blur-xl border-0" />
        </div>
        <div className="flex gap-1 rounded-xl bg-muted/60 p-1">
          <Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} className="rounded-lg h-8"><Grid3X3 className="h-4 w-4" /></Button>
          <Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="rounded-lg h-8"><List className="h-4 w-4" /></Button>
        </div>
      </motion.div>

      {/* Subject Grid/List */}
      <div className={view === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
        {filtered.map((subject, idx) => {
          const Icon = ICON_MAP[subject.icon] || BookOpen;
          const prog = getSubjectProgress(subject.id);
          const totalLessons = subject.units.reduce((a, u) => a + u.lessons.length, 0);
          const completedLessons = subject.units.reduce((a, u) => a + u.lessons.filter((l) => l.completed).length, 0);

          return (
            <motion.div key={subject.id} custom={idx} variants={fadeUp}>
              <Card className="border-0 bg-card/60 backdrop-blur-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${subject.gradient} p-6 text-white relative overflow-hidden`}>
                  <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{subject.name}</h3>
                        <p className="text-xs text-white/80">{totalLessons} lessons</p>
                      </div>
                    </div>
                    <ProgressRing progress={prog} size={48} strokeWidth={3} ringClass="text-white" textClass="text-white" showLabel>
                      <span className="text-xs font-bold text-white" />
                    </ProgressRing>
                  </div>
                </div>

                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
                  <Progress value={prog} className="h-1.5 mb-1" />
                  <p className="text-xs text-muted-foreground mb-4">{completedLessons}/{totalLessons} completed</p>

                  {/* Units accordion */}
                  <Accordion type="multiple" className="space-y-2">
                    {subject.units.map((unit) => (
                      <AccordionItem key={unit.id} value={unit.id} className="rounded-xl border border-border/50 px-3">
                        <AccordionTrigger className="py-2.5 text-sm font-medium hover:no-underline">
                          {unit.name} ({unit.lessons.filter((l) => l.completed).length}/{unit.lessons.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1.5 pb-1">
                            {unit.lessons.map((lesson) => {
                              const TypeIcon = TYPE_ICONS[lesson.type] || FileText;
                              const isBookmarked = subject.bookmarks.includes(lesson.id);
                              return (
                                <div key={lesson.id} className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2 group">
                                  <Checkbox checked={lesson.completed} onCheckedChange={() => toggleLesson(lesson.id)} className="shrink-0" />
                                  <TypeIcon className={`h-3.5 w-3.5 shrink-0 ${lesson.completed ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                  <span className={`text-xs flex-1 truncate ${lesson.completed ? 'line-through text-muted-foreground' : ''}`}>{lesson.title}</span>
                                  <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">{lesson.duration}</span>
                                  <button onClick={() => toggleBookmark(subject.id, lesson.id)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> : <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No subjects found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </motion.div>
  );
}
