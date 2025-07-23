import React, { useState } from 'react';
import { X, Zap, Target, Clock, MapPin, Users, CheckCircle } from 'lucide-react';

interface ScheduleOptimizerProps {
  onClose: () => void;
  onOptimize: (courseId: string, preferences: any) => void;
}

export const ScheduleOptimizer: React.FC<ScheduleOptimizerProps> = ({
  onClose,
  onOptimize
}) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [preferences, setPreferences] = useState({
    preferredDays: [] as string[],
    preferredTimes: [] as string[],
    roomPreferences: [] as string[],
    avoidConflicts: true,
    optimizeFor: 'efficiency' as 'efficiency' | 'convenience' | 'balance'
  });

  const courses = [
    { id: 'cs301', name: 'CS301 - Advanced Algorithms' },
    { id: 'cs205', name: 'CS205 - Database Systems' },
    { id: 'math201', name: 'MATH201 - Linear Algebra' }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];
  const rooms = ['Amphitheater A', 'Lab A-205', 'Room B-101', 'Room C-301'];

  const handleDayToggle = (day: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };

  const handleTimeToggle = (time: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(time)
        ? prev.preferredTimes.filter(t => t !== time)
        : [...prev.preferredTimes, time]
    }));
  };

  const handleRoomToggle = (room: string) => {
    setPreferences(prev => ({
      ...prev,
      roomPreferences: prev.roomPreferences.includes(room)
        ? prev.roomPreferences.filter(r => r !== room)
        : [...prev.roomPreferences, room]
    }));
  };

  const handleOptimize = () => {
    if (!selectedCourse) {
      alert('Please select a course to optimize');
      return;
    }
    onOptimize(selectedCourse, preferences);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-coral-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Schedule Optimizer</h2>
              <p className="text-sm text-neutral-600">AI-powered schedule optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Select Course to Optimize *
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            >
              <option value="">Choose a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          {/* Optimization Goal */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              <Target className="w-4 h-4 inline mr-1" />
              Optimization Goal
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'efficiency', label: 'Efficiency', desc: 'Minimize gaps and travel time' },
                { id: 'convenience', label: 'Convenience', desc: 'Prefer popular time slots' },
                { id: 'balance', label: 'Balance', desc: 'Even distribution across week' }
              ].map((goal) => (
                <label
                  key={goal.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.optimizeFor === goal.id
                      ? 'border-ocean-500 bg-ocean-50'
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="optimizeFor"
                    value={goal.id}
                    checked={preferences.optimizeFor === goal.id}
                    onChange={(e) => setPreferences(prev => ({ ...prev, optimizeFor: e.target.value as any }))}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <p className="font-medium text-neutral-800">{goal.label}</p>
                    <p className="text-xs text-neutral-600 mt-1">{goal.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Days */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-1" />
              Preferred Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {days.map((day) => (
                <label
                  key={day}
                  className={`p-2 border rounded-lg cursor-pointer transition-colors text-center ${
                    preferences.preferredDays.includes(day)
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={preferences.preferredDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-neutral-800">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Time Slots */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              <Clock className="w-4 h-4 inline mr-1" />
              Preferred Time Slots
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <label
                  key={time}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.preferredTimes.includes(time)
                      ? 'border-coral-500 bg-coral-50'
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={preferences.preferredTimes.includes(time)}
                    onChange={() => handleTimeToggle(time)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-neutral-800">{time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Preferences */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              <MapPin className="w-4 h-4 inline mr-1" />
              Room Preferences
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {rooms.map((room) => (
                <label
                  key={room}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.roomPreferences.includes(room)
                      ? 'border-ocean-500 bg-ocean-50'
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={preferences.roomPreferences.includes(room)}
                    onChange={() => handleRoomToggle(room)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-neutral-800">{room}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.avoidConflicts}
                onChange={(e) => setPreferences(prev => ({ ...prev, avoidConflicts: e.target.checked }))}
                className="rounded text-ocean-600 focus:ring-ocean-500"
              />
              <span className="text-sm font-medium text-neutral-700">Automatically avoid conflicts</span>
            </label>
          </div>

          {/* Optimization Preview */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="font-medium text-neutral-800 mb-2">Optimization Summary</h4>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Goal: {preferences.optimizeFor}</p>
              <p>• Preferred days: {preferences.preferredDays.length > 0 ? preferences.preferredDays.join(', ') : 'Any'}</p>
              <p>• Preferred times: {preferences.preferredTimes.length > 0 ? preferences.preferredTimes.length + ' slots' : 'Any'}</p>
              <p>• Room preferences: {preferences.roomPreferences.length > 0 ? preferences.roomPreferences.length + ' rooms' : 'Any'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOptimize}
              disabled={!selectedCourse}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-coral-600 to-ocean-600 text-white rounded-lg hover:from-coral-700 hover:to-ocean-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              <span>Optimize Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};