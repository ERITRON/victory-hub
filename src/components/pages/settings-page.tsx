/*
 * Victory Hub - Settings Page
 * Theme, accent color, font size, Pomodoro timer, and data management
 */

'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Palette, Sun, Moon, Monitor, Type, Timer, Download,
  Upload, Trash2, Check, RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/app-store';
import { exportAllData } from '@/lib/storage';

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
   Color swatches
   ------------------------------------------------------------------ */

const COLOR_SWATCHES = [
  { name: 'Amber', value: '#f59e0b', label: 'amber' },
  { name: 'Emerald', value: '#10b981', label: 'emerald' },
  { name: 'Rose', value: '#f43f5e', label: 'rose' },
  { name: 'Violet', value: '#8b5cf6', label: 'violet' },
  { name: 'Sky', value: '#0ea5e9', label: 'sky' },
  { name: 'Orange', value: '#f97316', label: 'orange' },
] as const;

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const importData = useAppStore((s) => s.importData);
  const resetAllData = useAppStore((s) => s.resetAllData);

  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* --- Theme handler --- */
  const handleThemeChange = (value: string) => {
    setTheme(value);
    updateSettings({ theme: value as 'light' | 'dark' | 'system' });
  };

  /* --- Accent color handler --- */
  const handleAccentChange = (color: string) => {
    updateSettings({ accentColor: color });
  };

  /* --- Font size handler --- */
  const handleFontSizeChange = (value: string) => {
    updateSettings({ fontSize: value as 'small' | 'medium' | 'large' });
  };

  /* --- Pomodoro handlers --- */
  const handleWorkChange = (value: number[]) => {
    updateSettings({ pomodoroWork: value[0] });
  };

  const handleBreakChange = (value: number[]) => {
    updateSettings({ pomodoroBreak: value[0] });
  };

  /* --- Export handler --- */
  const handleExport = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `victoryhub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* --- Import handler --- */
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = importData(json);
      if (success) {
        window.location.reload();
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* --- Reset handler --- */
  const handleReset = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-8 max-w-3xl mx-auto">
      {/* ===== APPEARANCE ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-amber-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme</Label>
              <RadioGroup
                value={theme || 'system'}
                onValueChange={handleThemeChange}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = (theme || 'system') === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-md'
                          : 'border-transparent bg-muted/50 hover:border-border'
                      }`}
                    >
                      <RadioGroupItem value={option.value} className="sr-only" />
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-amber-500' : 'text-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <Separator />

            {/* Accent Color */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Accent Color</Label>
              <div className="flex flex-wrap gap-3">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected = settings.accentColor === swatch.value;
                  return (
                    <button
                      key={swatch.value}
                      onClick={() => handleAccentChange(swatch.value)}
                      className="group relative flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-110"
                      title={swatch.name}
                    >
                      <div
                        className={`h-10 w-10 rounded-full shadow-lg transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-offset-background ring-[var(--ring-color)] scale-110'
                            : 'hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-[var(--ring-color)]'
                        }`}
                        style={{
                          backgroundColor: swatch.value,
                          '--ring-color': swatch.value,
                        } as React.CSSProperties}
                      >
                        {isSelected && (
                          <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{swatch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Font Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" /> Font Size
              </Label>
              <Select
                value={settings.fontSize}
                onValueChange={handleFontSizeChange}
              >
                <SelectTrigger className="rounded-xl w-full">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== POMODORO ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="h-5 w-5 text-orange-500" />
              Pomodoro Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Work Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Work Duration</Label>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {settings.pomodoroWork} min
                </span>
              </div>
              <Slider
                value={[settings.pomodoroWork]}
                onValueChange={handleWorkChange}
                min={15}
                max={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 min</span>
                <span>60 min</span>
              </div>
            </div>

            <Separator />

            {/* Break Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Break Duration</Label>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {settings.pomodoroBreak} min
                </span>
              </div>
              <Slider
                value={[settings.pomodoroBreak]}
                onValueChange={handleBreakChange}
                min={3}
                max={15}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3 min</span>
                <span>15 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== DATA MANAGEMENT ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
      >
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-emerald-500" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export */}
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium">Export Data</p>
                <p className="text-xs text-muted-foreground">
                  Download all your data as a JSON backup file
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg shrink-0"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>

            {/* Import */}
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium">Import Data</p>
                <p className="text-xs text-muted-foreground">
                  Restore from a previously exported JSON file
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
              </div>
            </div>

            <Separator />

            {/* Reset */}
            <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div>
                <p className="text-sm font-medium text-destructive">Reset All Data</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete all your data and start fresh
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg shrink-0"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      progress, notes, flashcards, quiz scores, achievements, and settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
