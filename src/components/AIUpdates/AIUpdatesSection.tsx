import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon, 
  EnvelopeIcon, 
  DocumentArrowUpIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AIProcessingState } from '../../types/aiUpdates';

interface AIUpdatesSectionProps {
  onNavigateToReview: () => void;
  pendingUpdatesCount: number;
}

const AIUpdatesSection: React.FC<AIUpdatesSectionProps> = ({ 
  onNavigateToReview, 
  pendingUpdatesCount 
}) => {
  const [processingState, setProcessingState] = useState<AIProcessingState>({
    isProcessing: false,
    progress: 0,
    status: 'idle'
  });
  const [showEmailCopied, setShowEmailCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: 'audio' | 'email') => {
    const input = type === 'audio' ? fileInputRef.current : emailInputRef.current;
    if (input) {
      input.click();
    }
  };

  const simulateFileProcessing = (type: 'audio' | 'email') => {
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
              // Navigate to review after processing
              setTimeout(() => {
                onNavigateToReview();
              }, 1000);
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

  const copyEmailToClipboard = async () => {
    const email = 'updates@yourproductdomain.com';
    try {
      await navigator.clipboard.writeText(email);
      setShowEmailCopied(true);
      setTimeout(() => setShowEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
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
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Update Review</h2>
          <p className="text-gray-600 mt-2">
            Effortlessly transform Daily Scrums and weekly emails into actionable project updates. 
            Upload files or forward emails for AI processing, then review and approve the generated summaries.
          </p>
        </div>
        
        {pendingUpdatesCount > 0 && (
          <motion.button
            onClick={onNavigateToReview}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Review Updates</span>
            <span className="bg-white text-primary-600 px-2 py-1 rounded-full text-xs font-bold">
              {pendingUpdatesCount}
            </span>
          </motion.button>
        )}
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio Upload */}
        <motion.div 
          className="card"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <MicrophoneIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Scrum Audio</h3>
              <p className="text-sm text-gray-500">Upload recorded daily standup meetings</p>
            </div>
          </div>
          
          <button
            onClick={() => handleFileUpload('audio')}
            disabled={processingState.isProcessing}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Upload Audio File</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: .mp3, .wav, .m4a (max 50MB)
          </p>
          
          <input
            ref={fileInputRef}
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

        {/* Email Upload */}
        <motion.div 
          className="card"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Email</h3>
              <p className="text-sm text-gray-500">Upload weekly status email files</p>
            </div>
          </div>
          
          <button
            onClick={() => handleFileUpload('email')}
            disabled={processingState.isProcessing}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Upload Email File</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: .eml files (max 10MB)
          </p>
          
          <input
            ref={emailInputRef}
            type="file"
            accept=".eml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                simulateFileProcessing('email');
              }
            }}
          />
        </motion.div>
      </div>

      {/* Forward Email Option */}
      <motion.div 
        className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Forward Email Updates</h3>
            <p className="text-sm text-gray-600">
              Forward your weekly status emails to our dedicated address for automatic processing
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-primary-200">
              <span className="text-sm font-mono text-primary-700">updates@yourproductdomain.com</span>
            </div>
            
            <motion.button
              onClick={copyEmailToClipboard}
              className="p-2 bg-white rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showEmailCopied ? (
                <CheckIcon className="w-5 h-5 text-success-600" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-primary-600" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

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

export default AIUpdatesSection; 