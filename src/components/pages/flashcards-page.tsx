/*
 * Victory Hub - Flashcards Page
 * Create, study, search, and manage flashcards with flip animation
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Shuffle, Star, Trash2, Grid3X3, List,
  Heart, Layers, Filter, X, Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */
const stagger = { visible: { transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

/* ------------------------------------------------------------------
   Single Flashcard Component
   ------------------------------------------------------------------ */
function FlashcardCard({ card, onDelete, onFavorite }: {
  card: ReturnType<typeof useAppStore.getState>['flashcards'][0];
  onDelete: () => void;
  onFavorite: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-[1000px] cursor-pointer group" onClick={() => setFlipped(!flipped)}>
      <div
        className={cn(
          'relative transition-transform duration-500 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]',
        )}
        style={{ minHeight: '180px' }}
      >
        {/* Front */}
        <div className="[backface-visibility:hidden] absolute inset-0 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="rounded-lg text-[10px]">{card.category || 'General'}</Badge>
            <button onClick={(e) => { e.stopPropagation(); onFavorite(); }} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <Heart className={cn('h-4 w-4', card.favorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground')} />
            </button>
          </div>
          <p className="text-sm font-medium flex-1 flex items-center">{card.front}</p>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">Click to flip</p>
        </div>

        {/* Back */}
        <div className="[backface-visibility:hidden] [transform:rotateY(180deg)] absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge className="rounded-lg text-[10px] bg-amber-500/20 text-amber-600 border-0">Answer</Badge>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
            </button>
          </div>
          <p className="text-sm flex-1 flex items-center">{card.back}</p>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">Click to flip back</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Flashcards Page
   ------------------------------------------------------------------ */
export function FlashcardsPage() {
  const { flashcards, addFlashcard, deleteFlashcard, toggleFlashcardFavorite } = useAppStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [shuffled, setShuffled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  /* Categories */
  const categories = useMemo(() => {
    const cats = new Set(flashcards.map((c) => c.category));
    return ['all', ...Array.from(cats).sort()];
  }, [flashcards]);

  /* Filtered cards */
  const filtered = useMemo(() => {
    let cards = [...flashcards];
    if (search) { const q = search.toLowerCase(); cards = cards.filter((c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)); }
    if (category !== 'all') cards = cards.filter((c) => c.category === category);
    if (showFavorites) cards = cards.filter((c) => c.favorite);
    if (shuffled) cards = [...cards].sort(() => Math.random() - 0.5);
    return cards;
  }, [flashcards, search, category, showFavorites, shuffled]);

  /* Create */
  const handleCreate = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    addFlashcard(newFront.trim(), newBack.trim(), newCategory);
    setNewFront(''); setNewBack(''); setDialogOpen(false);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Toolbar */}
      <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search flashcards..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl bg-card/60 backdrop-blur-xl border-0" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36 rounded-xl h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c} className="capitalize">{c === 'all' ? 'All Categories' : c}</SelectItem>)}</SelectContent>
          </Select>
          <Button size="sm" variant={showFavorites ? 'default' : 'outline'} onClick={() => setShowFavorites(!showFavorites)} className="rounded-xl h-9">
            <Heart className="h-3.5 w-3.5 mr-1" /> Favorites
          </Button>
          <Button size="sm" variant={shuffled ? 'default' : 'outline'} onClick={() => setShuffled(!shuffled)} className="rounded-xl h-9">
            <Shuffle className="h-3.5 w-3.5" />
          </Button>
          <div className="flex gap-0.5 rounded-lg bg-muted/60 p-0.5">
            <Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} className="rounded-md h-8 w-8 p-0"><Grid3X3 className="h-3.5 w-3.5" /></Button>
            <Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="rounded-md h-8 w-8 p-0"><List className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </motion.div>

      {/* Create button */}
      <motion.div variants={fadeUp} className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" /> New Flashcard
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>Create Flashcard</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><label className="text-sm font-medium mb-1 block">Front</label><Input value={newFront} onChange={(e) => setNewFront(e.target.value)} placeholder="Enter question or term..." className="rounded-xl" /></div>
              <div><label className="text-sm font-medium mb-1 block">Back</label><Input value={newBack} onChange={(e) => setNewBack(e.target.value)} placeholder="Enter answer or definition..." className="rounded-xl" /></div>
              <div><label className="text-sm font-medium mb-1 block">Category</label><Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Mathematics" className="rounded-xl" /></div>
              <Button onClick={handleCreate} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Cards grid/list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Layers className="mx-auto h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No flashcards yet</p>
          <p className="text-sm">Create your first flashcard to get started</p>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>
          {filtered.map((card) => (
            <motion.div key={card.id} variants={fadeUp}>
              {view === 'grid' ? (
                <FlashcardCard card={card} onDelete={() => deleteFlashcard(card.id)} onFavorite={() => toggleFlashcardFavorite(card.id)} />
              ) : (
                <Card className="border-0 bg-card/60 backdrop-blur-xl">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{card.front}</p>
                      <p className="text-xs text-muted-foreground truncate">{card.back}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-lg text-[10px] shrink-0">{card.category}</Badge>
                    <button onClick={() => toggleFlashcardFavorite(card.id)}>
                      <Heart className={cn('h-4 w-4', card.favorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground')} />
                    </button>
                    <button onClick={() => deleteFlashcard(card.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" /></button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Count */}
      <p className="text-center text-xs text-muted-foreground">Showing {filtered.length} of {flashcards.length} flashcards</p>
    </motion.div>
  );
}
