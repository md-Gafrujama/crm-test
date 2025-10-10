import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../hooks/use-theme';
import { Header } from '../../common/Header';
import { Sidebar, useSidebar } from '../../common/sidebar';
import Footer from '../../common/Footer';

// Import components
import CalendarHeader from './components/CalendarHeader';
import MonthlyStats from './components/MonthlyStats';
import CalendarGrid from './components/CalendarGrid';
import EventsList from './components/EventsList';
import MonthYearPicker from './components/MonthYearPicker';
import EventForm from './components/EventForm';

// Import services and utilities
import { 
  checkGoogleAuthStatus, 
  fetchEvents, 
  createEvent, 
  editEvent, 
  deleteEvent, 
  testAuthentication 
} from './services/calendarApi';
import { 
  navigateMonth, 
  getEventsForSelectedDate 
} from './utils/calendarUtils';
import { handleAuthError } from './utils/authUtils';

const Calendar = () => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // State management
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

  // Check Google Calendar authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch events when authenticated or date changes
  useEffect(() => {
    if (isGoogleAuthenticated) {
      loadEvents();
    }
  }, [isGoogleAuthenticated, currentDate]);

  const checkAuthStatus = async () => {
    setAuthLoading(true);
    try {
      const result = await checkGoogleAuthStatus();
      setIsGoogleAuthenticated(result.authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsGoogleAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await fetchEvents();
      if (result.success) {
        setEvents(result.events);
      } else if (result.authenticated === false) {
        setIsGoogleAuthenticated(false);
      }
    } catch (error) {
      console.error('Error loading events:', error);
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
          loadEvents(); // Refresh events list
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
          loadEvents(); // Refresh events list
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
          loadEvents(); // Refresh events list
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

  const handleNavigateMonth = (direction) => {
    const newDate = navigateMonth(currentDate, direction);
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

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
  };

  const handleDateDoubleClick = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    openEventForm(newSelectedDate);
  };

  const selectedDateEvents = getEventsForSelectedDate(selectedDate, events);

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onCollapsedChange={handleSidebarCollapsedChange}>
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <CalendarHeader 
            isGoogleAuthenticated={isGoogleAuthenticated}
            authLoading={authLoading}
          />

          <MonthlyStats 
            events={events}
            currentDate={currentDate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <CalendarGrid 
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              isGoogleAuthenticated={isGoogleAuthenticated}
              onDateSelect={handleDateSelect}
              onDateDoubleClick={handleDateDoubleClick}
              onNavigateMonth={handleNavigateMonth}
              onOpenEventForm={openEventForm}
              onOpenMonthYearPicker={openMonthYearPicker}
            />

            <EventsList 
              selectedDate={selectedDate}
              events={selectedDateEvents}
              isGoogleAuthenticated={isGoogleAuthenticated}
              loading={loading}
              deletingEvent={deletingEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>

          <MonthYearPicker 
            showMonthYearPicker={showMonthYearPicker}
            tempDate={tempDate}
            onClose={() => setShowMonthYearPicker(false)}
            onTempDateChange={setTempDate}
            onApply={handleMonthYearChange}
          />

          <EventForm 
            showEventForm={showEventForm}
            editingEvent={editingEvent}
            eventForm={eventForm}
            submitting={submitting}
            onClose={closeEventForm}
            onFormChange={handleEventFormChange}
            onSubmit={handleSubmitEvent}
          />
        </div>
      </Sidebar>
      <Footer collapsed={sidebarCollapsed} />
    </>
  );
};

export default Calendar;
