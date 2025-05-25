import React, { useState } from 'react';
import AuthProvider from '@/components/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import WelcomeScreen from '@/components/WelcomeScreen';
import Dashboard from '@/components/Dashboard';
import VoiceAssessment from '@/components/VoiceAssessment';
import OptionAssessment from '@/components/OptionAssessment';
import CareerResults from '@/components/CareerResults';

type AppMode = 'welcome' | 'dashboard' | 'voice-assessment' | 'option-assessment' | 'results';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentMode, setCurrentMode] = useState<AppMode>('welcome');
  const [assessmentResults, setAssessmentResults] = useState<Record<string, any>>({});

  const handleStartVoice = () => setCurrentMode('voice-assessment');
  const handleStartOptions = () => setCurrentMode('option-assessment');
  
  const handleAssessmentComplete = (results: Record<string, any>) => {
    setAssessmentResults(results);
    setCurrentMode('results');
  };

  const handleRestart = () => {
    setCurrentMode('welcome');
    setAssessmentResults({});
  };

  const handleBackToWelcome = () => setCurrentMode('welcome');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated and no specific mode is selected
  if (user && currentMode === 'welcome') {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen">
      {currentMode === 'welcome' && (
        <WelcomeScreen 
          onStartVoice={handleStartVoice}
          onStartOptions={handleStartOptions}
        />
      )}
      
      {currentMode === 'voice-assessment' && (
        <VoiceAssessment 
          onComplete={handleAssessmentComplete}
          onBack={handleBackToWelcome}
        />
      )}
      
      {currentMode === 'option-assessment' && (
        <OptionAssessment 
          onComplete={handleAssessmentComplete}
          onBack={handleBackToWelcome}
        />
      )}
      
      {currentMode === 'results' && (
        <CareerResults 
          responses={assessmentResults}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
