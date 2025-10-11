import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../../common/Header';
import { Sidebar, useSidebar } from '../../common/sidebar';
import { cn } from "../../../../utils/cn";
import { useTheme } from "../../../../hooks/use-theme";
import Footer from "../../common/Footer";
import StatusHistoryPopup from "../../../CombinedForUser&Admin/StatusHistoryPopup";
import CombinedLeadForm from "../../../CombinedForUser&Admin/CombinedLeadForm";

// Import separated components
import ViewLead from './components/ViewLead';
import EditLead from './components/EditLead';
import DeleteLead from './components/DeleteLead';
import LeadsTable from './components/LeadsTable';
import { LoadingSpinner, ErrorDisplay, StatCard } from './components/UtilityComponents';

// Import API services (only for data fetching, not for edit/delete)
import { 
  fetchRecentLeads, 
  fetchWeeklyLeads, 
  fetchMonthlyLeads
} from './services/leadsApi';

// Week and Month filter options with "All" options
const WEEKS = ["All Weeks", "Week 1", "Week 2", "Week 3", "Week 4"];
const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


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
    // This function is called after successful API call from EditLead component
    setEditPopupOpen(false);
    await fetchData();
    await fetchWeeklyMonthlyData();
    
    toast.success("Lead updated successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: theme === 'dark' ? 'dark' : 'light',
    });
  };

  const handleDeleteLead = async (leadId) => {
    // This function is called after successful API call from DeleteLead component
    setDeletePopupOpen(false);
    await fetchData();
    await fetchWeeklyMonthlyData();
    
    toast.success("Lead deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: theme === 'dark' ? 'dark' : 'light',
    });
  };

  // Fetch weekly and monthly leads data with updated filtering logic
  const fetchWeeklyMonthlyData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [weeklyData, monthlyData] = await Promise.all([
        fetchWeeklyLeads(),
        fetchMonthlyLeads()
      ]);

      setWeeklyLeads(weeklyData);
      setMonthlyLeads(monthlyData);

      // Calculate counts based on current filters
      let monthlyCount = 0;
      let weeklyCount = 0;

      if (selectedMonth === "All Months") {
        // Show all monthly leads
        monthlyCount = monthlyData.length;
      } else {
        const currentMonthIndex = MONTHS.indexOf(selectedMonth) - 1; // -1 because "All Months" is at index 0
        monthlyCount = monthlyData.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          return leadDate.getMonth() === currentMonthIndex;
        }).length;
      }

      if (selectedWeek === "All Weeks") {
        if (selectedMonth === "All Months") {
          // Show all weekly leads
          weeklyCount = weeklyData.length;
        } else {
          // Show all weeks for the selected month
          const currentMonthIndex = MONTHS.indexOf(selectedMonth) - 1;
          weeklyCount = weeklyData.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate.getMonth() === currentMonthIndex;
          }).length;
        }
      } else {
        const currentWeekNumber = parseInt(selectedWeek.split(' ')[1]);
        if (selectedMonth === "All Months") {
          // Show specific week across all months
          weeklyCount = weeklyData.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            const weekOfMonth = Math.ceil(leadDate.getDate() / 7);
            return weekOfMonth === currentWeekNumber;
          }).length;
        } else {
          // Show specific week for specific month
          const currentMonthIndex = MONTHS.indexOf(selectedMonth) - 1;
          weeklyCount = weeklyData.filter(lead => {
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
          theme: theme === 'dark' ? 'dark' : 'light',
          style: { fontSize: '1.2rem' }, 
        });
        navigate('/login');
        return;
      }

      const recentData = await fetchRecentLeads();

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
      const errorMessage = err.message.includes('401') || err.message.includes('Session expired')
        ? "Session expired please login again"
        : err.message || "Failed to fetch data";

      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: theme === 'dark' ? 'dark' : 'light',
        style: { fontSize: '1.2rem' }, 
      });
      
      if (errorMessage.includes('Session expired') || errorMessage.includes('401')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, theme]); 

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
              <ViewLead
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
              <DeleteLead
                lead={currentLead}
                onClose={() => setDeletePopupOpen(false)}
                onConfirm={handleDeleteLead}
              />
            )}

            {editPopupOpen && (
              <EditLead
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



export default LeadsActivity;
