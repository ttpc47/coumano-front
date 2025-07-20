import React, { useState, useEffect, useRef } from 'react';
import { Subtitles, Settings, Eye, EyeOff, Type, Palette } from 'lucide-react';

interface SubtitleSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  confidence?: number;
  language?: string;
}

interface SubtitleSettings {
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  position: 'bottom' | 'top' | 'center';
  opacity: number;
  maxLines: number;
  showSpeakerNames: boolean;
  autoHide: boolean;
  hideDelay: number;
}

interface SubtitleOverlayProps {
  segments: SubtitleSegment[];
  isVisible: boolean;
  onToggleVisibility: (visible: boolean) => void;
  currentTime?: number;
  className?: string;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  segments,
  isVisible,
  onToggleVisibility,
  currentTime = 0,
  className = ''
}) => {
  const [settings, setSettings] = useState<SubtitleSettings>({
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#ffffff',
    position: 'bottom',
    opacity: 1,
    maxLines: 2,
    showSpeakerNames: true,
    autoHide: false,
    hideDelay: 3000
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [currentSegments, setCurrentSegments] = useState<SubtitleSegment[]>([]);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find current active segments based on time
  useEffect(() => {
    const activeSegments = segments.filter(segment => 
      currentTime >= segment.startTime && currentTime <= segment.endTime
    );
    
    setCurrentSegments(activeSegments.slice(-settings.maxLines));

    // Auto-hide logic
    if (settings.autoHide && activeSegments.length === 0) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        onToggleVisibility(false);
      }, settings.hideDelay);
    } else if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [currentTime, segments, settings.maxLines, settings.autoHide, settings.hideDelay, onToggleVisibility]);

  const getPositionClasses = () => {
    switch (settings.position) {
      case 'top':
        return 'top-4';
      case 'center':
        return 'top-1/2 transform -translate-y-1/2';
      case 'bottom':
      default:
        return 'bottom-4';
    }
  };

  const renderSubtitleText = (segment: SubtitleSegment) => {
    return (
      <div
        key={segment.id}
        className="mb-1 last:mb-0"
        style={{
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily,
          color: settings.textColor,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        }}
      >
        {settings.showSpeakerNames && segment.speaker && (
          <span className="font-semibold mr-2">
            {segment.speaker}:
          </span>
        )}
        <span>{segment.text}</span>
        {segment.confidence && segment.confidence < 0.8 && (
          <span className="ml-2 text-yellow-300 text-xs">(?)</span>
        )}
      </div>
    );
  };

  if (!isVisible) {
    return (
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => onToggleVisibility(true)}
          className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
          title="Show Subtitles"
        >
          <Subtitles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Subtitle Display */}
      <div 
        className={`absolute left-1/2 transform -translate-x-1/2 ${getPositionClasses()} z-40 max-w-4xl w-full px-4 ${className}`}
        style={{ opacity: settings.opacity }}
      >
        {currentSegments.length > 0 && (
          <div
            className="rounded-lg px-4 py-2 text-center"
            style={{
              backgroundColor: settings.backgroundColor,
              backdropFilter: 'blur(4px)'
            }}
          >
            {currentSegments.map(renderSubtitleText)}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
          title="Subtitle Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => onToggleVisibility(false)}
          className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
          title="Hide Subtitles"
        >
          <EyeOff className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subtitle Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="32"
                value={settings.fontSize}
                onChange={(e) => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{settings.fontSize}px</span>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={settings.position}
                onChange={(e) => setSettings(prev => ({ ...prev, position: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="bottom">Bottom</option>
                <option value="center">Center</option>
                <option value="top">Top</option>
              </select>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Text Color
                </label>
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <select
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="rgba(0, 0, 0, 0.8)">Black (80%)</option>
                  <option value="rgba(0, 0, 0, 0.6)">Black (60%)</option>
                  <option value="rgba(0, 0, 0, 0.4)">Black (40%)</option>
                  <option value="rgba(255, 255, 255, 0.8)">White (80%)</option>
                  <option value="rgba(255, 255, 255, 0.6)">White (60%)</option>
                  <option value="transparent">Transparent</option>
                </select>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.opacity}
                onChange={(e) => setSettings(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{Math.round(settings.opacity * 100)}%</span>
            </div>

            {/* Max Lines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Lines
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.maxLines}
                onChange={(e) => setSettings(prev => ({ ...prev, maxLines: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{settings.maxLines} lines</span>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.showSpeakerNames}
                  onChange={(e) => setSettings(prev => ({ ...prev, showSpeakerNames: e.target.checked }))}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show speaker names</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoHide}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoHide: e.target.checked }))}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Auto-hide when no speech</span>
              </label>
            </div>

            {/* Auto-hide delay */}
            {settings.autoHide && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-hide delay (seconds)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.hideDelay / 1000}
                  onChange={(e) => setSettings(prev => ({ ...prev, hideDelay: Number(e.target.value) * 1000 }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{settings.hideDelay / 1000}s</span>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <div className="text-center">
              <div
                className="inline-block rounded px-3 py-1"
                style={{
                  fontSize: `${settings.fontSize}px`,
                  fontFamily: settings.fontFamily,
                  color: settings.textColor,
                  backgroundColor: settings.backgroundColor,
                  opacity: settings.opacity
                }}
              >
                {settings.showSpeakerNames && <span className="font-semibold">Speaker: </span>}
                This is a preview of your subtitle settings
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};