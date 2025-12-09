import { supabase } from '../lib/supabase';
import { Child, AgeGroup, RewardType } from '../lib/types';

export const childrenService = {
  async getChildren(userId: string): Promise<Child[]> {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getChildById(childId: string): Promise<Child | null> {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createChild(data: {
    user_id: string;
    name: string;
    age_group: AgeGroup;
    avatar: string;
    reward_contract_text: string;
    reward_type: RewardType;
  }): Promise<Child> {
    const { data: child, error } = await supabase
      .from('children')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return child;
  },

  async updateChild(childId: string, updates: Partial<Child>): Promise<Child> {
    const { data, error } = await supabase
      .from('children')
      .update(updates)
      .eq('id', childId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteChild(childId: string): Promise<void> {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId);
    
    if (error) throw error;
  },
};

