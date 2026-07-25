/*
 * Victory Hub - Progress Ring Component
 * SVG circular progress indicator with animation
 */

'use client';

import { motion } from 'framer-motion';

interface ProgressRingProps {
  /** Progress value 0-100 */
  progress: number;
  /** Ring radius in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Ring/track colour classes */
  ringClass?: string;
  /** Text colour class */
  textClass?: string;
  /** Show percentage label */
  showLabel?: boolean;
  /** Optional centre content (overrides label) */
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  ringClass = 'text-amber-500',
  textClass = 'text-foreground',
  showLabel = true,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={ringClass}
          stroke="currentColor"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      ) : showLabel ? (
        <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${textClass}`}>
          {Math.round(progress)}%
        </div>
      ) : null}
    </div>
  );
}
