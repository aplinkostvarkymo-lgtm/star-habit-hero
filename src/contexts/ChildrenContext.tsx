import React, { createContext, useContext, useEffect, useState } from 'react';
import { Child } from '../lib/types';
import { childrenService } from '../services/children';
import { useAuth } from './AuthContext';

interface ChildrenContextType {
  children: Child[];
  loading: boolean;
  refreshChildren: () => Promise<void>;
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined);

export const ChildrenProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshChildren = async () => {
    if (!user) {
      setChildren([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await childrenService.getChildren(user.id);
      setChildren(data);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshChildren();
  }, [user]);

  return (
    <ChildrenContext.Provider value={{ children, loading, refreshChildren }}>
      {reactChildren}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  const context = useContext(ChildrenContext);
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider');
  }
  return context;
};

