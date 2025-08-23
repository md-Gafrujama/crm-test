import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../config/api'; 
import { Header } from '../common/Header';
import { Sidebar,useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../hooks/use-theme";
import Footer from "../common/Footer";
import StatusHistoryPopup from "../../CombinedForUser&Admin/StatusHistoryPopup";
import CombinedLeadForm from "../../CombinedForUser&Admin/CombinedLeadForm";

// Week and Month filter options with "All" options
const WEEKS = ["All Weeks", "Week 1", "Week 2", "Week 3", "Week 4"];
const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const download = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/export/csv`, { 
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download error:', error);
    alert(`Download failed: ${error.message}`);
  }
};

const LeadsActivity = ({collapsed}) => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState([]);
  const [weeklyLeads, setWeeklyLeads] = useState([]);
  const [monthlyLeads, setMonthlyLeads] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("All Weeks");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { theme, setTheme } = useTheme();
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);

  const [stats, setStats] = useState({
    userNumber: 0,
    leadsNumber: 0,
    weeklyCount: 0,
    monthlyCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const handleSaveLead = async (updatedLead) => {
    try {
      setIsSaving(true);
      setApiError(null);

      if (!updatedLead.id) {
        throw new Error('Lead ID is missing. Cannot update lead.');
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

      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/leads/update-lead/${updatedLead.id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setEditPopupOpen(false);
      await fetchData();
      await fetchWeeklyMonthlyData();
    } catch (error) {
      console.error('Error saving lead:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to update lead';
      setApiError(errorMessage);
      alert('Failed to update lead: ' + errorMessage);
    } 
    finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/leads/delete-lead/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setDeletePopupOpen(false);
      fetchData();
      fetchWeeklyMonthlyData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         'Failed to delete lead';
      throw new Error(errorMessage);
    }
  };

  // Fetch weekly and monthly leads data with updated filtering logic
  const fetchWeeklyMonthlyData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [weeklyResponse, monthlyResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/leads/weekly`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/leads/monthly`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setWeeklyLeads(weeklyResponse.data || []);
      setMonthlyLeads(monthlyResponse.data || []);

      // Calculate counts based on current filters
      let monthlyCount = 0;
      let weeklyCount = 0;

      if (selectedMonth === "All Months") {
        // Show all monthly leads
        monthlyCount = monthlyResponse.data.length;
      } else {
        const currentMonthIndex = MONTHS.indexOf(selectedMonth) - 1; // -1 because "All Months" is at index 0
        monthlyCount = monthlyResponse.data.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          return leadDate.getMonth() === currentMonthIndex;
        }).length;
      }

      if (selectedWeek === "All Weeks") {
        if (selectedMonth === "All Months") {
          // Show all weekly leads
          weeklyCount = weeklyResponse.data.length;
        } else {
          // Show all weeks for the selected month
          const currentMonthIndex = MONTHS.indexOf(selectedMonth) - 1;
          weeklyCount = weeklyResponse.data.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate.getMonth() === currentMonthIndex;
          }).length;
        }
      } else {
        const currentWeekNumber = parseInt(selectedWeek.split(' ')[1]);
        if (selectedMonth === "All Months") {
          // Show specific week across all months
          weeklyCount = weeklyResponse.data.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            const weekOfMonth = Math.ceil(leadDate.getDate() / 7);
            return weekOfMonth === currentWeekNumber;
          }).length;
        } else {
          // Show specific week for specific month
          const currentMonthIndex = MONTHS.indexOf(selectedMonth) - 1;
          weeklyCount = weeklyResponse.data.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            const weekOfMonth = Math.ceil(leadDate.getDate() / 7);
            return leadDate.getMonth() === currentMonthIndex && weekOfMonth === currentWeekNumber;
          }).length;
        }
      }

      setStats(prev => ({
        ...prev,
        weeklyCount,
        monthlyCount
      }));

    } catch (err) {
      console.error('Error fetching weekly/monthly data:', err);
    }
  }, [selectedMonth, selectedWeek]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to view data", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === 'dark' ? 'dark' : 'light',
          style: { fontSize: '1.2rem' }, 
        });
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/recent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        toast.error("Session expired please login again", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === 'dark' ? 'dark' : 'light',
          style: { fontSize: '1.2rem' }, 
        });
        navigate('/login');
        return;
      }

      const recentData = await response.data;

      if (!recentData.leads) {
        throw new Error("Incomplete leads data received from API");
      }

      setLeadsData(recentData.leads);
      setStats(prev => ({
        ...prev,
        userNumber: recentData.userNumber || 0,
        leadsNumber: recentData.leadsNumber || 0,
      }));
    } catch (err) {
      console.error("Error in data fetching:", err);
      const errorMessage = err.response?.status === 401 
        ? "Session expired please login again"
        : err.response?.data?.message 
        ? err.response.data.message
        : err.message 
        ? err.message
        : "Failed to fetch data";

      setError(errorMessage);
      toast.error("Failed to fetch data" || err.message , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.2rem' }, 
      });
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, toast, theme]); 

  useEffect(() => {
    fetchData();
    fetchWeeklyMonthlyData();
  }, [fetchData, fetchWeeklyMonthlyData]);

  // Update counts when filters change
  useEffect(() => {
    fetchWeeklyMonthlyData();
  }, [selectedWeek, selectedMonth, fetchWeeklyMonthlyData]);

  // Helper function to get display text for cards
  const getWeekDisplayText = () => {
    if (selectedWeek === "All Weeks") {
      return selectedMonth === "All Months" ? "All Weeks" : `All ${selectedMonth} Weeks`;
    }
    return selectedMonth === "All Months" ? `${selectedWeek} (All Months)` : `${selectedWeek} ${selectedMonth}`;
  };

  const getMonthDisplayText = () => {
    return selectedMonth === "All Months" ? "All Months" : selectedMonth;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-[margin] duration-300 ease-in-out",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="min-h-screen dark:bg-slate-900 p-3 sm:p-5">
            <header className="mb-8">
              {/* Title and Filters Row */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-400">
                    Leads Activity
                  </h1>
                  <button 
                    onClick={download} 
                    className="text-gray-600 dark:text-gray-400 hover:text-[#ff8633] transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent text-sm w-full sm:w-auto"
                  >
                    {WEEKS.map(week => (
                      <option key={week} value={week}>{week}</option>
                    ))}
                  </select>

                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent text-sm w-full sm:w-auto"
                  >
                    {MONTHS.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats.userNumber} icon="👥" />
                <StatCard title="Total Leads" value={stats.leadsNumber} icon="📊" />
                <StatCard title={`${getMonthDisplayText()} Leads`} value={stats.monthlyCount} icon="🗓️" />
                <StatCard title={`${getWeekDisplayText()} Leads`} value={stats.weeklyCount} icon="📆" />
              </div>
            </header>

            <LeadsTable 
              leadsData={leadsData} 
              setSelectedLead={setSelectedLead} 
              setCurrentLead={setCurrentLead} 
              setViewPopupOpen={setViewPopupOpen} 
              setEditPopupOpen={setEditPopupOpen} 
              setDeletePopupOpen={setDeletePopupOpen} 
              setShowAddLeadForm={setShowAddLeadForm} 
            />

            {/* Modals and Popups */}
            {selectedLead && (
              <StatusHistoryPopup
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
              />
            )}

            {viewPopupOpen && (
              <ViewLeadPopup
                lead={currentLead}
                onClose={() => setViewPopupOpen(false)}
                onViewClick={(lead) => {
                  setCurrentLead(lead);
                  setViewPopupOpen(true);
                }}
                onEditClick={(lead) => {
                  setCurrentLead(lead);
                  setEditPopupOpen(true);
                }}
                onDeleteClick={(lead) => {
                  setCurrentLead(lead);
                  setDeletePopupOpen(true);
                }}
              />
            )}

            {deletePopupOpen && (
              <DeleteConfirmationPopup
                lead={currentLead}
                onClose={() => setDeletePopupOpen(false)}
                onConfirm={handleDeleteLead}
              />
            )}

            {editPopupOpen && (
              <EditLeadPopup
                lead={currentLead}
                onClose={() => setEditPopupOpen(false)}
                onSave={handleSaveLead}
              />
            )}

            <CombinedLeadForm 
              isOpen={showAddLeadForm} 
              onClose={() => setShowAddLeadForm(false)}
              collapsed={collapsed}
            />
          </div>
        </div>
      </Sidebar>
      <Footer/>
    </>
  );
};

// Rest of your components remain exactly the same...
// (LoadingSpinner, ErrorDisplay, StatCard, LeadsTable, ViewLeadPopup, EditLeadPopup, DeleteConfirmationPopup, LeadRow)

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400 dark:border-slate-300 mx-auto"></div>
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-400">Loading data...</p>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <h2 className="font-bold text-xl mb-2">Error</h2>
      <p>{error}</p>
      <p className="mt-2 text-sm">Please check the console for more details.</p>
    </div>
  </div>
);

// Stat Card Component - Made Responsive
const StatCard = React.memo(({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 min-w-0">
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

// Leads Table Component - Made Responsive
const LeadsTable = React.memo(({ leadsData, setSelectedLead, setCurrentLead, setViewPopupOpen, setEditPopupOpen, setShowAddLeadForm, setDeletePopupOpen }) => {
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 items-center mb-4 border-b pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-700 dark:text-gray-400">
          Leads ({leadsData.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button 
            onClick={download} 
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

// Table Header Component
const TableHeader = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

// View Lead Popup Component
const ViewLeadPopup = React.memo(({ lead, onClose, onViewClick, onEditClick, onDeleteClick }) => (
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
        <button onClick={() => onViewClick(lead)} className="p-2 text-blue-500 hover:text-blue-700 transition-colors" title="View">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>

        <button onClick={() => onEditClick(lead)} className="p-2 text-green-500 hover:text-green-700 transition-colors" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        <button onClick={() => onDeleteClick(lead)} className="p-2 text-red-500 hover:text-red-700 transition-colors" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
));

// Edit Lead Popup Component
const EditLeadPopup = ({ lead, onClose, onSave }) => {
  const [editedLead, setEditedLead] = useState(lead);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: value, id: lead.id }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedLead);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Edit Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name</label>
                  <input
                    type="text"
                    name="customerLastName"
                    value={editedLead.customerLastName || ''}
                    onChange={handleChange}
                    className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedLead.phoneNumber || ''}
                  onChange={handleChange}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedLead.jobTitle || ''}
                  onChange={handleChange}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Industry</label>
                <select
                  name="industry"
                  value={editedLead.industry || ''}
                  onChange={handleChange}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Status</label>
                <select
                  name="status"
                  value={editedLead.status || ''}
                  onChange={handleChange}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Expected Closing Date</label>
                <input
                  type="date"
                  name="closingDate"
                  value={editedLead.closingDate ? editedLead.closingDate.split('T')[0] : ''}
                  onChange={handleChange}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
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
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Notes</label>
                <textarea
                  name="notes"
                  value={editedLead.notes || ''}
                  onChange={handleChange}
                  className="dark:text-gray-400 dark:border-slate-700 dark:bg-slate-800 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent transition-all"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff8633] hover:bg-[#e57328] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Popup Component
const DeleteConfirmationPopup = React.memo(({ lead, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-400">Confirm Deletion</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mb-6 dark:text-gray-400">
        Are you sure you want to delete the lead for <strong>{lead.customerFirstName} {lead.customerLastName}</strong> from <strong>{lead.companyName || 'Unknown Company'}</strong>?
      </p>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-slate-400 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 dark:hover:bg-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(lead.id)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Delete Lead
        </button>
      </div>
    </div>
  </div>
));

// Lead Row Component
const LeadRow = React.memo(({ lead, formatDate, setSelectedLead, setCurrentLead, setViewPopupOpen, setEditPopupOpen, setDeletePopupOpen }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900 dark:text-gray-400 truncate max-w-xs">{lead.title}</div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-gray-400 font-medium">
        {lead.customerFirstName || "N/A"} {lead.customerLastName || ""}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{lead.emailAddress || "N/A"}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phoneNumber || "N/A"}</div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <button
        onClick={() => setSelectedLead(lead)}
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
          lead.status === "New"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
            : lead.status === "Contacted"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : lead.status === "Engaged"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : lead.status === "Qualified"
            ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
            : lead.status === "Proposal Sent"
            ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
            : lead.status === "Negotiation"
            ? "bg-pink-100 text-pink-800 hover:bg-pink-200"
            : lead.status === "Closed Won"
            ? "bg-teal-100 text-teal-800 hover:bg-teal-200"
            : lead.status === "Closed Lost"
            ? "bg-red-100 text-red-800 hover:bg-red-200"
            : lead.status === "On Hold"
            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
        }`}
      >
        {lead.status}
      </button>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex items-center justify-center space-x-2">
        {/* View Button */}
        <button 
          onClick={() => { setCurrentLead(lead); setViewPopupOpen(true); }} 
          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-all"
          title="View Lead"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Edit Button */}
        <button 
          onClick={() => { setCurrentLead(lead); setEditPopupOpen(true); }} 
          className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-all"
          title="Edit Lead"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        {/* Delete Button */}
        <button 
          onClick={() => { setCurrentLead(lead); setDeletePopupOpen(true); }} 
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
          title="Delete Lead"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
));

export default LeadsActivity;
