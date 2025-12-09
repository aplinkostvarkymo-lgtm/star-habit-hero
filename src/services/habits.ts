import { supabase } from '../lib/supabase';
import { Habit, HabitLog } from '../lib/types';
import { format } from 'date-fns';

export const habitsService = {
  async getHabits(childId: string): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('child_id', childId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createHabits(habits: Omit<Habit, 'id' | 'created_at'>[]): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .insert(habits)
      .select();
    
    if (error) throw error;
    return data || [];
  },

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', habitId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteHabit(habitId: string): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);
    
    if (error) throw error;
  },

  async getHabitLogs(childId: string, date: Date): Promise<HabitLog[]> {
    const dateString = format(date, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('child_id', childId)
      .eq('date', dateString);
    
    if (error) throw error;
    return data || [];
  },

  async getHabitLogsRange(childId: string, startDate: Date, endDate: Date): Promise<HabitLog[]> {
    const startString = format(startDate, 'yyyy-MM-dd');
    const endString = format(endDate, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('child_id', childId)
      .gte('date', startString)
      .lte('date', endString)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async toggleHabitCompletion(
    childId: string,
    habitId: string,
    date: Date,
    completed: boolean
  ): Promise<HabitLog> {
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Try to update existing log first
    const { data: existing } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .eq('date', dateString)
      .single();
    
    if (existing) {
      const { data, error } = await supabase
        .from('habit_logs')
        .update({ completed })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('habit_logs')
        .insert([{
          child_id: childId,
          habit_id: habitId,
          date: dateString,
          completed,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
};

