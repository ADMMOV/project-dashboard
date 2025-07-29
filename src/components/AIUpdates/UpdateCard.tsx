import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  CalendarIcon,
  MicrophoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { AIUpdate } from '../../types/aiUpdates';
import { mockUsers } from '../../data/mockData';

interface UpdateCardProps {
  update: AIUpdate;
  onApprove: (updateId: string) => void;
  onReject: (updateId: string) => void;
  onEdit: (update: AIUpdate) => void;
  isSelected: boolean;
  onSelect: (updateId: string, selected: boolean) => void;
}

const UpdateCard: React.FC<UpdateCardProps> = ({
  update,
  onApprove,
  onReject,
  onEdit,
  isSelected,
  onSelect
}) => {
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'in-progress':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'blocked':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'daily-scrum' ? (
      <MicrophoneIcon className="w-4 h-4" />
    ) : (
      <EnvelopeIcon className="w-4 h-4" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleReject = () => {
    setShowConfirmReject(false);
    onReject(update.id);
  };

  return (
    <motion.div
      className={`card border-2 transition-all duration-200 ${
        isSelected ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
      } ${update.isBlocker ? 'border-l-4 border-l-danger-500' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(update.id, e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            
            {update.isNewTask ? (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                NEW TASK
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                UPDATE TO: {update.linkedTaskId}
              </span>
            )}
            
            {update.isBlocker && (
              <span className="bg-danger-100 text-danger-800 text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                <ExclamationTriangleIcon className="w-3 h-3" />
                <span>BLOCKER</span>
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{update.taskName}</h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              {getSourceIcon(update.source)}
              <span>From {update.source === 'daily-scrum' ? 'Daily Scrum' : 'Weekly Email'} - {formatDate(update.sourceDate)}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.proposedStatus)}`}>
          <span className="capitalize">{update.proposedStatus.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Assignee */}
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Assigned: {update.proposedAssignee}</span>
        </div>

        {/* AI Notes */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 font-medium mb-1">AI-Generated Summary:</p>
          <p className="text-sm text-gray-600">{update.aiNotes}</p>
        </div>

        {/* Blocker Reason */}
        {update.isBlocker && update.blockerReason && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p className="text-sm text-danger-700 font-medium mb-1">Blocker Reason:</p>
            <p className="text-sm text-danger-600">{update.blockerReason}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onEdit(update)}
            className="btn-secondary flex items-center space-x-1 px-3 py-1.5 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit</span>
          </motion.button>
        </div>
        
        <div className="flex items-center space-x-2">
          <AnimatePresence>
            {showConfirmReject && (
              <motion.div
                className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <p className="text-sm text-gray-700 mb-2">Are you sure you want to discard this update?</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleReject}
                    className="text-xs bg-danger-600 text-white px-2 py-1 rounded hover:bg-danger-700"
                  >
                    Yes, Discard
                  </button>
                  <button
                    onClick={() => setShowConfirmReject(false)}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={() => setShowConfirmReject(true)}
            className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => onApprove(update.id)}
            className="btn-primary flex items-center space-x-1 px-3 py-1.5 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckIcon className="w-4 h-4" />
            <span>Approve</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateCard; 