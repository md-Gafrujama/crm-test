import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  isToday, 
  isSelected, 
  hasEvents, 
  getEventsForDate,
  navigateMonth,
  months
} from '../utils/calendarUtils';

const CalendarGrid = ({ 
  currentDate, 
  selectedDate, 
  events, 
  isGoogleAuthenticated,
  onDateSelect,
  onDateDoubleClick,
  onNavigateMonth,
  onOpenEventForm,
  onOpenMonthYearPicker
}) => {
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    // Adjust for Monday start (0 = Sunday, 1 = Monday, etc.)
    // We want Monday to be 0, so: Sunday(0)->6, Monday(1)->0, Tuesday(2)->1, etc.
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Add previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-600 mx-auto"
        >
          {day}
        </div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day, currentDate, events);
      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(day)}
          onDoubleClick={() => onDateDoubleClick(day)}
          className={`
            relative h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center cursor-pointer transition-all duration-150 text-xs sm:text-sm font-medium rounded-lg mx-auto touch-manipulation
            ${isToday(day, currentDate)
              ? 'bg-orange-500 text-white shadow-md'
              : isSelected(day, currentDate, selectedDate)
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {day}
          {hasEvents(day, currentDate, events) && (
            <div className="absolute bottom-0.5 right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full"></div>
          )}
        </div>
      );
    }

    // Add next month's leading days to fill the grid
    const totalCells = Math.ceil((adjustedFirstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (adjustedFirstDay + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-600 mx-auto"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="lg:col-span-1 order-1 lg:order-1">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
        {/* Compact Calendar Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => onNavigateMonth(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={onOpenMonthYearPicker}
            className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-2 py-1 rounded touch-manipulation"
          >
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </button>

          <button
            onClick={() => onNavigateMonth(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Compact Calendar Body */}
        <div className="p-3 sm:p-4">
          {/* Days of week header - more compact */}
          <div className="grid grid-cols-7 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <div
                key={day}
                className="h-6 sm:h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Compact Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Add Event Button */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-slate-700">
          {isGoogleAuthenticated ? (
            <button
              onClick={() => onOpenEventForm()}
              className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 sm:py-2 px-4 rounded-lg transition-colors touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm sm:text-base">Add Event</span>
            </button>
          ) : (
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-2">
                Connect Google Calendar to add events
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
