import { supabase } from '../lib/supabase';
import { HeroProgress } from '../lib/types';
import { DAYS_PER_LEVEL, MAX_LEVEL } from '../lib/constants';

export const heroProgressService = {
  async getHeroProgress(childId: string): Promise<HeroProgress | null> {
    const { data, error } = await supabase
      .from('hero_progress')
      .select('*')
      .eq('child_id', childId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },

  async createHeroProgress(childId: string): Promise<HeroProgress> {
    const { data, error } = await supabase
      .from('hero_progress')
      .insert([{
        child_id: childId,
        level: 1,
        successful_days_count: 0,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async incrementSuccessfulDays(childId: string): Promise<HeroProgress> {
    const progress = await this.getHeroProgress(childId);
    
    if (!progress) {
      return await this.createHeroProgress(childId);
    }

    const newCount = progress.successful_days_count + 1;
    const newLevel = Math.min(
      Math.floor(newCount / DAYS_PER_LEVEL) + 1,
      MAX_LEVEL
    );

    const { data, error } = await supabase
      .from('hero_progress')
      .update({
        successful_days_count: newCount,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('child_id', childId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateLevel(childId: string, level: number): Promise<HeroProgress> {
    const { data, error } = await supabase
      .from('hero_progress')
      .update({
        level,
        updated_at: new Date().toISOString(),
      })
      .eq('child_id', childId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

