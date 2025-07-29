import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import TaskCard from './TaskCard';
import { FiveDaysTask } from '../../types/fiveDays';

interface DailyColumnProps {
  dayName: string;
  date: Date;
  plannedTasks: FiveDaysTask[];
  dailyUpdates: FiveDaysTask[];
  blockers: FiveDaysTask[];
  onTaskClick: (task: FiveDaysTask) => void;
}

const DailyColumn: React.FC<DailyColumnProps> = ({
  dayName,
  date,
  plannedTasks,
  dailyUpdates,
  blockers,
  onTaskClick
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <motion.div
      className="card min-h-[600px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Day Header */}
      <div className={`text-center pb-4 border-b border-gray-200 ${
        isToday(date) ? 'bg-primary-50 rounded-t-lg -mt-4 -mx-4 px-4 pt-4' : ''
      }`}>
        <h3 className={`text-lg font-semibold ${
          isToday(date) ? 'text-primary-700' : 'text-gray-900'
        }`}>
          {dayName}
        </h3>
        <p className={`text-sm ${
          isToday(date) ? 'text-primary-600' : 'text-gray-500'
        }`}>
          {formatDate(date)}
        </p>
        {isToday(date) && (
          <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            Today
          </span>
        )}
      </div>

      <div className="space-y-4 pt-4">
        {/* Planned for Today/Tomorrow */}
        {plannedTasks.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Planned for Today
            </h4>
            <div className="space-y-2">
              {plannedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="planned"
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Daily Updates */}
        {dailyUpdates.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Daily Updates
            </h4>
            <div className="space-y-2">
              {dailyUpdates.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="update"
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Key Blockers */}
        {blockers.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-danger-600 uppercase tracking-wide mb-2 flex items-center">
              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
              Key Blockers
            </h4>
            <div className="space-y-2">
              {blockers.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="blocker"
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {plannedTasks.length === 0 && dailyUpdates.length === 0 && blockers.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-lg">📅</span>
            </div>
            <p className="text-sm text-gray-500">No tasks planned</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DailyColumn; 