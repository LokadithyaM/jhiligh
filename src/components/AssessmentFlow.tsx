import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import VoiceInterface from './VoiceInterface';

interface AssessmentFlowProps {
  onComplete: (responses: Record<string, any>) => void;
}

const questions = [
  {
    id: 'interests',
    title: 'What are your main interests?',
    subtitle: 'Tell me about what excites you most',
    voicePrompt: 'What are you most passionate about? What activities or topics make you lose track of time?',
    type: 'multiple',
    options: [
      'Technology & Programming',
      'Creative Arts & Design',
      'Business & Entrepreneurship',
      'Science & Research',
      'Healthcare & Medicine',
      'Education & Teaching',
      'Social Impact & Non-profit',
      'Finance & Economics'
    ]
  },
  {
    id: 'strengths',
    title: 'What are your key strengths?',
    subtitle: 'Choose your top 3 strengths',
    voicePrompt: 'What would your friends and colleagues say you are really good at? What comes naturally to you?',
    type: 'multiple',
    maxSelections: 3,
    options: [
      'Problem Solving',
      'Communication',
      'Leadership',
      'Creativity',
      'Analytical Thinking',
      'Team Collaboration',
      'Technical Skills',
      'Attention to Detail'
    ]
  },
  {
    id: 'workStyle',
    title: 'What work environment do you prefer?',
    subtitle: 'Select your preferred work style',
    voicePrompt: 'Where do you do your best work? Do you prefer working with others or independently?',
    type: 'single',
    options: [
      'Remote work with flexibility',
      'Office-based collaborative environment',
      'Hybrid (mix of remote and office)',
      'Field work or client-facing roles'
    ]
  },
  {
    id: 'experience',
    title: 'What\'s your current experience level?',
    subtitle: 'This helps us tailor our recommendations',
    voicePrompt: 'Tell me about your background. Are you just starting out or looking to make a career change?',
    type: 'single',
    options: [
      'Complete beginner',
      'Some experience or education',
      'Mid-level professional',
      'Senior professional looking to pivot'
    ]
  },
  {
    id: 'goals',
    title: 'What are your career goals?',
    subtitle: 'What do you hope to achieve?',
    voicePrompt: 'What does career success look like to you? What are your priorities?',
    type: 'multiple',
    options: [
      'High earning potential',
      'Work-life balance',
      'Making a positive impact',
      'Continuous learning & growth',
      'Job security & stability',
      'Creative freedom',
      'Leadership opportunities',
      'Entrepreneurial ventures'
    ]
  }
];

const AssessmentFlow = ({ onComplete }: AssessmentFlowProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleVoiceTranscript = (text: string) => {
    // Simple voice response processing
    const questionId = question.id;
    
    if (question.type === 'single') {
      // Find the best matching option
      const matchedOption = question.options.find(option => 
        text.toLowerCase().includes(option.toLowerCase().split(' ')[0].toLowerCase())
      );
      if (matchedOption) {
        setResponses(prev => ({ ...prev, [questionId]: matchedOption }));
      }
    } else {
      // For multiple choice, look for keywords
      const matches = question.options.filter(option =>
        text.toLowerCase().includes(option.toLowerCase().split(' ')[0].toLowerCase())
      );
      if (matches.length > 0) {
        setResponses(prev => ({ ...prev, [questionId]: matches }));
      }
    }
  };

  const handleOptionSelect = (option: string) => {
    const questionId = question.id;
    
    if (question.type === 'single') {
      setResponses(prev => ({ ...prev, [questionId]: option }));
    } else {
      const currentSelections = responses[questionId] || [];
      const maxSelections = question.maxSelections || Infinity;
      
      if (currentSelections.includes(option)) {
        setResponses(prev => ({
          ...prev,
          [questionId]: currentSelections.filter((item: string) => item !== option)
        }));
      } else if (currentSelections.length < maxSelections) {
        setResponses(prev => ({
          ...prev,
          [questionId]: [...currentSelections, option]
        }));
      }
    }
  };

  const canProceed = () => {
    const questionId = question.id;
    const response = responses[questionId];
    
    if (question.type === 'single') {
      return !!response;
    } else {
      return response && response.length > 0;
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const isSelected = (option: string) => {
    const questionId = question.id;
    const response = responses[questionId];
    
    if (question.type === 'single') {
      return response === option;
    } else {
      return response && response.includes(option);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200" />
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {question.title}
              </h2>
              <VoiceInterface 
                textToSpeak={question.voicePrompt}
                onTranscript={handleVoiceTranscript}
              />
            </div>
            <p className="text-gray-600">
              {question.subtitle}
            </p>
            {question.maxSelections && (
              <p className="text-sm text-blue-600 mt-1">
                Select up to {question.maxSelections} options
              </p>
            )}
          </div>

          <div className="grid gap-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  isSelected(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    isSelected(option)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected(option) && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center"
            >
              {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentFlow;
