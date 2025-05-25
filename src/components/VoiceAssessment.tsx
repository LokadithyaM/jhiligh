import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, RotateCcw, ArrowLeft } from 'lucide-react';
import { useVapi } from '@/hooks/useVapi';

interface VoiceAssessmentProps {
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
}

const voiceQuestions = [
  {
    id: 'interests',
    question: "What kind of work excites you the most? What activities make you lose track of time?",
    followUp: "Tell me more about what specifically draws you to that type of work."
  },
  {
    id: 'strengths',
    question: "What would your friends and colleagues say you're really good at? What comes naturally to you?",
    followUp: "Can you give me an example of when you've used these strengths?"
  },
  {
    id: 'workStyle',
    question: "Where do you do your best work? Do you prefer working with others or independently?",
    followUp: "What kind of environment helps you be most productive?"
  },
  {
    id: 'goals',
    question: "What does career success look like to you? What are your priorities?",
    followUp: "What would make you feel fulfilled in your work?"
  },
  {
    id: 'experience',
    question: "Tell me about your background. Are you just starting out or looking to make a career change?",
    followUp: "What experiences have shaped your career interests so far?"
  }
];

const VoiceAssessment = ({ onComplete, onBack }: VoiceAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { isConnected, isListening, startListening, stopListening, speak } = useVapi();

  const progress = ((currentQuestion + 1) / voiceQuestions.length) * 100;
  const question = voiceQuestions[currentQuestion];

  useEffect(() => {
    if (isConnected && question) {
      speak(question.question);
    }
  }, [isConnected, question, speak]);

  const handleVoiceResponse = (text: string) => {
    setTranscript(text);
    const questionId = question.id;
    setResponses(prev => ({ ...prev, [questionId]: text }));
  };

  const handleNext = async () => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    
    // Brief acknowledgment
    await speak("Got it, thank you!");
    
    if (currentQuestion < voiceQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTranscript('');
      setIsProcessing(false);
    } else {
      await speak("Perfect! Let me analyze your responses and find the best career paths for you.");
      onComplete(responses);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setResponses({});
    setTranscript('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <div className="animate-pulse mb-4">
            <Mic className="w-12 h-12 mx-auto text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connecting Voice...</h3>
          <p className="text-gray-600">Setting up your voice interface</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {voiceQuestions.length}
            </span>
          </div>
          
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        <Progress value={progress} className="h-3 mb-8 bg-gray-200" />

        <Card className="p-8 mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {question.question}
          </h2>

          <div className="flex flex-col items-center space-y-6">
            {/* Voice Waveform Animation */}
            <div className={`relative w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'border-red-500 bg-red-50 animate-pulse' 
                : 'border-blue-500 bg-blue-50'
            }`}>
              {isListening ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-red-500 rounded animate-bounce"></div>
                  <div className="w-2 h-12 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-6 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-10 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              ) : (
                <Mic className="w-8 h-8 text-blue-500" />
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className={isListening ? '' : 'bg-blue-500 hover:bg-blue-600'}
                disabled={isProcessing}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Speaking
                  </>
                )}
              </Button>
            </div>

            {/* Live Transcript */}
            {transcript && (
              <div className="w-full">
                <h4 className="font-semibold text-gray-700 mb-2">Your Response:</h4>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-gray-800">{transcript}</p>
                </div>
              </div>
            )}

            {/* Status Messages */}
            <div className="text-center">
              {isListening && (
                <p className="text-red-600 font-medium flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  Listening... speak naturally
                </p>
              )}
              {isProcessing && (
                <p className="text-blue-600 font-medium">Processing your response...</p>
              )}
              {!isListening && !isProcessing && transcript && (
                <p className="text-green-600 font-medium">Ready to continue!</p>
              )}
            </div>
          </div>
        </Card>

        {/* Next Button */}
        {transcript && !isProcessing && (
          <div className="text-center">
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {currentQuestion === voiceQuestions.length - 1 ? 'Get My Results' : 'Next Question'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssessment;
