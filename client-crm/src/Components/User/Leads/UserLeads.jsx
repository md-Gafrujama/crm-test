import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { UserHeader } from "../common/UserHeader";
import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../hooks/use-theme";
import { UserFooter } from "../common/UserFooter";
import StatusHistoryPopup from "../../CombinedForUser&Admin/StatusHistoryPopup";
import CombinedLeadForm from "../../CombinedForUser&Admin/CombinedLeadForm";

const download = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_BASE_URL}/api/export/csv`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Download error:", error);

    // Enhanced error handling for blob responses
    if (error.response && error.response.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorData = JSON.parse(reader.result);
          alert(
            `Download failed: ${errorData.message || error.response.statusText}`
          );
        } catch {
          alert(`Download failed: ${error.response.statusText}`);
        }
      };
      reader.readAsText(error.response.data);
    } else {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Download failed";
      alert(`Download failed: ${errorMessage}`);
    }
  }
};

const UserLeads = ({ collapsed, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { theme, setTheme } = useTheme();
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Initialize leadsData with proper default structure
  const [leadsData, setLeadsData] = useState({
    allLeads: 0,
    allNewLeads: [],
    newLeadsCount: 0,
    allContacted: [],
    contactedCount: 0,
    allEngaged: [],
    engagedCount: 0,
    allQualified: [],
    qualifiedCount: 0,
    allProposalSent: [],
    proposalSentCount: 0,
    allNegotiation: [],
    negotiationCount: 0,
    allClosedWon: [],
    closedWonCount: 0,
    allClosedLost: [],
    closedLostCount: 0,
    allOnHold: [],
    onHoldCount: 0,
    allDoNotContact: [],
    doNotContactCount: 0,
  });

  const navigate = useNavigate();

  // Safe way to combine all leads with proper null checks
  const allCombinedLeads = React.useMemo(() => {
    if (!leadsData) return [];
    
    return [
      ...(Array.isArray(leadsData.allNewLeads) ? leadsData.allNewLeads : []),
      ...(Array.isArray(leadsData.allContacted) ? leadsData.allContacted : []),
      ...(Array.isArray(leadsData.allEngaged) ? leadsData.allEngaged : []),
      ...(Array.isArray(leadsData.allQualified) ? leadsData.allQualified : []),
      ...(Array.isArray(leadsData.allProposalSent) ? leadsData.allProposalSent : []),
      ...(Array.isArray(leadsData.allNegotiation) ? leadsData.allNegotiation : []),
      ...(Array.isArray(leadsData.allClosedWon) ? leadsData.allClosedWon : []),
      ...(Array.isArray(leadsData.allClosedLost) ? leadsData.allClosedLost : []),
      ...(Array.isArray(leadsData.allOnHold) ? leadsData.allOnHold : []),
      ...(Array.isArray(leadsData.allDoNotContact) ? leadsData.allDoNotContact : []),
    ];
  }, [leadsData]);

  // Add these popup components right before your return statement
  const ViewLeadPopup = ({
    lead,
    onClose,
    onViewClick,
    onEditClick,
    onDeleteClick,
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">
            Lead Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p>
              <strong>Name:</strong> {lead.customerFirstName}{" "}
              {lead.customerLastName}
            </p>
            <p>
              <strong>Email:</strong> {lead.emailAddress}
            </p>
            <p>
              <strong>Phone:</strong> {lead.phoneNumber}
            </p>
            <p>
              <strong>Job Title:</strong> {lead.jobTitle || "Not specified"}
            </p>
          </div>

          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Company Information</h3>
            <p>
              <strong>Company Name:</strong>{" "}
              {lead.companyName || "Not Specified"}
            </p>
            <p>
              <strong>Industry:</strong> {lead.industry || "Not Specified"}
            </p>
          </div>

          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Lead Details</h3>
            <p>
              <strong>Title:</strong> {lead.title || "On Progress"}
            </p>
            <p>
              <strong>Status:</strong> {lead.status || "On Progress"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {lead.createdAt
                ? new Date(lead.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Not specified"}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {lead.closingDate
                ? new Date(lead.closingDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Not specified"}
            </p>
          </div>

          <div className="text-left dark:text-gray-400">
            <h3 className="font-semibold mb-2">Tracking</h3>
            <p>
              <strong>Service Interested:</strong>{" "}
              {lead.serviceInterestedIn || "Not specified"}
            </p>
            <p>
              <strong>Topic of Work:</strong>{" "}
              {lead.topicOfWork || "Not specified"}
            </p>
            <p>
              <strong>Notes:</strong> {lead.notes || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex mt-auto justify-end space-x-2">
          {/* View Button */}
          <button
            onClick={() => onViewClick(lead)}
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEditClick(lead)}
            className="p-1 text-green-500 hover:text-green-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDeleteClick(lead)}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const EditLeadPopup = ({ lead, onClose, onSave }) => {
    const [editedLead, setEditedLead] = useState(lead || {});

    const handleChangeEdit = (e) => {
      const { name, value } = e.target;
      setEditedLead((prev) => ({ ...prev, [name]: value, id: lead?.id }));
    };

    const handleSubmitEdit = (e) => {
      e.preventDefault();
      onSave(editedLead);
    };

    if (!lead) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">
              Edit Lead
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmitEdit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 dark:text-gray-400">
                <h3 className="font-semibold text-[#ff8633]">
                  Contact Information
                </h3>
                <div className="flex flex-row gap-4">
                  <div>
                    <label className="block text-base dark:text-gray-400 font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="customerFirstName"
                      value={editedLead.customerFirstName || ""}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium dark:text-gray-400 text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="customerLastName"
                      value={editedLead.customerLastName || ""}
                      onChange={handleChangeEdit}
                      className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={editedLead.emailAddress || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedLead.phoneNumber || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-400 text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={editedLead.jobTitle || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">
                  Company Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={editedLead.companyName || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={editedLead.industry || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  >
                    <option value="">Select an industry</option>
                    <option value="Technology">Technology</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">Lead Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editedLead.title || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editedLead.status || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  >
                    <option value="">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Do Not Contact">Do Not Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Service Interested In
                  </label>
                  <select
                    name="serviceInterestedIn"
                    value={editedLead.serviceInterestedIn || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  >
                    <option value="">Service Interested In</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Content Syndication">
                      Content Syndication
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#ff8633]">
                  Additional Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Topic of Work
                  </label>
                  <input
                    type="text"
                    name="topicOfWork"
                    value={editedLead.topicOfWork || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Expected Closing Date
                  </label>
                  <input
                    type="date"
                    name="closingDate"
                    value={
                      editedLead.closingDate
                        ? editedLead.closingDate.split("T")[0]
                        : ""
                    }
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editedLead.notes || ""}
                    onChange={handleChangeEdit}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e67328] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmationPopup = ({ lead, onClose, onConfirm }) => {
    if (!lead) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">
              Confirm Deletion
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="mb-6 dark:text-gray-400">
            Are you sure you want to delete the lead for{" "}
            <strong>
              {lead.customerFirstName} {lead.customerLastName}
            </strong>{" "}
            from <strong>{lead.companyName || "Unknown Company"}</strong>?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(lead.id)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete Lead
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveLead = async (updatedLead) => {
    try {
      setIsSaving(true);
      setApiError(null);

      if (!updatedLead.id) {
        throw new Error("Lead ID is missing. Cannot update lead.");
      }

      const payload = {
        uid: updatedLead.uid,
        companyId: updatedLead.cid,
        title: updatedLead.title,
        customerFirstName: updatedLead.customerFirstName,
        customerLastName: updatedLead.customerLastName,
        emailAddress: updatedLead.emailAddress,
        phoneNumber: updatedLead.phoneNumber,
        companyName: updatedLead.companyName,
        jobTitle: updatedLead.jobTitle,
        topicOfWork: updatedLead.topicOfWork,
        industry: updatedLead.industry,
        status: updatedLead.status,
        serviceInterestedIn: updatedLead.serviceInterestedIn,
        closingDate: updatedLead.closingDate,
        notes: updatedLead.notes,
      };

      const token = localStorage.getItem("token");

      // Update lead with Axios
      const response = await axios.put(
        `${API_BASE_URL}/api/leads/update-lead/${updatedLead.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setLeadsData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        
        // Helper function to update leads in any status array
        const updateStatusArray = (arr) => 
          Array.isArray(arr) ? arr.map(lead => lead.id === updatedLead.id ? response.data : lead) : [];
        
        return {
          ...newData,
          allNewLeads: updateStatusArray(newData.allNewLeads || []),
          allContacted: updateStatusArray(newData.allContacted || []),
          allEngaged: updateStatusArray(newData.allEngaged || []),
          allQualified: updateStatusArray(newData.allQualified || []),
          allProposalSent: updateStatusArray(newData.allProposalSent || []),
          allNegotiation: updateStatusArray(newData.allNegotiation || []),
          allClosedWon: updateStatusArray(newData.allClosedWon || []),
          allClosedLost: updateStatusArray(newData.allClosedLost || []),
          allOnHold: updateStatusArray(newData.allOnHold || []),
          allDoNotContact: updateStatusArray(newData.allDoNotContact || []),
        };
      });

      setEditPopupOpen(false);
      toast.success("Lead updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });
    } catch (err) {
      console.error("Lead update error:", err);

      // Enhanced error handling with Axios
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update lead";

      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const token = localStorage.getItem("token");

      // Delete lead with Axios
      await axios.delete(`${API_BASE_URL}/api/leads/delete-lead/${leadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setDeletePopupOpen(false);
      toast.success("Lead deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });

      // Refresh leads data with Axios
      const { data } = await axios.get(`${API_BASE_URL}/api/usersData`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Ensure we have valid data structure
      if (data && data.data) {
        setLeadsData(data.data);
      }
    } catch (err) {
      console.error("Lead deletion error:", err);

      // Enhanced error handling with Axios
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete lead";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
        style: { fontSize: "1.2rem" },
      });
    }
  };

  // UserProfile.jsx
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.group("[UserProfile] Loading User Data");

        // 1. Get stored credentials
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username");

        console.log("Stored credentials:", {
          token: token ? "exists" : "missing",
          userId: storedUserId,
          username: storedUsername,
        });

        if (!token || !storedUserId) {
          throw new Error("Missing authentication data");
        }

        console.log("Fetching user data...");
        const response = await axios.get(`${API_BASE_URL}/api/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = response.data;
        console.log("Received users:", allUsers);

        // 3. Find matching user with proper validation
        if (!Array.isArray(allUsers)) {
          throw new Error("Invalid users data received");
        }

        const matchedUser = allUsers.find(
          (user) => user && user.id === storedUserId && user.username === storedUsername
        );

        if (!matchedUser) {
          console.error(
            "No matching user found. Available users:",
            allUsers.map((u) => ({ id: u?.id, username: u?.username }))
          );
          throw new Error("User data mismatch");
        }

        console.log("Matched user:", matchedUser);
        setCurrentUser(matchedUser);
        setLoading(false);

        console.groupEnd();
      } catch (error) {
        console.error("Profile loading error:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load profile data";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === "dark" ? "dark" : "light",
          style: { fontSize: "1.2rem" },
        });
        setLoading(false);
        onLogout();
      }
    };

    loadUserProfile();
  }, [onLogout, theme]);

  // the leads of the user
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        setLeadsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please log in to view leads", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
            style: { fontSize: "1.2rem" },
          });
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/recent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Leads data:", response.data); // Debug log
        
        // Validate response structure
        if (response.data && response.data.data) {
          setLeadsData(response.data.data);
        } else {
          console.warn("Invalid leads data structure:", response.data);
          // Set default structure if invalid
          setLeadsData({
            allLeads: 0,
            allNewLeads: [],
            newLeadsCount: 0,
            allContacted: [],
            contactedCount: 0,
            allEngaged: [],
            engagedCount: 0,
            allQualified: [],
            qualifiedCount: 0,
            allProposalSent: [],
            proposalSentCount: 0,
            allNegotiation: [],
            negotiationCount: 0,
            allClosedWon: [],
            closedWonCount: 0,
            allClosedLost: [],
            closedLostCount: 0,
            allOnHold: [],
            onHoldCount: 0,
            allDoNotContact: [],
            doNotContactCount: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching leads:", error);

        const errorMessage =
          error.response?.data?.message || "Failed to load leads";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === "dark" ? "dark" : "light",
          style: { fontSize: "1.2rem" },
        });
      } finally {
        setLeadsLoading(false);
      }
    };

    fetchLeadsData();
  }, [navigate, theme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
          {/* Main Content */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out min-h-screen bg-slate-100 dark:bg-slate-900",
              collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
            )}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-slate-900 bg-slate-100">
              <div className="flex flex-col items-center">
                <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-[#ff8633] to-[#ff9a5a] p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                      <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                          Leads Management
                        </h1>
                        <p className="text-white/90">
                          Total Leads: {allCombinedLeads.length}
                        </p>
                      </div>
                      <div className="flex flex-row gap-4">
                        <div>
                          <button
                            onClick={download}
                            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-[#ff8633] rounded-md transition-colors shadow-md"
                          >
                            Download Leads
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        <div>
                          <button 
                            onClick={() => setShowAddLeadForm(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-white p-5 justify-center hover:bg-gray-100 text-[#ff8633] rounded-md transition-colors shadow-md"
                          >
                            Add Leads
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-6">
                    {leadsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        {allCombinedLeads.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-100 text-lg">
                              No leads found
                            </p>
                            <p className="text-gray-400 dark:text-gray-100 mt-2">
                              Create your first lead to get started
                            </p>
                          </div>
                        ) : (
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-slate-800">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200">
                              {allCombinedLeads.map((lead, index) => {
                                // Add safety check for each lead
                                if (!lead || !lead.id) {
                                  console.warn(`Invalid lead at index ${index}:`, lead);
                                  return null;
                                }
                                
                                return (
                                  <tr key={lead.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-600 font-medium">
                                            {(lead.customerFirstName || '').charAt(0)}
                                            {(lead.customerLastName || '').charAt(0)}
                                          </span>
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                            {lead.customerFirstName || ''}{" "}
                                            {lead.customerLastName || ''}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {lead.emailAddress || ''}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 dark:text-gray-400">
                                        {lead.companyName || 'N/A'}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <button
                                        onClick={() => setSelectedLead(lead)}
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          lead.status === "New"
                                            ? "bg-blue-100 text-blue-800"
                                            : lead.status === "Contacted"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : lead.status === "Engaged"
                                            ? "bg-green-100 text-green-800"
                                            : lead.status === "Qualified"
                                            ? "bg-purple-100 text-purple-800"
                                            : lead.status === "Proposal Sent"
                                            ? "bg-indigo-100 text-indigo-800"
                                            : lead.status === "Negotiation"
                                            ? "bg-pink-100 text-pink-800"
                                            : lead.status === "Closed Won"
                                            ? "bg-teal-100 text-teal-800"
                                            : lead.status === "Closed Lost"
                                            ? "bg-red-100 text-red-800"
                                            : lead.status === "On Hold"
                                            ? "bg-gray-100 text-gray-800"
                                            : "bg-orange-100 text-orange-800"
                                        }`}
                                      >
                                        {lead.status || 'New'}
                                      </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {lead.serviceInterestedIn || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => {
                                            setCurrentLead(lead);
                                            setViewPopupOpen(true);
                                          }}
                                          className="text-blue-600 hover:text-blue-900"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path
                                              fillRule="evenodd"
                                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setCurrentLead(lead);
                                            setEditPopupOpen(true);
                                          }}
                                          className="text-green-600 hover:text-green-900"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setCurrentLead(lead);
                                            setDeletePopupOpen(true);
                                          }}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }).filter(Boolean)}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Popups */}
          {viewPopupOpen && currentLead && (
            <ViewLeadPopup
              lead={currentLead}
              onClose={() => setViewPopupOpen(false)}
              onViewClick={(lead) => {
                setCurrentLead(lead);
                setViewPopupOpen(true);
              }}
              onEditClick={(lead) => {
                setCurrentLead(lead);
                setViewPopupOpen(false);
                setEditPopupOpen(true);
              }}
              onDeleteClick={(lead) => {
                setCurrentLead(lead);
                setViewPopupOpen(false);
                setDeletePopupOpen(true);
              }}
            />
          )}

          {editPopupOpen && currentLead && (
            <EditLeadPopup
              lead={currentLead}
              onClose={() => setEditPopupOpen(false)}
              onSave={handleSaveLead}
            />
          )}

          {deletePopupOpen && currentLead && (
            <DeleteConfirmationPopup
              lead={currentLead}
              onClose={() => setDeletePopupOpen(false)}
              onConfirm={handleDeleteLead}
            />
          )}

          {selectedLead && (
            <StatusHistoryPopup
              lead={selectedLead}
              onClose={() => setSelectedLead(null)}
            />
          )}

          <CombinedLeadForm 
            isOpen={showAddLeadForm} 
            onClose={() => setShowAddLeadForm(false)} 
            collapsed={collapsed}
          />
        </div>
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserLeads;