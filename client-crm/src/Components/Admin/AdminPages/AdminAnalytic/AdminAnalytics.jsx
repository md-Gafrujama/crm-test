import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../common/Footer";
import { Header } from "../../common/Header";
import { Sidebar, useSidebar } from "../../common/sidebar";
import { cn } from "../../../../utils/cn";
import { API_BASE_URL } from "../../../../config/api";

import GoogleAnalyticsDashboard from "../../../Analytics/GoogleAnalyticsDashboard";
import { getCompanyIdFromToken } from "../../../../utils/auth";
import LeadAnalytics from "./LeadAnalytics";
import UserAnalytics from "./UserAnalytics";
import SiteTraffic from "./SiteTraffic";



const AdminAnalytics = ({ collapsed }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  // State for leads data
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    pendingLeads: 0,
    lossLeads: 0,
  });

  // State for users data
  const [usersData, setUsersData] = useState({
    totalUser: 0,
    activeUser: 0,
    totalEmployee: 0,
    conversionRateFromActive: 0,
    conversionRateFromTotal: 0,
  });



  // Users for per-user site traffic filtering
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // { id, name }
  // Recent page-time events (to show device type and IP)
  const [recentEvents, setRecentEvents] = useState([]);

  // Map userId -> display name for quick lookup in events table
  const userNameById = useMemo(() => {
    const map = new Map();
    (allUsers || []).forEach((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const display = fullName || u.username || u.email || u.id;
      if (u.id) map.set(u.id, display);
    });
    return map;
  }, [allUsers]);

  // Fetch both APIs data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to view analytics");

        // Fetch users analytics
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/analytics/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch leads analytics
        const leadsResponse = await axios.get(
          `${API_BASE_URL}/api/analytics/leads`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.data) {
          setUsersData({
            totalUser: userResponse.data.totalUser || 0,
            activeUser: userResponse.data.activeUser || 0,
            totalEmployee: userResponse.data.totalEmployee || 0,
            conversionRateFromActive: userResponse.data.conversionRateFromActive || 0,
            conversionRateFromTotal: userResponse.data.conversionRateFromTotal || 0,
          });
        }

        if (leadsResponse.data) {
          setLeadsData({
            totalLeads: leadsResponse.data.totalLeads || 0,
            qualifiedLeads: leadsResponse.data.qualifiedLeads || 0,
            pendingLeads: leadsResponse.data.pendingLeads || 0,
            lossLeads: leadsResponse.data.lossLeads || 0,
          });
        }

        // Fetch recent events (device & IP)
        await fetchRecentEvents(token, selectedUser?.id);

        // Fetch all users for search dropdown (admin-only API)
        try {
          const usersRes = await axios.get(`${API_BASE_URL}/api/allUser`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = Array.isArray(usersRes.data)
            ? usersRes.data
            : usersRes.data?.users || [];
          setAllUsers(list);
        } catch (e) {
          console.warn("Users list API:", e?.response?.data?.message || e.message);
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast.error(
          error.response?.data?.message || error.message || "Failed to load analytics data",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800); // Smooth loading transition
      }
    };

    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // Helper to fetch recent events with optional userId
  const fetchRecentEvents = async (token, userId) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/analytics/page-time/events`);
      url.searchParams.set("limit", "10");
      if (userId) url.searchParams.set("userId", userId);
      const res = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setRecentEvents(list);
    } catch (e) {
      console.warn("Site Events API:", e?.response?.data?.message || e.message);
      setRecentEvents([]);
    }
  };

// Refetch events when selected user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchRecentEvents(token, selectedUser?.id);
  }, [selectedUser]);



  // Enhanced Loading Component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div
              className="h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full absolute top-0 left-0"
              style={{ animation: "spin 1s linear reverse infinite" }}
            ></div>
            <div className="absolute top-2 left-2 animate-spin h-12 w-12 border-4 border-white rounded-full"></div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Loading Analytics
            </h3>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn("")}>
          <div className="space-y-8 p-6">
            {/* Analytics Header */}
            <div className="text-center space-y-3 mb-8">
            

              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Comprehensive insights into your leads performance and user
                engagement metrics
              </p>
            </div>

            {/* Lead Distribution */}
            <div className="">
              <LeadAnalytics leadsData={leadsData} />
            </div>

            {/* User Analytics */}
            <div className="">
              <UserAnalytics usersData={usersData} />
            </div>

            {/* Site Traffic */}
            <div className="">
              <SiteTraffic allUsers={allUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </div>

            {/* RECENT EVENTS - shows device type and IP */}
            <div className="mt-10">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                    Recent Page Events (Device & IP)
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Latest 100 events for {selectedUser?.name ? selectedUser.name : "all users"}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/60">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">User ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Page</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Duration (s)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Device</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                    {recentEvents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No recent events.</td>
                      </tr>
                    )}
                    {recentEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{new Date(ev.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(ev.userId && userNameById.get(ev.userId)) || "-"}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{ev.page}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{(ev.durationMs / 1000).toFixed(1)}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200 capitalize">{ev.deviceType || "desktop"}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{ev.ip || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Google Analytics Integration */}
            <div className="mt-10">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Google Analytics Integration
                  </h3>
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Real-time website analytics and user behavior insights
                </p>
              </div>
              <GoogleAnalyticsDashboard companyId={getCompanyIdFromToken()} />
            </div>

          </div>
        </div>
      </Sidebar>
      <Footer />

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default AdminAnalytics;
