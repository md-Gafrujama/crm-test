import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, X, Edit, Trash2 } from 'lucide-react';
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
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    eventPurpose: 'MEETING',
    meetingType: 'ONLINE',
    requireMeeting: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Check Google Calendar authentication status on component mount
  useEffect(() => {
    checkGoogleAuthStatus();
  }, []);

  // Fetch events when authenticated or date changes
  useEffect(() => {
    if (isGoogleAuthenticated) {
      fetchEvents();
    }
  }, [isGoogleAuthenticated, currentDate]);

  const validateToken = (token) => {
    if (!token) {
      return false;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));

      if (!payload.uid || !payload.role) {
        return false;
      }

      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }

      return true;
    } catch (error) {
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

  const checkGoogleAuthStatus = async () => {
    setAuthLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/calendar/status`, { headers });

      if (response.data && response.data.authenticated) {
        setIsGoogleAuthenticated(true);
      } else {
        setIsGoogleAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking Google auth status:', error);
      setIsGoogleAuthenticated(false);
      if (error.response?.status === 401) {
        handleAuthError();
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const initiateGoogleAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleAuthError();
        return;
      }

      // Navigate directly to the auth endpoint with token in URL
      window.location.href = `${API_BASE_URL}/api/calendar/auth?authToken=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      if (error.message.includes('token')) {
        handleAuthError();
      }
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      const response = await axios.get(`${API_BASE_URL}/api/calendar/events`, { headers });

      if (response.data && response.data.success) {

        const events = response.data.events.map((event, index) => {

          const mappedEvent = {
            id: event.dbId || event.googleEventId, // Use dbId if available, otherwise googleEventId
            dbId: event.dbId,
            googleEventId: event.googleEventId,
            summary: event.summary || 'No Title',
            description: event.description || '',
            start: {
              dateTime: event.start,
              date: event.start ? new Date(event.start).toISOString().split('T')[0] : null
            },
            end: {
              dateTime: event.end
            },
            hangoutLink: event.hangoutLink,
            googleEventLink: event.googleEventLink,
            conferenceData: event.conferenceData,
            source: event.source || 'google'
          };


          return mappedEvent;
        });

        setEvents(events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Fetch Google Calendar events error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      if (error.response?.status === 401) {
        setIsGoogleAuthenticated(false);
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
      summary: '',
      description: '',
      startDateTime: '',
      endDateTime: '',
      eventPurpose: 'MEETING',
      meetingType: 'ONLINE',
      requireMeeting: false
    });
    setEditingEvent(null);
  };

  // API functions for edit and delete (replace with your own endpoints)
  const editEvent = async (eventId, eventData) => {
    try {
      const headers = getAuthHeaders();

      const response = await axios.put(`${API_BASE_URL}/api/calendar/editEvent/${eventId}`, eventData, { headers });

      // Check if the response indicates success
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Event updated successfully',
          updatedEvent: response.data.updatedEvent
        };
      } else {
        throw new Error(response.data?.error || 'Server did not confirm update');
      }
    } catch (error) {
      console.error('Edit event error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`);
      }
      throw new Error(error.message || 'Failed to edit event');
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const headers = getAuthHeaders();

      const response = await axios.delete(`${API_BASE_URL}/api/calendar/deleteEvent/${eventId}`, { headers });

      // Check if the response indicates success
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Event deleted successfully',
          deleted: response.data.deleted
        };
      } else {
        throw new Error(response.data?.error || 'Server did not confirm deletion');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`);
      }
      throw new Error(error.message || 'Failed to delete event');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      summary: event.summary || '',
      description: event.description || '',
      startDateTime: event.start?.dateTime ? new Date(event.start.dateTime).toISOString().slice(0, 16) : '',
      endDateTime: event.end?.dateTime ? new Date(event.end.dateTime).toISOString().slice(0, 16) : '',
      eventPurpose: event.eventPurpose || 'MEETING',
      meetingType: event.meetingType || 'ONLINE',
      requireMeeting: event.requireMeeting || false
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.summary}"?`)) {


      const eventId = event.dbId || event.googleEventId;

      if (!eventId) {
        alert('Cannot delete event: No valid ID found');
        return;
      }

      setDeletingEvent(eventId);
      try {
        const result = await deleteEvent(eventId);

        if (result && result.success) {
          alert(result.message || 'Event deleted successfully!');
          fetchEvents(); // Refresh events list
        } else {
          alert('Failed to delete event: Server did not confirm deletion');
        }
      } catch (error) {
        alert('Failed to delete event: ' + error.message);
      } finally {
        setDeletingEvent(null);
      }
    }
  };

  const openEventForm = (date = null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      const startDateTime = dateStr + 'T09:00:00';
      const endDateTime = dateStr + 'T10:00:00';
      setEventForm(prev => ({
        ...prev,
        startDateTime: startDateTime,
        endDateTime: endDateTime
      }));
    } else {
      // Set default values for today
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const startDateTime = dateStr + 'T09:00:00';
      const endDateTime = dateStr + 'T10:00:00';
      setEventForm(prev => ({
        ...prev,
        startDateTime: startDateTime,
        endDateTime: endDateTime
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

      // Ensure proper date formatting for Google Calendar API
      const startDate = new Date(eventData.startDateTime);
      const endDate = new Date(eventData.endDateTime);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format. Please check your start and end times.');
      }

      const googleEventData = {
        summary: eventData.summary,
        description: eventData.description || '',
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        eventPurpose: eventData.eventPurpose || 'MEETING',
        meetingType: eventData.meetingType || 'ONLINE',
        requireMeeting: eventData.requireMeeting || false,
        timeZone: 'UTC'
      };


      const response = await axios.post(`${API_BASE_URL}/api/calendar/createEvent`, googleEventData, { headers });

      // Check if Google Calendar event creation was successful
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || 'Failed to create event');
      }

      return { success: true, message: response.data.message || 'Event created successfully' };
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
      const response = await axios.get(`${API_BASE_URL}/api/calendar/status`, { headers });
      return response.data && response.data.authenticated;
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
      if (!eventForm.summary || !eventForm.startDateTime || !eventForm.endDateTime) {
        alert('Please fill in all required fields (Summary, Start Time, End Time)');
        return;
      }

      // Check if Google Calendar is authenticated
      if (!isGoogleAuthenticated) {
        alert('Please authenticate with Google Calendar first');
        return;
      }

      // Convert datetime-local format to proper ISO string
      const startDateTime = eventForm.startDateTime ? new Date(eventForm.startDateTime).toISOString() : null;
      const endDateTime = eventForm.endDateTime ? new Date(eventForm.endDateTime).toISOString() : null;

      // Prepare event data to match the Google Calendar API format
      const eventData = {
        summary: eventForm.summary,
        description: eventForm.description || '',
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        eventPurpose: eventForm.eventPurpose,
        meetingType: eventForm.meetingType,
        requireMeeting: eventForm.requireMeeting
      };



      let result;
      if (editingEvent) {
        // Edit existing event - use dbId if available, otherwise googleEventId
        const eventId = editingEvent.dbId || editingEvent.googleEventId;

        if (!eventId) {
          alert('Cannot edit event: No valid ID found');
          return;
        }
        result = await editEvent(eventId, eventData);
        if (result && result.success) {
          alert('Event updated successfully!');
          closeEventForm();
          fetchEvents(); // Refresh events list
        } else {
          console.error('Event update failed:', result);
          const errorMsg = result?.message || result?.error || 'Unknown error occurred';
          alert(`Failed to update event: ${errorMsg}`);
        }
      } else {
        // Create new event
        result = await createEvent(eventData);
        if (result && result.success) {
          alert('Event created successfully!');
          closeEventForm();
          fetchEvents(); // Refresh events list
        } else {
          console.error('Event creation failed:', result);
          const errorMsg = result?.message || result?.error || 'Unknown error occurred';
          alert(`Failed to create event: ${errorMsg}`);
        }
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
          className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-600 mx-auto"
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
            relative h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center cursor-pointer transition-all duration-150 text-xs sm:text-sm font-medium rounded-lg mx-auto touch-manipulation
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
            <div className="absolute bottom-0.5 right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full"></div>
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
          className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-xs sm:text-sm text-gray-400 dark:text-gray-600 mx-auto"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const getEventsForSelectedDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(event => {
      if (!event.start) return false;
      const eventDate = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start.date;
      return eventDate === dateStr;
    });
  };

  const selectedDateEvents = getEventsForSelectedDate(selectedDate);

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-8 bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                  <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Google Calendar
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    View and manage your Google Calendar events
                  </p>
                </div>
              </div>

              {/* Google Calendar Authentication Status */}
              <div className="flex items-center justify-between sm:justify-end space-x-3">
                {authLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Checking...</span>
                  </div>
                ) : isGoogleAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Not Connected</span>
                    </div>
                    <button
                      onClick={initiateGoogleAuth}
                      className="px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                    >
                      Connect Google Calendar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Monthly Stats Section - Top */}
          <div className="mb-4 sm:mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  This Month Overview
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Total Events Card */}
                <div className="relative p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm">Total Events</span>
                      <div className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                        {events.filter(event => {
                          if (!event.start?.dateTime && !event.start?.date) return false;
                          const eventDate = new Date(event.start?.dateTime || event.start?.date);
                          return eventDate.getMonth() === currentDate.getMonth() &&
                            eventDate.getFullYear() === currentDate.getFullYear();
                        }).length}
                      </div>
                    </div>
                    <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                      <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Days with Events Card */}
                <div className="relative p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-green-700 dark:text-green-300 font-semibold text-xs sm:text-sm">Active Days</span>
                      <div className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                        {new Set(events.filter(event => {
                          if (!event.start?.dateTime && !event.start?.date) return false;
                          const eventDate = new Date(event.start?.dateTime || event.start?.date);
                          return eventDate.getMonth() === currentDate.getMonth() &&
                            eventDate.getFullYear() === currentDate.getFullYear();
                        }).map(event => {
                          const eventDate = event.start?.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start?.date;
                          return eventDate;
                        })).size}
                      </div>
                    </div>
                    <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="relative p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-700/50 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm">Month Progress</span>
                      <div className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                        {currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear() ?
                          `${Math.round((new Date().getDate() / getDaysInMonth(currentDate)) * 100)}%` :
                          '100%'
                        }
                      </div>
                    </div>
                    <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Compact Calendar */}
            <div className="lg:col-span-1 order-1 lg:order-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                {/* Compact Calendar Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  <button
                    onClick={openMonthYearPicker}
                    className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-2 py-1 rounded touch-manipulation"
                  >
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </button>

                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Compact Calendar Body */}
                <div className="p-3 sm:p-4">
                  {/* Days of week header - more compact */}
                  <div className="grid grid-cols-7 mb-2">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                      <div
                        key={day}
                        className="h-6 sm:h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Compact Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendarDays()}
                  </div>
                </div>

                {/* Add Event Button */}
                <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-slate-700">
                  {isGoogleAuthenticated ? (
                    <button
                      onClick={() => openEventForm()}
                      className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 sm:py-2 px-4 rounded-lg transition-colors touch-manipulation"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm sm:text-base">Add Event</span>
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-2">
                        Connect Google Calendar to add events
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="lg:col-span-1 order-2 lg:order-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-slate-700 h-[350px] sm:h-[400px] flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex-shrink-0">
                  Events for {selectedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                {/* Debug info - remove this after testing */}
                <div className="text-xs text-gray-500 mb-3 sm:mb-4 flex-shrink-0 hidden lg:block">
                  Debug: Total events: {events.length}, Selected date events: {selectedDateEvents.length}
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  {!isGoogleAuthenticated ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Connect Google Calendar to view events
                        </p>
                      </div>
                    </div>
                  ) : loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : selectedDateEvents.length > 0 ? (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2">
                      <div className="space-y-3 sm:space-y-4">
                        {selectedDateEvents.map((event, index) => (
                          <div
                            key={event.id || index}
                            className="relative p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-slate-700 dark:to-slate-600 border-l-4 border-orange-500 rounded-xl hover:shadow-lg transition-all duration-200 min-h-[120px] sm:min-h-[140px] flex-shrink-0"
                          >
                            <div className="flex flex-col space-y-3 sm:space-y-4">
                              {/* Event Title and Actions */}
                              <div className="flex items-start justify-between gap-2 sm:gap-4">
                                <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight flex-1 min-w-0">
                                  {event.summary || 'Untitled Event'}
                                </h4>
                                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleEditEvent(event)}
                                    className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors touch-manipulation"
                                    title="Edit Event"
                                  >
                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event)}
                                    disabled={deletingEvent === (event.dbId || event.googleEventId)}
                                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
                                    title="Delete Event"
                                  >
                                    {deletingEvent === (event.dbId || event.googleEventId) ? (
                                      <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Event Time */}
                              {event.start?.dateTime && (
                                <div className="flex items-center text-orange-700 dark:text-orange-300 font-medium">
                                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                                  <span className="text-sm sm:text-base flex-1">
                                    {formatTime(event.start.dateTime)}
                                    {event.end?.dateTime && ` - ${formatTime(event.end.dateTime)}`}
                                  </span>
                                </div>
                              )}

                              {/* Event Description */}
                              {event.description && (
                                <div>
                                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                                    {event.description}
                                  </p>
                                </div>
                              )}

                              {/* Google Meet Link */}
                              {(event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri) && (
                                <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                                        Google Meet
                                      </span>
                                    </div>
                                    <a
                                      href={event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-1 sm:px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors touch-manipulation"
                                    >
                                      Join
                                    </a>
                                  </div>
                                  <div className="mt-2 hidden sm:block">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 break-all">
                                      {event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Status Indicator */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    Active Event
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                          No events scheduled for this day
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Month/Year Picker Modal */}
          {showMonthYearPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Select Month & Year
                    </h3>
                    <button
                      onClick={() => setShowMonthYearPicker(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Month Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Month
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {months.map((month, index) => (
                          <button
                            key={month}
                            onClick={() => setTempDate(new Date(tempDate.getFullYear(), index, 1))}
                            className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${tempDate.getMonth() === index
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Year
                      </label>
                      <div className="grid grid-cols-4 gap-2 max-h-40 sm:max-h-48 overflow-y-auto">
                        {getYearRange().map((year) => (
                          <button
                            key={year}
                            onClick={() => setTempDate(new Date(year, tempDate.getMonth(), 1))}
                            className={`p-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${tempDate.getFullYear() === year
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
                        className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors touch-manipulation text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleMonthYearChange(tempDate.getMonth(), tempDate.getFullYear())}
                        className="flex-1 px-4 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors touch-manipulation text-sm sm:text-base"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </h3>
                    <button
                      onClick={closeEventForm}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitEvent} className="space-y-3 sm:space-y-4">
                    {/* Event Summary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Event Summary *
                      </label>
                      <input
                        type="text"
                        value={eventForm.summary}
                        onChange={(e) => handleEventFormChange('summary', e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                        placeholder="Enter event summary"
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
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                        placeholder="Enter event description"
                        rows="3"
                      />
                    </div>

                    {/* Event Purpose */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Event Purpose *
                      </label>
                      <select
                        value={eventForm.eventPurpose}
                        onChange={(e) => handleEventFormChange('eventPurpose', e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                        required
                      >
                        <option value="MEETING">Meeting</option>
                        <option value="TRAINING">Training</option>
                        <option value="WEBINAR">Webinar</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>


                    {/* Start Date & Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.startDateTime}
                        onChange={(e) => handleEventFormChange('startDateTime', e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                        required
                      />
                    </div>

                    {/* End Date & Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.endDateTime}
                        onChange={(e) => handleEventFormChange('endDateTime', e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                        required
                      />
                    </div>

                    {/* Meeting Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Type
                      </label>
                      <select
                        value={eventForm.meetingType}
                        onChange={(e) => handleEventFormChange('meetingType', e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm sm:text-base"
                      >
                        <option value="ONLINE">Online Meeting</option>
                        <option value="OFFLINE">In-Person Meeting</option>
                        <option value="HYBRID">Hybrid Meeting</option>
                      </select>
                    </div>

                    {/* Require Google Meet */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="requireMeeting"
                        checked={eventForm.requireMeeting}
                        onChange={(e) => handleEventFormChange('requireMeeting', e.target.checked)}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="requireMeeting" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Create Google Meet link
                      </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeEventForm}
                        className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors touch-manipulation text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center justify-center touch-manipulation text-sm sm:text-base"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            <span className="hidden sm:inline">Creating...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <span>{editingEvent ? 'Update Event' : 'Create Event'}</span>
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
