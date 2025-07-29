import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  UserCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { FiveDaysTask } from '../../types/fiveDays';

interface TaskCardProps {
  task: FiveDaysTask;
  variant: 'planned' | 'update' | 'blocker';
  onClick: (task: FiveDaysTask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, variant, onClick }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'done':
        return <CheckCircleIcon className="w-4 h-4 text-success-600" />;
      case 'in-progress':
        return <ClockIcon className="w-4 h-4 text-warning-600" />;
      case 'blocked':
        return <ExclamationTriangleIcon className="w-4 h-4 text-danger-600" />;
      case 'not-started':
      case 'planned':
        return <CalendarIcon className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'done':
        return 'border-success-200 bg-success-50';
      case 'in-progress':
        return 'border-warning-200 bg-warning-50';
      case 'blocked':
        return 'border-danger-200 bg-danger-50';
      case 'not-started':
      case 'planned':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'planned':
        return 'border-dashed border-gray-300 bg-gray-50';
      case 'update':
        return 'border-2 border-primary-200 bg-primary-50';
      case 'blocker':
        return 'border-2 border-danger-300 bg-danger-50';
      default:
        return 'border border-gray-200 bg-white';
    }
  };

  const getProgressColor = () => {
    switch (task.status) {
      case 'done':
        return 'bg-success-600';
      case 'in-progress':
        return 'bg-warning-600';
      case 'blocked':
        return 'bg-danger-600';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${getVariantStyles()} ${getStatusColor()}`}
      onClick={() => onClick(task)}
      whileHover={{ y: -1 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {task.name}
          </h4>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          {getStatusIcon()}
        </div>
      </div>

      {/* Assignee */}
      <div className="flex items-center space-x-1 mb-2">
        <UserCircleIcon className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-600">{task.assignee}</span>
      </div>

      {/* Progress Bar */}
      {task.progress !== undefined && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {task.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.estimatedTime && (
            <span className="text-xs text-gray-500">
              {task.estimatedTime}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          task.status === 'done' ? 'bg-success-100 text-success-800' :
          task.status === 'in-progress' ? 'bg-warning-100 text-warning-800' :
          task.status === 'blocked' ? 'bg-danger-100 text-danger-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {task.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      {/* Blocker Warning */}
      {task.isBlocker && task.blockerReason && (
        <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded text-xs text-danger-700">
          <div className="flex items-center space-x-1">
            <ExclamationTriangleIcon className="w-3 h-3" />
            <span className="font-medium">Blocker:</span>
          </div>
          <p className="mt-1">{task.blockerReason}</p>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard; 