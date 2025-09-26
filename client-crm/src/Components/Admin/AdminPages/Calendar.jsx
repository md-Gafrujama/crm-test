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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch events when date changes
  useEffect(() => {
    if (authStatus?.authenticated) {
      fetchEvents();
    }
  }, [currentDate, authStatus]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/calendar/status`);
      setAuthStatus(response.data);
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Set a default state if API is not available
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
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: ''
    });
  };

  const openEventForm = (date = null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      setEventForm(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr
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
      const response = await axios.post(`${API_BASE_URL}/api/calendar/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!eventForm.summary || !eventForm.startDate || !eventForm.startTime) {
        alert('Please fill in all required fields (Title, Start Date, Start Time)');
        return;
      }

      // Prepare event data
      const startDateTime = `${eventForm.startDate}T${eventForm.startTime}:00`;
      const endDateTime = eventForm.endDate && eventForm.endTime 
        ? `${eventForm.endDate}T${eventForm.endTime}:00`
        : `${eventForm.startDate}T${eventForm.startTime}:00`;

      const eventData = {
        summary: eventForm.summary,
        description: eventForm.description,
        start: {
          dateTime: startDateTime,
          timeZone: 'UTC'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'UTC'
        }
      };

      if (eventForm.location) {
        eventData.location = eventForm.location;
      }

      const result = await createEvent(eventData);
      
      if (result.success) {
        alert('Event created successfully!');
        closeEventForm();
        fetchEvents(); // Refresh events list
      } else {
        alert('Failed to create event. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Error creating event. Please try again.');
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

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 md:h-12"></div>
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
            relative h-14 flex items-center justify-center cursor-pointer rounded-2xl transition-all duration-300 text-base font-medium transform hover:scale-105
            ${isToday(day) 
              ? 'bg-orange-500 text-white shadow-lg' 
              : isSelected(day)
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 shadow-md'
              : 'hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
            }
            ${hasEvents(day) ? 'ring-2 ring-blue-400 ring-opacity-30' : ''}
          `}
        >
          {day}
          {hasEvents(day) && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForDate(selectedDate.getDate());

  if (!authStatus) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
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

      {!authStatus.authenticated ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
          <CalendarIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Google Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            To view your events and schedule, please authenticate with Google Calendar.
          </p>
          <button
            onClick={handleAuthenticate}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Connect Google Calendar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openEventForm()}
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Event</span>
                  </button>
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="h-12 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
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
                    {new Set(events.map(event => 
                      event.start?.date || event.start?.dateTime?.split('T')[0]
                    )).size}
                  </span>
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
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventForm.summary}
                    onChange={(e) => handleEventFormChange('summary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter event title"
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

                {/* Start Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={eventForm.startDate}
                      onChange={(e) => handleEventFormChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => handleEventFormChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* End Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={eventForm.endDate}
                      onChange={(e) => handleEventFormChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => handleEventFormChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => handleEventFormChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter event location"
                  />
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
      <Footer />
    </>
  );
};

export default Calendar;
