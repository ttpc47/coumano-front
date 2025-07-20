import React, { useState, useEffect, useCallback } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  MessageCircle, 
  Share, 
  Settings, 
  Monitor, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Square, 
  FileText, 
  Download, 
  Bell, 
  BellOff, 
  Subtitles, 
  Languages, 
  Eye, 
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Pause,
  Play,
  Save,
  Upload,
  Share2
} from 'lucide-react';
import { useJitsiMeet } from '../../hooks/useJitsiMeet';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { SubtitleOverlay } from './SubtitleOverlay';
import { TranscriptionPanel } from './TranscriptionPanel';
import { JitsiConfig, JitsiInterfaceConfig, SubtitleSegment } from '../../types/jitsi';

interface ClassroomSession {
  id: string;
  title: string;
  course: string;
  instructor: string;
  startTime: string;
  endTime?: string;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  roomId: string;
  isRecording: boolean;
  recordingId?: string;
  autoAttendanceEnabled: boolean;
  notificationsEnabled: boolean;
  transcriptionEnabled: boolean;
  subtitlesEnabled: boolean;
  description?: string;
}

interface JitsiVirtualClassroomProps {
  session?: ClassroomSession;
  onSessionEnd?: () => void;
  onParticipantCountChange?: (count: number) => void;
}

export const JitsiVirtualClassroom: React.FC<JitsiVirtualClassroomProps> = ({
  session,
  onSessionEnd,
  onParticipantCountChange
}) => {
  const [showTranscriptionPanel, setShowTranscriptionPanel] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [subtitleSegments, setSubtitleSegments] = useState<SubtitleSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [localRecordingEnabled, setLocalRecordingEnabled] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Jitsi configuration
  const jitsiConfig: JitsiConfig = {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    enableClosePage: false,
    prejoinPageEnabled: false,
    disableDeepLinking: true,
    transcribingEnabled: session?.transcriptionEnabled || true,
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
    }
  };

  const jitsiInterfaceConfig: JitsiInterfaceConfig = {
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
      'settings', 'raisehand', 'videoquality', 'filmstrip', 'invite',
      'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
      'download', 'help', 'mute-everyone', 'security'
    ],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POWERED_BY: false,
    APP_NAME: 'COUMANO Virtual Classroom',
    PROVIDER_NAME: 'COUMANO University System'
  };

  // Jitsi Meet hook
  const {
    containerRef,
    api,
    isLoaded,
    participants,
    isAudioMuted,
    isVideoMuted,
    toggleAudio,
    toggleVideo,
    toggleChat,
    toggleShareScreen,
    startRecording: startJitsiRecording,
    stopRecording: stopJitsiRecording,
    toggleSubtitles,
    hangUp,
    setVideoQuality,
    sendChatMessage,
    setDisplayName,
    setSubject
  } = useJitsiMeet({
    roomName: session?.roomId || 'test-room',
    domain: import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si',
    userInfo: {
      displayName: 'Current User', // This should come from auth context
      email: 'user@university.cm'
    },
    config: jitsiConfig,
    interfaceConfig: jitsiInterfaceConfig,
    onReady: () => {
      console.log('Jitsi Meet is ready');
      if (session?.title) {
        setSubject(session.title);
      }
    },
    onJoin: () => {
      console.log('Joined conference');
      setSessionTime(0);
    },
    onLeave: () => {
      console.log('Left conference');
      onSessionEnd?.();
    },
    onParticipantJoined: (participant) => {
      console.log('Participant joined:', participant);
      onParticipantCountChange?.(participants.length + 1);
    },
    onParticipantLeft: (participant) => {
      console.log('Participant left:', participant);
      onParticipantCountChange?.(participants.length - 1);
    },
    onRecordingStatusChanged: (isRecording) => {
      console.log('Recording status changed:', isRecording);
    },
    onTranscriptionReceived: (transcription) => {
      console.log('Transcription received:', transcription);
      // Convert to subtitle segment
      const segment: SubtitleSegment = {
        id: Date.now().toString(),
        startTime: currentTime,
        endTime: currentTime + 3, // Assume 3 second duration
        text: transcription.transcript || transcription.text || '',
        speaker: transcription.participant?.name || 'Unknown',
        confidence: transcription.confidence || 1,
        language: transcription.language || 'en'
      };
      setSubtitleSegments(prev => [...prev, segment]);
    }
  });

  // Local recording with MediaRecorder
  const {
    state: recordingState,
    startRecording: startLocalRecording,
    stopRecording: stopLocalRecording,
    pauseRecording,
    resumeRecording,
    downloadRecording,
    formatDuration,
    formatSize,
    isSupported: isRecordingSupported
  } = useMediaRecorder({
    onDataAvailable: (chunk) => {
      console.log('Recording chunk received:', chunk.size);
    },
    onStop: (blob) => {
      console.log('Recording stopped, blob size:', blob.size);
      // Here you could upload the blob to your server
    },
    onError: (error) => {
      console.error('Recording error:', error);
    },
    mimeType: 'video/webm;codecs=vp9,opus',
    videoBitsPerSecond: 2500000,
    audioBitsPerSecond: 128000
  });

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoaded) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoaded]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 5000);
    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [resetControlsTimeout]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLocalRecording = () => {
    if (recordingState.isRecording) {
      stopLocalRecording();
    } else {
      startLocalRecording({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    }
  };

  const handleSaveRecording = () => {
    downloadRecording(`${session?.title || 'session'}-${Date.now()}.webm`);
  };

  if (!session) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No session selected</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen bg-gray-900 flex relative"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Session Header */}
        <div className={`bg-gray-800 px-6 py-4 flex items-center justify-between transition-transform duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-xl font-semibold">{session.title}</h1>
            {session.isRecording && (
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">
                  REC {formatTime(sessionTime)}
                </span>
              </div>
            )}
            {recordingState.isRecording && (
              <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">
                  LOCAL {formatDuration()}
                </span>
              </div>
            )}
            {session.transcriptionEnabled && (
              <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full">
                <Languages className="w-3 h-3 text-white" />
                <span className="text-white text-sm font-medium">Live Transcription</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-white">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{participants.length} participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatTime(sessionTime)}</span>
            </div>
          </div>
        </div>

        {/* Jitsi Meet Container */}
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />
          
          {/* Subtitle Overlay */}
          {session.subtitlesEnabled && (
            <SubtitleOverlay
              segments={subtitleSegments}
              isVisible={showSubtitles}
              onToggleVisibility={setShowSubtitles}
              currentTime={currentTime}
            />
          )}

          {/* Loading State */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Connecting to virtual classroom...</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Controls Overlay */}
        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-transform duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="bg-gray-800 bg-opacity-95 rounded-full px-6 py-3 flex items-center space-x-4 backdrop-blur-sm">
            {/* Audio Control */}
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-colors ${
                isAudioMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            {/* Video Control */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={isVideoMuted ? 'Turn On Camera' : 'Turn Off Camera'}
            >
              {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
            
            {/* Screen Share */}
            <button
              onClick={toggleShareScreen}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              title="Share Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* Jitsi Recording */}
            <button
              onClick={session.isRecording ? stopJitsiRecording : startJitsiRecording}
              className={`p-3 rounded-full transition-colors ${
                session.isRecording ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={session.isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {session.isRecording ? <Square className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Local Recording */}
            {isRecordingSupported && (
              <button
                onClick={handleLocalRecording}
                className={`p-3 rounded-full transition-colors ${
                  recordingState.isRecording ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                title={recordingState.isRecording ? 'Stop Local Recording' : 'Start Local Recording'}
              >
                {recordingState.isRecording ? <Square className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              </button>
            )}

            {/* Pause/Resume Local Recording */}
            {recordingState.isRecording && (
              <button
                onClick={recordingState.isPaused ? resumeRecording : pauseRecording}
                className="p-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
                title={recordingState.isPaused ? 'Resume Recording' : 'Pause Recording'}
              >
                {recordingState.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
            )}

            {/* Transcription Panel */}
            {session.transcriptionEnabled && (
              <button
                onClick={() => setShowTranscriptionPanel(!showTranscriptionPanel)}
                className={`p-3 rounded-full transition-colors ${
                  showTranscriptionPanel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                title="Toggle Transcription Panel"
              >
                <FileText className="w-5 h-5" />
              </button>
            )}

            {/* Subtitles */}
            {session.subtitlesEnabled && (
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`p-3 rounded-full transition-colors ${
                  showSubtitles ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                title="Toggle Subtitles"
              >
                <Subtitles className="w-5 h-5" />
              </button>
            )}
            
            {/* Chat */}
            <button
              onClick={toggleChat}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              title="Toggle Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            
            {/* Participants */}
            <button
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              title="Participants"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            
            {/* Settings */}
            <button
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {/* Hang Up */}
            <button
              onClick={hangUp}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Leave Session"
            >
              <Phone className="w-5 h-5 rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* Recording Controls Panel */}
        {recordingState.isRecording && (
          <div className="absolute top-20 right-4 bg-white rounded-xl shadow-xl p-4 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 mb-3">Local Recording</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formatDuration()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{formatSize()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${recordingState.isPaused ? 'text-yellow-600' : 'text-green-600'}`}>
                  {recordingState.isPaused ? 'Paused' : 'Recording'}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleSaveRecording}
                className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={stopLocalRecording}
                className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        )}

        {/* Session Info Overlay */}
        <div className={`absolute top-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg p-4 text-white transition-transform duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{session.course}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{session.instructor}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{participants.length}/{session.maxParticipants}</span>
            </div>
            {session.description && (
              <div className="text-xs text-gray-300 mt-2 max-w-xs">
                {session.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transcription Panel */}
      {showTranscriptionPanel && session.transcriptionEnabled && (
        <div className="w-96 border-l border-gray-700 bg-white">
          <TranscriptionPanel
            sessionId={session.id}
            isRecording={session.isRecording}
            onToggleTranscription={(enabled) => {
              console.log('Transcription toggled:', enabled);
            }}
          />
        </div>
      )}
    </div>
  );
};