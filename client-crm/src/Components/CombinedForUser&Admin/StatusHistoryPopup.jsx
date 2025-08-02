import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const StatusItem = ({ completed, title, changedBy, description, date, note, isCurrent }) => (
  <li className="relative pl-6 pb-4 border-l-2 border-green-200 dark:border-green-600 last:border-l-0 last:pb-0">
    {completed && !isCurrent && (
      <div className="absolute w-5 h-5 bg-green-500 rounded-full -left-[10px] top-0 ring-2 ring-green-500 ring-opacity-30 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    )}
    
    {isCurrent && (
      <div className="absolute w-5 h-5 bg-white dark:bg-slate-800 border-2 border-[#ff8633] rounded-full -left-[7px] top-1"></div>
    )}
    
    {!completed && !isCurrent && (
      <div className="absolute w-3 h-3 bg-[#ff8633] rounded-full -left-[10px] top-0"></div>
    )}
    
    <div className="ml-2">
      <h4 className={`font-medium ${
        completed ? 'text-green-600 dark:text-green-400' : 
        isCurrent ? 'text-gray-600 dark:text-gray-300' : 
        'text-gray-800 dark:text-gray-200'
      }`}>
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {note && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-slate-700 flex flex-row justify-center gap-4 rounded text-sm">
          <p className="text-gray-600 dark:text-gray-300">{note}</p>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {date}
          </div>
        </div>
      )}
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        <span>Changed by: {changedBy}</span>
      </div>
    </div>
  </li>
);

const StatBlock = ({ value, label }) => (
  <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
    <div className="text-2xl font-bold text-[#ff8633]">{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

const StatusHistoryPopup = ({ lead, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch lead history
        const historyResponse = await axios.get(`${API_BASE_URL}/api/leads/history/${lead.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        // Process history to focus on status changes and notes
        const allVersions = [
          historyResponse.data.current,
          ...historyResponse.data.history
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Filter to show versions where status changed or note was added
        const statusChanges = [];
        let lastStatus = null;

        allVersions.forEach(version => {
          const statusChanged = version.status !== lastStatus;
          
          if (statusChanged) {
            statusChanges.push({
              ...version,
              statusChanged,
            });
            lastStatus = version.status;
          }
        });

        setHistory(statusChanges.reverse()); // Reverse to show oldest first
      } catch (err) {
        setError(err.message || 'Failed to fetch history');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lead.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff8633]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full">
          <div className="text-red-500 dark:text-red-400">{error}</div>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[#ff8633] text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalStatusChanges = history.filter(item => item.statusChanged).length;
  const createdAt = new Date(history[0]?.createdAt || new Date());
  const now = new Date();
  const daysInPipeline = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  const currentStatusDuration = history.length > 0 
    ? Math.floor((now - new Date(history[history.length - 1].createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#ff8633]">Status History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 dark:text-gray-400">
          <h3 className="text-lg font-semibold">{lead.customerFirstName} {lead.customerLastName}</h3>
          <p className="text-gray-600 dark:text-gray-400">{lead.companyName || "No company specified"}</p>
          <p className="text-sm mt-1">
            Current Status: <span className="font-medium">{lead.status}</span>
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 dark:text-gray-400 mb-4">Status Timeline</h4>
          {history.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No status changes recorded</p>
          ) : (
            <ul className="space-y-4">
              {history.map((version, index) => {
                const date = new Date(version.createdAt);
                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                const changedBy = version.username || 'Unknown';
                const isCurrent = index === history.length - 1;
                const isFirst = index === 0;

                let description;
                if (isFirst) {
                  description = "Lead created";
                } else if (version.statusChanged) {
                  description = `Changed from ${history[index - 1].status} to ${version.status}`;
                }

                return (
                  <StatusItem
                    key={`${version.id}-${version.createdAt}`}
                    completed={version.statusChanged}
                    title={version.status}
                    changedBy={changedBy}
                    description={description}
                    date={formattedDate}
                    note={version.notes}
                    isCurrent={isCurrent}
                  />
                );
              })}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <StatBlock value={totalStatusChanges} label="Status Changes" />
          <StatBlock value={daysInPipeline} label="Days in Pipeline" />
          <StatBlock value={Math.floor(currentStatusDuration)} label="Days in Current Status" />
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryPopup;