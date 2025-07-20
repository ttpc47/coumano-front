import { useEffect, useRef, useState, useCallback } from 'react';
import { JitsiConfig, JitsiInterfaceConfig, JitsiParticipant, RecordingState } from '../types/jitsi';

interface UseJitsiMeetProps {
  roomName: string;
  domain?: string;
  userInfo?: {
    displayName: string;
    email?: string;
    avatarURL?: string;
  };
  config?: JitsiConfig;
  interfaceConfig?: JitsiInterfaceConfig;
  onReady?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
  onParticipantJoined?: (participant: JitsiParticipant) => void;
  onParticipantLeft?: (participant: JitsiParticipant) => void;
  onRecordingStatusChanged?: (isRecording: boolean) => void;
  onTranscriptionReceived?: (transcription: any) => void;
}

export const useJitsiMeet = ({
  roomName,
  domain = 'meet.jit.si',
  userInfo,
  config = {},
  interfaceConfig = {},
  onReady,
  onJoin,
  onLeave,
  onParticipantJoined,
  onParticipantLeft,
  onRecordingStatusChanged,
  onTranscriptionReceived
}: UseJitsiMeetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [participants, setParticipants] = useState<JitsiParticipant[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    recordedChunks: []
  });

  const defaultConfig: JitsiConfig = {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    enableClosePage: false,
    prejoinPageEnabled: false,
    disableDeepLinking: true,
    transcribingEnabled: true,
    liveStreamingEnabled: false,
    recordingEnabled: true,
    fileRecordingsEnabled: true,
    localRecording: {
      enabled: true,
      format: 'mp4'
    },
    resolution: 720,
    constraints: {
      video: {
        height: {
          ideal: 720,
          max: 1080,
          min: 240
        }
      }
    },
    disableAudioLevels: false,
    enableNoAudioDetection: true,
    enableNoisyMicDetection: true,
    channelLastN: -1,
    enableLayerSuspension: true,
    p2p: {
      enabled: false
    }
  };

  const defaultInterfaceConfig: JitsiInterfaceConfig = {
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
      'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
      'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
      'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
      'security', 'toggle-camera'
    ],
    SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    BRAND_WATERMARK_LINK: '',
    SHOW_POWERED_BY: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
    DEFAULT_BACKGROUND: '#474747',
    DISABLE_VIDEO_BACKGROUND: false,
    INITIAL_TOOLBAR_TIMEOUT: 20000,
    TOOLBAR_TIMEOUT: 4000,
    DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
    DEFAULT_LOCAL_DISPLAY_NAME: 'You',
    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    APP_NAME: 'COUMANO Virtual Classroom',
    NATIVE_APP_NAME: 'COUMANO',
    PROVIDER_NAME: 'COUMANO University System',
    LANG_DETECTION: true,
    INVITATION_POWERED_BY: false,
    AUTHENTICATION_ENABLE: false,
    MOBILE_APP_PROMO: false,
    MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
    SUPPORT_URL: 'https://coumano.university.cm/support',
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
    CONNECTION_INDICATOR_DISABLED: false,
    VIDEO_LAYOUT_FIT: 'both',
    filmStripOnly: false,
    VERTICAL_FILMSTRIP: true
  };

  const initializeJitsi = useCallback(() => {
    if (!containerRef.current || !window.JitsiMeetExternalAPI) {
      console.error('Jitsi Meet API not loaded or container not available');
      return;
    }

    // Clear any existing instance
    if (apiRef.current) {
      apiRef.current.dispose();
    }

    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: containerRef.current,
      userInfo: userInfo || {},
      configOverwrite: { ...defaultConfig, ...config },
      interfaceConfigOverwrite: { ...defaultInterfaceConfig, ...interfaceConfig }
    };

    try {
      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      apiRef.current.addEventListener('videoConferenceJoined', (event: any) => {
        console.log('Conference joined:', event);
        setIsLoaded(true);
        onJoin?.();
      });

      apiRef.current.addEventListener('videoConferenceLeft', (event: any) => {
        console.log('Conference left:', event);
        setIsLoaded(false);
        onLeave?.();
      });

      apiRef.current.addEventListener('participantJoined', (event: any) => {
        console.log('Participant joined:', event);
        const participant: JitsiParticipant = {
          id: event.id,
          displayName: event.displayName,
          email: event.email,
          role: event.role || 'participant'
        };
        setParticipants(prev => [...prev, participant]);
        onParticipantJoined?.(participant);
      });

      apiRef.current.addEventListener('participantLeft', (event: any) => {
        console.log('Participant left:', event);
        const participant: JitsiParticipant = {
          id: event.id,
          displayName: event.displayName,
          role: event.role || 'participant'
        };
        setParticipants(prev => prev.filter(p => p.id !== event.id));
        onParticipantLeft?.(participant);
      });

      apiRef.current.addEventListener('audioMuteStatusChanged', (event: any) => {
        setIsAudioMuted(event.muted);
      });

      apiRef.current.addEventListener('videoMuteStatusChanged', (event: any) => {
        setIsVideoMuted(event.muted);
      });

      apiRef.current.addEventListener('recordingStatusChanged', (event: any) => {
        console.log('Recording status changed:', event);
        onRecordingStatusChanged?.(event.on);
      });

      apiRef.current.addEventListener('transcriptionChunkReceived', (event: any) => {
        console.log('Transcription received:', event);
        onTranscriptionReceived?.(event);
      });

      apiRef.current.addEventListener('readyToClose', () => {
        console.log('Ready to close');
      });

      onReady?.();
    } catch (error) {
      console.error('Failed to initialize Jitsi Meet:', error);
    }
  }, [roomName, domain, userInfo, config, interfaceConfig, onReady, onJoin, onLeave, onParticipantJoined, onParticipantLeft, onRecordingStatusChanged, onTranscriptionReceived]);

  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      initializeJitsi();
    } else {
      // Wait for script to load
      const checkJitsi = setInterval(() => {
        if (window.JitsiMeetExternalAPI) {
          clearInterval(checkJitsi);
          initializeJitsi();
        }
      }, 100);

      return () => clearInterval(checkJitsi);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [initializeJitsi]);

  // Control methods
  const toggleAudio = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio');
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleVideo');
    }
  }, []);

  const toggleChat = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleChat');
    }
  }, []);

  const toggleShareScreen = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleShareScreen');
    }
  }, []);

  const startRecording = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('startRecording', {
        mode: 'file',
        dropboxToken: undefined,
        shouldShare: false
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('stopRecording');
    }
  }, []);

  const toggleSubtitles = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleSubtitles');
    }
  }, []);

  const hangUp = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand('hangup');
    }
  }, []);

  const setVideoQuality = useCallback((quality: number) => {
    if (apiRef.current) {
      apiRef.current.executeCommand('setVideoQuality', quality);
    }
  }, []);

  const sendChatMessage = useCallback((message: string) => {
    if (apiRef.current) {
      apiRef.current.executeCommand('sendChatMessage', message);
    }
  }, []);

  const setDisplayName = useCallback((name: string) => {
    if (apiRef.current) {
      apiRef.current.executeCommand('displayName', name);
    }
  }, []);

  const setSubject = useCallback((subject: string) => {
    if (apiRef.current) {
      apiRef.current.executeCommand('subject', subject);
    }
  }, []);

  return {
    containerRef,
    api: apiRef.current,
    isLoaded,
    participants,
    isAudioMuted,
    isVideoMuted,
    recordingState,
    // Control methods
    toggleAudio,
    toggleVideo,
    toggleChat,
    toggleShareScreen,
    startRecording,
    stopRecording,
    toggleSubtitles,
    hangUp,
    setVideoQuality,
    sendChatMessage,
    setDisplayName,
    setSubject
  };
};