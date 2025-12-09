import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeroDisplay } from '../components/kid/HeroDisplay';
import { MissionCard } from '../components/kid/MissionCard';
import { CelebrationAnimation } from '../components/kid/CelebrationAnimation';
import { ProgressBar } from '../components/ui/ProgressBar';
import { childrenService } from '../services/children';
import { habitsService } from '../services/habits';
import { heroProgressService } from '../services/heroProgress';
import { Child, Habit, HabitLog, HeroProgress } from '../lib/types';
import { DAYS_PER_LEVEL, MAX_LEVEL } from '../lib/constants';

export const KidView: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [heroProgress, setHeroProgress] = useState<HeroProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  useEffect(() => {
    if (childId) {
      loadData();
    }
  }, [childId]);

  const loadData = async () => {
    if (!childId) return;

    try {
      setLoading(true);
      const [childData, habitsData, logsData, progressData] = await Promise.all([
        childrenService.getChildById(childId),
        habitsService.getHabits(childId),
        habitsService.getHabitLogs(childId, new Date()),
        heroProgressService.getHeroProgress(childId),
      ]);

      setChild(childData);
      setHabits(habitsData);
      setHabitLogs(logsData);
      setHeroProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, currentlyCompleted: boolean) => {
    if (!childId) return;

    try {
      const newCompleted = !currentlyCompleted;
      await habitsService.toggleHabitCompletion(childId, habitId, new Date(), newCompleted);
      
      // Refresh habit logs
      const updatedLogs = await habitsService.getHabitLogs(childId, new Date());
      setHabitLogs(updatedLogs);

      // Check if all habits are now complete
      const allComplete = habits.every(habit =>
        updatedLogs.find(log => log.habit_id === habit.id && log.completed)
      );

      if (allComplete && habits.length > 0) {
        // Increment successful days
        const oldLevel = heroProgress?.level || 1;
        const updatedProgress = await heroProgressService.incrementSuccessfulDays(childId);
        setHeroProgress(updatedProgress);

        // Check if leveled up
        if (updatedProgress.level > oldLevel) {
          setLeveledUp(true);
          setNewLevel(updatedProgress.level);
        }

        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const getCompletedCount = () => {
    return habitLogs.filter(log => log.completed).length;
  };

  const isHabitCompleted = (habitId: string) => {
    const log = habitLogs.find(log => log.habit_id === habitId);
    return log?.completed || false;
  };

  const getDaysToNextLevel = () => {
    if (!heroProgress) return 0;
    const currentLevel = heroProgress.level;
    if (currentLevel >= MAX_LEVEL) return 0;
    const daysForNextLevel = currentLevel * DAYS_PER_LEVEL;
    return daysForNextLevel - heroProgress.successful_days_count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-hero-primary">Loading...</div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-500">Child not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <HeroDisplay
          avatar={child.avatar}
          level={heroProgress?.level || 1}
          successfulDays={heroProgress?.successful_days_count || 0}
          daysToNextLevel={getDaysToNextLevel()}
        />

        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Today's Missions 🎯
          </h2>
          <ProgressBar
            current={getCompletedCount()}
            total={habits.length}
            className="mb-6"
          />

          <div className="space-y-4">
            {habits.map((habit) => (
              <MissionCard
                key={habit.id}
                icon={habit.icon}
                title={habit.title}
                completed={isHabitCompleted(habit.id)}
                onToggle={() => handleToggleHabit(habit.id, isHabitCompleted(habit.id))}
              />
            ))}
          </div>

          {habits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No missions yet! Ask your parent to set up your missions.
            </div>
          )}
        </div>

        <CelebrationAnimation
          isOpen={showCelebration}
          onClose={() => {
            setShowCelebration(false);
            setLeveledUp(false);
          }}
          levelUp={leveledUp}
          newLevel={newLevel}
        />
      </div>
    </div>
  );
};

