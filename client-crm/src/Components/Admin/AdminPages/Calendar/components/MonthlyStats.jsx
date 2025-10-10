import React from 'react';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { months, getDaysInMonth } from '../utils/calendarUtils';

const MonthlyStats = ({ events, currentDate }) => {
  const currentMonthEvents = events.filter(event => {
    if (!event.start?.dateTime && !event.start?.date) return false;
    const eventDate = new Date(event.start?.dateTime || event.start?.date);
    return eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear();
  });

  const activeDays = new Set(currentMonthEvents.map(event => {
    const eventDate = event.start?.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start?.date;
    return eventDate;
  })).size;

  const monthProgress = currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear() ?
    `${Math.round((new Date().getDate() / getDaysInMonth(currentDate)) * 100)}%` :
    '100%';

  return (
    <div className="mb-4 sm:mb-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            This Month Overview
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Events Card */}
          <div className="relative p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm">Total Events</span>
                <div className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {currentMonthEvents.length}
                </div>
              </div>
              <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Days with Events Card */}
          <div className="relative p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-700/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-green-700 dark:text-green-300 font-semibold text-xs sm:text-sm">Active Days</span>
                <div className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {activeDays}
                </div>
              </div>
              <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="relative p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-700/50 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm">Month Progress</span>
                <div className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                  {monthProgress}
                </div>
              </div>
              <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats;
