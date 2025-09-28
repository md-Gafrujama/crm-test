// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, X } from 'lucide-react';
// import { useTheme } from '../../../hooks/use-theme';
// import axios from 'axios';
// import { API_BASE_URL } from '../../../config/api';
// import { Header } from '../common/Header';
// import { Sidebar, useSidebar } from '../common/sidebar';
// import Footer from '../common/Footer';

// const Calendar = () => {
//   const { theme } = useTheme();
//   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const handleSidebarCollapsedChange = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//   };
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [authStatus, setAuthStatus] = useState(null);
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [eventForm, setEventForm] = useState({
//     summary: '',
//     description: '',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//     location: ''
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
//   const [tempDate, setTempDate] = useState(new Date());

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

//   // Check authentication status
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Fetch events when date changes
//   useEffect(() => {
//     if (authStatus?.authenticated) {
//       fetchEvents();
//     }
//   }, [currentDate, authStatus]);

//   const checkAuthStatus = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/calendar/status`);
//       setAuthStatus(response.data);
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//       // Set a default state if API is not available
//       setAuthStatus({ authenticated: false, error: true });
//     }
//   };

//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/calendar/events`);
//       if (response.data.success) {
//         setEvents(response.data.events || []);
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAuthenticate = () => {
//     window.location.href = `${API_BASE_URL}/api/calendar/auth`;
//   };

//   const handleEventFormChange = (field, value) => {
//     setEventForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const resetEventForm = () => {
//     setEventForm({
//       summary: '',
//       description: '',
//       startDate: '',
//       startTime: '',
//       endDate: '',
//       endTime: '',
//       location: ''
//     });
//   };

//   const openEventForm = (date = null) => {
//     if (date) {
//       const dateStr = date.toISOString().split('T')[0];
//       setEventForm(prev => ({
//         ...prev,
//         startDate: dateStr,
//         endDate: dateStr
//       }));
//     }
//     setShowEventForm(true);
//   };

//   const closeEventForm = () => {
//     setShowEventForm(false);
//     resetEventForm();
//   };

//   const createEvent = async (eventData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/calendar/addEvent`, eventData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating event:', error);
//       throw error;
//     }
//   };

//   const handleSubmitEvent = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       // Validate required fields
//       if (!eventForm.summary || !eventForm.startDate || !eventForm.startTime) {
//         alert('Please fill in all required fields (Title, Start Date, Start Time)');
//         return;
//       }

//       // Prepare event data to match the backend API format
//       // Add timezone offset to create proper ISO string
//       const startDateTime = `${eventForm.startDate}T${eventForm.startTime}:00.000Z`;
      
//       let endDateTime;
//       if (eventForm.endDate && eventForm.endTime) {
//         endDateTime = `${eventForm.endDate}T${eventForm.endTime}:00.000Z`;
//       } else {
//         // Default to 1 hour after start time if no end time specified
//         const startDate = new Date(`${eventForm.startDate}T${eventForm.startTime}:00.000Z`);
//         const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
//         endDateTime = endDate.toISOString();
//       }

//       const eventData = {
//         summary: eventForm.summary,
//         description: eventForm.description || '',
//         startDateTime: startDateTime,
//         endDateTime: endDateTime,
//         timeZone: 'UTC'
//       };

//       console.log('Sending event data:', eventData);

//       const result = await createEvent(eventData);
//       console.log('API Response:', result);
      
//       if (result.success) {
//         alert('Event created successfully!');
//         closeEventForm();
//         fetchEvents(); // Refresh events list
//       } else {
//         console.error('Event creation failed:', result);
//         alert(`Failed to create event: ${result.message || 'Unknown error'}`);
//       }
//     } catch (error) {
//       console.error('Error submitting event:', error);
      
//       // Better error handling
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
        
//         const errorMessage = error.response.data.error || error.response.data.message || 'Server error';
        
//         // Check if it's an authentication error
//         if (error.response.status === 401 || errorMessage.includes('Not authenticated')) {
//           const shouldReauth = confirm(
//             'You need to re-authenticate with Google Calendar to create events. ' +
//             'This will redirect you to Google for permission to manage your calendar. ' +
//             'Click OK to continue or Cancel to close this dialog.'
//           );
          
//           if (shouldReauth) {
//             window.location.href = `${API_BASE_URL}/api/calendar/auth`;
//             return;
//           }
//         } else {
//           alert(`Error creating event: ${errorMessage}`);
//         }
//       } else if (error.request) {
//         console.error('Request error:', error.request);
//         alert('Error creating event: No response from server');
//       } else {
//         console.error('Error:', error.message);
//         alert(`Error creating event: ${error.message}`);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getDaysInMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   const navigateMonth = (direction) => {
//     const newDate = new Date(currentDate);
//     newDate.setMonth(currentDate.getMonth() + direction);
//     setCurrentDate(newDate);
//   };

//   const handleMonthYearChange = (month, year) => {
//     const newDate = new Date(year, month, 1);
//     setCurrentDate(newDate);
//     setShowMonthYearPicker(false);
//   };

//   const openMonthYearPicker = () => {
//     setTempDate(new Date(currentDate));
//     setShowMonthYearPicker(true);
//   };

//   const getCurrentYear = () => new Date().getFullYear();
//   const getYearRange = () => {
//     const currentYear = getCurrentYear();
//     const years = [];
//     for (let i = currentYear - 10; i <= currentYear + 10; i++) {
//       years.push(i);
//     }
//     return years;
//   };

//   const isToday = (day) => {
//     const today = new Date();
//     return (
//       day === today.getDate() &&
//       currentDate.getMonth() === today.getMonth() &&
//       currentDate.getFullYear() === today.getFullYear()
//     );
//   };

//   const isSelected = (day) => {
//     return (
//       day === selectedDate.getDate() &&
//       currentDate.getMonth() === selectedDate.getMonth() &&
//       currentDate.getFullYear() === selectedDate.getFullYear()
//     );
//   };

//   const hasEvents = (day) => {
//     const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     return events.some(event => {
//       const eventDate = event.start?.date || event.start?.dateTime?.split('T')[0];
//       return eventDate === dateStr;
//     });
//   };

//   const getEventsForDate = (day) => {
//     const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     return events.filter(event => {
//       const eventDate = event.start?.date || event.start?.dateTime?.split('T')[0];
//       return eventDate === dateStr;
//     });
//   };

//   const formatTime = (dateTimeStr) => {
//     if (!dateTimeStr) return '';
//     const date = new Date(dateTimeStr);
//     return date.toLocaleTimeString('en-US', { 
//       hour: 'numeric', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const renderCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentDate);
//     const firstDay = getFirstDayOfMonth(currentDate);
//     const days = [];

//     // Empty cells for days before the first day of the month
//     // Adjust for Monday start (0 = Monday, 6 = Sunday)
//     const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
//     // Add previous month's trailing days
//     const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
//     const prevMonthDays = prevMonth.getDate();
    
//     for (let i = adjustedFirstDay - 1; i >= 0; i--) {
//       const day = prevMonthDays - i;
//       days.push(
//         <div
//           key={`prev-${day}`}
//           className="h-10 w-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 mx-auto"
//         >
//           {day}
//         </div>
//       );
//     }

//     // Days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dayEvents = getEventsForDate(day);
//       days.push(
//         <div
//           key={day}
//           onClick={() => {
//             const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//             setSelectedDate(newSelectedDate);
//           }}
//           onDoubleClick={() => {
//             const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//             openEventForm(newSelectedDate);
//           }}
//           className={`
//             relative h-10 w-10 flex items-center justify-center cursor-pointer transition-all duration-150 text-sm font-medium rounded-lg mx-auto
//             ${isToday(day) 
//               ? 'bg-orange-500 text-white shadow-md' 
//               : isSelected(day)
//               ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
//               : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
//             }
//           `}
//         >
//           {day}
//           {hasEvents(day) && (
//             <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
//           )}
//         </div>
//       );
//     }

//     // Add next month's leading days to fill the grid
//     const totalCells = Math.ceil((adjustedFirstDay + daysInMonth) / 7) * 7;
//     const remainingCells = totalCells - (adjustedFirstDay + daysInMonth);
    
//     for (let day = 1; day <= remainingCells; day++) {
//       days.push(
//         <div
//           key={`next-${day}`}
//           className="h-10 w-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 mx-auto"
//         >
//           {day}
//         </div>
//       );
//     }

//     return days;
//   };

//   const selectedDateEvents = getEventsForDate(selectedDate.getDate());

//   if (!authStatus) {
//     return (
//       <>
//         <Header onMenuClick={toggleSidebar} />
//         <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
//           <div className="flex items-center justify-center min-h-screen">
//             <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
//           </div>
//         </Sidebar>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header onMenuClick={toggleSidebar} />
//       <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
//         <div className="p-6 max-w-7xl mx-auto">
//       <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
//         <div className="flex items-center space-x-4">
//           <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
//             <CalendarIcon className="h-8 w-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
//               Calendar
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               View and manage your schedule 
//             </p>
//           </div>
//         </div>
//       </div>

//       {!authStatus.authenticated ? (
//         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
//           <CalendarIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             Connect Your Google Calendar
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             To view your events and schedule, please authenticate with Google Calendar.
//           </p>
//           <button
//             onClick={handleAuthenticate}
//             className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
//           >
//             Connect Google Calendar
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Compact Calendar */}
//           <div className="lg:col-span-2">
//             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-md mx-auto">
//               {/* Compact Calendar Header */}
//               <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
//                 <button
//                   onClick={() => navigateMonth(-1)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                 >
//                   <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
//                 </button>
                
//                 <button
//                   onClick={openMonthYearPicker}
//                   className="text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
//                 >
//                   {months[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </button>
                
//                 <button
//                   onClick={() => navigateMonth(1)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                 >
//                   <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
//                 </button>
//               </div>

//               {/* Compact Calendar Body */}
//               <div className="p-4">
//                 {/* Days of week header - more compact */}
//                 <div className="grid grid-cols-7 mb-2">
//                   {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
//                     <div
//                       key={day}
//                       className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
//                     >
//                       {day}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Compact Calendar grid */}
//                 <div className="grid grid-cols-7">
//                   {renderCalendarDays()}
//                 </div>
//               </div>
              
//               {/* Add Event Button */}
//               <div className="p-4 border-t border-gray-200 dark:border-slate-700">
//                 <button
//                   onClick={() => openEventForm()}
//                   className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//                 >
//                   <Plus className="h-4 w-4" />
//                   <span>Add Event</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Events sidebar */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//                 Events for {selectedDate.toLocaleDateString('en-US', { 
//                   month: 'long', 
//                   day: 'numeric',
//                   year: 'numeric'
//                 })}
//               </h3>

//               {loading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//                 </div>
//               ) : selectedDateEvents.length > 0 ? (
//                 <div className="space-y-3">
//                   {selectedDateEvents.map((event, index) => (
//                     <div
//                       key={event.id || index}
//                       className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
//                     >
//                       <h4 className="font-medium text-gray-900 dark:text-white mb-2">
//                         {event.summary || 'Untitled Event'}
//                       </h4>
//                       {event.start?.dateTime && (
//                         <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
//                           <Clock className="h-4 w-4 mr-2" />
//                           {formatTime(event.start.dateTime)}
//                           {event.end?.dateTime && ` - ${formatTime(event.end.dateTime)}`}
//                         </div>
//                       )}
//                       {event.description && (
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//                           {event.description}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-500 dark:text-gray-400">
//                     No events scheduled for this day
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Quick stats */}
//             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//                 This Month
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl">
//                   <span className="text-gray-600 dark:text-gray-400 font-medium">Total Events</span>
//                   <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {events.length}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl">
//                   <span className="text-gray-600 dark:text-gray-400 font-medium">Days with Events</span>
//                   <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {new Set(events.map(event => 
//                       event.start?.date || event.start?.dateTime?.split('T')[0]
//                     )).size}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Month/Year Picker Modal */}
//       {showMonthYearPicker && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   Select Month & Year
//                 </h3>
//                 <button
//                   onClick={() => setShowMonthYearPicker(false)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                 >
//                   <X className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {/* Month Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                     Month
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {months.map((month, index) => (
//                       <button
//                         key={month}
//                         onClick={() => setTempDate(new Date(tempDate.getFullYear(), index, 1))}
//                         className={`p-3 rounded-lg text-sm font-medium transition-colors ${
//                           tempDate.getMonth() === index
//                             ? 'bg-orange-500 text-white'
//                             : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
//                         }`}
//                       >
//                         {month.slice(0, 3)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Year Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                     Year
//                   </label>
//                   <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
//                     {getYearRange().map((year) => (
//                       <button
//                         key={year}
//                         onClick={() => setTempDate(new Date(year, tempDate.getMonth(), 1))}
//                         className={`p-2 rounded-lg text-sm font-medium transition-colors ${
//                           tempDate.getFullYear() === year
//                             ? 'bg-orange-500 text-white'
//                             : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
//                         }`}
//                       >
//                         {year}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     onClick={() => setShowMonthYearPicker(false)}
//                     className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleMonthYearChange(tempDate.getMonth(), tempDate.getFullYear())}
//                     className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Event Form Modal */}
//       {showEventForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   Add New Event
//                 </h3>
//                 <button
//                   onClick={closeEventForm}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                 >
//                   <X className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmitEvent} className="space-y-4">
//                 {/* Event Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Event Title *
//                   </label>
//                   <input
//                     type="text"
//                     value={eventForm.summary}
//                     onChange={(e) => handleEventFormChange('summary', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                     placeholder="Enter event title"
//                     required
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     value={eventForm.description}
//                     onChange={(e) => handleEventFormChange('description', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                     placeholder="Enter event description"
//                     rows="3"
//                   />
//                 </div>

//                 {/* Start Date and Time */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Start Date *
//                     </label>
//                     <input
//                       type="date"
//                       value={eventForm.startDate}
//                       onChange={(e) => handleEventFormChange('startDate', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Start Time *
//                     </label>
//                     <input
//                       type="time"
//                       value={eventForm.startTime}
//                       onChange={(e) => handleEventFormChange('startTime', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* End Date and Time */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={eventForm.endDate}
//                       onChange={(e) => handleEventFormChange('endDate', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       End Time
//                     </label>
//                     <input
//                       type="time"
//                       value={eventForm.endTime}
//                       onChange={(e) => handleEventFormChange('endTime', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                     />
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     value={eventForm.location}
//                     onChange={(e) => handleEventFormChange('location', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
//                     placeholder="Enter event location"
//                   />
//                 </div>

//                 {/* Submit Buttons */}
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={closeEventForm}
//                     className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center justify-center"
//                   >
//                     {submitting ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Creating...
//                       </>
//                     ) : (
//                       'Create Event'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//         </div>
//       </Sidebar>
//       <Footer collapsed={sidebarCollapsed} />
//     </>
//   );
// };

// export default Calendar;
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  X,
  MoreHorizontal,
  Bell,
  Users,
  Sparkles,
  TrendingUp,
  Globe,
  Zap,
  Star,
  ArrowRight,
  UserCheck,
  LogOut,
  Settings,
  Video,
  Mail,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../../hooks/use-theme';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import Footer from '../common/Footer';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const Calendar = () => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Enhanced State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState('primary');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState({ 
    authenticated: false, 
    loading: true,
    user: null 
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [refreshing, setRefreshing] = useState(false);

  // Event form state
  const [eventForm, setEventForm] = useState({
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    attendees: '',
    calendarId: 'primary',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Meeting form state
  const [meetingForm, setMeetingForm] = useState({
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    attendees: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Notification system
  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const showSuccessNotification = (message) => showNotification(message, 'success');
  const showErrorNotification = (message) => showNotification(message, 'error');
  const showWarningNotification = (message) => showNotification(message, 'warning');

  // Enhanced API functions
  const checkAuthStatus = async () => {
    try {
      setAuthStatus(prev => ({ ...prev, loading: true }));
      const response = await axios.get(`${API_BASE_URL}/api/calendar/status`);
      setAuthStatus({
        ...response.data,
        loading: false
      });
      
      if (response.data.user) {
        showSuccessNotification(`Welcome back, ${response.data.user.name || response.data.user.email}!`);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ 
        authenticated: false, 
        loading: false, 
        error: true,
        user: null 
      });
    }
  };

  const fetchCalendars = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/calendar/calendars`);
      if (response.data.success) {
        setCalendars(response.data.calendars || []);
      }
    } catch (error) {
      console.error('Error fetching calendars:', error);
      if (error.response?.data?.requiresAuth) {
        setAuthStatus(prev => ({ ...prev, authenticated: false, requiresAuth: true }));
        showWarningNotification('Please re-authenticate to access calendars');
      } else {
        showErrorNotification('Failed to fetch calendars');
      }
    }
  };

  const fetchEvents = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    setLoading(true);
    
    try {
      const timeMin = new Date();
      const timeMax = new Date();
      
      // Adjust time range based on view mode
      if (viewMode === 'month') {
        timeMin.setDate(1);
        timeMax.setMonth(timeMax.getMonth() + 1);
        timeMax.setDate(0);
      } else if (viewMode === 'week') {
        const dayOfWeek = timeMin.getDay();
        timeMin.setDate(timeMin.getDate() - dayOfWeek);
        timeMax.setDate(timeMax.getDate() + (6 - dayOfWeek));
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/calendar/events`, {
        params: {
          calendar: selectedCalendar,
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          maxResults: 250
        }
      });
      
      if (response.data.success) {
        setEvents(response.data.events || []);
        if (refresh) {
          showSuccessNotification('Events refreshed successfully');
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.data?.requiresAuth) {
        setAuthStatus(prev => ({ ...prev, authenticated: false, requiresAuth: true }));
        showWarningNotification('Session expired. Please re-authenticate.');
      } else {
        showErrorNotification('Failed to fetch events');
      }
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAuthenticate = () => {
    window.location.href = `${API_BASE_URL}/api/calendar/auth`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/calendar/logout`);
      setAuthStatus({ authenticated: false, loading: false, user: null });
      setEvents([]);
      setCalendars([]);
      showSuccessNotification('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      showErrorNotification('Error during logout');
    }
  };

  const handleRevokeAccess = async () => {
    if (!window.confirm('Are you sure you want to revoke calendar access? You will need to re-authenticate.')) {
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/calendar/revoke`);
      setAuthStatus({ authenticated: false, loading: false, user: null });
      setEvents([]);
      setCalendars([]);
      showSuccessNotification('Calendar access revoked successfully');
    } catch (error) {
      console.error('Revoke error:', error);
      showErrorNotification('Error revoking access');
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    
    if (!eventForm.summary || !eventForm.startDateTime || !eventForm.endDateTime) {
      showErrorNotification('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const attendeesArray = eventForm.attendees 
        ? eventForm.attendees.split(',').map(email => email.trim()).filter(email => email)
        : [];

      const response = await axios.post(`${API_BASE_URL}/api/calendar/addEvent`, {
        ...eventForm,
        attendees: attendeesArray
      });

      if (response.data.success) {
        showSuccessNotification('Event created successfully!');
        setShowEventModal(false);
        setEventForm({
          summary: '',
          description: '',
          startDateTime: '',
          endDateTime: '',
          location: '',
          attendees: '',
          calendarId: 'primary',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showErrorNotification(error.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (e) => {
    e.preventDefault();
    
    if (!meetingForm.startDateTime || !meetingForm.endDateTime) {
      showErrorNotification('Please select start and end times');
      return;
    }

    try {
      setLoading(true);
      const attendeesArray = meetingForm.attendees 
        ? meetingForm.attendees.split(',').map(email => email.trim()).filter(email => email)
        : [];

      const response = await axios.post(`${API_BASE_URL}/api/calendar/meeting`, {
        ...meetingForm,
        attendees: attendeesArray
      });

      if (response.data.success) {
        showSuccessNotification('Google Meet created successfully!');
        setShowMeetingModal(false);
        setMeetingForm({
          summary: '',
          description: '',
          startDateTime: '',
          endDateTime: '',
          attendees: '',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        fetchEvents();
        
        // Show the meeting link
        if (response.data.hangoutLink) {
          setTimeout(() => {
            showNotification(
              `Meeting link: ${response.data.hangoutLink}`, 
              'info', 
              10000
            );
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      showErrorNotification(error.response?.data?.error || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const navigate = (direction) => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'day':
        navigateDay(direction);
        break;
      default:
        navigateMonth(direction);
    }
  };

  // Enhanced date utilities
  const formatDate = (date, format = 'full') => {
    const options = {
      full: { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      },
      short: { 
        month: 'short', 
        day: 'numeric' 
      },
      time: { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }
    };
    
    return new Intl.DateTimeFormat('en-US', options[format]).format(date);
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start?.dateTime || event.start?.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Effects
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus.authenticated) {
      fetchCalendars();
      fetchEvents();
    }
  }, [authStatus.authenticated, selectedCalendar, viewMode, currentDate]);

  // Auto-refresh events every 5 minutes
  useEffect(() => {
    if (!authStatus.authenticated) return;
    
    const interval = setInterval(() => {
      fetchEvents();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [authStatus.authenticated, selectedCalendar]);

  if (authStatus.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className={`flex-1 transition-all duration-300 ${isSidebarOpen && !sidebarCollapsed ? 'ml-64' : isSidebarOpen ? 'ml-16' : 'ml-0'}`}>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading calendar...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authStatus.authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className={`flex-1 transition-all duration-300 ${isSidebarOpen && !sidebarCollapsed ? 'ml-64' : isSidebarOpen ? 'ml-16' : 'ml-0'}`}>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Connect Your Calendar
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sign in with Google to access your calendar events and create new ones.
                  </p>
                </div>
                
                <button
                  onClick={handleAuthenticate}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Globe className="w-5 h-5" />
                  <span>Connect with Google</span>
                </button>
                
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>We'll redirect you to Google to authorize access to your calendar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : notification.type === 'warning'
                ? 'bg-yellow-500 text-black'
                : 'bg-blue-500 text-white'
            } max-w-sm`}
          >
            <div className="flex items-start space-x-2">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              {notification.type === 'info' && <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <p className="text-sm font-medium flex-1">{notification.message}</p>
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen && !sidebarCollapsed ? 'ml-64' : isSidebarOpen ? 'ml-16' : 'ml-0'}`}>
          <div className="p-6">
            {/* Enhanced Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Calendar Manager
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300">
                        {formatDate(currentDate)}
                      </p>
                    </div>
                  </div>
                  
                  {authStatus.user && (
                    <div className="hidden lg:flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2">
                      {authStatus.user.avatar ? (
                        <img 
                          src={authStatus.user.avatar} 
                          alt={authStatus.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {authStatus.user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {authStatus.user.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Selector */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {['month', 'week', 'day'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                          viewMode === mode
                            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Calendar Selector */}
                  {calendars.length > 0 && (
                    <select
                      value={selectedCalendar}
                      onChange={(e) => setSelectedCalendar(e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {calendars.map((cal) => (
                        <option key={cal.id} value={cal.id}>
                          {cal.summary} {cal.primary ? '(Primary)' : ''}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Action Buttons */}
                  <button
                    onClick={() => fetchEvents(true)}
                    disabled={refreshing}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                    title="Refresh events"
                  >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setShowEventModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Event</span>
                  </button>

                  <button
                    onClick={() => setShowMeetingModal(true)}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Meet</span>
                  </button>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-2">
                        <button
                          onClick={() => setCurrentDate(new Date())}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <CalendarIcon className="w-4 h-4" />
                          <span>Today</span>
                        </button>
                        <button
                          onClick={handleRevokeAccess}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Revoke Access</span>
                        </button>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {viewMode === 'month' && formatDate(currentDate, 'month')}
                    {viewMode === 'week' && `Week of ${formatDate(currentDate, 'short')}`}
                    {viewMode === 'day' && formatDate(currentDate, 'full')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {events.length} events • {viewMode} view
                  </p>
                </div>

                <button
                  onClick={() => navigate(1)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            {viewMode === 'month' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center py-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calendar Body */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    const isCurrentDay = isToday(date);
                    const isCurrentMonthDay = isCurrentMonth(date);

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-gray-100 dark:border-gray-700 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          isCurrentDay 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' 
                            : ''
                        } ${
                          !isCurrentMonthDay 
                            ? 'opacity-40' 
                            : ''
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            isCurrentDay 
                              ? 'text-indigo-600 dark:text-indigo-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {date.getDate()}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="text-xs p-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md truncate"
                              title={event.summary}
                            >
                              {event.summary}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Events List View */}
            {(viewMode === 'week' || viewMode === 'day') && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upcoming Events
                </h3>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No events found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {event.summary || 'Untitled Event'}
                            </h4>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatDate(new Date(event.start?.dateTime || event.start?.date), 'time')}
                                  {event.end && ` - ${formatDate(new Date(event.end?.dateTime || event.end?.date), 'time')}`}
                                </span>
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                              
                              {event.attendees && event.attendees.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{event.attendees.length} attendees</span>
                                </div>
                              )}
                            </div>
                            
                            {event.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {event.hangoutLink && (
                              <a
                                href={event.hangoutLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-green-600 hover:text-green-700 transition-colors"
                                title="Join Google Meet"
                              >
                                <Video className="w-4 h-4" />
                              </a>
                            )}
                            
                            {event.htmlLink && (
                              <a
                                href={event.htmlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                                title="View in Google Calendar"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Event</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={createEvent} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventForm.summary}
                    onChange={(e) => setEventForm({ ...eventForm, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.startDateTime}
                      onChange={(e) => setEventForm({ ...eventForm, startDateTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.endDateTime}
                      onChange={(e) => setEventForm({ ...eventForm, endDateTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter event description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attendees
                  </label>
                  <input
                    type="text"
                    value={eventForm.attendees}
                    onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter email addresses separated by commas"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Separate multiple email addresses with commas
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Event</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Google Meet</h2>
                </div>
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={createMeeting} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={meetingForm.summary}
                    onChange={(e) => setMeetingForm({ ...meetingForm, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter meeting title (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={meetingForm.startDateTime}
                      onChange={(e) => setMeetingForm({ ...meetingForm, startDateTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={meetingForm.endDateTime}
                      onChange={(e) => setMeetingForm({ ...meetingForm, endDateTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={meetingForm.description}
                    onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter meeting description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attendees
                  </label>
                  <input
                    type="text"
                    value={meetingForm.attendees}
                    onChange={(e) => setMeetingForm({ ...meetingForm, attendees: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter email addresses separated by commas"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Separate multiple email addresses with commas
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => setShowMeetingModal(false)}
                    className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>Create Meeting</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Calendar;
