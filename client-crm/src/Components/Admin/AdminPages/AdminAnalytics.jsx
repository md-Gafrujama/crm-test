import React, { useState, useEffect } from 'react';
import Footer from '../common/Footer';
import { Header } from '../common/Header';
import { Sidebar,useSidebar } from '../common/sidebar';
import { cn } from '../../../utils/cn';
import { 
  Users, UserPlus, UserCheck, UserMinus,
  Briefcase, TrendingUp, PieChart, BarChart2, 
  ArrowUp, ArrowDown, Circle, Calendar, DollarSign
} from 'lucide-react';

const AdminAnalytics = ({collapsed}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  // Sample analytics data
  const [analyticsData, setAnalyticsData] = useState({
    users: {
      total: 1245,
      active: 987,
      new: {
        current: 142,
        previous: 98,
        change: '+44.9%'
      },
      churn: {
        current: 28,
        previous: 35,
        change: '-20%'
      }
    },
    revenue: {
      total: '$245,789',
      current: '$56,420',
      previous: '$48,750',
      change: '+15.7%',
      topPerformer: 'John D.'
    },
    conversions: {
      leads: 356,
      rate: '31.2%',
      improvement: '+5.4%'
    },
    activities: [
      { id: 1, metric: 'Page Views', value: '24,532', change: '+12.4%', trend: 'up' },
      { id: 2, metric: 'Avg. Session', value: '4m 23s', change: '-2.1%', trend: 'down' },
      { id: 3, metric: 'Bounce Rate', value: '34.5%', change: '-8.2%', trend: 'down' },
      { id: 4, metric: 'New Signups', value: '1,243', change: '+18.7%', trend: 'up' }
    ],
    trends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      users: [450, 620, 780, 910, 1050, 1245],
      revenue: [32000, 45000, 58000, 72000, 89000, 112000]
    }
  });

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
      </div>
    );
  }

  return (
    <>
     <Header onToggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
            <div className={cn(
              "transition-all duration-300 ease-in-out min-h-screen bg-slate-100 dark:bg-slate-900",
              collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
            )}>
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-400">Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-[#00BFA6] text-white' : 'bg-gray-200 dark:text-gray-400 dark:bg-gray-700'}`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-[#ff8633] text-white' : 'bg-gray-200 dark:text-gray-400 dark:bg-gray-700'}`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'quarter' ? 'bg-[#ff8633] text-white' : 'bg-gray-200 dark:text-gray-400 dark:bg-gray-700'}`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-[#ff8633] text-white' : 'bg-gray-200 dark:text-gray-400 dark:bg-gray-700'}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-400">User Analytics</h3>
            <Users className="text-[#ff8633]" />
          </div>
          <div className="space-y-4 dark:text-gray-400">
            <div className="flex justify-between items-center dark:text-gray-400">
              <span>Total Users</span>
              <span className="font-bold text-xl">{analyticsData.users.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Users</span>
              <span className="font-bold text-green-500">{analyticsData.users.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>New Users</span>
              <div className="flex items-center">
                <span className="font-bold mr-2">{analyticsData.users.new.current}</span>
                <span className={`text-xs flex items-center ${analyticsData.users.new.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {analyticsData.users.new.change}
                  {analyticsData.users.new.change.startsWith('+') ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Churn Rate</span>
              <div className="flex items-center">
                <span className="font-bold mr-2">{analyticsData.users.churn.current}</span>
                <span className={`text-xs flex items-center ${analyticsData.users.churn.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                  {analyticsData.users.churn.change}
                  {analyticsData.users.churn.change.startsWith('+') ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-400">Revenue</h3>
            <DollarSign className="text-green-500" />
          </div>
          <div className="space-y-4 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Total Revenue</span>
              <span className="font-bold text-xl">{analyticsData.revenue.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Period</span>
              <span className="font-bold">{analyticsData.revenue.current}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Previous Period</span>
              <span className="">{analyticsData.revenue.previous}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Growth</span>
              <div className="flex items-center">
                <span className={`font-bold ${analyticsData.revenue.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {analyticsData.revenue.change}
                </span>
                {analyticsData.revenue.change.startsWith('+') ? <ArrowUp className="h-4 w-4 ml-1 text-green-500" /> : <ArrowDown className="h-4 w-4 ml-1 text-red-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-400">Conversions</h3>
            <TrendingUp className="text-purple-500" />
          </div>
          <div className="space-y-4 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Total Leads</span>
              <span className="font-bold text-xl">{analyticsData.conversions.leads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Conversion Rate</span>
              <span className="font-bold text-green-500">{analyticsData.conversions.rate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Improvement</span>
              <div className="flex items-center">
                <span className="font-bold text-green-500">{analyticsData.conversions.improvement}</span>
                <ArrowUp className="h-4 w-4 ml-1 text-green-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Top Performer</span>
              <span className="font-bold text-[#ff8633]">{analyticsData.revenue.topPerformer}</span>
            </div>
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-400">Activity Metrics</h3>
            <Calendar className="text-yellow-500" />
          </div>
          <div className="space-y-4 dark:text-gray-400">
            {analyticsData.activities.map(activity => (
              <div key={activity.id} className="flex justify-between items-center">
                <span>{activity.metric}</span>
                <div className="flex items-center">
                  <span className="font-bold mr-2">{activity.value}</span>
                  <span className={`text-xs flex items-center ${activity.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {activity.change}
                    {activity.trend === 'up' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-400">User Growth</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setChartType('bar')}
                className={`p-2 rounded ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <BarChart2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setChartType('pie')}
                className={`p-2 rounded ${chartType === 'pie' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <PieChart className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            {chartType === 'bar' ? (
              <div className="w-full h-full flex items-end space-x-2">
                {analyticsData.trends.users.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-[#ff8633] rounded-t hover:bg-blue-600 transition-all"
                      style={{ height: `${(value / Math.max(...analyticsData.trends.users)) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-500">{analyticsData.trends.labels[index]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-8 border-[#ff8633]"></div>
                <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analyticsData.users.total}</div>
                    <div className="text-xs text-gray-500">Total Users</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-gray-400">Revenue Trend</h3>
            <div className="text-sm text-gray-500">
              {timeRange === 'week' ? 'Last 7 days' : 
               timeRange === 'month' ? 'Last 30 days' : 
               timeRange === 'quarter' ? 'Last 90 days' : 'Last 12 months'}
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full">
              <div className="relative h-full">
                {/* Line chart simulation */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M0,100 L10,80 L20,85 L30,70 L40,60 L50,40 L60,30 L70,45 L80,20 L90,10 L100,0" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="2"
                  />
                  <path 
                    d="M0,100 L10,80 L20,85 L30,70 L40,60 L50,40 L60,30 L70,45 L80,20 L90,10 L100,0" 
                    fill="rgba(59, 130, 246, 0.1)" 
                  />
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x, i) => (
                    <circle 
                      key={i} 
                      cx={x} 
                      cy={i % 2 === 0 ? 100 - i * 9 : 100 - i * 8.5} 
                      r="2" 
                      fill="#3B82F6" 
                    />
                  ))}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                  {analyticsData.trends.labels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-gray-400">Detailed Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Previous</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y dark:text-gray-400 divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Active Users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.users.active}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.users.active - 120}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">+120</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">New Users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.users.new.current}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.users.new.previous}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">{analyticsData.users.new.change}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Revenue</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.revenue.current}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.revenue.previous}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">{analyticsData.revenue.change}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Churn Rate</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.users.churn.current}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{analyticsData.users.churn.previous}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">{analyticsData.users.churn.change}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowDown className="h-5 w-5 text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </Sidebar>
    <Footer/>
    </>
  );
};

export default AdminAnalytics;