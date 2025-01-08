import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles/CalendarCustomStyles.css'; 
import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  url: string;
}

const IST_TIMEZONE = 'Asia/Kolkata';

const mockData: Event[] = [
  {
    id: 1,
    title: 'Event 1: 10 AM to 2 PM',
    start: toZonedTime(new Date(Date.UTC(2025, 0, 1, 4, 30)), IST_TIMEZONE), // January 1, 2025, 10:00 AM IST
    end: toZonedTime(new Date(Date.UTC(2025, 0, 1, 7, 30)), IST_TIMEZONE),   // January 1, 2025, 2:00 PM IST
    url: '/event/1',
  },
  {
    id: 2,
    title: 'Event 2: 11 AM to 2 PM',
    start: toZonedTime(new Date(Date.UTC(2025, 0, 1, 5, 30)), IST_TIMEZONE), // January 1, 2025, 11:00 AM IST
    end: toZonedTime(new Date(Date.UTC(2025, 0, 1, 7, 30)), IST_TIMEZONE),   // January 1, 2025, 2:00 PM IST
    url: '/event/2',
  },
  {
    id: 3,
    title: 'Event 3: 10 AM to 2 PM',
    start: toZonedTime(new Date(Date.UTC(2025, 0, 1, 4, 30)), IST_TIMEZONE), // January 1, 2025, 10:00 AM IST
    end: toZonedTime(new Date(Date.UTC(2025, 0, 1, 7, 30)), IST_TIMEZONE),   // January 1, 2025, 2:00 PM IST
    url: '/event/3',
  },
  {
    id: 4,
    title: 'Event 4: 10 AM to 2 PM',
    start: toZonedTime(new Date(Date.UTC(2025, 0, 1, 4, 30)), IST_TIMEZONE), // January 1, 2025, 10:00 AM IST
    end: toZonedTime(new Date(Date.UTC(2025, 0, 1, 7, 30)), IST_TIMEZONE),   // January 1, 2025, 2:00 PM IST
    url: '/event/4',
  },
  {
    id: 5,
    title: 'Event 5: 10 AM to 2 PM',
    start: toZonedTime(new Date(Date.UTC(2025, 0, 1, 4, 30)), IST_TIMEZONE), // January 1, 2025, 10:00 AM IST
    end: toZonedTime(new Date(Date.UTC(2025, 0, 1, 7, 30)), IST_TIMEZONE),   // January 1, 2025, 2:00 PM IST
    url: '/event/5',
  },
  {
    id: 6,
    title: 'Event 6: 10 AM to 2 PM',
    start: toZonedTime(new Date(Date.UTC(2025, 0, 1, 4, 30)), IST_TIMEZONE), // January 1, 2025, 10:00 AM IST
    end: toZonedTime(new Date(Date.UTC(2025, 0, 1, 7, 30)), IST_TIMEZONE),   // January 1, 2025, 2:00 PM IST
    url: '/event/6',
  },
];

const UserCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate API call to fetch events
    setTimeout(() => {
      setEvents(mockData);
    }, 1000);
  }, []);

  const handleSelectEvent = (event: Event) => {
    window.location.href = event.url;
  };

  const eventStyleGetter = (event: Event) => {
    // Custom style for events (overlapping events with different colors)
    const backgroundColor = event.id % 2 === 0 ? '#4C9BFF' : '#5A67D8'; // Example of alternating colors
    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'white',
      border: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      padding: '0.5rem',
    };
    return {
      style,
    };
  };

  return (
    <div className="bg-white border border-blue-900 rounded-md shadow-md p-4 w-full md:w-2/3">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ width: '100%' }}
        onSelectEvent={handleSelectEvent}
        defaultView="week"
        views={['month', 'week', 'day']}
        eventPropGetter={eventStyleGetter} // Apply custom styles to events
      />
    </div>
  );
};

export default UserCalendar;
