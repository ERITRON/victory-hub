/*
 * Victory Hub - Notes Page
 * Rich text notes with folders, search, autosave, and export
 */

'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, FolderOpen, Trash2, Download, Search, Edit,
  Clock, Tag, ChevronLeft, Bold, Italic, Heading, Save, FolderPlus, X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';

/* ------------------------------------------------------------------
   Animation
   ------------------------------------------------------------------ */
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

/* ------------------------------------------------------------------
   Notes Page
   ------------------------------------------------------------------ */
export function NotesPage() {
  const { notes, noteFolders, addNote, updateNote, deleteNote, addFolder, deleteFolder } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  /* Filtered notes */
  const filtered = useMemo(() => {
    let n = [...notes];
    if (folderFilter !== 'all') n = n.filter((x) => x.folder === folderFilter);
    if (search) { const q = search.toLowerCase(); n = n.filter((x) => x.title.toLowerCase().includes(q) || x.content.toLowerCase().includes(q)); }
    return n;
  }, [notes, folderFilter, search]);

  const selected = notes.find((n) => n.id === selectedId);

  /* Auto-select first note */
  useEffect(() => {
    if (!selectedId && notes.length > 0) setSelectedId(notes[0].id);
  }, [notes, selectedId]);

  /* Autosave */
  const handleContentChange = useCallback((content: string) => {
    if (!selectedId) return;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => updateNote(selectedId, selected?.title || 'Untitled', content), 1000);
  }, [selectedId, selected?.title, updateNote]);

  const handleTitleChange = useCallback((title: string) => {
    if (!selectedId) return;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => updateNote(selectedId, title, selected?.content || ''), 1000);
  }, [selectedId, selected?.content, updateNote]);

  /* Create note */
  const createNote = () => {
    const folder = folderFilter !== 'all' ? folderFilter : 'General';
    addNote('Untitled Note', '', folder, 'General');
  };

  /* Export note */
  const exportNote = () => {
    if (!selected) return;
    const blob = new Blob([`# ${selected.title}\n\n${selected.content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${selected.title}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  /* Create folder */
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName(''); setShowNewFolder(false);
  };

  /* Insert markdown formatting */
  const insertFormat = (prefix: string, suffix: string) => {
    const ta = document.getElementById('note-editor') as HTMLTextAreaElement | null;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    ta.value = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    ta.focus();
    handleContentChange(ta.value);
  };

  /* Time ago helper */
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* ===== Sidebar ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="shrink-0 overflow-hidden">
            <Card className="border-0 bg-card/60 backdrop-blur-xl h-full flex flex-col">
              <CardContent className="p-3 flex flex-col flex-1 gap-3 overflow-hidden">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 rounded-lg text-xs" />
                </div>

                {/* Folders */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Folders</p>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShowNewFolder(!showNewFolder)}><FolderPlus className="h-3.5 w-3.5" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={folderFilter === 'all' ? 'default' : 'secondary'} className="cursor-pointer text-[10px] rounded-lg" onClick={() => setFolderFilter('all')}>All</Badge>
                    {noteFolders.map((f) => (
                      <Badge key={f} variant={folderFilter === f ? 'default' : 'secondary'} className="cursor-pointer text-[10px] rounded-lg group" onClick={() => setFolderFilter(f)}>
                        {f}
                        {f !== 'General' && <button onClick={(e) => { e.stopPropagation(); deleteFolder(f); }} className="ml-1 opacity-0 group-hover:opacity-100"><X className="h-2.5 w-2.5" /></button>}
                      </Badge>
                    ))}
                  </div>
                  {showNewFolder && (
                    <div className="flex gap-1">
                      <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createFolder()} placeholder="Folder name" className="h-7 text-xs rounded-lg" autoFocus />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={createFolder}><Plus className="h-3 w-3" /></Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Note list */}
                <ScrollArea className="flex-1">
                  <div className="space-y-1">
                    {filtered.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => setSelectedId(note.id)}
                        className={`w-full text-left rounded-lg p-2.5 transition-colors ${selectedId === note.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60'}`}
                      >
                        <p className="text-xs font-medium truncate">{note.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{note.content.substring(0, 50) || 'Empty note'}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" /> {timeAgo(note.updatedAt)}
                          <Tag className="h-2.5 w-2.5" /> {note.folder}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Editor ===== */}
      <Card className="border-0 bg-card/60 backdrop-blur-xl flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSidebarOpen(!sidebarOpen)}><ChevronLeft className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} /></Button>
              <Separator orientation="vertical" className="h-5" />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => insertFormat('**', '**')} title="Bold"><Bold className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => insertFormat('*', '*')} title="Italic"><Italic className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => insertFormat('## ', '')} title="Heading"><Heading className="h-4 w-4" /></Button>
              <div className="ml-auto flex items-center gap-1">
                <Select value={selected.folder} onValueChange={(v) => { updateNote(selected.id, selected.title, selected.content); addFolder(v); updateNote(selected.id, selected.title, selected.content); }}>
                  <SelectTrigger className="w-28 h-8 text-xs rounded-lg"><FolderOpen className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
                  <SelectContent>{noteFolders.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={exportNote} title="Export"><Download className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => setDeleteDialog(selected.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Title */}
            <div className="px-6 pt-4">
              <input
                ref={titleRef}
                value={selected.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-xl font-bold bg-transparent outline-none placeholder:text-muted-foreground/50"
                placeholder="Note title..."
              />
              <p className="text-xs text-muted-foreground mt-1">Last edited {timeAgo(selected.updatedAt)}</p>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-3">
              <textarea
                id="note-editor"
                defaultValue={selected.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:text-muted-foreground/50"
                placeholder="Start writing... (supports **bold** and *italic* markdown)"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">No note selected</p>
            <Button onClick={createNote} className="mt-4 rounded-xl"><Plus className="mr-2 h-4 w-4" /> Create Note</Button>
          </div>
        )}
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader><AlertDialogTitle>Delete Note?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteDialog) { deleteNote(deleteDialog); setSelectedId(null); setDeleteDialog(null); } }} className="rounded-xl bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
