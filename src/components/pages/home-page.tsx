/*
 * Victory Hub - Home Page
 * Landing page with hero, features, testimonials, stats, FAQ
 */

'use client';

import { motion } from 'framer-motion';
import {
  Brain, BarChart3, Bot, Award, BookOpen, GraduationCap,
  ArrowRight, Star, Zap, Shield, ChevronRight, Mail, Quote,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { useAppStore } from '@/store/app-store';

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

/* ------------------------------------------------------------------
   Features data
   ------------------------------------------------------------------ */

const FEATURES = [
  { icon: Brain, title: 'Smart Study Tools', desc: 'Flashcards, quizzes, and notes to supercharge your learning.', color: 'from-amber-500 to-orange-500' },
  { icon: BarChart3, title: 'Track Progress', desc: 'Detailed analytics and insights to monitor your growth.', color: 'from-emerald-500 to-teal-500' },
  { icon: Bot, title: 'AI Assistant', desc: 'Get instant help with your study questions and concepts.', color: 'from-violet-500 to-purple-500' },
  { icon: Award, title: 'Achievement System', desc: 'Earn badges and maintain streaks to stay motivated.', color: 'from-rose-500 to-pink-500' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Medical Student', quote: 'Victory Hub completely transformed my study routine. The quiz system and flashcards helped me ace my exams!', avatar: '👩🏽‍🎓' },
  { name: 'James M.', role: 'Engineering Student', quote: 'The analytics feature shows exactly where I need to improve. My grades went up by 30% in one semester.', avatar: '👨🏿‍💻' },
  { name: 'Amina H.', role: 'High School Student', quote: 'I love the achievement system! It makes studying feel like a game. The AI assistant is incredibly helpful too.', avatar: '👩🏽‍🏫' },
];

const STATS = [
  { value: '9', label: 'Subjects', icon: BookOpen },
  { value: '150+', label: 'Lessons', icon: GraduationCap },
  { value: '60+', label: 'Quiz Questions', icon: Zap },
  { value: '∞', label: 'Flashcards', icon: Shield },
];

const FAQS = [
  { q: 'Is Victory Hub free to use?', a: 'Yes! Victory Hub is completely free and works offline. All your data is stored locally on your device.' },
  { q: 'Does it work without internet?', a: 'Absolutely. Victory Hub is designed to work fully offline. Your progress is saved in your browser.' },
  { q: 'Can I track multiple subjects?', a: 'Yes! We support 9 subjects including Mathematics, Physics, Chemistry, Biology, English, ICT, Economics, History, and Geography.' },
  { q: 'How does the AI Assistant work?', a: 'The AI Assistant provides study tips, explains concepts, and helps with homework. It generates responses locally without needing an internet connection.' },
  { q: 'Can I export my notes?', a: 'Yes! You can export your notes as text files. All your data can also be backed up and restored from the Settings page.' },
];

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export function HomePage() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-16 pb-8">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 md:p-16 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Zap className="mr-1 h-3 w-3" /> Your Learning Companion
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Unlock Your Full{' '}
            <span className="underline decoration-4 decoration-white/40 underline-offset-4">Academic Potential</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            "The beautiful thing about learning is that no one can take it away from you." — B.B. King
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-xl rounded-xl px-8" onClick={() => navigate('dashboard')}>
              Start Studying <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 rounded-xl px-8" onClick={() => navigate('subjects')}>
              <BookOpen className="mr-2 h-4 w-4" /> Explore Subjects
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Everything You Need to <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Excel</span>
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="border-0 bg-card/60 backdrop-blur-xl text-center">
                  <CardContent className="p-6">
                    <Icon className="mx-auto h-6 w-6 mb-2 text-amber-500" />
                    <p className="text-3xl font-extrabold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Loved by <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Students</span>
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="border-0 bg-card/60 backdrop-blur-xl h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{t.avatar}</span>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <Quote className="h-5 w-5 text-amber-500 mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                  <div className="mt-3 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (<Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Frequently Asked <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Questions</span>
        </motion.h2>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border-0 bg-card/60 backdrop-blur-xl px-6">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section>
        <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 md:p-12 text-center">
            <Mail className="h-10 w-10 text-amber-500" />
            <h3 className="text-2xl font-bold">Stay Motivated</h3>
            <p className="text-muted-foreground max-w-md">Get weekly study tips and motivational content delivered to keep you on track.</p>
            <div className="flex w-full max-w-sm gap-2">
              <input placeholder="Enter your email" className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/50" />
              <Button className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border pt-8 pb-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold">Victory Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">Your complete learning companion for academic excellence.</p>
          </div>
          {[
            { title: 'Learn', links: ['Subjects', 'Quiz', 'Flashcards', 'Notes'] },
            { title: 'Organize', links: ['Planner', 'Analytics', 'Achievements', 'Resources'] },
            { title: 'Account', links: ['Profile', 'Settings', 'About', 'AI Assistant'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}><button onClick={() => navigate(l.toLowerCase().replace(/ /g, '-') as any)} className="hover:text-foreground transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Victory Hub. All rights reserved. Built with ❤️ for students.
        </div>
      </footer>
    </div>
  );
}
