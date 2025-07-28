import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'in-progress':
        return 'bg-warning-100 text-warning-800';
      case 'blocked':
        return 'bg-danger-100 text-danger-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'in-progress':
        return <ClockIcon className="w-4 h-4" />;
      case 'blocked':
        return <XCircleIcon className="w-4 h-4" />;
      case 'not-started':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-danger-500';
      case 'high':
        return 'bg-warning-500';
      case 'medium':
        return 'bg-primary-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const hasBlockers = task.blockers.length > 0;

  return (
    <motion.div
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(task.id)}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <UserCircleIcon className="w-4 h-4" />
              <span>{task.assignee.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {getStatusIcon(task.status)}
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Blockers Warning */}
      {hasBlockers && (
        <div className="flex items-center space-x-2 p-2 bg-danger-50 rounded-lg border border-danger-200">
          <ExclamationTriangleIcon className="w-4 h-4 text-danger-600" />
          <span className="text-sm text-danger-700 font-medium">
            {task.blockers.length} blocker{task.blockers.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Hours Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
        <span>Est: {task.estimatedHours}h</span>
        {task.actualHours && (
          <span>Actual: {task.actualHours}h</span>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard; 