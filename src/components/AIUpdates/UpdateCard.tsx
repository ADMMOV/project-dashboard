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
  EnvelopeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AIUpdate, MondayItem } from '../../types/fiveDays';

interface UpdateCardProps {
  update: AIUpdate;
  onApprove: (updateId: string) => void;
  onReject: (updateId: string) => void;
  onEdit: (update: AIUpdate) => void;
  isSelected: boolean;
  onSelect: (updateId: string, selected: boolean) => void;
  mondayItems: MondayItem[];
}

const UpdateCard: React.FC<UpdateCardProps> = ({ 
  update, 
  onApprove, 
  onReject, 
  onEdit, 
  isSelected, 
  onSelect,
  mondayItems 
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
    switch (source) {
      case 'daily-scrum':
        return <MicrophoneIcon className="w-4 h-4" />;
      case 'weekly-email':
        return <EnvelopeIcon className="w-4 h-4" />;
      case 'sprint-planning':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <SparklesIcon className="w-4 h-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'daily-scrum':
        return 'Daily Scrum';
      case 'weekly-email':
        return 'Weekly Email';
      case 'sprint-planning':
        return 'Sprint Planning';
      default:
        return 'Unknown';
    }
  };

  const getSourceDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const linkedMondayItem = update.linkedMondayItemId 
    ? mondayItems.find(item => item.id === update.linkedMondayItemId)
    : null;

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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(update.id, e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              {getSourceIcon(update.source)}
            </div>
            <div>
              <p className="text-xs text-gray-500">
                From {getSourceLabel(update.source)} - {getSourceDate(update.sourceDate)}
              </p>
              {update.sourceFileName && (
                <p className="text-xs text-gray-400">{update.sourceFileName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {update.isNewTask ? (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              NEW TASK
            </span>
          ) : linkedMondayItem ? (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              UPDATE TO: {linkedMondayItem.name}
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              UPDATE
            </span>
          )}
        </div>
      </div>

      {/* Task Information */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {update.taskName}
          </h3>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <UserCircleIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{update.proposedAssignee}</span>
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(update.proposedStatus)}`}>
              {update.proposedStatus.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* AI Notes */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">AI-Generated Notes:</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">{update.aiNotes}</p>
          </div>
        </div>

        {/* PM Notes */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">PM Notes:</h4>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">{update.pmNotes}</p>
          </div>
        </div>

        {/* Monday.com Integration */}
        {linkedMondayItem && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <CheckIcon className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm font-medium text-green-800">
                Linked to Monday.com: {linkedMondayItem.name}
              </span>
            </div>
          </div>
        )}

        {/* Blocker Warning */}
        {update.isBlocker && update.blockerReason && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-danger-600" />
              <span className="text-sm font-medium text-danger-700">BLOCKER DETECTED</span>
            </div>
            <p className="text-sm text-danger-600">{update.blockerReason}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
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
                className="absolute right-0 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <p className="text-sm text-gray-700 mb-2">Discard this update?</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowConfirmReject(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onReject(update.id);
                      setShowConfirmReject(false);
                    }}
                    className="text-xs text-danger-600 hover:text-danger-700 font-medium"
                  >
                    Discard
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