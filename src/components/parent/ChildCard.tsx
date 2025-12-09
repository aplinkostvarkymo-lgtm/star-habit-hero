import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';

interface ChildCardProps {
  name: string;
  avatar: string;
  level: number;
  completedToday: number;
  totalHabits: number;
  onClick: () => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  name,
  avatar,
  level,
  completedToday,
  totalHabits,
  onClick,
}) => {
  const isComplete = completedToday === totalHabits && totalHabits > 0;

  return (
    <Card onClick={onClick} className="hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <Avatar emoji={avatar} size="md" />
        <div className="flex-1">
          <h3 className="text-xl font-bold">{name}</h3>
          <Badge variant="primary">Level {level}</Badge>
        </div>
        {isComplete && (
          <div className="text-4xl">✅</div>
        )}
      </div>
      <ProgressBar current={completedToday} total={totalHabits} />
      <p className="text-sm text-gray-600 mt-2">
        {isComplete ? 'All missions complete! 🎉' : `${totalHabits - completedToday} mission${totalHabits - completedToday !== 1 ? 's' : ''} remaining`}
      </p>
    </Card>
  );
};

