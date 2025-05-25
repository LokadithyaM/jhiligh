import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OptionAssessmentProps {
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
}

const optionQuestions = [
  {
    id: 'interests',
    title: 'What do you enjoy doing the most?',
    type: 'multiple',
    options: [
      { value: 'problem-solving', label: '🧩 Solving complex problems', icon: '🧩' },
      { value: 'creative-design', label: '🎨 Designing and creating things', icon: '🎨' },
      { value: 'helping-people', label: '🤝 Helping and supporting others', icon: '🤝' },
      { value: 'leading-teams', label: '👥 Leading and managing teams', icon: '👥' },
      { value: 'analyzing-data', label: '📊 Analyzing data and trends', icon: '📊' },
      { value: 'building-systems', label: '⚙️ Building systems and processes', icon: '⚙️' }
    ]
  },
  {
    id: 'strengths',
    title: 'What are your key strengths?',
    subtitle: 'Select up to 3 that describe you best',
    type: 'multiple',
    maxSelections: 3,
    options: [
      { value: 'communication', label: '💬 Communication', icon: '💬' },
      { value: 'leadership', label: '🎯 Leadership', icon: '🎯' },
      { value: 'creativity', label: '✨ Creativity', icon: '✨' },
      { value: 'analytical', label: '🔍 Analytical thinking', icon: '🔍' },
      { value: 'technical', label: '💻 Technical skills', icon: '💻' },
      { value: 'empathy', label: '❤️ Empathy and emotional intelligence', icon: '❤️' },
      { value: 'organization', label: '📋 Organization and planning', icon: '📋' },
      { value: 'adaptability', label: '🔄 Adaptability', icon: '🔄' }
    ]
  },
  {
    id: 'workStyle',
    title: 'What work environment suits you best?',
    type: 'single',
    options: [
      { value: 'remote', label: '🏠 Remote work with flexibility', icon: '🏠' },
      { value: 'office', label: '🏢 Office-based collaborative environment', icon: '🏢' },
      { value: 'hybrid', label: '🔄 Hybrid (mix of remote and office)', icon: '🔄' },
      { value: 'field', label: '🌍 Field work or client-facing roles', icon: '🌍' }
    ]
  },
  {
    id: 'goals',
    title: 'What are your career priorities?',
    type: 'multiple',
    options: [
      { value: 'high-earning', label: '💰 High earning potential', icon: '💰' },
      { value: 'work-life-balance', label: '⚖️ Work-life balance', icon: '⚖️' },
      { value: 'positive-impact', label: '🌟 Making a positive impact', icon: '🌟' },
      { value: 'continuous-learning', label: '📚 Continuous learning & growth', icon: '📚' },
      { value: 'job-security', label: '🛡️ Job security & stability', icon: '🛡️' },
      { value: 'creative-freedom', label: '🎭 Creative freedom', icon: '🎭' }
    ]
  },
  {
    id: 'experience',
    title: 'What\'s your current experience level?',
    type: 'single',
    options: [
      { value: 'beginner', label: '🌱 Just starting my career journey', icon: '🌱' },
      { value: 'some-experience', label: '📈 Some experience or education', icon: '📈' },
      { value: 'mid-level', label: '💼 Mid-level professional', icon: '💼' },
      { value: 'senior-pivot', label: '🔄 Senior professional looking to pivot', icon: '🔄' }
    ]
  }
];

const OptionAssessment = ({ onComplete, onBack }: OptionAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const question = optionQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / optionQuestions.length) * 100;

  const handleOptionSelect = (optionValue: string) => {
    const questionId = question.id;
    
    if (question.type === 'single') {
      setResponses(prev => ({ ...prev, [questionId]: optionValue }));
    } else {
      const currentSelections = responses[questionId] || [];
      const maxSelections = question.maxSelections || Infinity;
      
      if (currentSelections.includes(optionValue)) {
        setResponses(prev => ({
          ...prev,
          [questionId]: currentSelections.filter((item: string) => item !== optionValue)
        }));
      } else if (currentSelections.length < maxSelections) {
        setResponses(prev => ({
          ...prev,
          [questionId]: [...currentSelections, optionValue]
        }));
      }
    }
  };

  const isSelected = (optionValue: string) => {
    const questionId = question.id;
    const response = responses[questionId];
    
    if (question.type === 'single') {
      return response === optionValue;
    } else {
      return response && response.includes(optionValue);
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
    if (currentQuestion < optionQuestions.length - 1) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={currentQuestion === 0 ? onBack : handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentQuestion === 0 ? 'Back' : 'Previous'}
          </Button>
          
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              Step {currentQuestion + 1} of {optionQuestions.length}
            </span>
          </div>
          
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <Progress value={progress} className="h-3 mb-8 bg-gray-200" />

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {question.title}
            </h2>
            {question.subtitle && (
              <p className="text-lg text-blue-600 font-medium">
                {question.subtitle}
              </p>
            )}
          </div>

          <div className="grid gap-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`p-6 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                  isSelected(option.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    isSelected(option.value)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected(option.value) && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="font-medium text-lg">{option.label.replace(/^[^\s]+ /, '')}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
            >
              {currentQuestion === optionQuestions.length - 1 ? 'Get My Results' : 'Next Question'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OptionAssessment;
