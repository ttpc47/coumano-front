import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, User, CheckCircle, X } from 'lucide-react';
import { CourseSchedule } from '../../types';

interface ScheduleConflict {
  type: 'room' | 'lecturer' | 'time';
  severity: 'high' | 'medium' | 'low';
  conflictingSchedules: CourseSchedule[];
  suggestedSolutions: SuggestedSolution[];
}

interface SuggestedSolution {
  id: string;
  type: 'change_room' | 'change_time' | 'split_session';
  description: string;
  newRoom?: string;
  newStartTime?: string;
  newEndTime?: string;
  impact: 'low' | 'medium' | 'high';
}

interface ScheduleConflictResolverProps {
  conflicts: ScheduleConflict[];
  onResolve: (conflictId: string, solution: SuggestedSolution) => void;
  onIgnore: (conflictId: string) => void;
  onClose: () => void;
}

export const ScheduleConflictResolver: React.FC<ScheduleConflictResolverProps> = ({
  conflicts,
  onResolve,
  onIgnore,
  onClose
}) => {
  const [selectedSolutions, setSelectedSolutions] = useState<Record<string, SuggestedSolution>>({});

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'room': return <MapPin className="w-5 h-5" />;
      case 'lecturer': return <User className="w-5 h-5" />;
      case 'time': return <Clock className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Schedule Conflicts Detected</h2>
              <p className="text-sm text-gray-600">
                {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} found. Please review and resolve.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conflicts List */}
        <div className="p-6 space-y-6">
          {conflicts.map((conflict, index) => (
            <div key={index} className={`border rounded-lg p-6 ${getSeverityColor(conflict.severity)}`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getConflictIcon(conflict.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold capitalize">
                      {conflict.type} Conflict
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity} priority
                    </span>
                  </div>

                  {/* Conflicting Schedules */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Conflicting Sessions:</h4>
                    <div className="space-y-2">
                      {conflict.conflictingSchedules.map((schedule, scheduleIndex) => (
                        <div key={scheduleIndex} className="bg-white bg-opacity-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Course Schedule</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>{schedule.day}</span>
                                <span>{schedule.startTime} - {schedule.endTime}</span>
                                <span>{schedule.room}</span>
                                <span className="capitalize">{schedule.type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Solutions */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Suggested Solutions:</h4>
                    <div className="space-y-3">
                      {conflict.suggestedSolutions.map((solution) => (
                        <label key={solution.id} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`conflict-${index}`}
                            value={solution.id}
                            onChange={() => setSelectedSolutions(prev => ({
                              ...prev,
                              [`conflict-${index}`]: solution
                            }))}
                            className="mt-1 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{solution.description}</p>
                              <span className={`text-xs font-medium ${getImpactColor(solution.impact)}`}>
                                {solution.impact} impact
                              </span>
                            </div>
                            {solution.newRoom && (
                              <p className="text-sm text-gray-600 mt-1">New room: {solution.newRoom}</p>
                            )}
                            {solution.newStartTime && solution.newEndTime && (
                              <p className="text-sm text-gray-600 mt-1">
                                New time: {solution.newStartTime} - {solution.newEndTime}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        const solution = selectedSolutions[`conflict-${index}`];
                        if (solution) {
                          onResolve(`conflict-${index}`, solution);
                        }
                      }}
                      disabled={!selectedSolutions[`conflict-${index}`]}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Apply Solution</span>
                    </button>
                    
                    <button
                      onClick={() => onIgnore(`conflict-${index}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Ignore Conflict
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Resolving conflicts will help ensure smooth scheduling and avoid overlaps.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};