import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface MissionCardProps {
  icon: string;
  title: string;
  completed: boolean;
  onToggle: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  icon,
  title,
  completed,
  onToggle,
}) => {
  return (
    <Card className={`${completed ? 'bg-green-50 border-2 border-green-400' : 'border-2 border-gray-200'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${completed ? 'line-through text-gray-500' : ''}`}>
              {title}
            </h3>
          </div>
        </div>
        <Button
          variant={completed ? 'secondary' : 'success'}
          size="lg"
          onClick={onToggle}
          className="min-w-[120px]"
        >
          {completed ? '✓ Done!' : 'Mark Done'}
        </Button>
      </div>
    </Card>
  );
};

