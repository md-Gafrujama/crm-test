// import React, { useState, useEffect } from 'react';
// import Footer from '../common/Footer';
// import { Header } from '../common/Header';
// import { Sidebar, useSidebar } from '../common/sidebar';
// import { cn } from '../../../utils/cn';
// import { Package, ShoppingCart, Activity, TrendingUp } from 'lucide-react';
// import { User, Users, MessageSquare, Users2 } from 'lucide-react';

// // Chart.js imports
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// // CRITICAL: Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );
// const additionalStats = [
//   {
//     id: 5,
//     title: "Total User",
//     value: "3,450",
//     icon: <User className="h-6 w-6" />,
//     change: "+7.5%",
//     trend: "up",
//     color: "from-indigo-500 to-indigo-600",
//     lightColor: "bg-indigo-50",
//     textColor: "text-indigo-600",
//     subtitle: "This year"
//   },
//   {
//     id: 6,
//     title: "Active User",
//     value: "1,892",
//     icon: <Users className="h-6 w-6" />,
//     change: "+3.2%",
//     trend: "up",
//     color: "from-green-400 to-green-500",
//     lightColor: "bg-green-50",
//     textColor: "text-green-600",
//     subtitle: "Last month"
//   },
//   {
//     id: 7,
//     title: "Conversation Rate",
//     value: "62.4%",
//     icon: <MessageSquare className="h-6 w-6" />,
//     change: "+1.1%",
//     trend: "up",
//     color: "from-pink-500 to-pink-600",
//     lightColor: "bg-pink-50",
//     textColor: "text-pink-600",
//     subtitle: "Last 7 days"
//   },
//   {
//     id: 8,
//     title: "Total Employee",
//     value: "230",
//     icon: <Users2 className="h-6 w-6" />,
//     change: "+4.8%",
//     trend: "up",
//     color: "from-yellow-500 to-yellow-600",
//     lightColor: "bg-yellow-50",
//     textColor: "text-yellow-600",
//     subtitle: "This quarter"
//   }
// ];

// const AdminAnalytics = ({ collapsed }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

//   const [stats] = useState([
//     {
//       id: 1,
//       title: "Total Leads",
//       value: "1,248",
//       icon: <Package className="h-6 w-6" />,
//       change: "+5.2%",
//       trend: "up",
//       color: "from-blue-500 to-blue-600",
//       lightColor: "bg-blue-50",
//       textColor: "text-blue-600",
//       subtitle: "This month"
//     },
//     {
//       id: 2,
//       title: "Qualified Leads",
//       value: "342",
//       icon: <ShoppingCart className="h-6 w-6" />,
//       change: "+12.3%",
//       trend: "up",
//       color: "from-emerald-500 to-emerald-600",
//       lightColor: "bg-emerald-50",
//       textColor: "text-emerald-600",
//       subtitle: "Active pipeline"
//     },
//     {
//       id: 3,
//       title: "Conversion Rate",
//       value: "24.8%",
//       icon: <Activity className="h-6 w-6" />,
//       change: "+0.5%",
//       trend: "up",
//       color: "from-purple-500 to-purple-600",
//       lightColor: "bg-purple-50",
//       textColor: "text-purple-600",
//       subtitle: "Last 30 days"
//     },
//     {
//       id: 4,
//       title: "Revenue",
//       value: "$45.2k",
//       icon: <TrendingUp className="h-6 w-6" />,
//       change: "+8.1%",
//       trend: "up",
//       color: "from-orange-500 to-orange-600",
//       lightColor: "bg-orange-50",
//       textColor: "text-orange-600",
//       subtitle: "This quarter"
//     },
//   ]);

//   const additionalChartData = {
//   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//   datasets: [
//     {
//       label: 'Total User',
//       data: [3300, 3400, 3450, 3500],
//       borderColor: '#6366F1',
//       backgroundColor: 'rgba(99,102,241,0.2)',
//       tension: 0.4,
//       fill: false,
//     },
//     {
//       label: 'Active User',
//       data: [1800, 1850, 1900, 1892],
//       borderColor: '#22C55E',
//       backgroundColor: 'rgba(34,197,94,0.2)',
//       tension: 0.4,
//       fill: false,
//     },
//     {
//       label: 'Conversation Rate (%)',
//       data: [60, 61, 62, 62.4],
//       borderColor: '#EC4899',
//       backgroundColor: 'rgba(236,72,153,0.2)',
//       tension: 0.4,
//       fill: false,
//     },
//     {
//       label: 'Total Employee',
//       data: [210, 220, 225, 230],
//       borderColor: '#EAB308',
//       backgroundColor: 'rgba(234,179,8,0.2)',
//       tension: 0.4,
//       fill: false,
//     }
//   ],
// };

// const additionalChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//   },
//   scales: {
//     x: { display: true },
//     y: { display: true, beginAtZero: true },
//   },
// };

//   // Chart data
//   const chartData = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [
//       {
//         label: 'Total Leads',
//         data: [1200, 1225, 1240, 1248],
//         borderColor: '#3b82f6',
//         backgroundColor: 'rgba(59,130,246,0.1)',
//         tension: 0.4,
//         borderWidth: 2,
//       },
//       {
//         label: 'Qualified Leads',
//         data: [300, 320, 335, 342],
//         borderColor: '#10b981',
//         backgroundColor: 'rgba(16,185,129,0.1)',
//         tension: 0.4,
//         borderWidth: 2,
//       },
//       {
//         label: 'Conversion Rate (%)',
//         data: [20, 22, 23.5, 24.8],
//         borderColor: '#8b5cf6',
//         backgroundColor: 'rgba(139,92,246,0.1)',
//         tension: 0.4,
//         borderWidth: 2,
//       },
//       {
//         label: 'Revenue ($K)',
//         data: [40, 42, 44, 45.2],
//         borderColor: '#f97316',
//         backgroundColor: 'rgba(249,115,22,0.1)',
//         tension: 0.4,
//         borderWidth: 2,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         display: true,
//       },
//       y: {
//         display: true,
//         beginAtZero: true,
//       },
//     },
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     const timer = setTimeout(() => setIsLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header onToggleSidebar={toggleSidebar} />
//       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
//         <div className={cn(
//           "transition-all duration-300 ease-in-out min-h-screen bg-slate-100 dark:bg-slate-900",
//           collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
//         )}>
//           <div className="space-y-6 p-6">
//             {/* Enhanced Stats Grid - ALL YOUR ORIGINAL CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//               {stats.map((stat) => (
//                 <div
//                   key={stat.id}
//                   className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
//                 >
//                   {/* Background Gradient Overlay */}
//                   <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
//                   {/* Main Content */}
//                   <div className="relative p-6">
//                     {/* Header with Icon and Change */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className={`${stat.lightColor} p-3 rounded-xl`}>
//                         <div className={`${stat.textColor}`}>
//                           {stat.icon}
//                         </div>
//                       </div>
                      
//                       <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
//                         stat.trend === "up"
//                           ? "bg-emerald-50 text-emerald-700"
//                           : "bg-red-50 text-red-700"
//                       }`}>
//                         <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
//                         {stat.change}
//                       </div>
//                     </div>

//                     {/* Stats Value */}
//                     <div className="space-y-2 mb-4">
//                       <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
//                       <div className="space-y-1">
//                         <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
//                       </div>
//                     </div>

//                     {/* Bottom Section */}
//                     <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
//                       <div className={`w-2 h-2 rounded-full ${
//                         stat.trend === "up" ? "bg-emerald-500" : "bg-red-500"
//                       }`}></div>
//                       <div className={`text-xs font-medium ${
//                         stat.trend === "up"
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}>{stat.change}</div>
//                     </div>
//                   </div>

//                   {/* Animated Progress Bar */}
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
//                     <div className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Chart Section */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
//               <div className="mb-6">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                   Analytics Trends
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Performance metrics over the last 4 weeks
//                 </p>
//               </div>
//               <div style={{ height: '400px' }}>
//                 <Line data={chartData} options={chartOptions} />
//               </div>
//             </div>

// {/* Four new cards */}
// <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//   {additionalStats.map(stat => (
//     <div
//       key={stat.id}
//       className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
//     >
//       {/* Background Gradient Overlay */}
//       <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
//       <div className="relative p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className={`${stat.lightColor} p-3 rounded-xl`}>
//             <div className={`${stat.textColor}`}>{stat.icon}</div>
//           </div>
//           <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
//             stat.trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
//           }`}>
//             <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
//             {stat.change}
//           </div>
//         </div>
//         <div className="space-y-2 mb-4">
//           <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
//           <div className="space-y-1">
//             <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.title}</p>
//             <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
//           </div>
//         </div>
//         <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
//           <div className={`w-2 h-2 rounded-full ${
//             stat.trend === "up" ? "bg-emerald-500" : "bg-red-500"
//           }`}></div>
//           <div className={`text-xs font-medium ${
//             stat.trend === "up" ? "text-emerald-600" : "text-red-600"
//           }`}>{stat.change}</div>
//         </div>
//       </div>
//       <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700`}>
//         <div className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
//       </div>
//     </div>
//   ))}
// </div>

// {/* New graph for these cards */}
// <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
//   <div className="mb-6">
//     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//       User & Employee Trends
//     </h3>
//     <p className="text-sm text-gray-500 dark:text-gray-400">
//       Four key metrics over the last 4 weeks
//     </p>
//   </div>
//   <div style={{ height: "400px" }}>
//     <Line data={additionalChartData} options={additionalChartOptions} />
//   </div>
// </div>
//           </div>
//         </div>
//       </Sidebar>
//       <Footer />
//     </>
//   );
// };

// export default AdminAnalytics;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import Footer from '../common/Footer';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import { cn } from '../../../utils/cn';
import {
  Package,
  ShoppingCart,
  Activity,
  TrendingUp,
  User,
  Users,
  MessageSquare,
  Users2,
  RefreshCw,
  Calendar,
  WifiOff,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || '';

const ranges = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

// Reusable Card
const StatCard = ({ stat, loading }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5">
      <div className={`pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', stat.lightColor)}>
            <div className={stat.textColor}>{stat.icon}</div>
          </div>
          <div
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold',
              stat.trend === 'up'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
            )}
          >
            <TrendingUp className={cn('h-3 w-3', stat.trend === 'down' && 'rotate-180')} />
            {loading ? '—' : stat.change}
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {loading ? <div className="h-8 w-28 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse" /> : stat.value}
          </h3>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{stat.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{stat.subtitle}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className={cn('w-2 h-2 rounded-full', stat.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500')} />
          <div className={cn('text-xs font-medium', stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600')}>
            {loading ? '—' : stat.change}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-700">
        <div
          className={cn(
            'h-full bg-gradient-to-r',
            stat.color,
            'transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700'
          )}
        />
      </div>
    </div>
  );
};

const AdminAnalytics = ({ collapsed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('');
  const [range, setRange] = useState(30);

  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  // Summary state
  const [summary, setSummary] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    revenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    conversationRate: 0,
    totalEmployees: 0,
    deltas: {
      totalLeads: '+0%',
      qualifiedLeads: '+0%',
      conversionRate: '+0%',
      revenue: '+0%',
      totalUsers: '+0%',
      activeUsers: '+0%',
      conversationRate: '+0%',
      totalEmployees: '+0%',
    },
  });

  // Timeseries state
  const [series, setSeries] = useState({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    totalLeads: [],
    qualifiedLeads: [],
    conversionRate: [],
    revenue: [],
    totalUsers: [],
    activeUsers: [],
    conversationRateSeries: [],
    totalEmployees: [],
  });

  // Chart refs for zoom/pan controls
  const mainLineRef = useRef(null);
  const secondLineRef = useRef(null);

  const fetchLocked = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/security/locked`, { withCredentials: true });
      setIsLocked(Boolean(res.data?.locked));
    } catch {
      // If locked check fails, keep unlocked by default
      setIsLocked(false);
    }
  };

  const fetchSummary = async (currentRange) => {
    const res = await axios.get(`${API_BASE_URL}/api/analytics/summary`, {
      params: { range: currentRange },
      withCredentials: true,
    });
    // Map your API fields here if different
    const s = res.data || {};
    setSummary({
      totalLeads: s.totalLeads ?? 0,
      qualifiedLeads: s.qualifiedLeads ?? 0,
      conversionRate: s.conversionRate ?? 0,
      revenue: s.revenue ?? 0,
      totalUsers: s.totalUsers ?? 0,
      activeUsers: s.activeUsers ?? 0,
      conversationRate: s.conversationRate ?? 0,
      totalEmployees: s.totalEmployees ?? 0,
      deltas: s.deltas ?? {
        totalLeads: '+0%',
        qualifiedLeads: '+0%',
        conversionRate: '+0%',
        revenue: '+0%',
        totalUsers: '+0%',
        activeUsers: '+0%',
        conversationRate: '+0%',
        totalEmployees: '+0%',
      },
    });
  };

  const fetchSeries = async (currentRange) => {
    const res = await axios.get(`${API_BASE_URL}/api/analytics/timeseries`, {
      params: { range: currentRange },
      withCredentials: true,
    });
    const d = res.data || {};
    setSeries({
      labels: d.labels ?? ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      totalLeads: d.totalLeads ?? [],
      qualifiedLeads: d.qualifiedLeads ?? [],
      conversionRate: d.conversionRate ?? [],
      revenue: d.revenue ?? [],
      totalUsers: d.totalUsers ?? [],
      activeUsers: d.activeUsers ?? [],
      conversationRateSeries: d.conversationRate ?? [],
      totalEmployees: d.totalEmployees ?? [],
    });
  };

  const loadAll = async (currentRange = range) => {
    setIsLoading(true);
    setError('');
    try {
      await fetchLocked();
      await Promise.all([fetchSummary(currentRange), fetchSeries(currentRange)]);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  // Stat cards config from summary
  const stats = useMemo(() => {
    const trend = (v) => (String(v).startsWith('-') ? 'down' : 'up');
    return [
      {
        id: 1,
        title: 'Total Leads',
        value: summary.totalLeads?.toLocaleString(),
        icon: <Package className="h-6 w-6" />,
        change: summary.deltas.totalLeads,
        trend: trend(summary.deltas.totalLeads),
        color: 'from-blue-500 to-blue-600',
        lightColor: 'bg-blue-50 dark:bg-blue-500/10',
        textColor: 'text-blue-600 dark:text-blue-400',
        subtitle: `Last ${range} days`,
      },
      {
        id: 2,
        title: 'Qualified Leads',
        value: summary.qualifiedLeads?.toLocaleString(),
        icon: <ShoppingCart className="h-6 w-6" />,
        change: summary.deltas.qualifiedLeads,
        trend: trend(summary.deltas.qualifiedLeads),
        color: 'from-emerald-500 to-emerald-600',
        lightColor: 'bg-emerald-50 dark:bg-emerald-500/10',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        subtitle: 'Active pipeline',
      },
      {
        id: 3,
        title: 'Conversion Rate',
        value: `${Number(summary.conversionRate || 0).toFixed(1)}%`,
        icon: <Activity className="h-6 w-6" />,
        change: summary.deltas.conversionRate,
        trend: trend(summary.deltas.conversionRate),
        color: 'from-purple-500 to-purple-600',
        lightColor: 'bg-purple-50 dark:bg-purple-500/10',
        textColor: 'text-purple-600 dark:text-purple-400',
        subtitle: `Last ${range} days`,
      },
      {
        id: 4,
        title: 'Revenue',
        value: `$${Number(summary.revenue || 0).toLocaleString()}`,
        icon: <TrendingUp className="h-6 w-6" />,
        change: summary.deltas.revenue,
        trend: trend(summary.deltas.revenue),
        color: 'from-orange-500 to-orange-600',
        lightColor: 'bg-orange-50 dark:bg-orange-500/10',
        textColor: 'text-orange-600 dark:text-orange-400',
        subtitle: 'This period',
      },
    ];
  }, [summary, range]);

  const additionalStats = useMemo(() => {
    const trend = (v) => (String(v).startsWith('-') ? 'down' : 'up');
    return [
      {
        id: 5,
        title: 'Total User',
        value: summary.totalUsers?.toLocaleString(),
        icon: <User className="h-6 w-6" />,
        change: summary.deltas.totalUsers,
        trend: trend(summary.deltas.totalUsers),
        color: 'from-indigo-500 to-indigo-600',
        lightColor: 'bg-indigo-50 dark:bg-indigo-500/10',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        subtitle: 'This year',
      },
      {
        id: 6,
        title: 'Active User',
        value: summary.activeUsers?.toLocaleString(),
        icon: <Users className="h-6 w-6" />,
        change: summary.deltas.activeUsers,
        trend: trend(summary.deltas.activeUsers),
        color: 'from-green-400 to-green-500',
        lightColor: 'bg-green-50 dark:bg-green-500/10',
        textColor: 'text-green-600 dark:text-green-400',
        subtitle: 'Last month',
      },
      {
        id: 7,
        title: 'Conversation Rate',
        value: `${Number(summary.conversationRate || 0).toFixed(1)}%`,
        icon: <MessageSquare className="h-6 w-6" />,
        change: summary.deltas.conversationRate,
        trend: trend(summary.deltas.conversationRate),
        color: 'from-pink-500 to-pink-600',
        lightColor: 'bg-pink-50 dark:bg-pink-500/10',
        textColor: 'text-pink-600 dark:text-pink-400',
        subtitle: 'Last 7 days',
      },
      {
        id: 8,
        title: 'Total Employee',
        value: summary.totalEmployees?.toLocaleString(),
        icon: <Users2 className="h-6 w-6" />,
        change: summary.deltas.totalEmployees,
        trend: trend(summary.deltas.totalEmployees),
        color: 'from-yellow-500 to-yellow-600',
        lightColor: 'bg-yellow-50 dark:bg-yellow-500/10',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        subtitle: 'This quarter',
      },
    ];
  }, [summary]);

  // Helpers: gradient fill factory
  const makeGradient = (ctx, chartArea, colorTop, colorBottom) => {
    const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, colorTop);
    g.addColorStop(1, colorBottom);
    return g;
  };

  // Main trends line chart data
  const chartData = useMemo(() => {
    return {
      labels: series.labels,
      datasets: [
        {
          label: 'Total Leads',
          data: series.totalLeads,
          borderColor: '#3b82f6',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(59,130,246,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(59,130,246,0.25)', 'rgba(59,130,246,0.05)');
          },
          tension: 0.5,
          borderWidth: 2.5,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Qualified Leads',
          data: series.qualifiedLeads,
          borderColor: '#10b981',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(16,185,129,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(16,185,129,0.25)', 'rgba(16,185,129,0.05)');
          },
          tension: 0.5,
          borderWidth: 2.5,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Conversion Rate (%)',
          data: series.conversionRate,
          borderColor: '#8b5cf6',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(139,92,246,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(139,92,246,0.25)', 'rgba(139,92,246,0.05)');
          },
          tension: 0.55,
          borderWidth: 2.5,
          fill: true,
          yAxisID: 'y2',
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Revenue',
          data: series.revenue,
          borderColor: '#f97316',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(249,115,22,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(249,115,22,0.25)', 'rgba(249,115,22,0.05)');
          },
          tension: 0.45,
          borderWidth: 2.5,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [series]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#64748b', usePointStyle: true, boxWidth: 8 },
          onClick: (e, legendItem, legend) => {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderColor: 'rgba(148,163,184,0.2)',
          borderWidth: 1,
          padding: 10,
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          callbacks: {
            label: (ctx) => {
              const { dataset, raw } = ctx;
              if (dataset.label.includes('Conversion')) return `${dataset.label}: ${raw}%`;
              if (dataset.label.includes('Revenue')) return `${dataset.label}: $${raw}`;
              return `${dataset.label}: ${raw}`;
            },
          },
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
          },
          limits: { x: { minRange: 3 } },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(148,163,184,0.15)' },
          ticks: { color: '#94a3b8' },
        },
        y: {
          grid: { color: 'rgba(148,163,184,0.12)' },
          ticks: { color: '#94a3b8' },
        },
        y2: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#a78bfa' },
        },
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
      },
    }),
    []
  );

  // Additional trends + pie
  const additionalChartData = useMemo(() => {
    return {
      labels: series.labels,
      datasets: [
        {
          label: 'Total User',
          data: series.totalUsers,
          borderColor: '#6366F1',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(99,102,241,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(99,102,241,0.25)', 'rgba(99,102,241,0.05)');
          },
          tension: 0.5,
          fill: true,
          pointRadius: 2.5,
          borderWidth: 2.2,
        },
        {
          label: 'Active User',
          data: series.activeUsers,
          borderColor: '#22C55E',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(34,197,94,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(34,197,94,0.25)', 'rgba(34,197,94,0.05)');
          },
          tension: 0.48,
          fill: true,
          pointRadius: 2.5,
          borderWidth: 2.2,
        },
        {
          label: 'Conversation Rate (%)',
          data: series.conversationRateSeries,
          borderColor: '#EC4899',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(236,72,153,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(236,72,153,0.25)', 'rgba(236,72,153,0.05)');
          },
          tension: 0.55,
          fill: true,
          pointRadius: 2.5,
          borderWidth: 2.2,
          yAxisID: 'y2',
        },
        {
          label: 'Total Employee',
          data: series.totalEmployees,
          borderColor: '#EAB308',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(234,179,8,0.15)';
            return makeGradient(ctx, chartArea, 'rgba(234,179,8,0.25)', 'rgba(234,179,8,0.05)');
          },
          tension: 0.46,
          fill: true,
          pointRadius: 2.5,
          borderWidth: 2.2,
        },
      ],
    };
  }, [series]);

  const additionalChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 8 },
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderColor: 'rgba(148,163,184,0.2)',
          borderWidth: 1,
          padding: 10,
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
          limits: { x: { minRange: 3 } },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(148,163,184,0.15)' },
          ticks: { color: '#94a3b8' },
        },
        y: {
          grid: { color: 'rgba(148,163,184,0.12)' },
          ticks: { color: '#94a3b8' },
          beginAtZero: false,
        },
        y2: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#f472b6' },
        },
      },
      animation: {
        duration: 900,
        easing: 'easeOutCubic',
      },
    }),
    []
  );

  // Pie data uses current summary
  const pieData = useMemo(() => {
    const qualified = Number(summary.qualifiedLeads || 0);
    const converted = Math.round(Number(summary.totalLeads || 0) * Number(summary.conversionRate || 0) / 100);
    const unqualified = Math.max(Number(summary.totalLeads || 0) - qualified, 0);

    return {
      labels: ['Qualified Leads', 'Converted Leads', 'Unqualified Leads'],
      datasets: [
        {
          data: [qualified, converted, unqualified],
          backgroundColor: [
            'rgba(16,185,129,0.85)',
            'rgba(139,92,246,0.85)',
            'rgba(59,130,246,0.85)',
          ],
          borderColor: [
            'rgba(16,185,129,1)',
            'rgba(139,92,246,1)',
            'rgba(59,130,246,1)',
          ],
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  }, [summary]);

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 10 },
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderColor: 'rgba(148,163,184,0.2)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          padding: 10,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}`,
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 800,
        easing: 'easeOutQuart',
      },
    }),
    []
  );

  const handleResetZoom = () => {
    if (mainLineRef.current) mainLineRef.current.resetZoom();
    if (secondLineRef.current) secondLineRef.current.resetZoom();
  };

  if (isLocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Analytics Locked</h2>
        <p className="text-slate-600 dark:text-slate-400">Access is restricted. Please contact admin.</p>
      </div>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out min-h-screen bg-slate-50 dark:bg-slate-900',
            collapsed ? 'md:ml-[70px]' : 'md:ml-[0px]'
          )}
        >
          <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Live metrics and trends</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 backdrop-blur px-1">
                  {ranges.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRange(r.value)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg transition',
                        range === r.value
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-700/40'
                      )}
                    >
                      <Calendar className="inline-block h-4 w-4 mr-1" />
                      {r.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => loadAll(range)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff8633] to-[#ff5d33] text-white shadow hover:shadow-lg transition active:scale-[0.98]"
                >
                  <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                  Refresh
                </button>
                <button
                  onClick={handleResetZoom}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition"
                >
                  <ZoomOut className="h-4 w-4" />
                  Reset Zoom
                </button>
              </div>
            </div>

            {/* Error/empty states */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/70 dark:bg-red-950/40 text-red-700 dark:text-red-300">
                <WifiOff className="h-5 w-5" />
                <div>
                  <p className="font-medium">Failed to load</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            )}

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat) => (
                <StatCard key={stat.id} stat={stat} loading={isLoading} />
              ))}
            </div>

            {/* Charts Row: Line + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
              <div className="xl:col-span-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Analytics Trends</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Performance over last {range} days</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <ZoomIn className="h-4 w-4" />
                    Scroll or pinch to zoom • Drag to pan
                  </div>
                </div>
                <div className="h-[360px] p-4">
                  <Line
                    ref={(chart) => {
                      // expose resetZoom
                      if (chart) mainLineRef.current = chart;
                    }}
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Lead Distribution</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Qualified vs Converted vs Unqualified</p>
                </div>
                <div className="h-[360px] p-4">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {additionalStats.map((stat) => (
                <StatCard key={stat.id} stat={stat} loading={isLoading} />
              ))}
            </div>

            {/* Additional Trends */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">User & Employee Trends</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Four key metrics over last {range} days</p>
                </div>
                <button
                  onClick={handleResetZoom}
                  className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition"
                >
                  Reset Zoom
                </button>
              </div>
              <div className="h-[380px] p-4">
                <Line
                  ref={(chart) => {
                    if (chart) secondLineRef.current = chart;
                  }}
                  data={additionalChartData}
                  options={additionalChartOptions}
                />
              </div>
            </div>

            {/* Loading overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-[60]">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ff8633]" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">Refreshing data…</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
      <Footer />
    </>
  );
};

export default AdminAnalytics;
