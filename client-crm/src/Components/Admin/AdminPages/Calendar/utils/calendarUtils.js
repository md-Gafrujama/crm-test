// Calendar utility functions

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const getCurrentYear = () => new Date().getFullYear();

export const getYearRange = () => {
  const currentYear = getCurrentYear();
  const years = [];
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
};

export const isToday = (day, currentDate) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

export const isSelected = (day, currentDate, selectedDate) => {
  return (
    day === selectedDate.getDate() &&
    currentDate.getMonth() === selectedDate.getMonth() &&
    currentDate.getFullYear() === selectedDate.getFullYear()
  );
};

export const hasEvents = (day, currentDate, events) => {
  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return events.some(event => {
    if (!event.start) return false;
    const eventDate = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start.date;
    return eventDate === dateStr;
  });
};

export const getEventsForDate = (day, currentDate, events) => {
  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return events.filter(event => {
    if (!event.start) return false;
    const eventDate = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start.date;
    return eventDate === dateStr;
  });
};

export const getEventsForSelectedDate = (date, events) => {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return events.filter(event => {
    if (!event.start) return false;
    const eventDate = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : event.start.date;
    return eventDate === dateStr;
  });
};

export const formatTime = (dateTimeStr) => {
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

export const navigateMonth = (currentDate, direction) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + direction);
  return newDate;
};
