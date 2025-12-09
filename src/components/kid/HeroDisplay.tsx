import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { getLevelInfo } from '../../lib/constants';

interface HeroDisplayProps {
  avatar: string;
  level: number;
  successfulDays: number;
  daysToNextLevel: number;
}

export const HeroDisplay: React.FC<HeroDisplayProps> = ({
  avatar,
  level,
  successfulDays,
  daysToNextLevel,
}) => {
  const levelInfo = getLevelInfo(level);

  return (
    <div className="text-center py-6">
      <div className="relative inline-block">
        <Avatar emoji={avatar} size="xl" />
        <Badge
          variant="warning"
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm px-3 py-1"
        >
          Level {level}
        </Badge>
      </div>
      <h2 className="text-2xl font-bold mt-4" style={{ color: levelInfo.color }}>
        {levelInfo.title}
      </h2>
      <p className="text-gray-600 mt-2">
        {successfulDays} successful days
      </p>
      {daysToNextLevel > 0 && (
        <p className="text-sm text-gray-500 mt-1">
          {daysToNextLevel} more day{daysToNextLevel !== 1 ? 's' : ''} to next level!
        </p>
      )}
    </div>
  );
};

