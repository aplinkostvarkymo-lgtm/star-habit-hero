import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ChildCard } from '../components/parent/ChildCard';
import { HistoryTimeline } from '../components/parent/HistoryTimeline';
import { ContractDisplay } from '../components/parent/ContractDisplay';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useChildren } from '../contexts/ChildrenContext';
// import { childrenService } from '../services/children'; // Not used in this component
import { habitsService } from '../services/habits';
import { heroProgressService } from '../services/heroProgress';
import { Child, HeroProgress, DayProgress } from '../lib/types';
import { subDays, format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId?: string }>();
  const { user, signOut } = useAuth();
  const { children, loading: childrenLoading } = useChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [childProgress, setChildProgress] = useState<{ [key: string]: { completed: number; total: number; level: number } }>({});
  const [history, setHistory] = useState<DayProgress[]>([]);
  const [heroProgress, setHeroProgress] = useState<HeroProgress | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (children.length > 0 && !childrenLoading) {
      loadChildrenProgress();
    }
  }, [children, childrenLoading]);

  useEffect(() => {
    if (childId) {
      const child = children.find(c => c.id === childId);
      if (child) {
        setSelectedChild(child);
        loadChildHistory(childId);
      }
    } else {
      setSelectedChild(null);
    }
  }, [childId, children]);

  const loadChildrenProgress = async () => {
    const progressData: { [key: string]: { completed: number; total: number; level: number } } = {};
    
    for (const child of children) {
      try {
        const [habits, logs, progress] = await Promise.all([
          habitsService.getHabits(child.id),
          habitsService.getHabitLogs(child.id, new Date()),
          heroProgressService.getHeroProgress(child.id),
        ]);

        const completedCount = logs.filter(log => log.completed).length;
        progressData[child.id] = {
          completed: completedCount,
          total: habits.length,
          level: progress?.level || 1,
        };
      } catch (error) {
        console.error(`Error loading progress for child ${child.id}:`, error);
      }
    }

    setChildProgress(progressData);
  };

  const loadChildHistory = async (childId: string) => {
    setLoadingHistory(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 13); // Last 14 days

      const [habits, logs, progress] = await Promise.all([
        habitsService.getHabits(childId),
        habitsService.getHabitLogsRange(childId, startDate, endDate),
        heroProgressService.getHeroProgress(childId),
      ]);

      setHeroProgress(progress);

      // Group logs by date
      const logsByDate: { [date: string]: typeof logs } = {};
      logs.forEach(log => {
        if (!logsByDate[log.date]) {
          logsByDate[log.date] = [];
        }
        logsByDate[log.date].push(log);
      });

      // Create history array
      const historyData: DayProgress[] = [];
      for (let i = 0; i < 14; i++) {
        const date = format(subDays(endDate, i), 'yyyy-MM-dd');
        const dayLogs = logsByDate[date] || [];
        const completedCount = dayLogs.filter(log => log.completed).length;
        const totalCount = habits.length;
        
        historyData.push({
          date,
          completed: completedCount === totalCount && totalCount > 0,
          completedCount,
          totalCount,
        });
      }

      setHistory(historyData);
    } catch (error) {
      console.error('Error loading child history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (childrenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-hero-primary">Loading...</div>
      </div>
    );
  }

  if (selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="secondary"
            onClick={() => navigate('/parent/dashboard')}
            className="mb-6"
          >
            ← Back to All Children
          </Button>

          <Card className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar emoji={selectedChild.avatar} size="lg" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{selectedChild.name}</h1>
                <Badge variant="primary">Level {heroProgress?.level || 1}</Badge>
                <p className="text-gray-600 mt-1">
                  {heroProgress?.successful_days_count || 0} successful days
                </p>
              </div>
              <Button
                variant="success"
                onClick={() => navigate(`/kid/${selectedChild.id}`)}
              >
                Open Kid View
              </Button>
            </div>
          </Card>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Family Contract</h2>
            <ContractDisplay
              rewardType={selectedChild.reward_type}
              contractText={selectedChild.reward_contract_text}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Progress History (Last 14 Days)</h2>
            {loadingHistory ? (
              <div className="text-center py-8 text-gray-500">Loading history...</div>
            ) : (
              <HistoryTimeline history={history} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-hero-primary mb-2">
              Parent Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {user?.email}</p>
          </div>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        {children.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <h2 className="text-2xl font-bold mb-4">No Children Yet</h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your first child's profile
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/parent/onboarding')}
            >
              Add Child
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Children</h2>
              <Button onClick={() => navigate('/parent/onboarding')}>
                + Add Another Child
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map((child) => {
                const progress = childProgress[child.id] || { completed: 0, total: 0, level: 1 };
                return (
                  <ChildCard
                    key={child.id}
                    name={child.name}
                    avatar={child.avatar}
                    level={progress.level}
                    completedToday={progress.completed}
                    totalHabits={progress.total}
                    onClick={() => navigate(`/parent/dashboard/${child.id}`)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

