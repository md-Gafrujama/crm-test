import React from 'react';

/**
 * Loading Spinner Component
 * Displays a loading spinner with message
 */
export const LoadingSpinner = ({ message = "Loading data..." }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400 dark:border-slate-300 mx-auto"></div>
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

/**
 * Error Display Component
 * Displays error messages in a styled container
 */
export const ErrorDisplay = ({ error, title = "Error" }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <h2 className="font-bold text-xl mb-2">{title}</h2>
      <p>{error}</p>
      <p className="mt-2 text-sm">Please check the console for more details.</p>
    </div>
  </div>
);

/**
 * Stat Card Component
 * Displays statistics in a card format with icon
 */
export const StatCard = React.memo(({ title, value, icon, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 min-w-0 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200 truncate">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-400 mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 ml-3 flex-shrink-0">
        <span className="text-lg sm:text-xl">{icon}</span>
      </div>
    </div>
  </div>
));

/**
 * Table Header Component
 * Reusable table header with consistent styling
 */
export const TableHeader = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

/**
 * Empty State Component
 * Displays when no data is available
 */
export const EmptyState = ({ 
  title = "No data available", 
  description = "There are no items to display at the moment.",
  icon = "📊",
  actionButton = null 
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">{description}</p>
    {actionButton && actionButton}
  </div>
);

/**
 * Confirmation Modal Component
 * Generic confirmation dialog
 */
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-slate-400 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${variantStyles[variant]}`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Badge Component
 * Displays status badges with different colors
 */
export const StatusBadge = ({ status, onClick, className = "" }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Engaged":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Qualified":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Proposal Sent":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case "Negotiation":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200";
      case "Closed Won":
        return "bg-teal-100 text-teal-800 hover:bg-teal-200";
      case "Closed Lost":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "On Hold":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${getStatusStyle(status)} ${className}`}
    >
      {status}
    </button>
  );
};
