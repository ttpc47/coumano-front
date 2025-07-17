import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Download, 
  Edit, 
  Save, 
  X, 
  Search, 
  Settings, 
  Users, 
  Clock, 
  Volume2, 
  VolumeX,
  Copy,
  FileText,
  Languages,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { transcriptionService, RealTimeTranscription, TranscriptionSegment } from '../../services/transcriptionService';

interface TranscriptionPanelProps {
  sessionId: string;
  isRecording: boolean;
  onToggleTranscription: (enabled: boolean) => void;
}

export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  sessionId,
  isRecording,
  onToggleTranscription
}) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [realTimeTranscriptions, setRealTimeTranscriptions] = useState<RealTimeTranscription[]>([]);
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [editingSegment, setEditingSegment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState('en');
  const [speakerColors, setSpeakerColors] = useState<Record<string, string>>({});
  
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isTranscribing && isRecording) {
      startRealTimeTranscription();
    } else {
      stopRealTimeTranscription();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isTranscribing, isRecording]);

  useEffect(() => {
    if (autoScroll && transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [realTimeTranscriptions, autoScroll]);

  const startRealTimeTranscription = async () => {
    try {
      await transcriptionService.startRealTimeTranscription(sessionId, {
        language,
        enableSpeakerIdentification: true,
        enableRealTime: true,
        enableAutoCorrection: true,
        enablePunctuation: true
      });

      // Connect to WebSocket for real-time updates
      wsRef.current = transcriptionService.connectRealTimeTranscription(
        sessionId,
        handleRealTimeTranscription
      );
    } catch (error) {
      console.error('Failed to start transcription:', error);
    }
  };

  const stopRealTimeTranscription = async () => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      await transcriptionService.stopRealTimeTranscription(sessionId);
    } catch (error) {
      console.error('Failed to stop transcription:', error);
    }
  };

  const handleRealTimeTranscription = (transcription: RealTimeTranscription) => {
    setRealTimeTranscriptions(prev => {
      const existing = prev.find(t => t.id === transcription.id);
      if (existing) {
        return prev.map(t => t.id === transcription.id ? transcription : t);
      }
      return [...prev, transcription];
    });

    // Assign color to new speakers
    if (!speakerColors[transcription.speakerId]) {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
      const usedColors = Object.values(speakerColors);
      const availableColor = colors.find(color => !usedColors.includes(color)) || colors[0];
      
      setSpeakerColors(prev => ({
        ...prev,
        [transcription.speakerId]: availableColor
      }));
    }
  };

  const handleToggleTranscription = () => {
    const newState = !isTranscribing;
    setIsTranscribing(newState);
    onToggleTranscription(newState);
  };

  const handleEditSegment = (segment: TranscriptionSegment) => {
    setEditingSegment(segment.id);
    setEditText(segment.text);
  };

  const handleSaveEdit = async () => {
    if (editingSegment) {
      try {
        await transcriptionService.editTranscriptionSegment(editingSegment, editText);
        setSegments(prev => prev.map(s => 
          s.id === editingSegment ? { ...s, text: editText, isEdited: true } : s
        ));
        setEditingSegment(null);
        setEditText('');
      } catch (error) {
        console.error('Failed to save edit:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSegment(null);
    setEditText('');
  };

  const handleDownloadTranscription = async (format: 'txt' | 'vtt' | 'srt') => {
    try {
      // For real-time, we'll format the current transcriptions
      const content = formatTranscriptionForDownload(realTimeTranscriptions, format);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription-${sessionId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download transcription:', error);
    }
  };

  const formatTranscriptionForDownload = (transcriptions: RealTimeTranscription[], format: string) => {
    switch (format) {
      case 'vtt':
        return formatAsVTT(transcriptions);
      case 'srt':
        return formatAsSRT(transcriptions);
      default:
        return transcriptions
          .filter(t => t.isFinal)
          .map(t => `[${t.speakerName}]: ${t.text}`)
          .join('\n');
    }
  };

  const formatAsVTT = (transcriptions: RealTimeTranscription[]) => {
    let vtt = 'WEBVTT\n\n';
    transcriptions
      .filter(t => t.isFinal)
      .forEach((t, index) => {
        const start = formatTime(new Date(t.timestamp));
        const end = formatTime(new Date(Date.parse(t.timestamp) + 3000)); // 3 second duration
        vtt += `${index + 1}\n${start} --> ${end}\n<v ${t.speakerName}>${t.text}\n\n`;
      });
    return vtt;
  };

  const formatAsSRT = (transcriptions: RealTimeTranscription[]) => {
    let srt = '';
    transcriptions
      .filter(t => t.isFinal)
      .forEach((t, index) => {
        const start = formatTime(new Date(t.timestamp), true);
        const end = formatTime(new Date(Date.parse(t.timestamp) + 3000), true);
        srt += `${index + 1}\n${start} --> ${end}\n${t.speakerName}: ${t.text}\n\n`;
      });
    return srt;
  };

  const formatTime = (date: Date, srtFormat = false) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    
    if (srtFormat) {
      return `${hours}:${minutes}:${seconds},${ms}`;
    }
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const filteredTranscriptions = realTimeTranscriptions.filter(t => {
    const matchesSearch = searchTerm === '' || t.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeaker = selectedSpeaker === 'all' || t.speakerId === selectedSpeaker;
    return matchesSearch && matchesSpeaker && t.isFinal;
  });

  const uniqueSpeakers = Array.from(new Set(realTimeTranscriptions.map(t => t.speakerId)))
    .map(id => ({
      id,
      name: realTimeTranscriptions.find(t => t.speakerId === id)?.speakerName || `Speaker ${id}`
    }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleTranscription}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isTranscribing 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isTranscribing ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isTranscribing ? 'Stop Transcription' : 'Start Transcription'}
              </span>
            </button>
            {isTranscribing && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Transcription</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="relative group">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => handleDownloadTranscription('txt')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download as TXT</span>
                </button>
                <button
                  onClick={() => handleDownloadTranscription('vtt')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download as VTT</span>
                </button>
                <button
                  onClick={() => handleDownloadTranscription('srt')}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download as SRT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transcription..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="all">All Speakers</option>
            {uniqueSpeakers.map(speaker => (
              <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
            ))}
          </select>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded-lg transition-colors ${
              autoScroll ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
            }`}
            title="Auto-scroll"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Transcription Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{fontSize}px</span>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Auto-scroll</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Transcription Content */}
      <div 
        ref={transcriptionRef}
        className="flex-1 p-4 overflow-y-auto space-y-3"
        style={{ fontSize: `${fontSize}px` }}
      >
        {filteredTranscriptions.length === 0 ? (
          <div className="text-center py-8">
            <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isTranscribing ? 'Listening for speech...' : 'No transcription available'}
            </h3>
            <p className="text-gray-600">
              {isTranscribing 
                ? 'Start speaking to see real-time transcription' 
                : 'Enable transcription to see live captions'
              }
            </p>
          </div>
        ) : (
          filteredTranscriptions.map((transcription) => (
            <div 
              key={transcription.id} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: speakerColors[transcription.speakerId] }}
              >
                {transcription.speakerName.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{transcription.speakerName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(transcription.timestamp).toLocaleTimeString()}
                  </span>
                  {transcription.confidence < 0.8 && (
                    <AlertCircle className="w-4 h-4 text-yellow-500" title="Low confidence" />
                  )}
                  {transcription.confidence >= 0.9 && (
                    <CheckCircle className="w-4 h-4 text-green-500" title="High confidence" />
                  )}
                </div>
                
                {editingSegment === transcription.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      rows={2}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group">
                    <p className="text-gray-800 leading-relaxed">{transcription.text}</p>
                    <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditSegment(transcription as any)}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(transcription.text)}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{filteredTranscriptions.length} segments</span>
            <span>{uniqueSpeakers.length} speakers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};