import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import ProjectOverview from './ProjectOverview';
import TaskCard from './TaskCard';
import AIUpdatesSection from '../AIUpdates/AIUpdatesSection';
import PendingUpdatesReview from '../AIUpdates/PendingUpdatesReview';
import { mockProject, mockTasks, mockDashboardStats } from '../../data/mockData';
import { AIUpdate } from '../../types/aiUpdates';
import { AnimatePresence } from 'framer-motion';

interface DashboardProps {
  onTaskClick: (taskId: string) => void;
}

type DashboardView = 'overview' | 'ai-updates' | 'pending-review';

const Dashboard: React.FC<DashboardProps> = ({ onTaskClick }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [pendingUpdatesCount, setPendingUpdatesCount] = useState(5); // Mock count

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeBlockers = mockTasks.flatMap(task => 
    task.blockers.filter(blocker => blocker.status === 'active')
  );

  const handleUpdateApproved = (update: AIUpdate) => {
    // In a real app, this would update the main dashboard
    console.log('Update approved:', update);
    setPendingUpdatesCount(prev => Math.max(0, prev - 1));
  };

  const renderOverviewView = () => (
    <div className="space-y-6">
      {/* Project Overview */}
      <ProjectOverview project={mockProject} stats={mockDashboardStats} />

      {/* Filters and Search */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Tasks & Milestones</h2>
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
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

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </motion.div>

      {/* Active Blockers Section */}
      {activeBlockers.length > 0 && (
        <motion.div 
          className="card border-l-4 border-l-danger-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Blockers</h3>
            <span className="text-sm text-gray-500">{activeBlockers.length} blocker{activeBlockers.length > 1 ? 's' : ''}</span>
          </div>
          
          <div className="space-y-3">
            {activeBlockers.slice(0, 3).map((blocker) => (
              <div key={blocker.id} className="flex items-start space-x-3 p-3 bg-danger-50 rounded-lg">
                <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{blocker.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Priority: {blocker.priority} • Created {new Date(blocker.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  More Info
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tasks Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FunnelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No tasks have been created yet'
            }
          </p>
        </motion.div>
      )}
    </div>
  );

  const renderAIUpdatesView = () => (
    <AIUpdatesSection
      onNavigateToReview={() => setCurrentView('pending-review')}
      pendingUpdatesCount={pendingUpdatesCount}
    />
  );

  const renderPendingReviewView = () => (
    <PendingUpdatesReview
      onBack={() => setCurrentView('ai-updates')}
      onUpdateApproved={handleUpdateApproved}
    />
  );

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentView('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentView === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setCurrentView('ai-updates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
              currentView === 'ai-updates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>AI Updates</span>
            {pendingUpdatesCount > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingUpdatesCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {currentView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderOverviewView()}
          </motion.div>
        )}
        
        {currentView === 'ai-updates' && (
          <motion.div
            key="ai-updates"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAIUpdatesView()}
          </motion.div>
        )}
        
        {currentView === 'pending-review' && (
          <motion.div
            key="pending-review"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPendingReviewView()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 