import { Calculator, Hash, Timer, Triangle, Dices, LucideIcon } from 'lucide-react';
import type { AptitudeGroupId } from '@/data/aptitudeTopics';

export interface AptitudeGroupTheme {
  icon: LucideIcon;
  /** soft pastel icon badge */
  badge: string;
  /** small text chip */
  chip: string;
  /** progress / accent bar */
  bar: string;
  /** hover border on cards */
  hover: string;
  /** text accent */
  text: string;
}

export const APTITUDE_THEME: Record<AptitudeGroupId, AptitudeGroupTheme> = {
  arithmetic: {
    icon: Calculator,
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    hover: 'hover:border-emerald-300',
    text: 'text-emerald-700',
  },
  numbers: {
    icon: Hash,
    badge: 'bg-blue-50 text-blue-600 border-blue-200',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    bar: 'bg-blue-500',
    hover: 'hover:border-blue-300',
    text: 'text-blue-700',
  },
  timework: {
    icon: Timer,
    badge: 'bg-amber-50 text-amber-600 border-amber-200',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-500',
    hover: 'hover:border-amber-300',
    text: 'text-amber-700',
  },
  geometry: {
    icon: Triangle,
    badge: 'bg-purple-50 text-purple-600 border-purple-200',
    chip: 'bg-purple-50 text-purple-700 border-purple-200',
    bar: 'bg-purple-500',
    hover: 'hover:border-purple-300',
    text: 'text-purple-700',
  },
  counting: {
    icon: Dices,
    badge: 'bg-rose-50 text-rose-600 border-rose-200',
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
    bar: 'bg-rose-500',
    hover: 'hover:border-rose-300',
    text: 'text-rose-700',
  },
};
