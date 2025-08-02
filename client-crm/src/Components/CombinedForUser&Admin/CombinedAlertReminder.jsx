
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


const CombinedAlertReminder = ({collapsed,isOpen, onClose}) => {
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
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div 
        ref={panelRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold dark:text-gray-300">Add New Alerts and Reminder</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AlertsandReminderForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </>
  );
};


export default CombinedAlertReminder;

