import React from 'react';
import { X } from 'lucide-react';
import { months, getYearRange } from '../utils/calendarUtils';

const MonthYearPicker = ({ 
  showMonthYearPicker, 
  tempDate, 
  onClose, 
  onTempDateChange, 
  onApply 
}) => {
  if (!showMonthYearPicker) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Select Month & Year
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Month Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Month
              </label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => onTempDateChange(new Date(tempDate.getFullYear(), index, 1))}
                    className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${tempDate.getMonth() === index
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                      }`}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Year
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-40 sm:max-h-48 overflow-y-auto">
                {getYearRange().map((year) => (
                  <button
                    key={year}
                    onClick={() => onTempDateChange(new Date(year, tempDate.getMonth(), 1))}
                    className={`p-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${tempDate.getFullYear() === year
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                      }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors touch-manipulation text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => onApply(tempDate.getMonth(), tempDate.getFullYear())}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors touch-manipulation text-sm sm:text-base"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthYearPicker;
