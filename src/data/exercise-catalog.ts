import type { ExerciseSearchResult } from '@/src/types/workouts';

export const exerciseCatalog: ExerciseSearchResult[] = [
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'Strength',
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Strength',
    primaryMuscles: ['Upper chest', 'Shoulders'],
  },
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Strength',
    primaryMuscles: ['Quads', 'Glutes'],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Strength',
    primaryMuscles: ['Hamstrings', 'Glutes'],
  },
  {
    id: 'conventional-deadlift',
    name: 'Conventional Deadlift',
    category: 'Strength',
    primaryMuscles: ['Back', 'Hamstrings', 'Glutes'],
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    category: 'Bodyweight',
    primaryMuscles: ['Lats', 'Biceps'],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Machine',
    primaryMuscles: ['Lats', 'Biceps'],
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    category: 'Cable',
    primaryMuscles: ['Back', 'Biceps'],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'Strength',
    primaryMuscles: ['Shoulders', 'Triceps'],
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Accessory',
    primaryMuscles: ['Shoulders'],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'Machine',
    primaryMuscles: ['Quads', 'Glutes'],
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    category: 'Accessory',
    primaryMuscles: ['Quads', 'Glutes'],
  },
];
