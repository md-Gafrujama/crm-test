import React from 'react';
import { CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react';
import { formatTime } from '../utils/calendarUtils';

const EventsList = ({ 
  selectedDate, 
  events, 
  isGoogleAuthenticated, 
  loading, 
  deletingEvent,
  onEditEvent,
  onDeleteEvent 
}) => {
  return (
    <div className="lg:col-span-1 order-2 lg:order-2">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-slate-700 h-[350px] sm:h-[400px] flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex-shrink-0">
          Events for {selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </h3>
        {/* Debug info - remove this after testing */}
        <div className="text-xs text-gray-500 mb-3 sm:mb-4 flex-shrink-0 hidden lg:block">
          Debug: Total events: {events.length}, Selected date events: {events.length}
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {!isGoogleAuthenticated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Connect Google Calendar to view events
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2">
              <div className="space-y-3 sm:space-y-4">
                {events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="relative p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-slate-700 dark:to-slate-600 border-l-4 border-orange-500 rounded-xl hover:shadow-lg transition-all duration-200 min-h-[120px] sm:min-h-[140px] flex-shrink-0"
                  >
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                      {/* Event Title and Actions */}
                      <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight flex-1 min-w-0">
                          {event.summary || 'Untitled Event'}
                        </h4>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <button
                            onClick={() => onEditEvent(event)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors touch-manipulation"
                            title="Edit Event"
                          >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(event)}
                            disabled={deletingEvent === (event.dbId || event.googleEventId)}
                            className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
                            title="Delete Event"
                          >
                            {deletingEvent === (event.dbId || event.googleEventId) ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Event Time */}
                      {event.start?.dateTime && (
                        <div className="flex items-center text-orange-700 dark:text-orange-300 font-medium">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-sm sm:text-base flex-1">
                            {formatTime(event.start.dateTime)}
                            {event.end?.dateTime && ` - ${formatTime(event.end.dateTime)}`}
                          </span>
                        </div>
                      )}

                      {/* Event Description */}
                      {event.description && (
                        <div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      )}

                      {/* Google Meet Link */}
                      {(event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri) && (
                        <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                                Google Meet
                              </span>
                            </div>
                            <a
                              href={event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 sm:px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors touch-manipulation"
                            >
                              Join
                            </a>
                          </div>
                          <div className="mt-2 hidden sm:block">
                            <p className="text-xs text-blue-600 dark:text-blue-400 break-all">
                              {event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Active Event
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  No events scheduled for this day
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsList;
