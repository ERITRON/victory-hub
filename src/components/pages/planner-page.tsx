/*
 * Victory Hub - Study Planner Page
 * Monthly calendar, weekly/daily views, task CRUD with priority & subject
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays, CalendarRange, CalendarCheck, Plus, Trash2,
  Clock, AlertCircle, ChevronLeft, ChevronRight, Filter,
  ListChecks, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useAppStore, type PlannerTask } from '@/store/app-store';

/* ------------------------------------------------------------------
   Animation
   ------------------------------------------------------------------ */
const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------ */
const PRIORITY_COLORS: Record<PlannerTask['priority'], { dot: string; bg: string; text: string; label: string }> = {
  urgent:  { dot: 'bg-red-500',     bg: 'bg-red-500/10',     text: 'text-red-500',     label: 'Urgent' },
  high:    { dot: 'bg-orange-500',  bg: 'bg-orange-500/10',  text: 'text-orange-500',  label: 'High' },
  medium:  { dot: 'bg-amber-500',   bg: 'bg-amber-500/10',   text: 'text-amber-500',   label: 'Medium' },
  low:     { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: 'Low' },
};

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'ICT', 'Economics', 'History', 'Geography', 'General',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // adjust for Monday start
  const monday = new Date(d);
  monday.setDate(d.getDate() - diff);
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd;
  });
}

/* ------------------------------------------------------------------
   Planner Page
   ------------------------------------------------------------------ */
export function PlannerPage() {
  const { plannerTasks, addTask, updateTask, deleteTask } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('month');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  /* Add task form state */
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(formatDate(new Date()));
  const [newTime, setNewTime] = useState('09:00');
  const [newPriority, setNewPriority] = useState<PlannerTask['priority']>('medium');
  const [newSubject, setNewSubject] = useState('General');

  /* Helpers */
  const todayStr = formatDate(new Date());

  const tasksByDate = useMemo(() => {
    const map: Record<string, PlannerTask[]> = {};
    for (const t of plannerTasks) {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [plannerTasks]);

  const filteredTasks = useMemo(() => {
    let tasks = tasksByDate[formatDate(selectedDate)] || [];
    if (priorityFilter !== 'all') {
      tasks = tasks.filter((t) => t.priority === priorityFilter);
    }
    return tasks;
  }, [tasksByDate, selectedDate, priorityFilter]);

  const selectedDateStr = formatDate(selectedDate);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  /* Task count for a date string */
  const taskCountForDate = (ds: string) => (tasksByDate[ds] || []).length;

  /* Reset form */
  const resetForm = () => {
    setNewTitle('');
    setNewDate(formatDate(selectedDate));
    setNewTime('09:00');
    setNewPriority('medium');
    setNewSubject('General');
  };

  /* Add task handler */
  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      priority: newPriority,
      subject: newSubject,
    });
    resetForm();
    setAddDialogOpen(false);
  };

  /* Navigation helpers */
  const navigateDate = (offset: number) => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() + offset);
      return next;
    });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-amber-500" />
            Study Planner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your study schedule and stay on track</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={(open) => { setAddDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="border-0 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle>New Study Task</DialogTitle>
              <DialogDescription>Add a new task to your study plan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Task Title</label>
                <Input
                  placeholder="e.g. Review Chapter 5"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Time</label>
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <Select value={newPriority} onValueChange={(v) => setNewPriority(v as PlannerTask['priority'])}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_COLORS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${val.dot}`} />
                            {val.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Subject</label>
                  <Select value={newSubject} onValueChange={setNewSubject}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setAddDialogOpen(false); resetForm(); }} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleAddTask} className="rounded-xl" disabled={!newTitle.trim()}>
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Tabs for views */}
      <motion.div variants={fadeUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="month" className="gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Month
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" /> Week
            </TabsTrigger>
            <TabsTrigger value="day" className="gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5" /> Day
            </TabsTrigger>
          </TabsList>

          {/* ===================== MONTH VIEW ===================== */}
          <TabsContent value="month">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar */}
              <Card className="border-0 bg-card/60 backdrop-blur-xl lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-amber-500" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => d && setSelectedDate(d)}
                    modifiers={{
                      hasTasks: Object.keys(tasksByDate).map((ds) => new Date(ds + 'T12:00:00')),
                    }}
                    modifiersClassNames={{
                      hasTasks: 'relative',
                    }}
                    className="rounded-xl border-0 p-2"
                    classNames={{
                      day: 'relative w-full h-full p-0 text-center select-none aspect-square',
                    }}
                    components={{
                      DayButton: ({ day, ...props }: any) => {
                        const dateStr = formatDate(day.date);
                        const count = taskCountForDate(dateStr);
                        const isToday = dateStr === todayStr;
                        const isSelected = dateStr === selectedDateStr;
                        return (
                          <button
                            {...props}
                            className={`
                              relative flex flex-col items-center justify-center w-full h-full aspect-square rounded-lg text-sm
                              transition-colors
                              ${isSelected ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}
                              ${isToday && !isSelected ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold' : ''}
                              ${!isSelected && !isToday ? 'hover:bg-muted' : ''}
                            `}
                          >
                            <span>{day.date.getDate()}</span>
                            {count > 0 && (
                              <div className="flex gap-0.5 absolute bottom-1">
                                {count <= 3 ? (
                                  Array.from({ length: count }).map((_, i) => (
                                    <div key={i} className="h-1 w-1 rounded-full bg-amber-500" />
                                  ))
                                ) : (
                                  <>
                                    <div className="h-1 w-1 rounded-full bg-amber-500" />
                                    <div className="h-1 w-1 rounded-full bg-orange-500" />
                                    <div className="h-1 w-1 rounded-full bg-red-500" />
                                  </>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Selected Date Tasks (Month sidebar) */}
              <Card className="border-0 bg-card/60 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-amber-500" />
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList
                    tasks={filteredTasks}
                    onToggle={(id, completed) => updateTask(id, { completed })}
                    onDelete={deleteTask}
                    emptyMessage="No tasks for this date"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===================== WEEK VIEW ===================== */}
          <TabsContent value="week">
            <Card className="border-0 bg-card/60 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-amber-500" />
                    Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => navigateDate(-7)} className="rounded-lg">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedDate(new Date())} className="rounded-lg text-xs">
                      Today
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigateDate(7)} className="rounded-lg">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((day) => {
                    const dateStr = formatDate(day);
                    const dayTasks = tasksByDate[dateStr] || [];
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          flex flex-col rounded-xl p-2 min-h-[120px] text-left transition-colors border
                          ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:bg-muted/50'}
                          ${isToday ? 'ring-1 ring-amber-500/30' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-medium uppercase ${isToday ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {WEEKDAYS[weekDates.indexOf(day)]}
                          </span>
                          {dayTasks.length > 0 && (
                            <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                              {dayTasks.length}
                            </Badge>
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${isToday ? 'text-amber-500' : ''}`}>
                          {day.getDate()}
                        </span>
                        <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                          {dayTasks.slice(0, 4).map((t) => (
                            <div key={t.id} className="flex items-center gap-1">
                              <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${PRIORITY_COLORS[t.priority].dot}`} />
                              <span className="text-[10px] truncate leading-tight">{t.title}</span>
                            </div>
                          ))}
                          {dayTasks.length > 4 && (
                            <span className="text-[9px] text-muted-foreground">+{dayTasks.length - 4} more</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===================== DAY VIEW ===================== */}
          <TabsContent value="day">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-0 bg-card/60 backdrop-blur-xl lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-amber-500" />
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => navigateDate(-1)} className="rounded-lg">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedDate(new Date())} className="rounded-lg text-xs">
                        Today
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => navigateDate(1)} className="rounded-lg">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Priority filter */}
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Filter:</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={priorityFilter === 'all' ? 'default' : 'ghost'}
                        className="h-6 text-[10px] px-2 rounded-lg"
                        onClick={() => setPriorityFilter('all')}
                      >
                        All
                      </Button>
                      {Object.entries(PRIORITY_COLORS).map(([key, val]) => (
                        <Button
                          key={key}
                          size="sm"
                          variant={priorityFilter === key ? 'default' : 'ghost'}
                          className={`h-6 text-[10px] px-2 rounded-lg gap-1 ${priorityFilter === key ? '' : ''}`}
                          onClick={() => setPriorityFilter(key)}
                        >
                          <div className={`h-1.5 w-1.5 rounded-full ${val.dot}`} />
                          {val.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Summary badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                    </Badge>
                    {(() => {
                      const completed = filteredTasks.filter((t) => t.completed).length;
                      return (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                          {completed} completed
                        </Badge>
                      );
                    })()}
                  </div>

                  <TaskList
                    tasks={filteredTasks}
                    onToggle={(id, completed) => updateTask(id, { completed })}
                    onDelete={deleteTask}
                    emptyMessage={priorityFilter !== 'all' ? `No ${priorityFilter} priority tasks for this date` : 'No tasks for this date. Click "Add Task" to create one!'}
                  />
                </CardContent>
              </Card>

              {/* Stats sidebar */}
              <div className="space-y-4">
                <Card className="border-0 bg-card/60 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Day Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(['urgent', 'high', 'medium', 'low'] as const).map((p) => {
                      const allTasks = tasksByDate[selectedDateStr] || [];
                      const count = allTasks.filter((t) => t.priority === p).length;
                      const done = allTasks.filter((t) => t.priority === p && t.completed).length;
                      return (
                        <div key={p} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${PRIORITY_COLORS[p].dot}`} />
                            <span className="text-xs">{PRIORITY_COLORS[p].label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {done}/{count}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card/60 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Upcoming
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {plannerTasks
                        .filter((t) => !t.completed && t.date >= todayStr)
                        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                        .slice(0, 5)
                        .map((t) => (
                          <div key={t.id} className="flex items-center gap-2 rounded-lg bg-muted/40 p-2">
                            <div className={`h-2 w-2 rounded-full shrink-0 ${PRIORITY_COLORS[t.priority].dot}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs truncate font-medium">{t.title}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {t.date === todayStr ? 'Today' : new Date(t.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {t.time}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Task List Sub-component
   ------------------------------------------------------------------ */
function TaskList({
  tasks,
  onToggle,
  onDelete,
  emptyMessage,
}: {
  tasks: PlannerTask[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  emptyMessage: string;
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ListChecks className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  /* Separate incomplete and completed tasks */
  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-2 max-h-[480px] overflow-y-auto">
      {incomplete.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
      {completed.length > 0 && incomplete.length > 0 && (
        <div className="pt-2 pb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Completed ({completed.length})
          </span>
        </div>
      )}
      {completed.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: PlannerTask;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const pc = PRIORITY_COLORS[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`
        group flex items-center gap-3 rounded-xl p-3 transition-colors
        ${task.completed ? 'bg-muted/30 opacity-60' : 'bg-muted/40 hover:bg-muted/60'}
      `}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id, !task.completed)}
        className="shrink-0"
      />
      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${pc.dot}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {task.time}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">{task.subject}</span>
          <Badge variant="outline" className={`h-4 px-1.5 text-[9px] ${pc.text} border-current/20`}>
            {pc.label}
          </Badge>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rounded-lg"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
      </Button>
    </motion.div>
  );
}
