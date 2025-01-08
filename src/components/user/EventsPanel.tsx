import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
}

const EventsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('completed');

  // Mock event data categorized into all, completed, and online events
  const allEvents: Event[] = [
    { id: 1, title: 'Step Up Open Mic Show', date: 'Thu, Jun 30, 2022 4:30 AM', imageUrl: 'https://images.unsplash.com/photo-1523251343397-9225e4cb6319?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { id: 2, title: 'Comedy Night Extravaganza', date: 'Fri, Jul 1, 2022 7:00 PM', imageUrl: 'https://images.unsplash.com/photo-1523251343397-9225e4cb6319?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  ];

  const completedEvents: Event[] = [
    { id: 1, title: 'Step Up Open Mic Show', date: 'Thu, Jun 30, 2022 4:30 AM', imageUrl: 'https://images.unsplash.com/photo-1523251343397-9225e4cb6319?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  ];

  const onlineEvents: Event[] = [
    { id: 2, title: 'Comedy Night Extravaganza', date: 'Fri, Jul 1, 2022 7:00 PM', imageUrl: 'https://images.unsplash.com/photo-1523251343397-9225e4cb6319?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  ];

  // Function to get events based on active tab
  const getEvents = (): Event[] => {
    switch (activeTab) {
      case 'all':
        return allEvents;
      case 'completed':
        return completedEvents;
      case 'online':
        return onlineEvents;
      default:
        return [];
    }
  };

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
          Online Events
        </div>
      </div>

      {/* Event Listing */}
      {getEvents().map((event) => (
        <div
          key={event.id}
          className="flex items-center mb-3 p-3 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-16 h-16 rounded-lg object-cover mr-4"
          />
          <div>
            <h3 className="font-semibold text-blue-900">{event.title}</h3>
            <p className="text-xs text-gray-600">{event.date}</p>
          </div>
          <button className="ml-auto bg-blue-100 text-blue-900 py-1 px-3 rounded-full text-sm hover:bg-blue-200 transition-colors flex items-center">
            <Star size={14} className="mr-1" />
            Rate Event
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventsPanel;
