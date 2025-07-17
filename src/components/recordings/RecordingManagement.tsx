import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Download, 
  FileText, 
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Mic,
  Eye,
  Trash2,
  Share2,
  MoreVertical
} from 'lucide-react';
import { recordingService, Recording } from '../../services/recordingService';

export const RecordingManagement: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [transcriptionFilter, setTranscriptionFilter] = useState<string>('all');
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  useEffect(() => {
    loadRecordings();
  }, [selectedCourse, transcriptionFilter]);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const params = {
        course: selectedCourse !== 'all' ? selectedCourse : undefined,
        transcribed: transcriptionFilter === 'transcribed' ? true : 
                    transcriptionFilter === 'not_transcribed' ? false : undefined
      };
      const data = await recordingService.getRecordings(params);
      setRecordings(data.results || []);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (recordingId: string, title: string) => {
    try {
      const blob = await recordingService.downloadRecording(recordingId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download recording:', error);
    }
  };

  const handleRequestTranscription = async (recordingId: string) => {
    try {
      await recordingService.requestTranscription(recordingId, {
        language: 'en',
        speakerIdentification: true,
        generateSummary: true
      });
      loadRecordings(); // Refresh to show updated status
    } catch (error) {
      console.error('Failed to request transcription:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTranscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Recordings</h1>
          <p className="text-gray-600 mt-1">Access recorded lectures and transcriptions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Courses</option>
            <option value="CS301">CS301 - Advanced Algorithms</option>
            <option value="CS205">CS205 - Database Systems</option>
            <option value="MATH201">MATH201 - Linear Algebra</option>
          </select>

          <select
            value={transcriptionFilter}
            onChange={(e) => setTranscriptionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Recordings</option>
            <option value="transcribed">Transcribed</option>
            <option value="not_transcribed">Not Transcribed</option>
            <option value="processing">Processing</option>
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Video className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recordings</p>
              <p className="text-2xl font-bold text-gray-900">{recordings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Transcribed</p>
              <p className="text-2xl font-bold text-gray-900">
                {recordings.filter(r => r.transcriptionStatus === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(recordings.reduce((sum, r) => sum + r.duration, 0) / 3600)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(recordings.reduce((sum, r) => sum + r.attendanceCount, 0) / recordings.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recordings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recordings ({filteredRecordings.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRecordings.map((recording) => (
            <div key={recording.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-12 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {recording.thumbnailUrl ? (
                      <img 
                        src={recording.thumbnailUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="w-6 h-6 text-white" />
                    )}
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {formatDuration(recording.duration)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {recording.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>{recording.course}</span>
                      <span>•</span>
                      <span>{recording.lecturer}</span>
                      <span>•</span>
                      <span>{new Date(recording.startTime).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(recording.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{recording.attendanceCount} attended</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{formatFileSize(recording.size)}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        recording.quality === 'HD' ? 'bg-green-100 text-green-800' :
                        recording.quality === 'SD' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {recording.quality}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTranscriptionStatusColor(recording.transcriptionStatus)}`}>
                    {recording.transcriptionStatus === 'completed' ? 'Transcribed' :
                     recording.transcriptionStatus === 'processing' ? 'Processing' :
                     recording.transcriptionStatus === 'pending' ? 'Pending' : 'Failed'}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => setSelectedRecording(recording)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Play"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    
                    {recording.transcriptionStatus === 'completed' && (
                      <button 
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Transcription"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                    
                    {recording.transcriptionStatus === 'pending' && (
                      <button 
                        onClick={() => handleRequestTranscription(recording.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Request Transcription"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDownload(recording.id, recording.title)}
                      className="p-2 text-gray-600 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button 
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecordings.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings found</h3>
            <p className="text-gray-600">No recordings match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};