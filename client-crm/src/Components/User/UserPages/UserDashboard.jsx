import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserHeader } from "../common/UserHeader";
import { UserSidebar, useSidebarUser } from "../common/UserSidebar";
import { UserFooter } from "../common/UserFooter";
import { PersonalDetails } from "../common/PersonalDetails";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../../hooks/use-theme";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import CombinedAlertReminder from "../../CombinedForUser&Admin/CombinedAlertReminder";

const UserDashboard = ({ onLogout }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarUser();
  const { user } = PersonalDetails(onLogout);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showAddAlertReminderForm, setShowAddAlertReminderForm] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Get the logged-in user's ID

        if (!token || !userId) {
          throw new Error("Please login to view alerts");
        }

        const response = await axios.get(`${API_BASE_URL}/api/alert`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter alerts to show ONLY the current user's alerts
        const userAlerts = response.data.data
          .filter((alert) => alert.uid === userId) // Keep only alerts where uid matches userId
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first

        setAlerts(userAlerts);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load alerts", {
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
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Sample data
  const stats = [
    { title: "Total Projects", value: "24", change: "+12%", trend: "up" },
    { title: "Tasks Completed", value: "156", change: "+5%", trend: "up" },
    { title: "Pending Requests", value: "8", change: "-2%", trend: "down" },
    { title: "Team Members", value: "14", change: "+3%", trend: "up" },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Completed project "Website Redesign"',
      time: "2 hours ago",
      icon: "✅",
    },
    {
      id: 2,
      action: 'Received feedback on "Mobile App"',
      time: "5 hours ago",
      icon: "💬",
    },
    {
      id: 3,
      action: 'Started new project "Dashboard UI"',
      time: "1 day ago",
      icon: "🚀",
    },
    {
      id: 4,
      action: "Meeting with client at 3 PM",
      time: "2 days ago",
      icon: "📅",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      status: "Completed",
      progress: 100,
      dueDate: "May 15, 2023",
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "In Progress",
      progress: 75,
      dueDate: "Jun 20, 2023",
    },
    {
      id: 3,
      name: "Dashboard UI",
      status: "Not Started",
      progress: 0,
      dueDate: "Jul 10, 2023",
    },
    {
      id: 4,
      name: "API Integration",
      status: "In Progress",
      progress: 45,
      dueDate: "Jun 5, 2023",
    },
  ];

  return (
    <>
      <UserHeader onToggleSidebar={toggleSidebar} />
      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              <div className="flex flex-row justify-between rounded-lg py-4 p-5 mb-4 items-center bg-[#ff8633]">
                <div className="bg-[#ff8633] rounded-lg p-6 mb-6 text-white">
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user.name} !
                  </h1>
                  <p className="opacity-90">
                    Your Assigned Work:{" "}
                    {user.assignedWork || "Nothing is assigned to you."}.
                  </p>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white p-5 justify-center hover:bg-gray-100 text-[#ff8633] rounded-md transition-colors shadow-md">
                    Upload Data
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
                        transform="rotate(180 10 10)"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <div className="flex items-end mt-2">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-400 ">
                        {stat.value}
                      </span>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between">
                    <h2 className="text-lg dark:text-gray-400 font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-red-500" />
                      Alerts and Reminders
                    </h2>
                     <button onClick={() => setShowAddAlertReminderForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#ff8633] hover:bg-orange-500 text-white rounded-md transition-colors">
          Add Alerts and Reminder
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
                  </div>
                  <div className="p-6">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded shadow-sm flex items-center gap-4 overflow-x-auto"
                      >
                        <span className="font-medium text-gray-900 text-left dark:text-white min-w-[100px]">
                          {alert.topic}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          📅 {new Date(alert.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          ⏰ {alert.time}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          🔔 {alert.remainder}
                        </span>
                        {alert.description && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            📝 {alert.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
                    <button
                      onClick={() => navigate("/all-alerts-reminders")}
                      className="text-sm font-medium text-[#ff8633]"
                    >
                      View All Events →
                    </button>
                  </div>
                </div>

                <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-400">
                      Your Projects
                    </h2>
                    <Link
                      to="#"
                      className="px-4 py-2 bg-[#ff8633] text-white rounded-lg  text-sm"
                    >
                      + New Project
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-left">
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-[#ff8633] text-left font-medium"
                              >
                                {project.name}
                              </Link>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  project.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : project.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {project.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    project.progress === 100
                                      ? "bg-green-600"
                                      : "bg-blue-600"
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.dueDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
          <CombinedAlertReminder 
                      isOpen={showAddAlertReminderForm} 
                      onClose={() => setShowAddAlertReminderForm(false)}
                    />
      </UserSidebar>
      <UserFooter />
    </>
  );
};

export default UserDashboard;
