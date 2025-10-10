import React from 'react';
import { X } from 'lucide-react';

const EventForm = ({ 
  showEventForm, 
  editingEvent, 
  eventForm, 
  submitting,
  onClose, 
  onFormChange, 
  onSubmit 
}) => {
  if (!showEventForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
            {/* Event Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Summary *
              </label>
              <input
                type="text"
                value={eventForm.summary}
                onChange={(e) => onFormChange('summary', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                placeholder="Enter event summary"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={eventForm.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                placeholder="Enter event description"
                rows="3"
              />
            </div>

            {/* Event Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Purpose *
              </label>
              <select
                value={eventForm.eventPurpose}
                onChange={(e) => onFormChange('eventPurpose', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                required
              >
                <option value="MEETING">Meeting</option>
                <option value="TRAINING">Training</option>
                <option value="WEBINAR">Webinar</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Start Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={eventForm.startDateTime}
                onChange={(e) => onFormChange('startDateTime', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                required
              />
            </div>

            {/* End Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                value={eventForm.endDateTime}
                onChange={(e) => onFormChange('endDateTime', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                required
              />
            </div>

            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Type
              </label>
              <select
                value={eventForm.meetingType}
                onChange={(e) => onFormChange('meetingType', e.target.value)}
                className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
              >
                <option value="ONLINE">Online Meeting</option>
                <option value="OFFLINE">In-Person Meeting</option>
                <option value="HYBRID">Hybrid Meeting</option>
              </select>
            </div>

            {/* Require Google Meet */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="requireMeeting"
                checked={eventForm.requireMeeting}
                onChange={(e) => onFormChange('requireMeeting', e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="requireMeeting" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Create Google Meet link
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors touch-manipulation text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center justify-center touch-manipulation text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <span>{editingEvent ? 'Update Event' : 'Create Event'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
