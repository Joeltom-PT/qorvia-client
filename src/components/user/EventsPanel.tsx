import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { getAllRegisteredEvents } from '../../redux/action/userActions';
import { RegisteredEvent } from '../../interfaces/event';
import { Link } from 'react-router-dom';

const EventsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'online'>('all');
  const dispatch = useDispatch<AppDispatch>();
  const [events, setEvents] = useState<RegisteredEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getAllRegisteredEvents()).unwrap();
      const updatedEvents = response.map((event) => {
        const currentTime = new Date();
        const startTime = new Date(event.startDateAndTime);
        const endTime = new Date(event.endDateAndTime);

        return {
          ...event,
          isLive: currentTime >= startTime && currentTime <= endTime,
          isCompleted: currentTime > endTime,
        };
      });
      setEvents(updatedEvents);
    } catch (error) {
      toast.error('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = (): RegisteredEvent[] => {
    switch (activeTab) {
      case 'completed':
        return events.filter((event) => event.isCompleted);
      case 'online':
        return events.filter((event) => event.isOnline && !event.isCompleted);
      case 'all':
      default:
        return events;
    }
  };

  const renderButton = (event: RegisteredEvent) => {
    if (event.isOnline && !event.isCompleted && event.isLive) {
      return (
        <Link to={`/live/${event.id}`} className="ml-auto bg-blue-900 text-white py-1 px-3 rounded-full text-sm hover:bg-blue-950 transition-colors">
          Join Live
        </Link>
      );
    }
    if (!event.isCompleted && !event.isLive) {
      return null; 
    }
    if (event.isCompleted) {
      return (
        <button className="ml-auto bg-gray-100 text-gray-900 py-1 px-3 rounded-full text-sm hover:bg-gray-200 transition-colors flex items-center">
          <Star size={14} className="mr-1" />
          Rate Event
        </button>
      );
    }
    return null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white border border-blue-900 rounded-[5px] shadow-md p-4 w-full md:w-2/3">
      <div className="flex justify-between mb-4 text-sm font-bold">
        <div
          className={`cursor-pointer ${activeTab === 'all' ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'} px-3 py-1 w-full text-center border-blue-900 border ml-1 rounded-[2px]`}
          onClick={() => setActiveTab('all')}
        >
          All Events
        </div>
        <div
          className={`cursor-pointer ${activeTab === 'completed' ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'} px-3 py-1 w-full text-center border-blue-900 border mx-1 rounded-[2px]`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Events
        </div>
        <div
          className={`cursor-pointer ${activeTab === 'online' ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'} px-3 py-1 w-full text-center border-blue-900 border mr-1 rounded-[2px]`}
          onClick={() => setActiveTab('online')}
        >
          Live Now
        </div>
      </div>

      {getFilteredEvents().map((event) => (
        <div
          key={event.id}
          className="flex items-center mb-3 p-3 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-16 h-16 rounded-lg object-cover mr-4"
          />
          <div>
            <h3 className="font-semibold text-blue-900">{event.name}</h3>
            <p className="text-xs text-gray-600">
              {new Date(event.startDateAndTime).toLocaleString()} - {new Date(event.endDateAndTime).toLocaleString()}
            </p>
          </div>
          {renderButton(event)}
        </div>
      ))}
    </div>
  );
};

export default EventsPanel;
