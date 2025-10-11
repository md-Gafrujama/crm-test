import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config/api';

/**
 * DeleteLead Component
 * Provides a confirmation dialog for deleting leads with integrated API calls
 */
const DeleteLead = ({ lead, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!lead?.id) {
      console.error('Lead ID is missing');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/leads/delete-lead/${lead.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Call parent's onConfirm to refresh data and close modal
      onConfirm(lead.id);
    } catch (error) {
      console.error('Error deleting lead:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to delete lead';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Confirm Deletion</h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <p className="text-center text-gray-700 dark:text-gray-400 mb-2">
            Are you sure you want to delete this lead?
          </p>
          
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Lead:</strong> {lead.customerFirstName} {lead.customerLastName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Company:</strong> {lead.companyName || 'Unknown Company'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> {lead.emailAddress || 'No email'}
            </p>
          </div>
          
          <p className="text-sm text-red-600 dark:text-red-400 mt-4 text-center">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 dark:border-slate-400 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 dark:hover:bg-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLead;
