/*
 * Victory Hub - Subjects & Books Page
 * Browse subjects with add/delete, manage books per subject
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Monitor,
  TrendingUp, Landmark, Globe, Search, Grid3X3, List, Video,
  FileText, Dumbbell, Brain, Bookmark, BookmarkCheck, ChevronDown,
  Plus, Trash2, BookMarked, X, Library,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';
import { ProgressRing } from '@/components/shared/progress-ring';
import { GRADES } from '@/data/subjects-data';

/* ------------------------------------------------------------------
   Icon mapping
   ------------------------------------------------------------------ */
const ICON_MAP: Record<string, React.ElementType> = {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Monitor, TrendingUp, Landmark, Globe,
};

const TYPE_ICONS: Record<string, React.ElementType> = { video: Video, reading: FileText, exercise: Dumbbell, quiz: Brain };

const GRADIENT_OPTIONS = [
  { label: 'Amber', value: 'from-amber-500 to-orange-600' },
  { label: 'Emerald', value: 'from-emerald-500 to-teal-600' },
  { label: 'Rose', value: 'from-rose-500 to-pink-600' },
  { label: 'Violet', value: 'from-violet-500 to-purple-600' },
  { label: 'Cyan', value: 'from-cyan-500 to-blue-600' },
  { label: 'Orange', value: 'from-orange-500 to-red-500' },
  { label: 'Sky', value: 'from-sky-500 to-indigo-600' },
  { label: 'Lime', value: 'from-lime-500 to-green-600' },
];

/* ------------------------------------------------------------------
   Animation
   ------------------------------------------------------------------ */
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } };

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */
export function SubjectsPage() {
  const { subjects, books, toggleLesson, toggleBookmark, getSubjectProgress, addSubject, deleteSubject, addBook, deleteBook } = useAppStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('subjects');
  const [activeGrade, setActiveGrade] = useState<number>(GRADES[0]);

  /* ---- Add Subject Dialog ---- */
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('BookOpen');
  const [newGradient, setNewGradient] = useState(GRADIENT_OPTIONS[0].value);

  /* ---- Delete Subject Dialog ---- */
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /* ---- Add Book Dialog ---- */
  const [showAddBook, setShowAddBook] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookSubjectId, setBookSubjectId] = useState('');
  const [bookChapters, setBookChapters] = useState('');
  const [bookNotes, setBookNotes] = useState('');

  /* ---- Delete Book Dialog ---- */
  const [deleteBookTarget, setDeleteBookTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const byGrade = subjects.filter((s) => s.grade === activeGrade);
    if (!search) return byGrade;
    const q = search.toLowerCase();
    return byGrade.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [subjects, search, activeGrade]);

  const filteredBooks = useMemo(() => {
    if (!search) return books;
    const q = search.toLowerCase();
    return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }, [books, search]);

  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || 'Unknown';

  const handleAddSubject = () => {
    if (!newName.trim()) return;
    addSubject({
      grade: activeGrade,
      name: newName.trim(),
      icon: newIcon,
      color: '#f59e0b',
      gradient: newGradient,
      description: newDesc.trim() || 'Custom subject',
      units: [],
    });
    setNewName(''); setNewDesc(''); setNewIcon('BookOpen'); setNewGradient(GRADIENT_OPTIONS[0].value);
    setShowAddSubject(false);
  };

  const handleAddBook = () => {
    if (!bookTitle.trim() || !bookSubjectId) return;
    addBook({
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      subjectId: bookSubjectId,
      chapters: parseInt(bookChapters) || 0,
      notes: bookNotes.trim(),
    });
    setBookTitle(''); setBookAuthor(''); setBookSubjectId(''); setBookChapters(''); setBookNotes('');
    setShowAddBook(false);
  };

  return (
    <>
      {/* ====== DIALOGS ====== */}
      {/* Add Subject Dialog */}
      <Dialog open={showAddSubject} onOpenChange={setShowAddSubject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>Create a custom subject to track your studies. It will be added under Grade {activeGrade}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="subj-name">Subject Name</Label>
              <Input id="subj-name" placeholder="e.g. Civics & Ethical Education" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subj-desc">Description</Label>
              <Textarea id="subj-desc" placeholder="Brief description of this subject..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <div className="flex flex-wrap gap-2">
                {GRADIENT_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setNewGradient(g.value)}
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${g.value} transition-all ${newGradient === g.value ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'opacity-60 hover:opacity-100'}`}
                    aria-label={g.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubject(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAddSubject} disabled={!newName.trim()} className="rounded-xl">Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this subject and all linked books. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteTarget) { deleteSubject(deleteTarget); setDeleteTarget(null); } }} className="rounded-xl bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Book Dialog */}
      <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>Add a textbook to your study library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="book-title">Book Title</Label>
              <Input id="book-title" placeholder="e.g. Grade 11 Mathematics Textbook" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-author">Author</Label>
              <Input id="book-author" placeholder="Author name (optional)" value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-subject">Subject</Label>
              <Select value={bookSubjectId} onValueChange={setBookSubjectId}>
                <SelectTrigger id="book-subject" className="rounded-xl">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>Grade {s.grade} - {s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-chapters">Number of Chapters</Label>
              <Input id="book-chapters" type="number" min="0" placeholder="e.g. 12" value={bookChapters} onChange={(e) => setBookChapters(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-notes">Notes (optional)</Label>
              <Textarea id="book-notes" placeholder="Any notes about this book..." value={bookNotes} onChange={(e) => setBookNotes(e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBook(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAddBook} disabled={!bookTitle.trim() || !bookSubjectId} className="rounded-xl">Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Confirmation */}
      <AlertDialog open={!!deleteBookTarget} onOpenChange={(open) => !open && setDeleteBookTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this book from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteBookTarget) { deleteBook(deleteBookTarget); setDeleteBookTarget(null); } }} className="rounded-xl bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ====== MAIN CONTENT ====== */}
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <TabsList className="rounded-xl">
              <TabsTrigger value="subjects" className="rounded-lg gap-1.5">
                <BookOpen className="h-4 w-4" /> Subjects ({filtered.length})
              </TabsTrigger>
              <TabsTrigger value="books" className="rounded-lg gap-1.5">
                <Library className="h-4 w-4" /> Books ({books.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2 items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={activeTab === 'subjects' ? 'Search subjects...' : 'Search books...'} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl bg-card/60 backdrop-blur-xl border-0" />
              </div>
              {activeTab === 'subjects' && (
                <div className="flex gap-1 rounded-xl bg-muted/60 p-1">
                  <Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} className="rounded-lg h-8"><Grid3X3 className="h-4 w-4" /></Button>
                  <Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="rounded-lg h-8"><List className="h-4 w-4" /></Button>
                </div>
              )}
              <Button size="sm" onClick={() => activeTab === 'subjects' ? setShowAddSubject(true) : setShowAddBook(true)} className="rounded-xl h-9 gap-1.5">
                <Plus className="h-4 w-4" /> {activeTab === 'subjects' ? 'Add Subject' : 'Add Book'}
              </Button>
            </div>
          </div>

          {/* ====== SUBJECTS TAB ====== */}
          <TabsContent value="subjects" className="mt-6">
            {/* Grade selector */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGrade(g)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    activeGrade === g
                      ? 'bg-foreground text-background'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
            <div className={view === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
              <AnimatePresence>
                {filtered.map((subject, idx) => {
                  const Icon = ICON_MAP[subject.icon] || BookOpen;
                  const prog = getSubjectProgress(subject.id);
                  const totalLessons = subject.units.reduce((a, u) => a + u.lessons.length, 0);
                  const completedLessons = subject.units.reduce((a, u) => a + u.lessons.filter((l) => l.completed).length, 0);

                  return (
                    <motion.div key={subject.id} custom={idx} variants={fadeUp} exit={{ opacity: 0, scale: 0.95 }}>
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
                            <div className="flex items-center gap-2">
                              <ProgressRing progress={prog} size={48} strokeWidth={3} ringClass="text-white" textClass="text-white" showLabel>
                                <span className="text-xs font-bold text-white" />
                              </ProgressRing>
                              <button
                                onClick={() => setDeleteTarget(subject.id)}
                                className="rounded-lg p-1.5 bg-white/15 hover:bg-red-500/80 transition-colors"
                                aria-label={`Delete ${subject.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
                          <Progress value={prog} className="h-1.5 mb-1" />
                          <p className="text-xs text-muted-foreground mb-4">{completedLessons}/{totalLessons} completed</p>

                          {/* Units accordion */}
                          {subject.units.length > 0 && (
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
                                          <div key={lesson.id} className="flex items-start gap-2 rounded-lg bg-muted/40 px-2.5 py-2 group">
                                            <Checkbox checked={lesson.completed} onCheckedChange={() => toggleLesson(lesson.id)} className="shrink-0 mt-0.5" />
                                            <TypeIcon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${lesson.completed ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium truncate ${lesson.completed ? 'line-through text-muted-foreground' : ''}`}>{lesson.title}</span>
                                                <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">{lesson.duration}</span>
                                              </div>
                                              {lesson.summary && (
                                                <p className="text-[11px] text-muted-foreground/80 mt-0.5 leading-snug">{lesson.summary}</p>
                                              )}
                                            </div>
                                            <button onClick={() => toggleBookmark(subject.id, lesson.id)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
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
                          )}

                          {subject.units.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">No units yet. This is a custom subject.</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-40" />
                <p className="text-lg font-medium">No subjects found</p>
                <p className="text-sm">Try a different search term or add a new subject</p>
              </div>
            )}
          </TabsContent>

          {/* ====== BOOKS TAB ====== */}
          <TabsContent value="books" className="mt-6">
            <div className="space-y-3">
              <AnimatePresence>
                {filteredBooks.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
                    <BookMarked className="mx-auto h-12 w-12 mb-4 opacity-40" />
                    <p className="text-lg font-medium">No books yet</p>
                    <p className="text-sm">Add your textbooks to track your study materials</p>
                  </motion.div>
                )}

                {filteredBooks.map((book) => {
                  const subject = subjects.find((s) => s.id === book.subjectId);
                  const subjectName = subject?.name || 'Unknown Subject';
                  const gradient = subject?.gradient || 'from-gray-500 to-gray-600';
                  const SubjectIcon = subject ? (ICON_MAP[subject.icon] || BookOpen) : BookOpen;

                  return (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-0 bg-card/60 backdrop-blur-xl hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                            <SubjectIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate">{book.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{book.author}{book.chapters > 0 ? ` · ${book.chapters} chapters` : ''}</p>
                            {book.notes && <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{book.notes}</p>}
                          </div>
                          <Badge variant="secondary" className="rounded-lg shrink-0 hidden sm:inline-flex">
                            {subjectName}
                          </Badge>
                          <button
                            onClick={() => setDeleteBookTarget(book.id)}
                            className="rounded-lg p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                            aria-label={`Delete ${book.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

    </motion.div>
    </>
  );
}
