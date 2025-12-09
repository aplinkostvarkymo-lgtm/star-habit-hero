import React, { createContext, useContext } from 'react';
import { Habit, HabitLog } from '../lib/types';
import { habitsService } from '../services/habits';

interface HabitsContextType {
  getHabits: (childId: string) => Promise<Habit[]>;
  getHabitLogs: (childId: string, date: Date) => Promise<HabitLog[]>;
  toggleHabitCompletion: (childId: string, habitId: string, date: Date, completed: boolean) => Promise<HabitLog>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getHabits = async (childId: string) => {
    return await habitsService.getHabits(childId);
  };

  const getHabitLogs = async (childId: string, date: Date) => {
    return await habitsService.getHabitLogs(childId, date);
  };

  const toggleHabitCompletion = async (
    childId: string,
    habitId: string,
    date: Date,
    completed: boolean
  ) => {
    return await habitsService.toggleHabitCompletion(childId, habitId, date, completed);
  };

  return (
    <HabitsContext.Provider value={{ getHabits, getHabitLogs, toggleHabitCompletion }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};

