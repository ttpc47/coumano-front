import React, { useState, useEffect } from 'react';
import { X, Edit, Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { CourseSchedule, UpdateScheduleData, courseScheduleService } from '../../services/courseScheduleService';

interface EditScheduleModalProps {
  schedule: CourseSchedule;
  onClose: () => void;
  onSubmit: (scheduleData: UpdateScheduleData) => void;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  schedule,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<UpdateScheduleData>({
    day: schedule.day,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    room: schedule.room,
    building: schedule.building,
    type: schedule.type,
    status: schedule.status,
    notes: schedule.notes
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflicts, setConflicts] = useState<any[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const rooms = ['Amphitheater A', 'Amphitheater B', 'Lab A-205', 'Lab B-205', 'Room C-301'];
  const buildings = ['Main Building', 'Science Block', 'Engineering Block'];

  useEffect(() => {
    checkConflicts();
  }, [formData.day, formData.startTime, formData.endTime, formData.room]);

  const checkConflicts = async () => {
    try {
      const conflictData = await courseScheduleService.checkConflicts(formData, schedule.id);
      setConflicts(conflictData);
    } catch (error) {
      console.error('Failed to check conflicts:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.room) newErrors.room = 'Room is required';

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
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Edit Schedule</h2>
              <p className="text-sm text-neutral-600">{schedule.courseName}</p>
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
                  <h4 className="text-sm font-medium text-coral-800">Scheduling Conflicts</h4>
                  <p className="text-sm text-coral-700 mt-1">
                    Changes will create {conflicts.length} conflict(s).
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Building */}
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

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Room/Location *
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${
                  errors.room ? 'border-coral-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
              {errors.room && <p className="text-coral-600 text-sm mt-1">{errors.room}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
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
              className="px-6 py-2 bg-gradient-to-r from-sage-600 to-ocean-600 text-white rounded-lg hover:from-sage-700 hover:to-ocean-700 transition-all duration-200"
            >
              Update Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};