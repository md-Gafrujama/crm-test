import React from 'react';

const ViewLead = ({ lead, onClose, onViewClick, onEditClick, onDeleteClick }) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p><strong>Name:</strong> {lead.customerFirstName} {lead.customerLastName}</p>
            <p><strong>Email:</strong> {lead.emailAddress}</p>
            <p><strong>Phone:</strong> {lead.phoneNumber}</p>
            <p><strong>Job Title:</strong> {lead.jobTitle || 'Not specified'}</p>
          </div>

          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Company Information</h3>
            <p><strong>Company Name:</strong> {lead.companyName || 'Not Specified'}</p>
            <p><strong>Industry:</strong> {lead.industry || 'Not Specified'}</p>
          </div>

          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Lead Details</h3>
            <p><strong>Title:</strong> {lead.title || 'On Progress'}</p>
            <p><strong>Status:</strong> {lead.status || 'On Progress'}</p>
            <p><strong>Created At:</strong> {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : 'Not specified'}</p>
            <p><strong>Deadline:</strong> {lead.closingDate ? new Date(lead.closingDate).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : 'Not specified'}</p>
          </div>

          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Additional Info</h3>
            <p><strong>Topic of Work:</strong> {lead.topicOfWork || 'Not specified'}</p>
            <p><strong>Service Interested:</strong> {lead.serviceInterestedIn || 'Not specified'}</p>
            <p><strong>Notes:</strong> {lead.notes || 'No notes'}</p>
          </div>
        </div>

        <div className="flex mt-6 justify-end space-x-2">
          <button 
            onClick={() => onViewClick(lead)} 
            className="p-2 text-blue-500 hover:text-blue-700 transition-colors" 
            title="View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>

          <button 
            onClick={() => onEditClick(lead)} 
            className="p-2 text-green-500 hover:text-green-700 transition-colors" 
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          <button 
            onClick={() => onDeleteClick(lead)} 
            className="p-2 text-red-500 hover:text-red-700 transition-colors" 
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLead;