import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, ArrowLeft, Send, Sparkles, Users, Bot } from 'lucide-react';

interface ChatLandingSectionProps {
  onStartChat: () => void;
  onBack: () => void;
}

const ChatLandingSection = ({ onStartChat, onBack }: ChatLandingSectionProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to AI Career Chat",
      subtitle: "Your personal career counselor is ready to help",
      content: "I'm here to guide you through career decisions, explore opportunities, and help you find your ideal path forward.",
      icon: <Bot className="w-8 h-8 text-blue-500" />
    },
    {
      title: "What can I help with?",
      subtitle: "I can assist you with various career topics",
      content: "Career transitions, skill development, industry insights, job search strategies, and personalized recommendations.",
      icon: <Users className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Let's get started!",
      subtitle: "Ready to begin your career journey?",
      content: "Click below to start our conversation. I'll ask you some questions to better understand your goals.",
      icon: <Sparkles className="w-8 h-8 text-green-500" />
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-4 flex justify-center">
              {currentStepData.icon}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              {currentStepData.title}
            </h1>
            
            <p className="text-xl text-gray-700 mb-4">
              {currentStepData.subtitle}
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            {currentStep < steps.length - 1 ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-6"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6"
                >
                  Next
                </Button>
              </>
            ) : (
              <Button 
                onClick={onStartChat}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Start Chat Now
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Free • Personalized • AI-Powered Career Guidance
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatLandingSection;
