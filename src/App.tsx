import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import LoginScreen from './components/Auth/LoginScreen';
import Dashboard from './components/Dashboard/Dashboard';
import AIUpdatesCenter from './components/AIUpdates/AIUpdatesCenter';
import PendingUpdatesReview from './components/AIUpdates/PendingUpdatesReview';
import FiveDaysDashboard from './components/ClientDashboard/FiveDaysDashboard';
import { mockUsers } from './data/mockData';
import { UserRole, DashboardView } from './types/fiveDays';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [userRole, setUserRole] = useState<UserRole>('pm');
  const [currentView, setCurrentView] = useState<DashboardView>('ai-updates');

  const handleLogin = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Determine role based on email or user data
      if (email.includes('client')) {
        setUserRole('client');
        setCurrentView('five-days');
      } else {
        setUserRole('pm');
        setCurrentView('ai-updates');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('ai-updates');
    setUserRole('pm');
  };

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId);
  };

  const handleNavigateToReview = () => {
    setCurrentView('pending-review');
  };

  const handleBackToAIUpdates = () => {
    setCurrentView('ai-updates');
  };

  const renderMainContent = () => {
    if (userRole === 'client') {
      return <FiveDaysDashboard />;
    }

    switch (currentView) {
      case 'ai-updates':
        return (
          <AIUpdatesCenter
            onNavigateToReview={handleNavigateToReview}
            pendingUpdatesCount={5}
          />
        );
      case 'pending-review':
        return (
          <PendingUpdatesReview
            onBack={handleBackToAIUpdates}
            onUpdateApproved={(update) => {
              console.log('Update approved:', update);
              // In a real app, this would update the 5 Days dashboard
            }}
          />
        );
      case 'five-days':
        return <FiveDaysDashboard />;
      default:
        return (
          <AIUpdatesCenter
            onNavigateToReview={handleNavigateToReview}
            pendingUpdatesCount={5}
          />
        );
    }
  };

  const renderNavigation = () => {
    if (userRole === 'client') {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Client View</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentView('ai-updates')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'ai-updates'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          AI Updates
        </button>
        <button
          onClick={() => setCurrentView('pending-review')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'pending-review'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setCurrentView('five-days')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'five-days'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          5 Days View
        </button>
        <button
          onClick={() => setUserRole('client')}
          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300"
        >
          Switch to Client View
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Header currentUser={currentUser} onLogout={handleLogout} />
            
            {/* Navigation */}
            <div className="border-b border-gray-200 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {renderNavigation()}
                </div>
              </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
