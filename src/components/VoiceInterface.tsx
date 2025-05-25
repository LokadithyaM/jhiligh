import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVapi } from '@/hooks/useVapi';

interface VoiceInterfaceProps {
  onTranscript?: (text: string) => void;
  textToSpeak?: string;
  className?: string;
}

const VoiceInterface = ({ onTranscript, textToSpeak, className }: VoiceInterfaceProps) => {
  const { isConnected, isListening, isSpeaking, startListening, stopListening, speak } = useVapi();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakClick = () => {
    if (textToSpeak) {
      speak(textToSpeak);
    }
  };

  if (!isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-sm text-gray-500">Connecting voice...</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        onClick={handleMicClick}
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        className={`relative ${isListening ? 'animate-pulse' : ''}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {isListening ? 'Stop' : 'Speak'}
      </Button>

      {textToSpeak && (
        <Button
          onClick={handleSpeakClick}
          variant="outline"
          size="sm"
          disabled={isSpeaking}
          className={isSpeaking ? 'animate-pulse' : ''}
        >
          <Volume2 className="w-4 h-4" />
          {isSpeaking ? 'Speaking...' : 'Listen'}
        </Button>
      )}

      {isListening && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
