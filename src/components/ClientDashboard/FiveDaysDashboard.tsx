import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DailyColumn from './DailyColumn';
import { mockFiveDaysTasks, mockFiveDaysProject, mockFiveDaysStats } from '../../data/mondayMockData';
import { FiveDaysTask } from '../../types/fiveDays';

const FiveDaysDashboard: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<FiveDaysTask | null>(null);

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const getWeekDates = (weekStart: Date) => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDates = getWeekDates(weekStart);

  const getTasksForDay = (dayOfWeek: string) => {
    return mockFiveDaysTasks.filter(task => task.dayOfWeek === dayOfWeek);
  };

  const getPlannedTasksForDay = (dayOfWeek: string) => {
    return mockFiveDaysTasks.filter(task => 
      task.dayOfWeek === dayOfWeek && task.source === 'sprint-planning'
    );
  };

  const getDailyUpdatesForDay = (dayOfWeek: string) => {
    return mockFiveDaysTasks.filter(task => 
      task.dayOfWeek === dayOfWeek && 
      (task.source === 'daily-scrum' || task.source === 'weekly-email')
    );
  };

  const getBlockersForDay = (dayOfWeek: string) => {
    return mockFiveDaysTasks.filter(task => 
      task.dayOfWeek === dayOfWeek && task.isBlocker
    );
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    
    return `${startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    if (direction === 'prev') {
      newWeek.setDate(currentWeek.getDate() - 7);
    } else {
      newWeek.setDate(currentWeek.getDate() + 7);
    }
    setCurrentWeek(newWeek);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">5 Days</h1>
              <p className="text-sm text-gray-500">{mockFiveDaysProject.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => navigateWeek('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {formatWeekRange(weekStart)}
              </p>
              <p className="text-xs text-gray-500">This Week's Plan</p>
            </div>
            
            <motion.button
              onClick={() => navigateWeek('next')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{mockFiveDaysStats.totalTasks}</div>
          <div className="text-xs text-gray-500">Total Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{mockFiveDaysStats.completedTasks}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{mockFiveDaysStats.inProgressTasks}</div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{mockFiveDaysStats.blockedTasks}</div>
          <div className="text-xs text-gray-500">Blocked</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{mockFiveDaysStats.plannedTasks}</div>
          <div className="text-xs text-gray-500">Planned</div>
        </div>
      </div>

      {/* 5 Days Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {weekDays.map((day, index) => (
          <DailyColumn
            key={day}
            dayName={dayNames[index]}
            date={weekDates[index]}
            plannedTasks={getPlannedTasksForDay(day)}
            dailyUpdates={getDailyUpdatesForDay(day)}
            blockers={getBlockersForDay(day)}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTask(null)}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedTask.name}</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedTask.status === 'done' ? 'bg-success-100 text-success-800' :
                  selectedTask.status === 'in-progress' ? 'bg-warning-100 text-warning-800' :
                  selectedTask.status === 'blocked' ? 'bg-danger-100 text-danger-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedTask.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Assignee:</span>
                <span className="text-sm text-gray-900">{selectedTask.assignee}</span>
              </div>
              
              {selectedTask.estimatedTime && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Estimated:</span>
                  <span className="text-sm text-gray-900">{selectedTask.estimatedTime}</span>
                </div>
              )}
              
              {selectedTask.dueDate && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Due:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div>
                <span className="text-sm font-medium text-gray-500">Notes:</span>
                <p className="text-sm text-gray-900 mt-1">{selectedTask.notes}</p>
              </div>
              
              {selectedTask.isBlocker && selectedTask.blockerReason && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-danger-700">Blocker:</span>
                  <p className="text-sm text-danger-600 mt-1">{selectedTask.blockerReason}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FiveDaysDashboard; 