import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { courseScheduleService, CreateScheduleData, ScheduleConflict } from '../../services/courseScheduleService';

interface CreateScheduleModalProps {
  onClose: () => void;
  onSubmit: (scheduleData: CreateScheduleData) => void;
}

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<CreateScheduleData>({
    courseId: '',
    day: '',
    startTime: '',
    endTime: '',
    room: '',
    building: '',
    type: 'lecture',
    isRecurring: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);

  const courses = [
    { id: 'cs301', name: 'CS301 - Advanced Algorithms' },
    { id: 'cs205', name: 'CS205 - Database Systems' },
    { id: 'math201', name: 'MATH201 - Linear Algebra' }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const rooms = ['Amphitheater A', 'Amphitheater B', 'Lab A-205', 'Lab B-205', 'Room C-301'];
  const buildings = ['Main Building', 'Science Block', 'Engineering Block'];

  useEffect(() => {
    if (formData.day && formData.startTime && formData.endTime) {
      checkAvailability();
    }
  }, [formData.day, formData.startTime, formData.endTime, formData.building]);

  const checkAvailability = async () => {
    try {
      setChecking(true);
      const available = await courseScheduleService.getAvailableRooms(
        formData.day,
        formData.startTime,
        formData.endTime,
        formData.building
      );
      setAvailableRooms(available);
    } catch (error) {
      console.error('Failed to check room availability:', error);
    } finally {
      setChecking(false);
    }
  };

  const checkConflicts = async () => {
    try {
      const conflictData = await courseScheduleService.checkConflicts(formData);
      setConflicts(conflictData);
    } catch (error) {
      console.error('Failed to check conflicts:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.room) newErrors.room = 'Room is required';
    if (!formData.type) newErrors.type = 'Session type is required';

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await checkConflicts();
    
    if (conflicts.length > 0) {
      if (!window.confirm('There are scheduling conflicts. Do you want to proceed anyway?')) {
        return;
      }
    }

    onSubmit(formData);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-ocean-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Create Schedule</h2>
              <p className="text-sm text-neutral-600">Add a new course schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Conflict Warning */}
          {conflicts.length > 0 && (
            <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-coral-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-coral-800">Scheduling Conflicts Detected</h4>
                  <p className="text-sm text-coral-700 mt-1">
                    {conflicts.length} conflict(s) found. Review and resolve before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Course *
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${
                  errors.courseId ? 'border-coral-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              {errors.courseId && <p className="text-coral-600 text-sm mt-1">{errors.courseId}</p>}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Session Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              >
                <option value="lecture">Lecture</option>
                <option value="practical">Practical</option>
                <option value="tutorial">Tutorial</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            {/* Day Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Day of Week *
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${
                  errors.day ? 'border-coral-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              {errors.day && <p className="text-coral-600 text-sm mt-1">{errors.day}</p>}
            </div>

            {/* Building Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Building
              </label>
              <select
                value={formData.building}
                onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              >
                <option value="">Select Building</option>
                {buildings.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Start Time *
              </label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${
                  errors.startTime ? 'border-coral-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select Start Time</option>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.startTime && <p className="text-coral-600 text-sm mt-1">{errors.startTime}</p>}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                End Time *
              </label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${
                  errors.endTime ? 'border-coral-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select End Time</option>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.endTime && <p className="text-coral-600 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Room Selection with Availability */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Room/Location *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {rooms.map(room => {
                const isAvailable = availableRooms.includes(room);
                return (
                  <label
                    key={room}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.room === room
                        ? 'border-ocean-500 bg-ocean-50'
                        : isAvailable
                        ? 'border-sage-300 bg-sage-50 hover:bg-sage-100'
                        : 'border-coral-300 bg-coral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="room"
                      value={room}
                      checked={formData.room === room}
                      onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                      className="text-ocean-600 focus:ring-ocean-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-neutral-800">{room}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {checking ? (
                          <span className="text-xs text-neutral-500">Checking...</span>
                        ) : isAvailable ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-sage-600" />
                            <span className="text-xs text-sage-600">Available</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-coral-600" />
                            <span className="text-xs text-coral-600">Conflict</span>
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.room && <p className="text-coral-600 text-sm mt-1">{errors.room}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes or instructions..."
            />
          </div>

          {/* Recurring Schedule */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="rounded text-ocean-600 focus:ring-ocean-500"
            />
            <label htmlFor="isRecurring" className="text-sm font-medium text-neutral-700">
              Create recurring schedule
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-ocean-600 to-sage-600 text-white rounded-lg hover:from-ocean-700 hover:to-sage-700 transition-all duration-200"
            >
              Create Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};