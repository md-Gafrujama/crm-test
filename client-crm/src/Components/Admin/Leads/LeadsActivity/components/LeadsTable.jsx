import React, { useCallback } from 'react';
import { TableHeader, StatusBadge } from './UtilityComponents';
import { handleCSVDownload } from '../services/leadsApi';


const LeadsTable = React.memo(({ 
  leadsData, 
  setSelectedLead, 
  setCurrentLead, 
  setViewPopupOpen, 
  setEditPopupOpen, 
  setShowAddLeadForm, 
  setDeletePopupOpen 
}) => {
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  }, []);

  const handleDownload = async () => {
    try {
      await handleCSVDownload();
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 items-center mb-4 border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-700 dark:text-gray-400">
          Leads ({leadsData.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button 
            onClick={handleDownload} 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ff8633] hover:bg-orange-500 text-white rounded-md transition-colors text-sm font-medium"
          >
            <span className="hidden sm:inline">Download Leads</span>
            <span className="sm:hidden">Download</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <button 
            onClick={() => setShowAddLeadForm(true)} 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ff8633] hover:bg-orange-500 text-white rounded-md transition-colors text-sm font-medium"
          >
            <span className="hidden sm:inline">Add Leads</span>
            <span className="sm:hidden">Add</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leadsData.map((lead) => (
              <LeadRow 
                key={lead.id} 
                lead={lead} 
                formatDate={formatDate} 
                setSelectedLead={setSelectedLead} 
                setCurrentLead={setCurrentLead} 
                setViewPopupOpen={setViewPopupOpen} 
                setEditPopupOpen={setEditPopupOpen} 
                setDeletePopupOpen={setDeletePopupOpen} 
                setShowAddLeadForm={setShowAddLeadForm} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/**
 * LeadRow Component
 * Individual row component for the leads table
 */
const LeadRow = React.memo(({ 
  lead, 
  formatDate, 
  setSelectedLead, 
  setCurrentLead, 
  setViewPopupOpen, 
  setEditPopupOpen, 
  setDeletePopupOpen 
}) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900 dark:text-gray-400 truncate max-w-xs">
        {lead.title}
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-gray-400 font-medium">
        {lead.customerFirstName || "N/A"} {lead.customerLastName || ""}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
        {lead.emailAddress || "N/A"}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {lead.phoneNumber || "N/A"}
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <StatusBadge 
        status={lead.status}
        onClick={() => setSelectedLead(lead)}
      />
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex items-center justify-center space-x-2">
        {/* View Button */}
        <ActionButton
          onClick={() => { setCurrentLead(lead); setViewPopupOpen(true); }}
          color="blue"
          title="View Lead"
          icon={<ViewIcon />}
        />

        {/* Edit Button */}
        <ActionButton
          onClick={() => { setCurrentLead(lead); setEditPopupOpen(true); }}
          color="green"
          title="Edit Lead"
          icon={<EditIcon />}
        />

        {/* Delete Button */}
        <ActionButton
          onClick={() => { setCurrentLead(lead); setDeletePopupOpen(true); }}
          color="red"
          title="Delete Lead"
          icon={<DeleteIcon />}
        />
      </div>
    </td>
  </tr>
));

/**
 * ActionButton Component
 * Reusable action button for table actions
 */
const ActionButton = ({ onClick, color, title, icon }) => {
  const colorClasses = {
    blue: "text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30",
    green: "text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30",
    red: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
  };

  return (
    <button 
      onClick={onClick} 
      className={`p-2 rounded-full transition-all ${colorClasses[color]}`}
      title={title}
    >
      {icon}
    </button>
  );
};

// Icon Components
const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export default LeadsTable;
