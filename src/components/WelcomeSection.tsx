import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Target, Users, TrendingUp, Mic } from 'lucide-react';
import VoiceInterface from './VoiceInterface';

interface WelcomeSectionProps {
  onStart: () => void;
}

const WelcomeSection = ({ onStart }: WelcomeSectionProps) => {
  const welcomeText = "Welcome to CareerGuide GPT! I'm your AI career counselor, ready to help you discover the perfect career path. We'll have a quick conversation about your interests and goals.";

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            CareerGuide GPT
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered career counselor with voice interaction
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Speak naturally or click through our assessment to get personalized career recommendations
          </p>
          
          <div className="flex justify-center mb-8">
            <VoiceInterface 
              textToSpeak={welcomeText}
              className="bg-blue-50 px-4 py-2 rounded-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Interaction</h3>
            <p className="text-gray-600 text-sm">
              Speak naturally or type your responses - your choice!
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Recommendations</h3>
            <p className="text-gray-600 text-sm">
              AI-powered career suggestions based on your unique profile
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-0">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Skills Roadmap</h3>
            <p className="text-gray-600 text-sm">
              Detailed learning paths with resources and project ideas
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Your Career Journey
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Takes about 3 minutes • Voice & Text Enabled • 100% Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
