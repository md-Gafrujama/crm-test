
// import 'react-toastify/dist/ReactToastify.css';
// import { Header } from '../Admin/common/Header';
// import { Sidebar,useSidebar } from '../Admin/common/sidebar';
// import AlertsandReminderForm from '../Admin/Forms/AlertsandReminderForm';
// import { UserHeader } from '../User/common/UserHeader';
// import { UserSidebar ,useSidebarUser} from '../User/common/UserSidebar';
// import { UserFooter } from '../User/common/UserFooter';
// import Footer from '../Admin/common/Footer';


// const CombinedAlertReminder = ({collapsed}) => {
// const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
// const { isSidebarOpenUser, toggleSidebarUser, closeSidebarUser } = useSidebarUser();
//   return (
//     <>
// {localStorage.getItem('userType') === 'admin' && (
// <>
//  <Header onToggleSidebar={toggleSidebar} />
//   <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} >
//    <AlertsandReminderForm />
//   </Sidebar>
//   <Footer/>
//   </>
// )}
  
// {localStorage.getItem('userType') === 'user' && (
//   <>
//     <UserHeader onToggleSidebar={toggleSidebarUser} />
//   <UserSidebar isOpen={isSidebarOpenUser} onClose={closeSidebarUser} >
//    <AlertsandReminderForm />
//    </UserSidebar>
//    <UserFooter/>
//   </>
// )}
//    </>
//   );
// };


// export default CombinedAlertReminder;
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef } from 'react';
import AlertsandReminderForm from '../Admin/Forms/AlertsandReminderForm';
import { useTheme } from '../../hooks/use-theme';
import { X, Bell, Calendar, Plus } from 'lucide-react';

const CombinedAlertReminder = ({collapsed, isOpen, onClose}) => {
  const panelRef = useRef(null);
  const { theme, setTheme } = useTheme();
  
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Panel - Reduced Width */}
      <div 
        ref={panelRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Simplified Clean Header */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Alert
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <AlertsandReminderForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CombinedAlertReminder;
