import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { getAllApprovedEvents } from '../../redux/action/adminActions';
import { GetAllApprovedEventsResponse } from '../../interfaces/admin';
import { Calendar, MapPin, Globe, Clock } from 'lucide-react';

interface FilterEventsProps {
  categories: string[];
  onFilterChange: (filters: {
    search: string;
    eventState: string | null;
    isOnline: boolean | null;
    categoryId: string | null;
    page: number;
    size: number;
  }) => void;
}

const FilterEvents: React.FC<FilterEventsProps> = ({ categories, onFilterChange }) => {
  const [search, setSearch] = useState<string>('');
  const [eventState, setEventState] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  const handleApplyFilters = () => {
    onFilterChange({
      search,
      eventState,
      isOnline,
      categoryId,
      page,
      size,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <select
          value={categoryId || ''}
          onChange={(e) => setCategoryId(e.target.value || null)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={eventState || ''}
          onChange={(e) => setEventState(e.target.value || null)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">All States</option>
          <option value="PUBLISH">Published</option>
          <option value="DRAFT">Draft</option>
        </select>

        <select
          value={isOnline === null ? 'all' : isOnline ? 'online' : 'offline'}
          onChange={(e) => setIsOnline(e.target.value === 'all' ? null : e.target.value === 'online')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Events</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const ApprovedEventManagement: React.FC = () => {
  const [eventResponse, setEventResponse] = useState<GetAllApprovedEventsResponse | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    eventState: null,
    isOnline: null,
    categoryId: null,
    page: 0,
    size: 10,
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const categories = ['Movies', 'Music', 'Sports'];

  const fetchEvents = async () => {
    try {
      const response = await dispatch(getAllApprovedEvents(filters)).unwrap();
      setEventResponse(response);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: newPage,
    }));
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        </div>
        <div className="p-6">
          <FilterEvents categories={categories} onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="space-y-6">
        {eventResponse ? (
          <>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {eventResponse.events.length} of {eventResponse.totalElements} events
              </div>
              <div className="text-sm text-gray-600">
                Page {eventResponse.pageNumber + 1} of {eventResponse.totalPages}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventResponse.events.map((event) => (
                <div key={event.eventId} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{event.eventName}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(event.startDateAndTime).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(event.startDateAndTime).toLocaleTimeString()} - 
                          {new Date(event.endDateAndTime).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        {event.isOnline ? (
                          <Globe className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {event.isOnline ? 'Online Event' : 'In-Person Event'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {event.eventCategory}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.eventState === 'PUBLISH' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.eventState}
                        </span>
                      </div>

                      <button 
                        onClick={() => navigate(`/admin/event/${event.eventId}`)}
                        className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(eventResponse.pageNumber - 1)}
                disabled={eventResponse.pageNumber <= 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(eventResponse.pageNumber + 1)}
                disabled={eventResponse.pageNumber + 1 >= eventResponse.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center items-center">
            <p className="text-gray-500">Loading events...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedEventManagement;