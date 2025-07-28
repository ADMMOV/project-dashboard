import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Project, DashboardStats } from '../../types';

interface ProjectOverviewProps {
  project: Project;
  stats: DashboardStats;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, stats }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'at-risk':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'delayed':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'completed':
        return 'bg-success-100 text-success-800 border-success-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'at-risk':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'delayed':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: project.budget.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Main Project Overview Card */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                <span className="text-sm font-medium capitalize">{project.status.replace('-', ' ')}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Started {formatDate(project.startDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>Due {formatDate(project.endDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Last updated {getRelativeTime(project.lastUpdated)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${project.progress}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{project.progress}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Complete</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-success-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}/{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Days Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{stats.daysRemaining}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget.used)}</p>
              <p className="text-xs text-gray-500">of {formatCurrency(project.budget.allocated)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 text-blue-600 font-bold text-sm">V</div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Velocity</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teamVelocity}</p>
              <p className="text-xs text-gray-500">points/week</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectOverview; 