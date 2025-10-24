import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/api";
import { Bar } from "react-chartjs-2";

const SiteTraffic = ({ allUsers, selectedUser, setSelectedUser }) => {
  const [avgTimePages, setAvgTimePages] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // Helper to fetch averages with optional userId
  const fetchAvgTimePerPage = async (token, userId) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/analytics/page-time/averages`);
      if (userId) url.searchParams.set("userId", userId);
      const avgRes = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (avgRes?.data?.data) {
        setAvgTimePages(Array.isArray(avgRes.data.data) ? avgRes.data.data : []);
      }
    } catch (e) {
      console.warn("Site Traffic API:", e?.response?.data?.message || e.message);
      setAvgTimePages([]);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAvgTimePerPage(token, selectedUser?.id);
  }, []);

  // Refetch when selectedUser changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAvgTimePerPage(token, selectedUser?.id);
  }, [selectedUser]);

  // Site Traffic - Average time per page chart data (seconds)
  const avgTimeBarData = {
    labels: avgTimePages.map((d) => d.page.replace(/^\//, "") || "Home"),
    datasets: [
      {
        label: "Avg Time (seconds)",
        data: avgTimePages.map((d) =>
          Number((d.averageMs / 1000).toFixed(1))
        ),
        backgroundColor: "#0EA5E9",
        borderColor: "#0284C7",
        borderWidth: 0,
        borderRadius: 0,
        maxBarThickness: 60,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return `${context.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { size: 12, weight: "500" },
          color: "#6B7280",
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.8)",
          drawBorder: false,
          lineWidth: 1,
        },
        border: { display: true, color: "#D1D5DB", width: 1 },
        ticks: {
          font: { size: 11, weight: "400" },
          color: "#6B7280",
          padding: 10,
          stepSize: 1,
        },
      },
    },
    elements: { bar: { borderRadius: 4, borderSkipped: false } },
    animation: { duration: 800, easing: "easeOutQuart" },
  };

  return (
    <div className="">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Site Traffic - Average Time Spent Per Page
          </h3>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          User engagement metrics showing average time spent on each page
        </p>
      </div>

      {/* User search and selection */}
      <div className="max-w-3xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search user by name, email, or username"
            className="w-full pl-4 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
          />
          {/* Suggestions */}
          {userSearch.trim() && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-56 overflow-auto text-left">
              {allUsers
                .filter((u) => {
                  const q = userSearch.toLowerCase().trim();
                  return [
                    u.firstName,
                    u.lastName,
                    u.email,
                    u.username,
                  ]
                    .filter(Boolean)
                    .some((v) => v.toString().toLowerCase().includes(q));
                })
                .slice(0, 10)
                .map((u) => (
                  <button
                    key={u.id}
                    className="w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    onClick={() => {
                      setSelectedUser({
                        id: u.id,
                        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || u.email,
                      });
                      setUserSearch("");
                    }}
                  >
                    {(u.firstName || u.lastName) ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.username || u.email)}
                  </button>
                ))}
              {allUsers.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">No users</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Selected:</span>{" "}
            {selectedUser?.name ? selectedUser.name : "All users"}
          </div>
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {avgTimePages.length > 0 ? (
        <div style={{ height: "450px" }} className="relative">
          <Bar data={avgTimeBarData} options={barChartOptions} />
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          No data to display for the current selection.
        </div>
      )}
    </div>
  );
};

export default SiteTraffic;
