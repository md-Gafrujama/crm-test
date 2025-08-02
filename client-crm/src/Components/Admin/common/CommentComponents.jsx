export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
  </div>
);

export const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

export const CommentRow = ({ comment, onView, onDelete }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-800 dark:text-gray-400 font-medium">
            {comment.firstName?.charAt(0)}{comment.lastName?.charAt(0)}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-400">
            {comment.firstName} {comment.lastName}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="text-sm text-left text-gray-900 dark:text-gray-400 line-clamp-2">
        {comment.comment}
      </div>
    </td>
    <td className="px-6 flex flex-row gap-4 py-4 whitespace-nowrap text-left dark:text-gray-400 text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <h1>View</h1>
        <button onClick={onView} className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>

        <h1>Delete</h1>
        <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
);

export const ViewCommentPopup = ({ comment, onClose, activeTab }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Comment Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium text-xl">
              {comment.firstName?.charAt(0)}{comment.lastName?.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400">
              {comment.firstName} {comment.lastName}
            </h3>
          </div>
        </div>

        <div className="bg-gray-50 dark:border dark:border-slate-400 dark:bg-slate-800 p-4 rounded-lg">
          <p className="text-gray-800 dark:text-gray-400 whitespace-pre-line">
            Commented "{comment.comment}" on{" "}
            <span className="font-semibold">
              {comment.companyName || (activeTab === 'compare' ? 'Compare Bazar' : 'Quore B2B')}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#ff8633] text-white rounded-md hover:bg-[#e57328] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export const DeleteConfirmationPopup = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Confirm Deletion</h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mb-6 dark:text-gray-400">Are you sure you want to delete this comment? This action cannot be undone.</p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);