import { useState, useEffect, useRef } from 'react';

interface VapiConfig {
  apiKey: string;
  assistant?: {
    name: string;
    voice: {
      provider: string;
      voiceId: string;
    };
    model: {
      provider: string;
      model: string;
      messages: Array<{
        role: string;
        content: string;
      }>;
    };
  };
}

export const useVapi = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const vapiRef = useRef<any>(null);

  const initializeVapi = async () => {
    try {
      // Load Vapi SDK
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.js';
      document.head.appendChild(script);

      script.onload = () => {
        const config: VapiConfig = {
          apiKey: 'b19f4116-5d11-4fce-ba67-ef02e6ca7edd',
          assistant: {
            name: 'CareerGuide Assistant',
            voice: {
              provider: 'elevenlabs',
              voiceId: 'sarah'
            },
            model: {
              provider: 'openai',
              model: 'gpt-3.5-turbo',
              messages: [{
                role: 'system',
                content: 'You are CareerGuide GPT, a helpful career counselor. Keep responses short, friendly, and conversational for voice interaction.'
              }]
            }
          }
        };

        // @ts-ignore
        vapiRef.current = new window.Vapi(config.apiKey);
        setIsConnected(true);
      };
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
    }
  };

  const startListening = async () => {
    if (!vapiRef.current) return;
    
    try {
      setIsListening(true);
      await vapiRef.current.start();
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (!vapiRef.current) return;
    
    try {
      await vapiRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  };

  const speak = async (text: string) => {
    if (!vapiRef.current) return;
    
    try {
      setIsSpeaking(true);
      await vapiRef.current.say(text);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Failed to speak:', error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    initializeVapi();
    
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  return {
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak
  };
};
