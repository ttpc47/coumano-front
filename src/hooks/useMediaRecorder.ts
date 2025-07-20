import { useState, useRef, useCallback, useEffect } from 'react';

interface UseMediaRecorderProps {
  onDataAvailable?: (chunk: Blob) => void;
  onStop?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  bitsPerSecond?: number;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  size: number;
  error: string | null;
}

export const useMediaRecorder = ({
  onDataAvailable,
  onStop,
  onError,
  mimeType = 'video/webm;codecs=vp9,opus',
  audioBitsPerSecond = 128000,
  videoBitsPerSecond = 2500000,
  bitsPerSecond = 2628000
}: UseMediaRecorderProps = {}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    size: 0,
    error: null
  });

  const updateDuration = useCallback(() => {
    setState(prev => ({ ...prev, duration: prev.duration + 1 }));
  }, []);

  const startRecording = useCallback(async (constraints: MediaStreamConstraints = {
    video: {
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
      frameRate: { ideal: 30, max: 60 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
      channelCount: 2
    }
  }) => {
    try {
      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        const fallbackMimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(fallbackMimeType)) {
          throw new Error('MediaRecorder is not supported in this browser');
        }
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Create MediaRecorder instance
      const options: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm',
        audioBitsPerSecond,
        videoBitsPerSecond,
        bitsPerSecond
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];

      // Event listeners
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          setState(prev => ({ 
            ...prev, 
            size: prev.size + event.data.size 
          }));
          onDataAvailable?.(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onStop?.(blob);
        
        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setState(prev => ({ 
          ...prev, 
          isRecording: false, 
          isPaused: false 
        }));
      };

      mediaRecorderRef.current.onerror = (event: any) => {
        const error = new Error(`MediaRecorder error: ${event.error?.message || 'Unknown error'}`);
        setState(prev => ({ 
          ...prev, 
          error: error.message,
          isRecording: false,
          isPaused: false
        }));
        onError?.(error);
      };

      mediaRecorderRef.current.onpause = () => {
        setState(prev => ({ ...prev, isPaused: true }));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      mediaRecorderRef.current.onresume = () => {
        setState(prev => ({ ...prev, isPaused: false }));
        intervalRef.current = setInterval(updateDuration, 1000);
      };

      // Start recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        duration: 0, 
        size: 0, 
        error: null 
      }));

      // Start duration timer
      intervalRef.current = setInterval(updateDuration, 1000);

    } catch (error) {
      const err = error as Error;
      setState(prev => ({ 
        ...prev, 
        error: err.message,
        isRecording: false 
      }));
      onError?.(err);
    }
  }, [mimeType, audioBitsPerSecond, videoBitsPerSecond, bitsPerSecond, onDataAvailable, onStop, onError, updateDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [state.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
    }
  }, [state.isRecording, state.isPaused]);

  const getRecordedBlob = useCallback(() => {
    if (chunksRef.current.length > 0) {
      return new Blob(chunksRef.current, { type: mimeType });
    }
    return null;
  }, [mimeType]);

  const downloadRecording = useCallback((filename?: string) => {
    const blob = getRecordedBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [getRecordedBlob]);

  const clearRecording = useCallback(() => {
    chunksRef.current = [];
    setState(prev => ({ 
      ...prev, 
      duration: 0, 
      size: 0, 
      error: null 
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRecording]);

  // Format duration for display
  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Format file size for display
  const formatSize = useCallback((bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getRecordedBlob,
    downloadRecording,
    clearRecording,
    formatDuration: (seconds?: number) => formatDuration(seconds || state.duration),
    formatSize: (bytes?: number) => formatSize(bytes || state.size),
    isSupported: typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeType)
  };
};