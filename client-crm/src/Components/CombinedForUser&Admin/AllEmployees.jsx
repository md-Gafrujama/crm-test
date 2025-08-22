import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditEmployee from '../Admin/Forms/EditEmployee';
import axios from 'axios';
import { Header } from '../Admin/common/Header';
import { Sidebar, useSidebar } from '../Admin/common/sidebar';
import { cn } from "../../utils/cn";
import Footer from '../Admin/common/Footer';
import AddEmployeeForm from '../Admin/Forms/AddEmployeeForm';
import { API_BASE_URL } from "../../config/api";
import { Search, Users, UserCheck, Building, Activity, UserX, Filter, ArrowLeft } from 'lucide-react';

const AllEmployees = ({collapsed}) => {
  const navigate = useNavigate();
  const [employees, setemployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  useEffect(() => {
    const fetchemployees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view employees');
        }
       
        const response = await axios.get(`${API_BASE_URL}/api/employee`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }

        setemployees(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchemployees();
  }, []);

  // Filter employees by search term and department
  const filteredEmployees = employees.employees ? employees.employees.filter(employee => {
    const matchesSearch = ['firstName', 'lastName', 'email', 'username', 'department'].some(field =>
      employee[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDepartment = departmentFilter === 'All' || employee.department?.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesDepartment;
  }) : [];

  // Calculate counts
  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(emp => emp.status !== 'inactive').length;
  const inactiveEmployees = filteredEmployees.filter(emp => emp.status === 'inactive').length;
  const totalDepartments = ['Sales', 'Marketing', 'SaaS', 'Technology'].length;

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };

  const handleUserUpdated = (updatedUser) => {
    setemployees(prev => ({
      ...prev,
      employees: prev.employees.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    }));
    handleCloseModal();
  };

  const handleUserDeleted = (userId) => {
    setemployees(prev => ({
      ...prev,
      employees: prev.employees.filter(user => user.id !== userId)
    }));
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8633]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        <div className={cn(
          "transition-[margin] duration-300 ease-in-out",
          collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
        )}>
          <div className="container mx-auto px-4 py-6">

            {/* Header Section with Back Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 max-w-7xl mx-auto gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                  All Employees ({totalEmployees})
                </h1>
              </div>
              
              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                
                {/* Department Filter */}
                <div className="relative w-full sm:w-44">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8633] focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none bg-white cursor-pointer"
                  >
                    <option value="All">All Departments</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Technology">Technology</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Add Employee Button */}
                <button
                  onClick={() => setShowAddEmployeeForm(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ff8633] text-white rounded-lg transition-all duration-200 hover:bg-[#e57328] hover:shadow-md whitespace-nowrap text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 616 6H2a6 6 0 616-6z" />
                  </svg>
                  Add Employee
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Employees */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
                  </div>
                </div>
              </div>
              
              {/* Active Employees */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeEmployees}</p>
                  </div>
                </div>
              </div>

              {/* Inactive Employees */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{inactiveEmployees}</p>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalDepartments}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Cards Grid - Show ALL employees (no slice limit) */}
            {filteredEmployees.length === 0 ? (
              <div className="max-w-7xl mx-auto text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  {searchTerm || departmentFilter !== 'All' ? 'No employees match your criteria.' : 'No employees found.'}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Try adjusting your search or filter options.
                </p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    {/* Same employee card structure as your original */}
                    <div className="relative pt-6 pb-4">
                      <div className="flex justify-center mb-3">
                        <img
                          src={employee.photo || 'https://randomuser.me/api/portraits/men/1.jpg'}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-sm"
                          onError={(e) => {
                            e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="text-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{employee.username}</p>
                      </div>

                      <div className="flex justify-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'inactive'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {employee.status === 'inactive' ? 'Inactive' : 'Active'}
                        </span>
                        {employee.department && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium rounded-full">
                            {employee.department}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleEditUser(employee.id)}
                          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                          aria-label="Edit employee"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="px-4 pb-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="truncate">{employee.email}</span>
                      </div>

                      {employee.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          <span>{employee.phoneNumber}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <EditEmployee 
                isOpen={isEditModalOpen}
                userId={selectedUserId}
                onClose={handleCloseModal}
                onUpdate={handleUserUpdated}
                onDelete={handleUserDeleted}
              />
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        <AddEmployeeForm
          isOpen={showAddEmployeeForm} 
          onClose={() => setShowAddEmployeeForm(false)}
        />
      </Sidebar>
      <Footer/>
    </>
  );
};

export default AllEmployees;