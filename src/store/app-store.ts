/*
 * Victory Hub - Main Application Store (Zustand)
 * Central state management with localStorage persistence
 */

import { create } from 'zustand';
import { getStorage, setStorage } from '@/lib/storage';
import { SUBJECTS, type Subject, type Lesson } from '@/data/subjects-data';
import type { QuizQuestion } from '@/data/quiz-data';

/* ------------------------------------------------------------------
   Type definitions
   ------------------------------------------------------------------ */

export type PageId =
  | 'home'
  | 'dashboard'
  | 'subjects'
  | 'quiz'
  | 'flashcards'
  | 'notes'
  | 'planner'
  | 'analytics'
  | 'achievements'
  | 'resources'
  | 'profile'
  | 'settings'
  | 'ai-assistant'
  | 'about';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  favorite: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface PlannerTask {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  subject: string;
}

export interface QuizScore {
  id: string;
  subject: string;
  score: number;
  total: number;
  difficulty: string;
  date: number;
  answers: number[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  condition: string;
}

export interface StudySession {
  date: string;
  minutes: number;
  subject: string;
}

export interface DailyGoal {
  studyMinutes: number;
  lessonsCompleted: number;
  quizzesTaken: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  favoriteSubjects: string[];
  joinDate: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  pomodoroWork: number;
  pomodoroBreak: number;
  sidebarCollapsed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subjectId: string;
  chapters: number;
  notes: string;
  addedAt: number;
}

/* ------------------------------------------------------------------
   Achievements definition
   ------------------------------------------------------------------ */

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day study streak', icon: 'Flame', unlocked: false, condition: 'streak_7' },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day study streak', icon: 'Trophy', unlocked: false, condition: 'streak_30' },
  { id: 'hours-100', name: 'Centurion Scholar', description: 'Complete 100 hours of study', icon: 'Clock', unlocked: false, condition: 'hours_100' },
  { id: 'math-complete', name: 'Math Maestro', description: 'Complete all Mathematics lessons', icon: 'Calculator', unlocked: false, condition: 'complete_mathematics' },
  { id: 'bio-complete', name: 'Biology Brain', description: 'Complete all Biology lessons', icon: 'Leaf', unlocked: false, condition: 'complete_biology' },
  { id: 'phy-complete', name: 'Physics Phenom', description: 'Complete all Physics lessons', icon: 'Atom', unlocked: false, condition: 'complete_physics' },
  { id: 'quiz-10', name: 'Quiz Champion', description: 'Complete 10 quizzes', icon: 'Award', unlocked: false, condition: 'quizzes_10' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: 'Star', unlocked: false, condition: 'perfect_score' },
  { id: 'notes-20', name: 'Note Taker', description: 'Create 20 notes', icon: 'FileText', unlocked: false, condition: 'notes_20' },
  { id: 'flashcards-50', name: 'Flashcard Master', description: 'Create 50 flashcards', icon: 'Layers', unlocked: false, condition: 'flashcards_50' },
  { id: 'all-subjects', name: 'Renaissance Student', description: 'Start studying all 9 subjects', icon: 'GraduationCap', unlocked: false, condition: 'all_subjects' },
  { id: 'first-quiz', name: 'First Steps', description: 'Complete your first quiz', icon: 'Target', unlocked: false, condition: 'first_quiz' },
];

/* ------------------------------------------------------------------
   Default values
   ------------------------------------------------------------------ */

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  accentColor: '#f59e0b',
  fontSize: 'medium',
  pomodoroWork: 25,
  pomodoroBreak: 5,
  sidebarCollapsed: false,
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Student',
  avatar: '',
  bio: 'Passionate learner on Victory Hub',
  favoriteSubjects: [],
  joinDate: Date.now(),
};

const DEFAULT_DAILY_GOAL: DailyGoal = {
  studyMinutes: 60,
  lessonsCompleted: 3,
  quizzesTaken: 1,
};

/* ------------------------------------------------------------------
   Main Store
   ------------------------------------------------------------------ */

interface AppState {
  /* Navigation */
  currentPage: PageId;
  previousPage: PageId | null;
  sidebarOpen: boolean;
  searchOpen: boolean;
  searchQuery: string;

  /* Subject progress */
  subjects: Subject[];

  /* Flashcards */
  flashcards: Flashcard[];

  /* Notes */
  notes: Note[];
  noteFolders: string[];

  /* Planner */
  plannerTasks: PlannerTask[];

  /* Quiz */
  quizScores: QuizScore[];

  /* Achievements */
  achievements: Achievement[];

  /* Study tracking */
  studySessions: StudySession[];
  dailyGoal: DailyGoal;
  currentStreak: number;
  lastStudyDate: string | null;

  /* Profile */
  profile: UserProfile;

  /* Settings */
  settings: AppSettings;

  /* AI Chat */
  chatMessages: ChatMessage[];

  /* Recent activity */
  recentActivity: { action: string; detail: string; timestamp: number }[];

  /* Books */
  books: Book[];

  /* ===== Actions ===== */
  navigate: (page: PageId) => void;
  goBack: () => void;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;

  /* Subject actions */
  toggleLesson: (lessonId: string) => void;
  toggleBookmark: (subjectId: string, lessonId: string) => void;
  getSubjectProgress: (subjectId: string) => number;
  addSubject: (subject: Omit<Subject, 'id' | 'progress' | 'bookmarks'>) => void;
  deleteSubject: (id: string) => void;

  /* Book actions */
  addBook: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  deleteBook: (id: string) => void;

  /* Flashcard actions */
  addFlashcard: (front: string, back: string, category: string) => void;
  deleteFlashcard: (id: string) => void;
  toggleFlashcardFavorite: (id: string) => void;

  /* Note actions */
  addNote: (title: string, content: string, folder: string, category: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  addFolder: (name: string) => void;
  deleteFolder: (name: string) => void;

  /* Planner actions */
  addTask: (task: Omit<PlannerTask, 'id' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<PlannerTask>) => void;
  deleteTask: (id: string) => void;

  /* Quiz actions */
  addQuizScore: (score: Omit<QuizScore, 'id'>) => void;

  /* Study tracking */
  addStudySession: (minutes: number, subject: string) => void;
  updateDailyGoal: (goal: Partial<DailyGoal>) => void;

  /* Profile actions */
  updateProfile: (updates: Partial<UserProfile>) => void;

  /* Settings actions */
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetAllData: () => void;
  importData: (json: string) => boolean;

  /* Chat actions */
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;

  /* Achievement checking */
  checkAchievements: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  /* --- Initial state loaded from localStorage --- */
  currentPage: 'home',
  previousPage: null,
  sidebarOpen: false,
  searchOpen: false,
  searchQuery: '',

  subjects: getStorage<Subject[]>('subjects', SUBJECTS),
  flashcards: getStorage<Flashcard[]>('flashcards', []),
  notes: getStorage<Note[]>('notes', []),
  noteFolders: getStorage<string[]>('noteFolders', ['General', 'School', 'Personal']),
  plannerTasks: getStorage<PlannerTask[]>('plannerTasks', []),
  quizScores: getStorage<QuizScore[]>('quizScores', []),
  achievements: getStorage<Achievement[]>('achievements', DEFAULT_ACHIEVEMENTS),
  studySessions: getStorage<StudySession[]>('studySessions', []),
  dailyGoal: getStorage<DailyGoal>('dailyGoal', DEFAULT_DAILY_GOAL),
  currentStreak: getStorage<number>('currentStreak', 0),
  lastStudyDate: getStorage<string | null>('lastStudyDate', null),
  profile: getStorage<UserProfile>('profile', DEFAULT_PROFILE),
  settings: getStorage<AppSettings>('settings', DEFAULT_SETTINGS),
  chatMessages: getStorage<ChatMessage[]>('chatMessages', []),
  recentActivity: getStorage<{ action: string; detail: string; timestamp: number }[]>('recentActivity', []),
  books: getStorage<Book[]>('books', []),

  /* ===== Navigation ===== */
  navigate: (page) => {
    const { currentPage } = get();
    set({ currentPage: page, previousPage: currentPage, sidebarOpen: false });
  },
  goBack: () => {
    const { previousPage } = get();
    if (previousPage) set({ currentPage: previousPage, previousPage: null });
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  /* ===== Subject Actions ===== */
  toggleLesson: (lessonId) => {
    const updated = get().subjects.map((subject) => ({
      ...subject,
      units: subject.units.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
        ),
      })),
    }));
    set({ subjects: updated });
    setStorage('subjects', updated);
    get().checkAchievements();
  },

  toggleBookmark: (subjectId, lessonId) => {
    const updated = get().subjects.map((s) => {
      if (s.id !== subjectId) return s;
      const bookmarks = s.bookmarks.includes(lessonId)
        ? s.bookmarks.filter((b) => b !== lessonId)
        : [...s.bookmarks, lessonId];
      return { ...s, bookmarks };
    });
    set({ subjects: updated });
    setStorage('subjects', updated);
  },

  getSubjectProgress: (subjectId) => {
    const subject = get().subjects.find((s) => s.id === subjectId);
    if (!subject) return 0;
    const total = subject.units.reduce((acc, u) => acc + u.lessons.length, 0);
    const completed = subject.units.reduce(
      (acc, u) => acc + u.lessons.filter((l) => l.completed).length,
      0
    );
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  },

  addSubject: (subject) => {
    const newSubject: Subject = {
      ...subject,
      id: `subj-${Date.now()}`,
      progress: 0,
      bookmarks: [],
    };
    const updated = [...get().subjects, newSubject];
    set({ subjects: updated });
    setStorage('subjects', updated);
    get().addActivity('Added subject', subject.name);
  },

  deleteSubject: (id) => {
    const updated = get().subjects.filter((s) => s.id !== id);
    set({ subjects: updated });
    setStorage('subjects', updated);
    /* Also remove books linked to this subject */
    const booksUpdated = get().books.filter((b) => b.subjectId !== id);
    set({ books: booksUpdated });
    setStorage('books', booksUpdated);
    get().addActivity('Deleted subject', id);
  },

  addBook: (book) => {
    const newBook: Book = { ...book, id: `book-${Date.now()}`, addedAt: Date.now() };
    const updated = [...get().books, newBook];
    set({ books: updated });
    setStorage('books', updated);
    get().addActivity('Added book', book.title);
  },

  deleteBook: (id) => {
    const updated = get().books.filter((b) => b.id !== id);
    set({ books: updated });
    setStorage('books', updated);
  },

  /* ===== Flashcard Actions ===== */
  addFlashcard: (front, back, category) => {
    const card: Flashcard = {
      id: `fc-${Date.now()}`,
      front,
      back,
      category,
      favorite: false,
      createdAt: Date.now(),
    };
    const updated = [...get().flashcards, card];
    set({ flashcards: updated });
    setStorage('flashcards', updated);
    get().addActivity('Created flashcard', front);
    get().checkAchievements();
  },

  deleteFlashcard: (id) => {
    const updated = get().flashcards.filter((c) => c.id !== id);
    set({ flashcards: updated });
    setStorage('flashcards', updated);
  },

  toggleFlashcardFavorite: (id) => {
    const updated = get().flashcards.map((c) =>
      c.id === id ? { ...c, favorite: !c.favorite } : c
    );
    set({ flashcards: updated });
    setStorage('flashcards', updated);
  },

  /* ===== Note Actions ===== */
  addNote: (title, content, folder, category) => {
    const note: Note = {
      id: `note-${Date.now()}`,
      title,
      content,
      folder,
      category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [note, ...get().notes];
    set({ notes: updated });
    setStorage('notes', updated);
    get().addActivity('Created note', title);
    get().checkAchievements();
  },

  updateNote: (id, title, content) => {
    const updated = get().notes.map((n) =>
      n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n
    );
    set({ notes: updated });
    setStorage('notes', updated);
  },

  deleteNote: (id) => {
    const updated = get().notes.filter((n) => n.id !== id);
    set({ notes: updated });
    setStorage('notes', updated);
  },

  addFolder: (name) => {
    const folders = [...get().noteFolders, name];
    set({ noteFolders: folders });
    setStorage('noteFolders', folders);
  },

  deleteFolder: (name) => {
    if (name === 'General') return;
    const folders = get().noteFolders.filter((f) => f !== name);
    set({ noteFolders: folders });
    setStorage('noteFolders', folders);
  },

  /* ===== Planner Actions ===== */
  addTask: (task) => {
    const newTask: PlannerTask = { ...task, id: `task-${Date.now()}`, completed: false };
    const updated = [...get().plannerTasks, newTask];
    set({ plannerTasks: updated });
    setStorage('plannerTasks', updated);
  },

  updateTask: (id, updates) => {
    const updated = get().plannerTasks.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    set({ plannerTasks: updated });
    setStorage('plannerTasks', updated);
  },

  deleteTask: (id) => {
    const updated = get().plannerTasks.filter((t) => t.id !== id);
    set({ plannerTasks: updated });
    setStorage('plannerTasks', updated);
  },

  /* ===== Quiz Actions ===== */
  addQuizScore: (score) => {
    const newScore: QuizScore = { ...score, id: `qs-${Date.now()}` };
    const updated = [...get().quizScores, newScore];
    set({ quizScores: updated });
    setStorage('quizScores', updated);
    get().addActivity('Completed quiz', `${score.subject} - ${score.score}/${score.total}`);
    get().checkAchievements();
  },

  /* ===== Study Tracking ===== */
  addStudySession: (minutes, subject) => {
    const today = new Date().toISOString().split('T')[0];
    const sessions = [...get().studySessions, { date: today, minutes, subject }];
    set({ studySessions: sessions });
    setStorage('studySessions', sessions);

    /* Streak logic */
    const { lastStudyDate, currentStreak } = get();
    if (lastStudyDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastStudyDate === yesterday ? currentStreak + 1 : 1;
    set({ currentStreak: newStreak, lastStudyDate: today });
    setStorage('currentStreak', newStreak);
    setStorage('lastStudyDate', today);
    get().checkAchievements();
  },

  updateDailyGoal: (goal) => {
    const updated = { ...get().dailyGoal, ...goal };
    set({ dailyGoal: updated });
    setStorage('dailyGoal', updated);
  },

  /* ===== Profile ===== */
  updateProfile: (updates) => {
    const updated = { ...get().profile, ...updates };
    set({ profile: updated });
    setStorage('profile', updated);
  },

  /* ===== Settings ===== */
  updateSettings: (settings) => {
    const updated = { ...get().settings, ...settings };
    set({ settings: updated });
    setStorage('settings', updated);
  },

  resetAllData: () => {
    if (typeof window !== 'undefined') {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith('victoryhub_')) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
    }
    set({
      subjects: SUBJECTS,
      flashcards: [],
      notes: [],
      noteFolders: ['General', 'School', 'Personal'],
      plannerTasks: [],
      quizScores: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      studySessions: [],
      dailyGoal: DEFAULT_DAILY_GOAL,
      currentStreak: 0,
      lastStudyDate: null,
      profile: DEFAULT_PROFILE,
      settings: DEFAULT_SETTINGS,
      chatMessages: [],
      recentActivity: [],
      books: [],
    });
  },

  importData: (json) => {
    try {
      const data = JSON.parse(json) as Record<string, unknown>;
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith('victoryhub_')) {
          localStorage.setItem(k, JSON.stringify(v));
        }
      }
      return true;
    } catch {
      return false;
    }
  },

  /* ===== Chat ===== */
  addChatMessage: (role, content) => {
    const msg: ChatMessage = { id: `msg-${Date.now()}`, role, content, timestamp: Date.now() };
    const updated = [...get().chatMessages, msg];
    set({ chatMessages: updated });
    setStorage('chatMessages', updated);
  },

  clearChat: () => {
    set({ chatMessages: [] });
    setStorage('chatMessages', []);
  },

  /* ===== Internal helpers ===== */
  addActivity: (action: string, detail: string) => {
    const activity = { action, detail, timestamp: Date.now() };
    const updated = [activity, ...get().recentActivity].slice(0, 50);
    set({ recentActivity: updated });
    setStorage('recentActivity', updated);
  },

  /* ===== Achievement Checking ===== */
  checkAchievements: () => {
    const state = get();
    const updated = state.achievements.map((a) => {
      if (a.unlocked) return a;
      let unlocked = false;
      switch (a.condition) {
        case 'streak_7':
          unlocked = state.currentStreak >= 7;
          break;
        case 'streak_30':
          unlocked = state.currentStreak >= 30;
          break;
        case 'hours_100':
          unlocked = state.studySessions.reduce((sum, s) => sum + s.minutes, 0) >= 6000;
          break;
        case 'complete_mathematics':
          unlocked = state.getSubjectProgress('mathematics') === 100;
          break;
        case 'complete_biology':
          unlocked = state.getSubjectProgress('biology') === 100;
          break;
        case 'complete_physics':
          unlocked = state.getSubjectProgress('physics') === 100;
          break;
        case 'quizzes_10':
          unlocked = state.quizScores.length >= 10;
          break;
        case 'perfect_score':
          unlocked = state.quizScores.some(
            (s) => s.score === s.total && s.total > 0
          );
          break;
        case 'notes_20':
          unlocked = state.notes.length >= 20;
          break;
        case 'flashcards_50':
          unlocked = state.flashcards.length >= 50;
          break;
        case 'all_subjects': {
          const subjectsStarted = state.subjects.filter((s) => {
            const lessons = s.units.flatMap((u) => u.lessons);
            return lessons.some((l) => l.completed);
          }).length;
          unlocked = subjectsStarted >= 9;
          break;
        }
        case 'first_quiz':
          unlocked = state.quizScores.length >= 1;
          break;
      }
      return unlocked ? { ...a, unlocked: true, unlockedAt: Date.now() } : a;
    });
    set({ achievements: updated });
    setStorage('achievements', updated);
  },
}));
