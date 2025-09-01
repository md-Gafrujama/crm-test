// import React, { useState } from "react";
// import { TrendingUp, Target, Award, Clock, AlertCircle } from "lucide-react";
// import { Header } from "../common/Header";
// import { Sidebar, useSidebar } from "../common/sidebar";
// import { cn } from "../../../utils/cn";
// import Footer from "../common/Footer";

// const Dashboard = ({ collapsed }) => {
//   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

//   // Static data for the four cards
//   const stats = [
//     {
//       id: 'totalLeads',
//       title: "Total Leads",
//       value: "152",
//       change: "+12%",
//       trend: "up",
//       icon: Target,
//       color: "from-blue-500 to-blue-600",
//       lightColor: "bg-blue-50 dark:bg-blue-900/20",
//       textColor: "text-blue-600 dark:text-blue-400",
//       subtitle: "This month"
//     },
//     {
//       id: 'qualifiedLeads',
//       title: "Qualified Leads",
//       value: "89",
//       change: "+8%",
//       trend: "up",
//       icon: Award,
//       color: "from-emerald-500 to-emerald-600",
//       lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
//       textColor: "text-emerald-600 dark:text-emerald-400",
//       subtitle: "Active pipeline"
//     },
//     {
//       id: 'pendingLeads',
//       title: "Pending Leads",
//       value: "48",
//       change: "+15%",
//       trend: "up",
//       icon: Clock,
//       color: "from-amber-500 to-amber-600",
//       lightColor: "bg-amber-50 dark:bg-amber-900/20",
//       textColor: "text-amber-600 dark:text-amber-400",
//       subtitle: "Awaiting follow-up"
//     },
//     {
//       id: 'lossLeads',
//       title: "Lost Leads",
//       value: "22",
//       change: "-3%",
//       trend: "down",
//       icon: AlertCircle,
//       color: "from-red-500 to-red-600",
//       lightColor: "bg-red-50 dark:bg-red-900/20",
//       textColor: "text-red-600 dark:text-red-400",
//       subtitle: "Lost opportunities"
//     }
//   ];

//   return (
//     <>
//       <Header onToggleSidebar={toggleSidebar} />
//       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
//         <div className={cn("", collapsed ? "md:ml-[70px]" : "md:ml-[0px]")}>
//           <main className="p-6 space-y-8">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   Dashboard Overview
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   Monitor your business performance and key metrics
//                 </p>
//               </div>
//             </div>

//             {/* Four Stats Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {stats.map((stat, index) => (
//                 <div
//                   key={stat.id}
//                   className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   {/* Animated background gradient */}
//                   <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-all duration-300`} />
                  
//                   <div className="relative p-6">
//                     {/* Header */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className={`p-3 rounded-xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
//                         <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
//                       </div>
                      
//                       <div className={cn(
//                         "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105",
//                         stat.trend === "up" 
//                           ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
//                           : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//                       )}>
//                         <TrendingUp className={cn("h-3 w-3", stat.trend === "down" && "rotate-180")} />
//                         {stat.change}
//                       </div>
//                     </div>

//                     {/* Value and Title */}
//                     <div className="space-y-3">
//                       <div className="space-y-1">
//                         <div className="text-2xl font-bold text-gray-900 dark:text-white">
//                           {stat.value}
//                         </div>
//                         <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                           {stat.title}
//                         </div>
//                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                           {stat.subtitle}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Progress indicator */}
//                     <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-xl">
//                       <div className={cn(
//                         "h-full bg-gradient-to-r rounded-b-xl transition-all duration-500 transform origin-left",
//                         stat.color,
//                         "scale-x-0 group-hover:scale-x-100"
//                       )} />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </main>
//         </div>
//       </Sidebar>
//       <Footer />
//     </>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Mail, 
  Phone, 
  Building, 
  User, 
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyTypeFilter, setCompanyTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [actionReason, setActionReason] = useState('');

  // Mock data - Replace with actual API calls
  const mockData = [
    {
      id: 'REQ001',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe_tech',
      email: 'john.doe@techcorp.com',
      phone: '+1234567890',
      companyName: 'TechCorp Solutions',
      companyType: 'technology',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      submittedAt: '2025-09-01T10:30:00Z',
      status: 'pending'
    },
    {
      id: 'REQ002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      username: 'sarah_marketing',
      email: 'sarah.j@brandboost.com',
      phone: '+1987654321',
      companyName: 'BrandBoost Marketing',
      companyType: 'marketing',
      profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      submittedAt: '2025-09-01T09:15:00Z',
      status: 'pending'
    },
    {
      id: 'REQ003',
      firstName: 'Mike',
      lastName: 'Chen',
      username: 'mike_sales',
      email: 'mike.chen@salesforce.com',
      phone: '+1555123456',
      companyName: 'Global Sales Inc',
      companyType: 'sales',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      submittedAt: '2025-08-31T16:45:00Z',
      status: 'approved'
    }
  ];

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [pendingRequests, searchTerm, statusFilter, companyTypeFilter]);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // const response = await axios.get(`${API_BASE_URL}/api/admin/pending-registrations`);
      // setPendingRequests(response.data.requests);
      
      // Using mock data for demo
      setTimeout(() => {
        setPendingRequests(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = pendingRequests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Company type filter
    if (companyTypeFilter !== 'all') {
      filtered = filtered.filter(request => request.companyType === companyTypeFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleApproveReject = async (requestId, action, reason = '') => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // const response = await axios.post(`${API_BASE_URL}/api/admin/approve-registration`, {
      //   requestId,
      //   action,
      //   reason
      // });

      // Mock API response
      console.log(`${action} request ${requestId} with reason: ${reason}`);
      
      // Update local state
      setPendingRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
            : request
        )
      );

      setShowModal(false);
      setSelectedRequest(null);
      setActionReason('');
      
      const message = action === 'approve' 
        ? 'Registration approved successfully!' 
        : 'Registration rejected successfully!';
      
      // You would typically show a toast notification here
      alert(message);
      
    } catch (error) {
      console.error(`Error ${action}ing registration:`, error);
      alert(`Error ${action}ing registration`);
    } finally {
      setIsLoading(false);
    }
  };

  const openActionModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const companyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'technology', label: 'Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'consulting', label: 'Consulting' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage company registration requests</p>
            </div>
            <button
              onClick={fetchPendingRequests}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-[#ff8633] text-white px-4 py-2 rounded-md hover:bg-[#e47b17] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingRequests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={companyTypeFilter}
              onChange={(e) => setCompanyTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
            >
              {companyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Registration Requests ({filteredRequests.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-[#ff8633]" />
              <span className="ml-2 text-gray-600">Loading requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No registration requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recruiter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={request.profilePhoto}
                            alt={`${request.firstName} ${request.lastName}`}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.firstName} {request.lastName}
                            </div>
                            <div className="text-sm text-gray-500">@{request.username}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.companyName}</div>
                        <div className="text-sm text-gray-500 capitalize">{request.companyType}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {request.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-1" />
                          {request.phone}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(request.submittedAt)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                              setActionType('view');
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openActionModal(request, 'approve')}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => openActionModal(request, 'reject')}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionType === 'view' ? 'Registration Details' :
                   actionType === 'approve' ? 'Approve Registration' : 'Reject Registration'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setActionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Request Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={selectedRequest.profilePhoto}
                    alt={`${selectedRequest.firstName} ${selectedRequest.lastName}`}
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedRequest.firstName} {selectedRequest.lastName}
                    </h4>
                    <p className="text-gray-600">@{selectedRequest.username}</p>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.companyName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRequest.companyType}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Request ID</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRequest.id}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.submittedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                {actionType !== 'view' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {actionType === 'approve' ? 'Approval Note (Optional)' : 'Rejection Reason'}
                      </label>
                      <textarea
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        placeholder={
                          actionType === 'approve' 
                            ? 'Add any notes for the approval...' 
                            : 'Please provide a reason for rejection...'
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                        rows={3}
                        required={actionType === 'reject'}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setActionReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                {actionType === 'approve' && (
                  <button
                    onClick={() => handleApproveReject(selectedRequest.id, 'approve', actionReason)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Approving...' : 'Approve Registration'}
                  </button>
                )}
                
                {actionType === 'reject' && (
                  <button
                    onClick={() => handleApproveReject(selectedRequest.id, 'reject', actionReason)}
                    disabled={isLoading || !actionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Rejecting...' : 'Reject Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

