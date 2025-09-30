import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, X } from 'lucide-react';
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

  const handleSidebarCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    eventTopic: '',
    description: '',
    eventDate: '',
    startingTime: '',
    endingTime: '',
    meeting: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events when date changes
  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const validateToken = (token) => {
    if (!token) {
      console.log('No token provided');
      return false;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format');
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
      
      if (!payload.uid || !payload.role) {
        console.log('Token missing uid or role');
        return false;
      }
      
      if (payload.exp && payload.exp < Date.now() / 1000) {
        console.log('Token expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Token validation error:', error);
      return false;
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!validateToken(token)) {
      localStorage.removeItem('token');
      throw new Error('Invalid or expired token');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      console.log('Fetching events with headers:', headers);
      
      const response = await axios.get(`${API_BASE_URL}/api/events/getAllEvents`, { headers });
      console.log('Events response:', response.data);
      
      if (response.data && response.data.success) {
        const events = response.data.data.map(event => ({
          id: event.id,
          summary: event.eventTopic,
          description: event.description,
          start: {
            dateTime: event.startingTime,
            date: event.eventDate
          },
          end: {
            dateTime: event.endingTime
          },
          source: 'local'
        }));
        setEvents(events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Fetch events error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      if (error.response?.status === 401) {
        handleAuthError();
        return;
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };


  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetEventForm = () => {
    setEventForm({
      eventTopic: '',
      description: '',
      eventDate: '',
      startingTime: '',
      endingTime: '',
      meeting: false
    });
  };

  const openEventForm = (date = null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      const startDateTime = dateStr + 'T09:00';
      const endDateTime = dateStr + 'T10:00';
      setEventForm(prev => ({
        ...prev,
        eventDate: dateStr,
        startingTime: startDateTime,
        endingTime: endDateTime
      }));
    } else {
      // Set default values for today
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const startDateTime = dateStr + 'T09:00';
      const endDateTime = dateStr + 'T10:00';
      setEventForm(prev => ({
        ...prev,
        eventDate: dateStr,
        startingTime: startDateTime,
        endingTime: endDateTime
      }));
    }
    setShowEventForm(true);
  };

  const closeEventForm = () => {
    setShowEventForm(false);
    resetEventForm();
  };

  const createEvent = async (eventData) => {
    try {
      const headers = getAuthHeaders();
      
      // Ensure proper date formatting
      const startDate = new Date(eventData.startingTime);
      const endDate = new Date(eventData.endingTime);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format. Please check your start and end times.');
      }
      
      const localEventData = {
        eventTopic: eventData.eventTopic,
        eventDate: eventData.eventDate, // YYYY-MM-DD format
        startingTime: startDate.toISOString(), // Full ISO string for backend
        endingTime: endDate.toISOString(), // Full ISO string for backend
        description: eventData.description || '',
        meeting: eventData.meeting || false
      };
      
      console.log('Creating event with data:', localEventData);
      console.log('Using headers:', headers);
      
      const response = await axios.post(`${API_BASE_URL}/api/events/postAnEvent`, localEventData, { headers });
      console.log('Create event response:', response.data);
      
      // Check if local event creation was successful
      if (!response.data || !response.data.id) {
        throw new Error(response.data?.message || 'Failed to create event');
      }
      
      return { success: true, message: 'Event created successfully' };
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data.error || error.response.data.message || 'Server error';
        const newError = new Error(`Server responded with ${error.response.status}: ${serverError}`);
        newError.response = error.response;
        throw newError;
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error(error.message || 'Unknown error occurred while creating event');
      }
    }
  };

  const testAuthentication = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/events/getAllEvents`, { headers });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userType');
    alert('Your session has expired. Please log in again.');
    window.location.href = '/login';
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const authTest = await testAuthentication();
      if (!authTest) {
        handleAuthError();
        return;
      }
      
      // Validate required fields
      if (!eventForm.eventTopic || !eventForm.startingTime || !eventForm.endingTime) {
        alert('Please fill in all required fields (Event Topic, Start Time, End Time)');
        return;
      }

      // Extract date from startingTime if eventDate is not set
      let eventDate = eventForm.eventDate;
      if (!eventDate && eventForm.startingTime) {
        eventDate = eventForm.startingTime.split('T')[0];
      }

      // Prepare event data to match the local calendar API format
      const eventData = {
        eventTopic: eventForm.eventTopic,
        description: eventForm.description || '',
        eventDate: eventDate,
        startingTime: eventForm.startingTime,
        endingTime: eventForm.endingTime,
        meeting: eventForm.meeting
      };

      const result = await createEvent(eventData);
      
      if (result && result.success) {
        alert('Event created successfully!');
        closeEventForm();
        fetchEvents(); // Refresh events list
      } else {
        console.error('Event creation failed:', result);
        const errorMsg = result?.message || result?.error || 'Unknown error occurred';
        alert(`Failed to create event: ${errorMsg}`);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || error.response.data.message || 'Server error';
        
        if (error.response.status === 401) {
          handleAuthError();
          return;
        } else if (error.response.status === 400) {
          alert(`Bad request: ${errorMessage}`);
        } else {
          alert(`Error creating event: ${errorMessage}`);
        }
      } else if (error.request) {
        alert('Error creating event: No response from server');
      } else if (error.message && error.message.includes('Invalid or expired token')) {
        handleAuthError();
        return;
      } else {
        // Log the full error object for debugging
        console.error('Full error object:', error);
        console.error('Error keys:', Object.keys(error));
        
        let errorMessage = 'Unknown error occurred';
        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.toString && error.toString() !== '[object Object]') {
          errorMessage = error.toString();
        } else {
          // Try to extract meaningful information from the error object
          errorMessage = JSON.stringify(error, Object.getOwnPropertyNames(error));
        }
        
        alert(`Error creating event: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
      if (!event.start) return false;
      const eventDate = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start.date;
      return eventDate === dateStr;
    });
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      if (!event.start) return false;
      const eventDate = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start.date;
      return eventDate === dateStr;
    });
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    // Adjust for Monday start (0 = Sunday, 1 = Monday, etc.)
    // We want Monday to be 0, so: Sunday(0)->6, Monday(1)->0, Tuesday(2)->1, etc.
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="h-10 w-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 mx-auto"
        >
          {day}
        </div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
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
            relative h-10 w-10 flex items-center justify-center cursor-pointer transition-all duration-150 text-sm font-medium rounded-lg mx-auto
            ${isToday(day) 
              ? 'bg-orange-500 text-white shadow-md' 
              : isSelected(day)
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
              : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {day}
          {hasEvents(day) && (
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
          )}
        </div>
      );
    }

    // Add next month's leading days to fill the grid
    const totalCells = Math.ceil((adjustedFirstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (adjustedFirstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="h-10 w-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 mx-auto"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForDate(selectedDate.getDate());

  return (
    <>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
        <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
            <CalendarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your schedule 
            </p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Compact Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-md mx-auto">
              {/* Compact Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                
                <button
                  onClick={openMonthYearPicker}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </button>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Compact Calendar Body */}
              <div className="p-4">
                {/* Days of week header - more compact */}
                <div className="grid grid-cols-7 mb-2">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div
                      key={day}
                      className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Compact Calendar grid */}
                <div className="grid grid-cols-7">
                  {renderCalendarDays()}
                </div>
              </div>
              
              {/* Add Event Button */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => openEventForm()}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Event</span>
                </button>
              </div>
            </div>
          </div>

          {/* Events sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Events for {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <div
                      key={event.id || index}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {event.summary || 'Untitled Event'}
                      </h4>
                      {event.start?.dateTime && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(event.start.dateTime)}
                          {event.end?.dateTime && ` - ${formatTime(event.end.dateTime)}`}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No events scheduled for this day
                  </p>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                This Month
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Events</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {events.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Days with Events</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(events.map(event => {
                    const eventDate = event.start?.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start?.date;
                    return eventDate;
                  })).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Month/Year Picker Modal */}
      {showMonthYearPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select Month & Year
                </h3>
                <button
                  onClick={() => setShowMonthYearPicker(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Month Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Month
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => setTempDate(new Date(tempDate.getFullYear(), index, 1))}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          tempDate.getMonth() === index
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                        }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Year
                  </label>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {getYearRange().map((year) => (
                      <button
                        key={year}
                        onClick={() => setTempDate(new Date(year, tempDate.getMonth(), 1))}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          tempDate.getFullYear() === year
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowMonthYearPicker(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMonthYearChange(tempDate.getMonth(), tempDate.getFullYear())}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add New Event
                </h3>
                <button
                  onClick={closeEventForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitEvent} className="space-y-4">
                {/* Event Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Topic *
                  </label>
                  <input
                    type="text"
                    value={eventForm.eventTopic}
                    onChange={(e) => handleEventFormChange('eventTopic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter event topic"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => handleEventFormChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter event description"
                    rows="3"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventForm.eventDate}
                    onChange={(e) => handleEventFormChange('eventDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                {/* Starting Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Starting Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.startingTime}
                    onChange={(e) => handleEventFormChange('startingTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                {/* Ending Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ending Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.endingTime}
                    onChange={(e) => handleEventFormChange('endingTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                {/* Meeting Option */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="meeting"
                    checked={eventForm.meeting}
                    onChange={(e) => handleEventFormChange('meeting', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="meeting" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    This is a meeting
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEventForm}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </div>
      </Sidebar>
      <Footer collapsed={sidebarCollapsed} />
    </>
  );
};

export default Calendar;
