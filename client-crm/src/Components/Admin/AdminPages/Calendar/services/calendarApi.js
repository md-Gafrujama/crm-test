// Calendar API service functions
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config/api';
import { getAuthHeaders, handleAuthError } from '../utils/authUtils';

export const checkGoogleAuthStatus = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/api/calendar/status`, { headers });

    if (response.data && response.data.authenticated) {
      return { authenticated: true };
    } else {
      return { authenticated: false };
    }
  } catch (error) {
    console.error('Error checking Google auth status:', error);
    if (error.response?.status === 401) {
      handleAuthError();
    }
    return { authenticated: false, error };
  }
};

export const initiateGoogleAuth = async () => {
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

export const fetchEvents = async () => {
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

      return { success: true, events };
    } else {
      return { success: true, events: [] };
    }
  } catch (error) {
    console.error('Fetch Google Calendar events error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    if (error.response?.status === 401) {
      return { success: false, authenticated: false };
    }
    return { success: false, events: [], error };
  }
};

export const createEvent = async (eventData) => {
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

export const editEvent = async (eventId, eventData) => {
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

export const deleteEvent = async (eventId) => {
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

export const testAuthentication = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/api/calendar/status`, { headers });
    return response.data && response.data.authenticated;
  } catch (error) {
    return false;
  }
};
