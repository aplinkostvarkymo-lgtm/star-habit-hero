import { AgeGroup, HabitTemplate, RewardType } from './types';

// Age group options
export const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: '5-7', label: '5-7 years' },
  { value: '8-10', label: '8-10 years' },
  { value: '11-12', label: '11-12 years' },
];

// Avatar options (using emojis for simplicity)
export const AVATARS = [
  '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', 
  '🦹‍♂️', '🦹‍♀️', '🧝‍♂️', '🧝‍♀️',
  '🐉', '🦁', '🐯', '🦅',
  '⚡', '🌟', '🔥', '💫'
];

// Default habit templates by age group
export const HABIT_TEMPLATES: Record<AgeGroup, HabitTemplate[]> = {
  '5-7': [
    { title: 'Wake up on time', icon: '⏰' },
    { title: 'Make the bed', icon: '🛏️' },
    { title: 'Get dressed', icon: '👕' },
    { title: 'Brush teeth', icon: '🦷' },
    { title: 'Eat breakfast', icon: '🍳' },
  ],
  '8-10': [
    { title: 'Wake up on time', icon: '⏰' },
    { title: 'Make the bed', icon: '🛏️' },
    { title: 'Get dressed', icon: '👕' },
    { title: 'Brush teeth', icon: '🦷' },
    { title: 'Pack backpack', icon: '🎒' },
    { title: 'Eat breakfast', icon: '🍳' },
  ],
  '11-12': [
    { title: 'Wake up on time', icon: '⏰' },
    { title: 'Make the bed', icon: '🛏️' },
    { title: 'Personal hygiene', icon: '🚿' },
    { title: 'Get dressed', icon: '👕' },
    { title: 'Pack backpack', icon: '🎒' },
    { title: 'Eat breakfast', icon: '🍳' },
    { title: 'Check schedule', icon: '📅' },
  ],
};

// Habit icon options
export const HABIT_ICONS = [
  '⏰', '🛏️', '👕', '🦷', '🎒', '🍳',
  '📚', '✏️', '🧹', '🧺', '🚿', '💧',
  '🥗', '🏃', '📅', '🎯', '⭐', '✅'
];

// Reward types
export const REWARD_TYPES: { value: RewardType; label: string; description: string }[] = [
  { 
    value: 'screen_time', 
    label: 'Screen Time', 
    description: 'Complete missions to earn screen time' 
  },
  { 
    value: 'time_together', 
    label: 'Time Together', 
    description: 'Complete missions to earn special time together' 
  },
  { 
    value: 'experience', 
    label: 'Experience', 
    description: 'Complete missions to earn special activities' 
  },
];

// Hero progression
export const DAYS_PER_LEVEL = 5;
export const MAX_LEVEL = 5;

// Level configurations
export const LEVEL_CONFIG = [
  { level: 1, title: 'Beginner Hero', color: '#94a3b8' },
  { level: 2, title: 'Rising Star', color: '#60a5fa' },
  { level: 3, title: 'Skilled Hero', color: '#a78bfa' },
  { level: 4, title: 'Master Hero', color: '#f59e0b' },
  { level: 5, title: 'Legendary Hero', color: '#ef4444' },
];

export const getLevelInfo = (level: number) => {
  return LEVEL_CONFIG.find(l => l.level === level) || LEVEL_CONFIG[0];
};

