// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  age_group: AgeGroup;
  avatar: string;
  reward_contract_text: string;
  reward_type: RewardType;
  created_at: string;
}

export interface Habit {
  id: string;
  child_id: string;
  title: string;
  icon: string;
  order: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  child_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  created_at: string;
}

export interface HeroProgress {
  id: string;
  child_id: string;
  level: number;
  successful_days_count: number;
  created_at: string;
  updated_at: string;
}

// Enums and types
export type AgeGroup = '5-7' | '8-10' | '11-12';
export type RewardType = 'screen_time' | 'time_together' | 'experience';

export interface HabitTemplate {
  title: string;
  icon: string;
}

export interface DayProgress {
  date: string;
  completed: boolean;
  completedCount: number;
  totalCount: number;
}

// UI types
export interface OnboardingData {
  childName: string;
  ageGroup: AgeGroup;
  avatar: string;
  habits: HabitTemplate[];
  rewardType: RewardType;
  rewardContractText: string;
}

