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
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../../hooks/use-theme';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { Header } from '../common/Header';
import { Sidebar, useSidebar } from '../common/sidebar';
import Footer from '../common/Footer';

const Calendar = () => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    summary: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Constants
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shortDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleSidebarCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Effects
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus?.authenticated) {
      fetchEvents();
    }
  }, [currentDate, authStatus]);

  // Helper function to get current date/time in user's timezone
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  // Helper function to create proper datetime string for API
  const createDateTimeString = (date, time) => {
    // Create a proper datetime string in user's local timezone
    const dateTimeString = `${date}T${time}:00`;
    const localDate = new Date(dateTimeString);
    
    // Return ISO string which will be in UTC but properly converted
    return localDate.toISOString();
  };

  // API Functions
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/calendar/status`);
      setAuthStatus(response.data);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ authenticated: false, error: true });
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/calendar/events`);
      if (response.data.success) {
        setEvents(response.data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = () => {
    window.location.href = `${API_BASE_URL}/api/calendar/auth`;
  };

  const createEvent = async (eventData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/calendar/addEvent`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  // Event Form Functions
  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
  };

  const resetEventForm = () => {
    const { date, time } = getCurrentDateTime();
    setEventForm({
      summary: '',
      description: '',
      startDate: date,
      startTime: time,
      endDate: date,
      endTime: '',
      location: ''
    });
  };

  const openEventForm = (date = null) => {
    const { date: currentDate, time: currentTime } = getCurrentDateTime();
    
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      setEventForm(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
        startTime: currentTime,
        endTime: ''
      }));
    } else {
      setEventForm(prev => ({
        ...prev,
        startDate: currentDate,
        endDate: currentDate,
        startTime: currentTime,
        endTime: ''
      }));
    }
    setShowEventForm(true);
  };

  const closeEventForm = () => {
    setShowEventForm(false);
    resetEventForm();
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!eventForm.summary || !eventForm.startDate || !eventForm.startTime) {
        alert('Please fill in all required fields (Title, Start Date, Start Time)');
        return;
      }

      // Create proper datetime strings in user's local timezone
      const startDateTime = createDateTimeString(eventForm.startDate, eventForm.startTime);
      
      let endDateTime;
      if (eventForm.endDate && eventForm.endTime) {
        endDateTime = createDateTimeString(eventForm.endDate, eventForm.endTime);
      } else {
        // Default to 1 hour after start time
        const startDate = new Date(`${eventForm.startDate}T${eventForm.startTime}:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        endDateTime = endDate.toISOString();
      }

      const eventData = {
        summary: eventForm.summary,
        description: eventForm.description || '',
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        timeZone: userTimezone // Use user's timezone
      };

      console.log('Sending event data with timezone:', eventData);

      const result = await createEvent(eventData);
      
      if (result.success) {
        // Show success message with better styling
        showSuccessNotification('Event created successfully!');
        closeEventForm();
        fetchEvents();
      } else {
        showErrorNotification(`Failed to create event: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.error || error.response.data.message || 'Server error';
        
        if (error.response.status === 401 || errorMessage.includes('Not authenticated')) {
          const shouldReauth = confirm(
            'You need to re-authenticate with Google Calendar to create events. ' +
            'This will redirect you to Google for permission to manage your calendar. ' +
            'Click OK to continue or Cancel to close this dialog.'
          );
          
          if (shouldReauth) {
            window.location.href = `${API_BASE_URL}/api/calendar/auth`;
            return;
          }
        } else {
          showErrorNotification(`Error creating event: ${errorMessage}`);
        }
      } else {
        showErrorNotification(`Error creating event: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Notification functions
  const showSuccessNotification = (message) => {
    // Create a better notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const showErrorNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  // Calendar Helper Functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleMonthYearChange = (month, year) => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
    setShowMonthYearPicker(false);
  };

  const openMonthYearPicker = () => {
    setTempDate(new Date(currentDate));
    setShowMonthYearPicker(true);
  };

  const getCurrentYear = () => new Date().getFullYear();
  
  const getYearRange = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasEvents = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => {
      const eventDate = event.start?.date || event.start?.dateTime?.split('T')[0];
      return eventDate === dateStr;
    });
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const eventDate = event.start?.date || event.start?.dateTime?.split('T')[0];
      return eventDate === dateStr;
    });
  };

  // Improved time formatting with proper timezone handling
  const formatTime = (dateTimeStr, showTimezone = false) => {
    if (!dateTimeStr) return '';
    
    const date = new Date(dateTimeStr);
    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
      timeZone: userTimezone
    });
    
    if (showTimezone) {
      const timezone = date.toLocaleTimeString('en-US', {
        timeZoneName: 'short',
        timeZone: userTimezone
      }).split(' ').pop();
      return `${timeString} ${timezone}`;
    }
    
    return timeString;
  };

  // Calendar Rendering Functions with improved design
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Adjust for Monday start
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="aspect-square flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl transition-all duration-300 cursor-pointer group"
        >
          <span className="font-medium group-hover:scale-110 transition-transform duration-300">{day}</span>
        </div>
      );
    }

    // Current month days with enhanced styling
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const eventCount = dayEvents.length;
      
      days.push(
        <div
          key={day}
          onClick={() => {
            const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDate(newSelectedDate);
          }}
          onDoubleClick={() => {
            const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            openEventForm(newSelectedDate);
          }}
          className={`
            group relative aspect-square flex flex-col items-center justify-start p-3 cursor-pointer transition-all duration-300 rounded-2xl border-2
            ${isToday(day) 
              ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-xl shadow-orange-500/30 transform scale-105 border-orange-400' 
              : isSelected(day)
              ? 'bg-gradient-to-br from-orange-100 via-orange-50 to-white text-orange-700 dark:from-orange-900/70 dark:via-orange-800/50 dark:to-orange-700/30 dark:text-orange-300 border-orange-400 dark:border-orange-500 shadow-lg shadow-orange-500/20'
              : 'hover:bg-gradient-to-br hover:from-gray-50 hover:via-white hover:to-gray-100 dark:hover:from-slate-700 dark:hover:via-slate-600 dark:hover:to-slate-700 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
            }
          `}
        >
          {/* Day number */}
          <span className={`text-sm font-bold mb-1 ${isToday(day) ? 'text-white' : ''} group-hover:scale-110 transition-transform duration-300`}>
            {day}
          </span>
          
          {/* Event indicators with improved design */}
          {eventCount > 0 && (
            <div className="flex flex-wrap gap-1 items-center justify-center">
              {eventCount <= 3 ? (
                // Show individual dots for 1-3 events with animation
                Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isToday(day) 
                        ? 'bg-white shadow-lg' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-md'
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))
              ) : (
                // Show count badge for 4+ events with improved styling
                <div className={`
                  px-2 py-1 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-all duration-300
                  ${isToday(day) 
                    ? 'bg-white text-orange-600' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  }
                `}>
                  {eventCount}
                </div>
              )}
            </div>
          )}
          
          {/* Enhanced hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-600/0 to-orange-700/0 group-hover:from-orange-500/10 group-hover:via-orange-600/5 group-hover:to-orange-700/10 rounded-2xl transition-all duration-500" />
          
          {/* Sparkle effect for today */}
          {isToday(day) && (
            <div className="absolute -top-1 -right-1">
              <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
          )}
        </div>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((adjustedFirstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (adjustedFirstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="aspect-square flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl transition-all duration-300 cursor-pointer group"
        >
          <span className="font-medium group-hover:scale-110 transition-transform duration-300">{day}</span>
        </div>
      );
    }

    return days;
  };

  // Stats calculations
  const getMonthStats = () => {
    const eventsThisMonth = events.filter(event => {
      const eventDate = new Date(event.start?.date || event.start?.dateTime);
      return eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
    });

    const uniqueDays = new Set(eventsThisMonth.map(event => 
      (event.start?.date || event.start?.dateTime?.split('T')[0])
    )).size;

    return {
      totalEvents: eventsThisMonth.length,
      busyDays: uniqueDays,
      upcomingEvents: eventsThisMonth.filter(event => 
        new Date(event.start?.date || event.start?.dateTime) > new Date()
      ).length
    };
  };

  const selectedDateEvents = getEventsForDate(selectedDate.getDate());
  const monthStats = getMonthStats();

  // Loading state with better design
  if (!authStatus) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-transparent animate-pulse"></div>
                <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Calendar...</p>
              <p className="text-gray-500 dark:text-gray-400">Setting up your personalized experience</p>
            </div>
          </div>
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            
            {/* Enhanced Header Section */}
            <div className="mb-8">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-orange-200/50 dark:border-slate-700/50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-600/10 dark:from-orange-400/10 dark:via-orange-500/5 dark:to-orange-600/10" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-400/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative group">
                      <div className="p-5 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:scale-105">
                        <CalendarIcon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white dark:border-slate-800 animate-pulse" />
                      <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-orange-400 animate-pulse" />
                    </div>
                    <div>
                      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-3">
                        Smart Calendar
                      </h1>
                      <div className="flex items-center space-x-3">
                        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                          Your intelligent schedule companion
                        </p>
                        <div className="flex items-center space-x-1 text-orange-500">
                          <Globe className="w-4 h-4" />
                          <span className="text-xs font-medium">{userTimezone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Quick Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => openEventForm()}
                      className="group flex items-center space-x-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
                      <span className="hidden sm:inline text-lg">Create Event</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    
                    <button className="group p-4 bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transform hover:scale-105 hover:-translate-y-1">
                      <Bell className="h-6 w-6 group-hover:animate-pulse" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!authStatus.authenticated ? (
              // Enhanced Authentication Required State
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-16 text-center border border-orange-200/50 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-600/10" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                
                <div className="relative">
                  <div className="mb-12">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/25 animate-pulse">
                        <CalendarIcon className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-8 animate-bounce">
                        <Sparkles className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      Connect Your Google Calendar
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                      Unlock the full potential of smart scheduling by connecting with Google Calendar. 
                      Get intelligent insights, seamless synchronization, and timezone-aware event management.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleAuthenticate}
                    className="group inline-flex items-center space-x-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-bold py-6 px-12 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                  >
                    <Zap className="h-8 w-8 group-hover:animate-pulse" />
                    <span className="text-xl">Connect Google Calendar</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            ) : (
              // Enhanced Main Calendar Interface
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                
                {/* Main Calendar Section */}
                <div className="xl:col-span-8">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-orange-200/50 dark:border-slate-700/50 overflow-hidden">
                    
                    {/* Enhanced Calendar Header */}
                    <div className="p-6 border-b border-orange-200/30 dark:border-slate-700/50 bg-gradient-to-r from-orange-50/50 via-white/50 to-orange-100/50 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => navigateMonth(-1)}
                            className="group p-4 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:shadow-xl transform hover:scale-105"
                          >
                            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
                          </button>
                          
                          <button
                            onClick={openMonthYearPicker}
                            className="group flex items-center space-x-3 text-3xl font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300 hover:scale-105 transform"
                          >
                            <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                            <MoreHorizontal className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                          </button>
                          
                          <button
                            onClick={() => navigateMonth(1)}
                            className="group p-4 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:shadow-xl transform hover:scale-105"
                          >
                            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>

                        {/* Enhanced View Mode Toggle */}
                        <div className="hidden sm:flex items-center space-x-2 bg-orange-100/50 dark:bg-slate-700/50 rounded-2xl p-2 backdrop-blur-xl">
                          {['month', 'week', 'day'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setViewMode(mode)}
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 capitalize ${
                                viewMode === mode
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Calendar Body */}
                    <div className="p-8">
                      {/* Days of Week Header with better styling */}
                      <div className="grid grid-cols-7 gap-3 mb-6">
                        {daysOfWeek.map((day, index) => (
                          <div
                            key={day}
                            className="text-center py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-slate-700/50 dark:to-slate-600/30 rounded-2xl"
                          >
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{shortDays[index]}</span>
                          </div>
                        ))}
                      </div>

                      {/* Enhanced Calendar Grid */}
                      <div className="grid grid-cols-7 gap-3">
                        {renderCalendarDays()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Sidebar */}
                <div className="xl:col-span-4 space-y-6">
                  
                  {/* Enhanced Selected Date Events */}
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-orange-200/50 dark:border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/15 to-transparent rounded-full blur-3xl animate-pulse" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {selectedDate.toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              weekday: 'long'
                            })}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse" />
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {selectedDateEvents.length} events
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-orange-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs font-medium">{userTimezone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center py-16">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-transparent animate-pulse"></div>
                            <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                          </div>
                        </div>
                      ) : selectedDateEvents.length > 0 ? (
                        <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100 dark:scrollbar-track-slate-700">
                          {selectedDateEvents.map((event, index) => (
                            <div
                              key={event.id || index}
                              className="group p-6 border border-orange-200/30 dark:border-slate-600/30 rounded-3xl hover:bg-gradient-to-r hover:from-orange-50 hover:via-orange-25 hover:to-transparent dark:hover:from-orange-900/20 dark:hover:via-orange-800/10 dark:hover:to-transparent transition-all duration-500 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-600 transform hover:scale-105"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 text-lg">
                                  {event.summary || 'Untitled Event'}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              </div>
                              
                              {event.start?.dateTime && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3 bg-orange-50/50 dark:bg-slate-700/30 rounded-xl p-3">
                                  <Clock className="h-5 w-5 mr-3 text-orange-500" />
                                  <span className="font-semibold">
                                    {formatTime(event.start.dateTime, true)}
                                    {event.end?.dateTime && ` - ${formatTime(event.end.dateTime)}`}
                                  </span>
                                </div>
                              )}
                              
                              {event.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                              <CalendarIcon className="h-10 w-10 text-orange-400" />
                            </div>
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-orange-400 animate-pulse" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg mb-2">
                            No events scheduled
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Double-click a date to create your first event
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Month Statistics */}
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-orange-200/50 dark:border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-500/15 to-transparent rounded-full blur-3xl animate-pulse" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Monthly Insights
                        </h3>
                        <TrendingUp className="h-6 w-6 text-orange-500 animate-pulse" />
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="group p-6 bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-orange-900/10 rounded-3xl border border-orange-200/50 dark:border-orange-700/30 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-orange-700 dark:text-orange-300 mb-2 uppercase tracking-wide">
                                Total Events
                              </p>
                              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                                {monthStats.totalEvents}
                              </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 group-hover:scale-110 transition-all duration-300">
                              <CalendarIcon className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="group p-6 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-900/10 rounded-3xl border border-blue-200/50 dark:border-blue-700/30 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">
                                Busy Days
                              </p>
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                {monthStats.busyDays}
                              </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-110 transition-all duration-300">
                              <Users className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="group p-6 bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-green-900/10 rounded-3xl border border-green-200/50 dark:border-green-700/30 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">
                                Upcoming
                              </p>
                              <p className="text-3xl font-bold text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                {monthStats.upcomingEvents}
                              </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 group-hover:scale-110 transition-all duration-300">
                              <Clock className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Enhanced Month/Year Picker Modal */}
            {showMonthYearPicker && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg border border-orange-200/50 dark:border-slate-700/50 overflow-hidden transform animate-scale-in">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Select Date
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">Choose your preferred month and year</p>
                      </div>
                      <button
                        onClick={() => setShowMonthYearPicker(false)}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-colors duration-300 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transform hover:scale-110"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Month Selection */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                          Month
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {months.map((month, index) => (
                            <button
                              key={month}
                              onClick={() => setTempDate(new Date(tempDate.getFullYear(), index, 1))}
                              className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                                tempDate.getMonth() === index
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/25'
                                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-lg'
                              }`}
                            >
                              {month.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Year Selection */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                          Year
                        </label>
                        <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100 dark:scrollbar-track-slate-700">
                          {getYearRange().map((year) => (
                            <button
                              key={year}
                              onClick={() => setTempDate(new Date(year, tempDate.getMonth(), 1))}
                              className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                                tempDate.getFullYear() === year
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/25'
                                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-lg'
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-4 pt-6">
                        <button
                          onClick={() => setShowMonthYearPicker(false)}
                          className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 font-bold transform hover:scale-105"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleMonthYearChange(tempDate.getMonth(), tempDate.getFullYear())}
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl transition-all duration-300 font-bold shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 hover:-translate-y-1"
                        >
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Event Form Modal */}
            {showEventForm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100 dark:scrollbar-track-slate-700 border border-orange-200/50 dark:border-slate-700/50 transform animate-scale-in">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Create New Event
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <span>Add a new event to your calendar</span>
                          <div className="flex items-center space-x-1 text-orange-500">
                            <Globe className="w-4 h-4" />
                            <span className="text-xs font-medium">{userTimezone}</span>
                          </div>
                        </p>
                      </div>
                      <button
                        onClick={closeEventForm}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-colors duration-300 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transform hover:scale-110"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitEvent} className="space-y-8">
                      {/* Event Title */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                          Event Title *
                        </label>
                        <input
                          type="text"
                          value={eventForm.summary}
                          onChange={(e) => handleEventFormChange('summary', e.target.value)}
                          className="w-full px-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 font-semibold text-lg placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Enter a descriptive title for your event"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                          Description
                        </label>
                        <textarea
                          value={eventForm.description}
                          onChange={(e) => handleEventFormChange('description', e.target.value)}
                          className="w-full px-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 resize-none font-medium placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Add details, agenda, or notes for your event"
                          rows="4"
                        />
                      </div>

                      {/* Date and Time Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={eventForm.startDate}
                            onChange={(e) => handleEventFormChange('startDate', e.target.value)}
                            className="w-full px-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 font-semibold"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                            Start Time *
                          </label>
                          <input
                            type="time"
                            value={eventForm.startTime}
                            onChange={(e) => handleEventFormChange('startTime', e.target.value)}
                            className="w-full px-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 font-semibold"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={eventForm.endDate}
                            onChange={(e) => handleEventFormChange('endDate', e.target.value)}
                            className="w-full px-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={eventForm.endTime}
                            onChange={(e) => handleEventFormChange('endTime', e.target.value)}
                            className="w-full px-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-400" />
                          <input
                            type="text"
                            value={eventForm.location}
                            onChange={(e) => handleEventFormChange('location', e.target.value)}
                            className="w-full pl-16 pr-6 py-4 border-2 border-gray-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-slate-700/50 dark:text-white transition-all duration-300 font-semibold placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Add meeting room, address, or virtual link"
                          />
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex space-x-6 pt-8">
                        <button
                          type="button"
                          onClick={closeEventForm}
                          className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 font-bold transform hover:scale-105"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white rounded-2xl transition-all duration-300 flex items-center justify-center font-bold shadow-xl hover:shadow-orange-500/25 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 disabled:transform-none"
                        >
                          {submitting ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                              Creating Event...
                            </>
                          ) : (
                            <>
                              <Plus className="h-6 w-6 mr-3" />
                              Create Event
                              <Sparkles className="h-5 w-5 ml-2" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </Sidebar>
      <Footer collapsed={sidebarCollapsed} />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-100%) translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Calendar;
