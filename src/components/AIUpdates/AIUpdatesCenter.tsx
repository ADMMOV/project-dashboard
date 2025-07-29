import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  DocumentArrowUpIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AIProcessingState } from '../../types/fiveDays';

interface AIUpdatesCenterProps {
  onNavigateToReview: () => void;
  pendingUpdatesCount: number;
}

const AIUpdatesCenter: React.FC<AIUpdatesCenterProps> = ({ 
  onNavigateToReview, 
  pendingUpdatesCount 
}) => {
  const [processingState, setProcessingState] = useState<AIProcessingState>({
    isProcessing: false,
    progress: 0,
    status: 'idle'
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const audioInputRef = useRef<HTMLInputElement>(null);
  const weeklyEmailInputRef = useRef<HTMLInputElement>(null);
  const sprintEmailInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: 'audio' | 'weekly-email' | 'sprint-email') => {
    const input = type === 'audio' ? audioInputRef.current : 
                 type === 'weekly-email' ? weeklyEmailInputRef.current : 
                 sprintEmailInputRef.current;
    if (input) {
      input.click();
    }
  };

  const simulateFileProcessing = (type: 'audio' | 'weekly-email' | 'sprint-email') => {
    setProcessingState({
      isProcessing: true,
      progress: 0,
      status: 'uploading'
    });

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProcessingState(prev => {
        if (prev.progress >= 100) {
          clearInterval(uploadInterval);
          return {
            isProcessing: false,
            progress: 100,
            status: 'completed'
          };
        }
        return {
          ...prev,
          progress: prev.progress + 10
        };
      });
    }, 200);

    // Simulate AI processing after upload
    setTimeout(() => {
      setProcessingState({
        isProcessing: true,
        progress: 0,
        status: 'processing'
      });

      const processingInterval = setInterval(() => {
        setProcessingState(prev => {
          if (prev.progress >= 100) {
            clearInterval(processingInterval);
            setTimeout(() => {
              setProcessingState({
                isProcessing: false,
                progress: 100,
                status: 'completed'
              });
              
              // Show success message
              const messages = {
                'audio': 'Audio sent for processing!',
                'weekly-email': 'Email sent for processing!',
                'sprint-email': 'Sprint Plan sent for processing!'
              };
              setSuccessMessage(messages[type]);
              
              // Navigate to review after a delay
              setTimeout(() => {
                onNavigateToReview();
              }, 2000);
            }, 500);
            return prev;
          }
          return {
            ...prev,
            progress: prev.progress + 5
          };
        });
      }, 100);
    }, 2000);
  };

  const getProcessingStatusText = () => {
    switch (processingState.status) {
      case 'uploading':
        return 'Uploading file...';
      case 'processing':
        return 'Processing with AI...';
      case 'completed':
        return 'Processing complete!';
      case 'error':
        return 'Processing failed';
      default:
        return '';
    }
  };

  const getUploadIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <MicrophoneIcon className="w-6 h-6" />;
      case 'weekly-email':
        return <EnvelopeIcon className="w-6 h-6" />;
      case 'sprint-email':
        return <CalendarIcon className="w-6 h-6" />;
      default:
        return <DocumentArrowUpIcon className="w-6 h-6" />;
    }
  };

  const getUploadTitle = (type: string) => {
    switch (type) {
      case 'audio':
        return 'Daily Scrum Audio';
      case 'weekly-email':
        return 'Weekly Status Email';
      case 'sprint-email':
        return 'Sprint Planning Email';
      default:
        return 'Upload File';
    }
  };

  const getUploadDescription = (type: string) => {
    switch (type) {
      case 'audio':
        return 'Upload recorded daily standup meetings';
      case 'weekly-email':
        return 'Upload weekly status email files';
      case 'sprint-email':
        return 'Upload sprint planning emails for 5-day planning';
      default:
        return 'Upload file for AI processing';
    }
  };

  const getFileTypes = (type: string) => {
    switch (type) {
      case 'audio':
        return 'MP3, WAV, M4A';
      case 'weekly-email':
      case 'sprint-email':
        return 'EML files';
      default:
        return 'All files';
    }
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
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Update Center</h2>
          </div>
          <p className="text-gray-600">
            Upload your Daily Scrum audio, weekly status emails, and sprint planning emails for AI processing. 
            Review and approve the AI's suggestions before they appear on the client dashboard.
          </p>
        </div>
        
        {pendingUpdatesCount > 0 && (
          <motion.button
            onClick={onNavigateToReview}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Pending Updates</span>
            <span className="bg-white text-primary-600 px-2 py-1 rounded-full text-xs font-bold">
              {pendingUpdatesCount}
            </span>
          </motion.button>
        )}
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Scrum Audio */}
        <motion.div 
          className="card hover:shadow-lg transition-all duration-200"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              {getUploadIcon('audio')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{getUploadTitle('audio')}</h3>
              <p className="text-sm text-gray-500">{getUploadDescription('audio')}</p>
            </div>
          </div>
          
          <button
            onClick={() => handleFileUpload('audio')}
            disabled={processingState.isProcessing}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Upload Daily Scrum Audio ({getFileTypes('audio')})</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: {getFileTypes('audio')} (max 50MB)
          </p>
          
          <input
            ref={audioInputRef}
            type="file"
            accept=".mp3,.wav,.m4a"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                simulateFileProcessing('audio');
              }
            }}
          />
        </motion.div>

        {/* Weekly Status Email */}
        <motion.div 
          className="card hover:shadow-lg transition-all duration-200"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              {getUploadIcon('weekly-email')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{getUploadTitle('weekly-email')}</h3>
              <p className="text-sm text-gray-500">{getUploadDescription('weekly-email')}</p>
            </div>
          </div>
          
          <button
            onClick={() => handleFileUpload('weekly-email')}
            disabled={processingState.isProcessing}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Upload Weekly Status Email ({getFileTypes('weekly-email')})</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: {getFileTypes('weekly-email')} (max 10MB)
          </p>
          
          <input
            ref={weeklyEmailInputRef}
            type="file"
            accept=".eml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                simulateFileProcessing('weekly-email');
              }
            }}
          />
        </motion.div>

        {/* Sprint Planning Email */}
        <motion.div 
          className="card hover:shadow-lg transition-all duration-200"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              {getUploadIcon('sprint-email')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{getUploadTitle('sprint-email')}</h3>
              <p className="text-sm text-gray-500">{getUploadDescription('sprint-email')}</p>
            </div>
          </div>
          
          <button
            onClick={() => handleFileUpload('sprint-email')}
            disabled={processingState.isProcessing}
            className="w-full bg-success-600 hover:bg-success-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Upload Sprint Planning Email ({getFileTypes('sprint-email')})</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: {getFileTypes('sprint-email')} (max 10MB)
          </p>
          
          <input
            ref={sprintEmailInputRef}
            type="file"
            accept=".eml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                simulateFileProcessing('sprint-email');
              }
            }}
          />
        </motion.div>
      </div>

      {/* Processing Status */}
      <AnimatePresence>
        {processingState.isProcessing && (
          <motion.div
            className="card bg-blue-50 border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  {getProcessingStatusText()}
                </p>
                
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingState.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            className="card bg-success-50 border-success-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-3">
              <CheckIcon className="w-6 h-6 text-success-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-success-900">{successMessage}</p>
                <p className="text-xs text-success-700 mt-1">Redirecting to review updates...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {processingState.status === 'error' && (
          <motion.div
            className="card bg-danger-50 border-danger-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-3">
              <XMarkIcon className="w-6 h-6 text-danger-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-danger-900">
                  {processingState.errorMessage || 'Processing failed'}
                </p>
                <p className="text-xs text-danger-700 mt-1">
                  Please try uploading the file again
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIUpdatesCenter; 