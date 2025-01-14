import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchEvents } from "../../redux/action/userActions";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  InboxIcon, 
  MapPin, 
  Monitor, 
  XCircle 
} from "lucide-react";

const EventListing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [events, setEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    isOnline: "",
    categoryId: "",
    organizerId: "",
    date: "",
  });

  useEffect(() => {
    fetchEventsData(0);
  }, []);

  const encodeBase64 = (data: object) =>
    btoa(JSON.stringify(data))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  const fetchEventsData = async (page: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        size: pageSize,
        search: filters.search,
        isOnline:
          filters.isOnline === "true"
            ? true
            : filters.isOnline === "false"
            ? false
            : undefined,
        categoryId: filters.categoryId,
        organizerId: filters.organizerId,
        date: filters.date,
      };

      const result = await dispatch(fetchEvents(params)).unwrap();

      setEvents(result.events);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setCurrentPage(page);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked ? "true" : "",
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchEventsData(newPage);
    }
  };

  const handleApplyFilters = () => {
    fetchEventsData(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-200 to-slate-50">
      <header className="pt-8 pb-7 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-700">
  Explore & Book Events Tailored for You
</h1>
<p className="font-body text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-blue-800">
  Experience every event as a unique journey, whether it's a physical gathering or a virtual celebration—our platform is designed to make each moment special.
</p>
            </div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative group">
              <input
  type="text"
  name="search"
  value={filters.search}
  onChange={handleFilterChange}
  placeholder="Search for events..."
  className="font-body w-full px-6 py-4 rounded-full border border-blue-200 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-blue-900"
/>
                <button
                  onClick={handleApplyFilters}
                  className="absolute top-1/2 right-2 rounded-full -translate-y-1/2 px-6 py-2 bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-300"
                >
                  Search
                </button>
              </div>
            </motion.div>

            <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.5 }}
  className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-2xl mx-auto"
>
  <div className="relative w-full md:w-1/4 group">
    <select
      name="categoryId"
      value={filters.categoryId}
      onChange={handleFilterChange}
      className="font-body w-full px-3 py-2 appearance-none bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-blue-900 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300 cursor-pointer hover:bg-white"    >
      <option value="">All Categories</option>
      <option value="1">Movies</option>
      <option value="2">Music</option>
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
      <ChevronDown className="w-4 h-4" />
    </div>
  </div>

  <div className="relative w-full md:w-1/4 group">
    <select
      name="isOnline"
      value={filters.isOnline}
      onChange={handleFilterChange}
      className="font-body w-full px-3 py-2 appearance-none bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-blue-900 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300 cursor-pointer hover:bg-white"    >
      <option value="">All Events</option>
      <option value="true">Online</option>
      <option value="false">Venue</option>
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
      <ChevronDown className="w-4 h-4" />
    </div>
  </div>

  <div className="relative w-full md:w-1/4 group">
    <select
      name="organizerId"
      value={filters.organizerId}
      onChange={handleFilterChange}
      className="font-body w-full px-3 py-2 appearance-none bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-blue-900 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300 cursor-pointer hover:bg-white"    >
      <option value="">All Organizations</option>
      <option value="1">Google</option>
      <option value="2">Apple</option>
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
      <ChevronDown className="w-4 h-4" />
    </div>
  </div>

  <div className="relative w-full md:w-1/4 group">
    <input
      type="date"
      name="date"
      value={filters.date}
      onChange={handleFilterChange}
      className="font-body w-full px-3 py-2 appearance-none bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-blue-900 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300 cursor-pointer hover:bg-white"    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
      {/* <CalendarDays className="w-4 h-4" /> */}
    </div>
  </div>
</motion.div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            Loading...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            No events found
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-3"
          >
            {events.map((event) => (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  navigate(`/event/${encodeBase64({ 
                    eventId: event.eventId, 
                    organizerId: event.organizerId, 
                    isOnline: event.isOnline 
                  })}`);
                }}
                className="cursor-pointer relative rounded-[8px] overflow-hidden hover:shadow-sm transition-all duration-200"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={event.imgUrl}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 transition-opacity">
                    <div className="text-white space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-white/20 rounded-[4px] text-xs">
                          {event.isOnline ? (
                            <span className="flex items-center">
                              <Monitor className="w-3 h-3 mr-1" />
                              Online
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              Venue
                            </span>
                          )}
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded-[4px] text-xs">
                          {event.eventCategory}
                        </span>
                      </div>
                      
                      <h3 className="font-heading font-semibold line-clamp-2">
                        {event.eventName}
                      </h3>
                      
                      <div className="flex items-center text-xs">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <time>{event.startDateAndTime}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center mt-8 mb-16 gap-2"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="font-body px-3 py-1 bg-white border border-gray-200 rounded-[4px] text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`font-body w-8 h-8 flex items-center justify-center rounded-[4px] text-sm transition-all duration-200 ${
                  currentPage === i
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-50 bg-white border border-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="font-body px-3 py-1 bg-white border border-gray-200 rounded-[4px] text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 text-gray-700"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default EventListing;