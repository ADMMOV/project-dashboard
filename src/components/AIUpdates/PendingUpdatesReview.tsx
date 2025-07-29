import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { AIUpdate } from '../../types/aiUpdates';
import { mockAIUpdates } from '../../data/aiMockData';
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
                         update.aiNotes.toLowerCase().includes(searchTerm.toLowerCase());
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
      onUpdateApproved(update);
      setUpdates(prev => prev.filter(u => u.id !== updateId));
      setSelectedUpdates(prev => prev.filter(id => id !== updateId));
    }
  };

  const handleReject = (updateId: string) => {
    setUpdates(prev => prev.filter(u => u.id !== updateId));
    setSelectedUpdates(prev => prev.filter(id => id !== updateId));
  };

  const handleEdit = (update: AIUpdate) => {
    // For now, just log the edit action
    console.log('Edit update:', update);
    // In a real implementation, this would open an edit modal
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

  const getSourceLabel = (source: string) => {
    return source === 'daily-scrum' ? 'Daily Scrum' : 'Weekly Email';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
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
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </motion.button>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending AI Updates Review</h2>
            <p className="text-gray-600 mt-1">
              Review and approve AI-generated updates from Daily Scrums and weekly emails
            </p>
          </div>
        </div>

        {updates.length > 0 && (
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleApproveAllSelected}
              disabled={selectedUpdates.length === 0}
              className={`btn-primary flex items-center space-x-2 ${
                selectedUpdates.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={selectedUpdates.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedUpdates.length > 0 ? { scale: 0.98 } : {}}
            >
              <CheckIcon className="w-4 h-4" />
              <span>Approve Selected ({selectedUpdates.length})</span>
            </motion.button>
            
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
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Sources</option>
            <option value="daily-scrum">Daily Scrum</option>
            <option value="weekly-email">Weekly Email</option>
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
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredUpdates.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FunnelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No pending AI updates to review'
            }
          </p>
        </motion.div>
      )}

      {/* Discard All Confirmation */}
      <AnimatePresence>
        {showDiscardAllConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Discard All Updates</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to discard all {updates.length} pending updates? This action cannot be undone.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDiscardAllConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDiscardAll}
                  className="bg-danger-600 hover:bg-danger-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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