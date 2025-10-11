import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config/api';

/**
 * EditLead Component
 * Provides a form to edit lead information with integrated API calls
 */
const EditLead = ({ lead, onClose, onSave }) => {
  const [editedLead, setEditedLead] = useState(lead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: value, id: lead.id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editedLead.id) {
      alert('Lead ID is missing. Cannot update lead.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        uid: editedLead.uid,
        companyId: editedLead.cid,
        title: editedLead.title,
        customerFirstName: editedLead.customerFirstName,
        customerLastName: editedLead.customerLastName,
        emailAddress: editedLead.emailAddress,
        phoneNumber: editedLead.phoneNumber,
        companyName: editedLead.companyName,
        jobTitle: editedLead.jobTitle,
        topicOfWork: editedLead.topicOfWork,
        industry: editedLead.industry,
        status: editedLead.status,
        serviceInterestedIn: editedLead.serviceInterestedIn,
        closingDate: editedLead.closingDate,
        notes: editedLead.notes,
      };

      const response = await axios.put(`${API_BASE_URL}/api/leads/update-lead/${editedLead.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Call parent's onSave to refresh data and close modal
      onSave(editedLead);
    } catch (error) {
      console.error('Error updating lead:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to update lead';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Edit Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
            disabled={isSubmitting}
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Contact Information</h3>
              <div className="flex flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">First Name</label>
                  <input
                    type="text"
                    name="customerFirstName"
                    value={editedLead.customerFirstName || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name</label>
                  <input
                    type="text"
                    name="customerLastName"
                    value={editedLead.customerLastName || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={editedLead.emailAddress || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedLead.phoneNumber || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedLead.jobTitle || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Company Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={editedLead.companyName || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Industry</label>
                <select
                  name="industry"
                  value={editedLead.industry || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Saas">Saas</option>
                  <option value="Media">Media</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Lead Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Lead Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedLead.title || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Status</label>
                <select
                  name="status"
                  value={editedLead.status || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Do Not Contact">Do Not Contact</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Topic of Work</label>
                <input
                  type="text"
                  name="topicOfWork"
                  value={editedLead.topicOfWork || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Expected Closing Date</label>
                <input
                  type="date"
                  name="closingDate"
                  value={editedLead.closingDate ? editedLead.closingDate.split('T')[0] : ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#ff8633]">Additional Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Service Interested In</label>
                <input
                  type="text"
                  name="serviceInterestedIn"
                  value={editedLead.serviceInterestedIn || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Notes</label>
                <textarea
                  name="notes"
                  value={editedLead.notes || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all disabled:opacity-50"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e57328] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;