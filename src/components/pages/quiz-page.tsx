/*
 * Victory Hub - Quiz Page
 * Complete quiz engine with timer, scoring, review, and leaderboard
 */

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Play, RotateCcw, Clock, Trophy, Star, CheckCircle2,
  XCircle, ArrowRight, Award, ChevronRight, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';
import { QUIZ_QUESTIONS } from '@/data/quiz-data';
import { ProgressRing } from '@/components/shared/progress-ring';

/* ------------------------------------------------------------------
   Fisher-Yates shuffle
   ------------------------------------------------------------------ */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------
   Types
   ------------------------------------------------------------------ */
type Phase = 'setup' | 'playing' | 'review';

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */
export function QuizPage() {
  const { quizScores, addQuizScore, subjects } = useAppStore();

  /* State */
  const [phase, setPhase] = useState<Phase>('setup');
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<typeof QUIZ_QUESTIONS>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Available questions */
  const available = useMemo(() => {
    let q = QUIZ_QUESTIONS;
    if (subject !== 'all') q = q.filter((x) => x.subject === subject);
    if (difficulty !== 'all') q = q.filter((x) => x.difficulty === difficulty);
    return q;
  }, [subject, difficulty]);

  /* Start quiz */
  const startQuiz = () => {
    const shuffled = shuffle(available);
    const picked = shuffled.slice(0, Math.min(count, shuffled.length));
    if (picked.length === 0) return;
    setQuestions(picked);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setTimer(0);
    setShowResult(false);
    setPhase('playing');
  };

  /* Timer */
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  /* Handle answer */
  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    setAnswers((a) => [...a, idx]);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setPhase('review');
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1200);
  };

  /* Score */
  const score = useMemo(() => answers.reduce((s, a, i) => s + (a === questions[i]?.correctAnswer ? 1 : 0), 0), [answers, questions]);
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');

  /* Save score */
  const saveScore = () => {
    addQuizScore({ subject, score, total: questions.length, difficulty, date: Date.now(), answers });
  };

  /* Reset */
  const reset = () => { setPhase('setup'); setTimer(0); setAnswers([]); setCurrent(0); setSelected(null); setShowResult(false); };

  /* Leaderboard */
  const leaderboard = useMemo(() =>
    [...quizScores].sort((a, b) => (b.score / b.total) - (a.score / a.total)).slice(0, 10),
    [quizScores]
  );

  /* Subject options - dedupe across grades (e.g. g9-biology, g10-biology -> biology) */
  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    ...Array.from(
      new Map(
        subjects.map((s) => [s.id.replace(/^g\d+-/, ''), s.name])
      ).entries()
    ).map(([value, label]) => ({ value, label })),
  ];

  /* ==================================================================
     SETUP PHASE
     ================================================================== */
  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-amber-500" /> Start a Quiz</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {/* Subject */}
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{subjectOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {/* Difficulty */}
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <div className="flex gap-2">
                {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <Button key={d} size="sm" variant={difficulty === d ? 'default' : 'outline'} onClick={() => setDifficulty(d)} className="rounded-xl capitalize flex-1">
                    {d}
                  </Button>
                ))}
              </div>
            </div>
            {/* Count */}
            <div>
              <label className="text-sm font-medium mb-2 block">Questions: {count}</label>
              <input type="range" min={5} max={Math.min(20, available.length || 5)} step={5} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-amber-500" />
              <p className="text-xs text-muted-foreground mt-1">{available.length} questions available</p>
            </div>
            <Button onClick={startQuiz} disabled={available.length === 0} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90">
              <Play className="mr-2 h-4 w-4" /> Start Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500" /> Leaderboard</CardTitle></CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No quiz scores yet. Complete a quiz to appear here!</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((s, i) => {
                  const medal = i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : '';
                  const subName = subjects.find((x) => x.id === s.subject)?.name || s.subject;
                  return (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                      <span className={`text-sm font-bold w-6 text-center ${medal}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{subName}</p>
                        <p className="text-xs text-muted-foreground">{s.difficulty} · {new Date(s.date).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={s.score / s.total >= 0.8 ? 'default' : s.score / s.total >= 0.5 ? 'secondary' : 'destructive'} className="rounded-lg">
                        {s.score}/{s.total}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ==================================================================
     PLAYING PHASE
     ================================================================== */
  if (phase === 'playing' && questions[current]) {
    const q = questions[current];
    const labels = ['A', 'B', 'C', 'D'];
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Progress bar and timer */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Question {current + 1}/{questions.length}</span>
              <span className="text-muted-foreground">Score: {score}</span>
            </div>
            <Progress value={((current + 1) / questions.length) * 100} className="h-2" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
            <Clock className="h-4 w-4" /> {mins}:{secs}
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize rounded-lg">{q.subject}</Badge>
                  <Badge variant="outline" className="capitalize rounded-lg">{q.difficulty}</Badge>
                </div>
                <h3 className="text-lg font-semibold">{q.question}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    let cls = 'border-border hover:border-primary/50 hover:bg-muted/60';
                    if (showResult) {
                      if (i === q.correctAnswer) cls = 'border-emerald-500 bg-emerald-500/10';
                      else if (i === selected) cls = 'border-red-500 bg-red-500/10';
                    } else if (i === selected) {
                      cls = 'border-primary bg-primary/10';
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${cls}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold">{labels[i]}</span>
                        <span className="text-sm">{opt}</span>
                        {showResult && i === q.correctAnswer && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />}
                        {showResult && i === selected && i !== q.correctAnswer && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
                {showResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-center text-sm font-medium ${selected === q.correctAnswer ? 'text-emerald-500' : 'text-red-500'}`}>
                    {selected === q.correctAnswer ? '✓ Correct!' : `✗ Incorrect. The answer is ${labels[q.correctAnswer]}.`}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ==================================================================
     REVIEW PHASE
     ================================================================== */
  if (phase === 'review') {
    const labels = ['A', 'B', 'C', 'D'];
    const msg = pct >= 90 ? 'Outstanding! 🎉' : pct >= 70 ? 'Great job! 🌟' : pct >= 50 ? 'Good effort! 💪' : 'Keep practicing! 📚';
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Score card */}
        <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <ProgressRing progress={pct} size={130} strokeWidth={8} ringClass={pct >= 70 ? 'text-emerald-500' : 'text-amber-500'}>
              <div className="text-center">
                <p className="text-3xl font-extrabold">{pct}%</p>
                <p className="text-xs text-muted-foreground">{score}/{questions.length}</p>
              </div>
            </ProgressRing>
            <h2 className="text-2xl font-bold">{msg}</h2>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {mins}:{secs}</span>
              <span className="flex items-center gap-1"><Zap className="h-4 w-4" /> {difficulty}</span>
            </div>
            <div className="flex gap-3 mt-2">
              <Button onClick={() => { saveScore(); }} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90">
                <Award className="mr-2 h-4 w-4" /> Save Score
              </Button>
              <Button variant="outline" onClick={reset} className="rounded-xl"><RotateCcw className="mr-2 h-4 w-4" /> Try Again</Button>
            </div>
          </CardContent>
        </Card>

        {/* Review list */}
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader><CardTitle className="text-base">Review Answers</CardTitle></CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <p className="text-sm font-medium mb-2">{i + 1}. {q.question}</p>
                  <div className="space-y-1 text-xs">
                    {q.options.map((opt, j) => (
                      <p key={j} className={`flex items-center gap-2 ${j === q.correctAnswer ? 'text-emerald-500 font-medium' : j === userAns && !isCorrect ? 'text-red-500 line-through' : 'text-muted-foreground'}`}>
                        <span>{labels[j]}.</span> {opt}
                        {j === q.correctAnswer && ' ✓'}
                        {j === userAns && !isCorrect && ' ✗'}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
