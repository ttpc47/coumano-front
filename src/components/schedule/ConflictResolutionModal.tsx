import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Clock, MapPin, User } from 'lucide-react';
import { ScheduleConflict, SuggestedSolution } from '../../services/courseScheduleService';

interface ConflictResolutionModalProps {
  conflicts: ScheduleConflict[];
  onClose: () => void;
  onResolve: (conflictId: string, solution: SuggestedSolution) => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  conflicts,
  onClose,
  onResolve
}) => {
  const [selectedSolutions, setSelectedSolutions] = useState<Record<string, SuggestedSolution>>({});

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-coral-100 text-coral-800 border-coral-200';
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low': return 'bg-ocean-100 text-ocean-800 border-ocean-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
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
      case 'high': return 'text-coral-600';
      case 'medium': return 'text-warning-600';
      case 'low': return 'text-sage-600';
      default: return 'text-neutral-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-coral-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">Schedule Conflicts</h2>
              <p className="text-sm text-neutral-600">
                {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected. Please review and resolve.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold capitalize">
                      {conflict.type} Conflict
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity} priority
                    </span>
                  </div>

                  {/* Conflicting Schedules */}
                  <div className="mb-4">
                    <h4 className="font-medium text-neutral-800 mb-2">Conflicting Sessions:</h4>
                    <div className="space-y-2">
                      {conflict.conflictingSchedules.map((schedule, scheduleIndex) => (
                        <div key={scheduleIndex} className="bg-white bg-opacity-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-neutral-800">{schedule.courseName}</p>
                              <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
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
                    <h4 className="font-medium text-neutral-800 mb-3">Suggested Solutions:</h4>
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
                            className="mt-1 text-ocean-600 focus:ring-ocean-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-neutral-800">{solution.description}</p>
                              <span className={`text-xs font-medium ${getImpactColor(solution.impact)}`}>
                                {solution.impact} impact
                              </span>
                            </div>
                            {solution.newRoom && (
                              <p className="text-sm text-neutral-600 mt-1">New room: {solution.newRoom}</p>
                            )}
                            {solution.newStartTime && solution.newEndTime && (
                              <p className="text-sm text-neutral-600 mt-1">
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
                      className="flex items-center space-x-2 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Apply Solution</span>
                    </button>
                    
                    <button className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
                      Ignore Conflict
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Resolving conflicts will help ensure smooth scheduling and avoid overlaps.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};