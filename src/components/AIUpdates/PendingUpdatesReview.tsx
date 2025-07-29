import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  XMarkIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AIUpdate } from '../../types/fiveDays';
import { mockAIUpdates, mockMondayItems } from '../../data/mondayMockData';
import UpdateCard from './UpdateCard';

interface PendingUpdatesReviewProps {
  onBack: () => void;
  onUpdateApproved: (update: AIUpdate) => void;
}

const PendingUpdatesReview: React.FC<PendingUpdatesReviewProps> = ({ 
  onBack, 
  onUpdateApproved 
}) => {
  const [updates, setUpdates] = useState<AIUpdate[]>(mockAIUpdates);
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [showDiscardAllConfirm, setShowDiscardAllConfirm] = useState(false);

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.proposedAssignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || update.proposedStatus === statusFilter;
    const matchesSource = sourceFilter === 'all' || update.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleSelectUpdate = (updateId: string, selected: boolean) => {
    if (selected) {
      setSelectedUpdates(prev => [...prev, updateId]);
    } else {
      setSelectedUpdates(prev => prev.filter(id => id !== updateId));
    }
  };

  const handleSelectAll = () => {
    if (selectedUpdates.length === filteredUpdates.length) {
      setSelectedUpdates([]);
    } else {
      setSelectedUpdates(filteredUpdates.map(update => update.id));
    }
  };

  const handleApprove = (updateId: string) => {
    const update = updates.find(u => u.id === updateId);
    if (update) {
      const updatedUpdate = { ...update, isApproved: true };
      onUpdateApproved(updatedUpdate);
      setUpdates(prev => prev.filter(u => u.id !== updateId));
      setSelectedUpdates(prev => prev.filter(id => id !== updateId));
    }
  };

  const handleReject = (updateId: string) => {
    setUpdates(prev => prev.filter(u => u.id !== updateId));
    setSelectedUpdates(prev => prev.filter(id => id !== updateId));
  };

  const handleEdit = (update: AIUpdate) => {
    console.log('Edit update:', update);
    // In a real app, this would open an edit modal
  };

  const handleApproveAllSelected = () => {
    selectedUpdates.forEach(updateId => {
      handleApprove(updateId);
    });
  };

  const handleDiscardAll = () => {
    setUpdates([]);
    setSelectedUpdates([]);
    setShowDiscardAllConfirm(false);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'daily-scrum':
        return '🎤';
      case 'weekly-email':
        return '📧';
      case 'sprint-planning':
        return '📅';
      default:
        return '📄';
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

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review & Approve AI Updates</h2>
              <p className="text-sm text-gray-500">
                Review AI-generated updates before they appear on the client dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedUpdates.length > 0 && (
            <motion.button
              onClick={handleApproveAllSelected}
              className="btn-primary flex items-center space-x-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckIcon className="w-4 h-4" />
              <span>Approve Selected ({selectedUpdates.length})</span>
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setShowDiscardAllConfirm(true)}
            className="btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Discard All</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="daily-scrum">Daily Scrum</option>
            <option value="weekly-email">Weekly Email</option>
            <option value="sprint-planning">Sprint Planning</option>
          </select>
        </div>
      </div>

      {/* Select All */}
      {filteredUpdates.length > 0 && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedUpdates.length === filteredUpdates.length}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-600">
            Select all ({filteredUpdates.length} updates)
          </span>
        </div>
      )}

      {/* Updates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredUpdates.map((update) => (
            <UpdateCard
              key={update.id}
              update={update}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              isSelected={selectedUpdates.includes(update.id)}
              onSelect={handleSelectUpdate}
              mondayItems={mockMondayItems}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredUpdates.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No updates to review</h3>
          <p className="text-gray-500">
            {updates.length === 0 
              ? "Upload some files to get started with AI processing"
              : "No updates match your current filters"
            }
          </p>
        </motion.div>
      )}

      {/* Discard All Confirmation Modal */}
      <AnimatePresence>
        {showDiscardAllConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDiscardAllConfirm(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Discard All Updates</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to discard all {updates.length} pending updates? 
                This will permanently remove them from the review queue.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDiscardAllConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDiscardAll}
                  className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
                >
                  Discard All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PendingUpdatesReview; 