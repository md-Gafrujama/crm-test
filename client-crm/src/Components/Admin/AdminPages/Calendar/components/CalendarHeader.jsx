import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { initiateGoogleAuth } from '../services/calendarApi';

const CalendarHeader = ({ isGoogleAuthenticated, authLoading }) => {
  return (
    <div className="mb-4 sm:mb-8 bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
            <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Google Calendar
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              View and manage your Google Calendar events
            </p>
          </div>
        </div>

        {/* Google Calendar Authentication Status */}
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {authLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Checking...</span>
            </div>
          ) : isGoogleAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Not Connected</span>
              </div>
              <button
                onClick={initiateGoogleAuth}
                className="px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
              >
                Connect Google Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
