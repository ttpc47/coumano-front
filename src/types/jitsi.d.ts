declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export interface JitsiConfig {
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
  enableWelcomePage?: boolean;
  enableClosePage?: boolean;
  prejoinPageEnabled?: boolean;
  disableDeepLinking?: boolean;
  transcribingEnabled?: boolean;
  liveStreamingEnabled?: boolean;
  recordingEnabled?: boolean;
  fileRecordingsEnabled?: boolean;
  localRecording?: {
    enabled: boolean;
    format: string;
  };
  resolution?: number;
  constraints?: {
    video?: {
      height?: {
        ideal?: number;
        max?: number;
        min?: number;
      };
    };
  };
  disableAudioLevels?: boolean;
  enableNoAudioDetection?: boolean;
  enableNoisyMicDetection?: boolean;
  channelLastN?: number;
  enableLayerSuspension?: boolean;
  p2p?: {
    enabled?: boolean;
  };
}

export interface JitsiInterfaceConfig {
  TOOLBAR_BUTTONS?: string[];
  SETTINGS_SECTIONS?: string[];
  SHOW_JITSI_WATERMARK?: boolean;
  SHOW_WATERMARK_FOR_GUESTS?: boolean;
  SHOW_BRAND_WATERMARK?: boolean;
  BRAND_WATERMARK_LINK?: string;
  SHOW_POWERED_BY?: boolean;
  SHOW_PROMOTIONAL_CLOSE_PAGE?: boolean;
  SHOW_CHROME_EXTENSION_BANNER?: boolean;
  DEFAULT_BACKGROUND?: string;
  DISABLE_VIDEO_BACKGROUND?: boolean;
  INITIAL_TOOLBAR_TIMEOUT?: number;
  TOOLBAR_TIMEOUT?: number;
  DEFAULT_REMOTE_DISPLAY_NAME?: string;
  DEFAULT_LOCAL_DISPLAY_NAME?: string;
  GENERATE_ROOMNAMES_ON_WELCOME_PAGE?: boolean;
  DISPLAY_WELCOME_PAGE_CONTENT?: boolean;
  DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT?: boolean;
  APP_NAME?: string;
  NATIVE_APP_NAME?: string;
  PROVIDER_NAME?: string;
  LANG_DETECTION?: boolean;
  INVITATION_POWERED_BY?: boolean;
  AUTHENTICATION_ENABLE?: boolean;
  MOBILE_APP_PROMO?: boolean;
  MAXIMUM_ZOOMING_COEFFICIENT?: number;
  SUPPORT_URL?: string;
  CONNECTION_INDICATOR_AUTO_HIDE_ENABLED?: boolean;
  CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT?: number;
  CONNECTION_INDICATOR_DISABLED?: boolean;
  VIDEO_LAYOUT_FIT?: string;
  filmStripOnly?: boolean;
  VERTICAL_FILMSTRIP?: boolean;
}

export interface JitsiParticipant {
  id: string;
  displayName: string;
  email?: string;
  avatarURL?: string;
  role: 'moderator' | 'participant';
}

export interface JitsiEvent {
  type: string;
  data?: any;
}

export interface RecordingState {
  isRecording: boolean;
  recordingId?: string;
  startTime?: Date;
  duration: number;
  mediaRecorder?: MediaRecorder;
  recordedChunks: Blob[];
}

export interface SubtitleSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export {};