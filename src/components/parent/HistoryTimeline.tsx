import React from 'react';
import { format } from 'date-fns';
import { DayProgress } from '../../lib/types';

interface HistoryTimelineProps {
  history: DayProgress[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No history yet. Start completing missions!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((day) => (
        <div
          key={day.date}
          className={`flex items-center justify-between p-4 rounded-lg ${
            day.completed ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {day.completed ? '✅' : '⭕'}
            </div>
            <div>
              <p className="font-semibold">
                {format(new Date(day.date), 'EEEE, MMM d')}
              </p>
              <p className="text-sm text-gray-600">
                {day.completedCount} / {day.totalCount} missions
              </p>
            </div>
          </div>
          {day.completed && (
            <div className="text-green-600 font-semibold">
              Complete!
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

