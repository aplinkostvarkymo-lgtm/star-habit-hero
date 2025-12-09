import React from 'react';
import { Card } from '../ui/Card';
import { RewardType } from '../../lib/types';
import { REWARD_TYPES } from '../../lib/constants';

interface ContractDisplayProps {
  rewardType: RewardType;
  contractText: string;
}

export const ContractDisplay: React.FC<ContractDisplayProps> = ({
  rewardType,
  contractText,
}) => {
  const rewardInfo = REWARD_TYPES.find(r => r.value === rewardType);
  
  const icons = {
    screen_time: '📱',
    time_together: '🎮',
    experience: '🎯',
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <div className="flex items-start gap-3">
        <div className="text-4xl">{icons[rewardType]}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {rewardInfo?.label}
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {contractText}
          </p>
        </div>
      </div>
    </Card>
  );
};

