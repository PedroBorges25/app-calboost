"use client";

import { useState, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    lang = 'pt-PT',
    continuous = false,
    interimResults = false,
    onResult,
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Verificar suporte do navegador
  const isSupported = useCallback(() => {
    return typeof window !== 'undefined' && 
           ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }, []);

  // Iniciar reconhecimento de voz
  const startListening = useCallback(() => {
    if (!isSupported()) {
      const errorMsg = 'O seu navegador não suporta reconhecimento de voz. Use Chrome, Edge ou Safari.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
      
      const recognition = new SpeechRecognition();
      
      // Configurações
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = 1;

      // Evento: início da gravação
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        console.log('🎤 Reconhecimento de voz iniciado');
      };

      // Evento: resultado obtido
      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result[0].transcript;
        
        console.log('📝 Transcrição:', transcriptText);
        setTranscript(transcriptText);
        
        if (result.isFinal) {
          onResult?.(transcriptText);
        }
      };

      // Evento: erro
      recognition.onerror = (event: any) => {
        console.error('❌ Erro no reconhecimento de voz:', event.error);
        
        let errorMsg = 'Erro ao reconhecer a voz';
        
        switch (event.error) {
          case 'no-speech':
            errorMsg = 'Não consegui perceber o que disse. Pode repetir?';
            break;
          case 'audio-capture':
            errorMsg = 'Não foi possível aceder ao microfone. Verifique as permissões.';
            break;
          case 'not-allowed':
            errorMsg = 'Permissão para usar o microfone foi negada. Ative nas configurações do navegador.';
            break;
          case 'network':
            errorMsg = 'Erro de rede. Verifique a sua ligação à internet.';
            break;
          case 'aborted':
            errorMsg = 'Reconhecimento de voz foi interrompido.';
            break;
          default:
            errorMsg = `Erro: ${event.error}`;
        }
        
        setError(errorMsg);
        setIsListening(false);
        onError?.(errorMsg);
      };

      // Evento: fim da gravação
      recognition.onend = () => {
        setIsListening(false);
        console.log('🛑 Reconhecimento de voz terminado');
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (err) {
      const errorMsg = 'Erro ao inicializar o reconhecimento de voz';
      console.error(errorMsg, err);
      setError(errorMsg);
      setIsListening(false);
      onError?.(errorMsg);
    }
  }, [lang, continuous, interimResults, onResult, onError, isSupported]);

  // Parar reconhecimento de voz
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Resetar estado
  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported: isSupported(),
    startListening,
    stopListening,
    reset
  };
}
