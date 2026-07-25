/*
 * Victory Hub - Resources Page
 * Resource library with tab filters, search, and resource cards
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Play, Globe, Calculator, BookOpen,
  Search, Library, X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RESOURCES, type Resource } from '@/data/quiz-data';
import { toast } from 'sonner';

/* ------------------------------------------------------------------
   Type icon mapping
   ------------------------------------------------------------------ */

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  video: Play,
  website: Globe,
  formula: Calculator,
  book: BookOpen,
};

const TYPE_COLORS: Record<string, string> = {
  pdf: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  video: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  website: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  formula: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  book: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: 'bg-amber-500',
  physics: 'bg-sky-500',
  chemistry: 'bg-violet-500',
  biology: 'bg-emerald-500',
  english: 'bg-rose-500',
  ict: 'bg-cyan-500',
  economics: 'bg-orange-500',
  history: 'bg-yellow-600',
  geography: 'bg-lime-600',
};

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' as const },
  }),
};

/* ------------------------------------------------------------------
   Resource Card
   ------------------------------------------------------------------ */

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const Icon = TYPE_ICONS[resource.type] || FileText;
  const dotColor = SUBJECT_COLORS[resource.subject] || 'bg-gray-500';

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-xl cursor-pointer transition-shadow duration-300 hover:shadow-xl h-full"
        onClick={() => toast.info('Resource preview coming soon!')}
      >
        {/* Subject colour indicator bar */}
        <div className={`absolute top-0 left-0 h-1 w-full ${dotColor}`} />

        <CardContent className="p-5 pt-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${TYPE_COLORS[resource.type] || ''}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {resource.type}
            </Badge>
          </div>

          <h3 className="text-sm font-semibold leading-snug mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {resource.title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {resource.description}
          </p>

          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${dotColor}`} />
            <span className="text-[11px] capitalize text-muted-foreground">
              {resource.subject}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Resources Page
   ------------------------------------------------------------------ */

export function ResourcesPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = RESOURCES;
    if (filter !== 'all') list = list.filter((r) => r.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'pdf', label: 'PDF' },
    { value: 'video', label: 'Video' },
    { value: 'website', label: 'Website' },
    { value: 'formula', label: 'Formula' },
    { value: 'book', label: 'Book' },
  ];

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
            <Library className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Resource Library</h1>
            <p className="text-sm text-muted-foreground">Study materials and references</p>
          </div>
        </div>
      </motion.div>

      {/* ===== Search ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources by title, subject, or description..."
          className="pl-9 pr-9 rounded-xl border-0 bg-card/60 backdrop-blur-xl h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>

      {/* ===== Tabs & Grid ===== */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-muted/80 flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.value !== 'all' && (
                <span className="mr-1">
                  {(() => {
                    const Ic = TYPE_ICONS[t.value];
                    return Ic ? <Ic className="h-3.5 w-3.5" /> : null;
                  })()}
                </span>
              )}
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-muted-foreground">No resources found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Try adjusting your search or filter
                </p>
              </motion.div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((resource, i) => (
                  <ResourceCard key={resource.id} resource={resource} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
