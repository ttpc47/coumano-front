import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Mail,
  Video,
  Database,
  Shield,
  Bell,
  Globe
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  jitsi: {
    domain: string;
    appId: string;
    enableRecording: boolean;
    enableTranscription: boolean;
    maxParticipants: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableTLS: boolean;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    retentionDays: number;
    enableCompression: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    sessionTimeout: number;
    enableTwoFactor: boolean;
    maxLoginAttempts: number;
  };
  notifications: {
    enableEmail: boolean;
    enablePush: boolean;
    enableSMS: boolean;
    reminderMinutes: number[];
  };
}

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Mock data for development
      setSettings({
        general: {
          siteName: 'COUMANO',
          siteDescription: 'Cameroon-Oriented University Management System',
          timezone: 'Africa/Douala',
          language: 'en',
          maintenanceMode: false
        },
        jitsi: {
          domain: 'meet.jit.si',
          appId: 'coumano-university',
          enableRecording: true,
          enableTranscription: true,
          maxParticipants: 100
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
          fromEmail: 'noreply@university.cm',
          fromName: 'COUMANO System',
          enableTLS: true
        },
        storage: {
          maxFileSize: 100,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3'],
          retentionDays: 365,
          enableCompression: true
        },
        security: {
          passwordMinLength: 8,
          passwordRequireSpecial: true,
          sessionTimeout: 480,
          enableTwoFactor: false,
          maxLoginAttempts: 5
        },
        notifications: {
          enableEmail: true,
          enablePush: false,
          enableSMS: false,
          reminderMinutes: [15, 60, 1440]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await apiClient.updateSystemSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      const result = await apiClient.post('/settings/test-email', settings?.email);
      setTestResults(prev => ({ ...prev, email: result.success }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, email: false }));
    }
  };

  const testJitsiConnection = async () => {
    try {
      const result = await apiClient.post('/settings/test-jitsi', settings?.jitsi);
      setTestResults(prev => ({ ...prev, jitsi: result.success }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, jitsi: false }));
    }
  };

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'jitsi', label: 'Jitsi Meet', icon: Video },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (!settings) return null;

    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Africa/Douala">Africa/Douala</option>
                  <option value="Africa/Yaounde">Africa/Yaounde</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.general.maintenanceMode}
                onChange={(e) => updateSettings('general', 'maintenanceMode', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        );

      case 'jitsi':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jitsi Domain
                </label>
                <input
                  type="text"
                  value={settings.jitsi.domain}
                  onChange={(e) => updateSettings('jitsi', 'domain', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App ID
                </label>
                <input
                  type="text"
                  value={settings.jitsi.appId}
                  onChange={(e) => updateSettings('jitsi', 'appId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                value={settings.jitsi.maxParticipants}
                onChange={(e) => updateSettings('jitsi', 'maxParticipants', parseInt(e.target.value))}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableRecording"
                  checked={settings.jitsi.enableRecording}
                  onChange={(e) => updateSettings('jitsi', 'enableRecording', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableRecording" className="text-sm font-medium text-gray-700">
                  Enable Session Recording
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableTranscription"
                  checked={settings.jitsi.enableTranscription}
                  onChange={(e) => updateSettings('jitsi', 'enableTranscription', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableTranscription" className="text-sm font-medium text-gray-700">
                  Enable Auto Transcription
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={testJitsiConnection}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span>Test Connection</span>
              </button>
              {testResults.jitsi !== undefined && (
                <div className="flex items-center space-x-2">
                  {testResults.jitsi ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`text-sm ${testResults.jitsi ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.jitsi ? 'Connection successful' : 'Connection failed'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.email.smtpHost}
                  onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.email.smtpUser}
                  onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  value={settings.email.fromName}
                  onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableTLS"
                checked={settings.email.enableTLS}
                onChange={(e) => updateSettings('email', 'enableTLS', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="enableTLS" className="text-sm font-medium text-gray-700">
                Enable TLS/SSL
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={testEmailConnection}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span>Test Email</span>
              </button>
              {testResults.email !== undefined && (
                <div className="flex items-center space-x-2">
                  {testResults.email ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`text-sm ${testResults.email ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.email ? 'Email sent successfully' : 'Email test failed'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'storage':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.storage.maxFileSize}
                  onChange={(e) => updateSettings('storage', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retention Days
                </label>
                <input
                  type="number"
                  value={settings.storage.retentionDays}
                  onChange={(e) => updateSettings('storage', 'retentionDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed File Types
              </label>
              <input
                type="text"
                value={settings.storage.allowedFileTypes.join(', ')}
                onChange={(e) => updateSettings('storage', 'allowedFileTypes', e.target.value.split(', '))}
                placeholder="pdf, doc, docx, mp4, mp3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-sm text-gray-500 mt-1">Separate file extensions with commas</p>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableCompression"
                checked={settings.storage.enableCompression}
                onChange={(e) => updateSettings('storage', 'enableCompression', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="enableCompression" className="text-sm font-medium text-gray-700">
                Enable File Compression
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Min Length
                </label>
                <input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="passwordRequireSpecial"
                  checked={settings.security.passwordRequireSpecial}
                  onChange={(e) => updateSettings('security', 'passwordRequireSpecial', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="passwordRequireSpecial" className="text-sm font-medium text-gray-700">
                  Require Special Characters in Password
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableTwoFactor"
                  checked={settings.security.enableTwoFactor}
                  onChange={(e) => updateSettings('security', 'enableTwoFactor', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableTwoFactor" className="text-sm font-medium text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableEmail"
                  checked={settings.notifications.enableEmail}
                  onChange={(e) => updateSettings('notifications', 'enableEmail', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableEmail" className="text-sm font-medium text-gray-700">
                  Enable Email Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enablePush"
                  checked={settings.notifications.enablePush}
                  onChange={(e) => updateSettings('notifications', 'enablePush', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enablePush" className="text-sm font-medium text-gray-700">
                  Enable Push Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableSMS"
                  checked={settings.notifications.enableSMS}
                  onChange={(e) => updateSettings('notifications', 'enableSMS', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableSMS" className="text-sm font-medium text-gray-700">
                  Enable SMS Notifications
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Times (minutes before session)
              </label>
              <input
                type="text"
                value={settings.notifications.reminderMinutes.join(', ')}
                onChange={(e) => updateSettings('notifications', 'reminderMinutes', e.target.value.split(', ').map(Number))}
                placeholder="15, 60, 1440"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-sm text-gray-500 mt-1">Separate times with commas (e.g., 15, 60, 1440 for 15 min, 1 hour, 1 day)</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and integrations</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 border-r border-gray-200 bg-gray-50">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};