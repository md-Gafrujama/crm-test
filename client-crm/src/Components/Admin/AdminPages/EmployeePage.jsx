import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditEmployee from '../Forms/EditEmployee';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; 
import { Header } from '../common/Header';
import { Sidebar,useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import { useTheme } from '../../../hooks/use-theme';
import Footer from '../common/Footer';
import AddEmployeeForm from '../Forms/AddEmployeeForm';

const EmployeePage = ({collapsed}) => {
  const navigate = useNavigate();
  const [employees, setemployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  
  useEffect(() => {
   const fetchemployees = async () => {
    
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to view employees');
    }
   
    // i have kept /allUser for now after the api created add /allEmployee 
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
    // if (err.message.includes('Session expired')) {
    // }
  } finally {
    setLoading(false);
  }
};
    fetchemployees();
  }, []);




  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };


    const handleUserUpdated = (updatedUser) => {
    setemployees(employees.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    handleCloseModal();
  };

  const handleUserDeleted = (userId) => {
    setemployees(employees.filter(user => user.id !== userId));
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
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-400">Employee Management</h1>
        <div className='flex flex-col lg:flex-row md:flex-row gap-2'>
        <button
           onClick={() => setShowAddEmployeeForm(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#ff8633] text-white rounded-lg transition-colors hover:bg-[#e57328]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Add New Employee
        </button>
        </div>
      </div>



      {employees.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">No employees found.</p>
        </div>
      ) : (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {employees.employees && employees.employees.map((employee) => (
      <div
        key={employee.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <img
            src={employee.photo || 'https://randomuser.me/api/portraits/men/1.jpg'}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-full h-full object-cover opacity-90 hover:opacity-80 transition-opacity duration-300"
            onError={(e) => {
              e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl font-bold text-white">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-blue-200">@{employee.username}</p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="p-5 space-y-3">
          {/* Role & Status Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full capitalize">
              {employee.role}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              employee.status === 'active'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {employee.status || 'Active'}
            </span>
            {employee.department && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded-full">
                {employee.department}
              </span>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a href={`mailto:${employee.email}`} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                {employee.email}
              </a>
            </div>

            <div className="flex items-start">
              <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <a href={`tel:${employee.phoneNumber}`} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                {employee.phoneNumber}
              </a>
            </div>

            {employee.whatsAppPhone && (
              <div className="flex items-start">
                <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">WhatsApp: {employee.whatsAppPhone}</span>
              </div>
            )}

            <div className="flex items-start">
              <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Joined: {new Date(employee.joiningDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <button onClick={() => handleEditUser(employee.id)} className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      )}

            {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
      <AddEmployeeForm
              isOpen={showAddEmployeeForm} 
              onClose={() => setShowAddEmployeeForm(false)}
            />
    </div>
    </div>
    </Sidebar>
    <Footer/>
    </>
  );
};

export default EmployeePage;




