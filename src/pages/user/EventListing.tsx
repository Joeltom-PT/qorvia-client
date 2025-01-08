import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchEvents } from "../../redux/action/userActions";
import { Link, useNavigate } from "react-router-dom";

import { CalendarDays, MapPin, Monitor } from "lucide-react";
import EventHeader from "../../components/user/EventHeader";
import EventButtonBase64 from "../../components/user/EventButtonBase64";

const EventListing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [events, setEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(8);
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
    <>
      <EventHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="relative h-[300px] bg-cover bg-center bg-[url('/user/bg/event-explore-search-bg.png')]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/60 to-blue-900/95">
            <div className="h-full flex flex-col justify-center items-center px-4">
              <div className="w-full max-w-5xl backdrop-blur-xl bg-white/30 rounded-[2px] shadow-md p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="1">Movies</option>
                    <option value="2">Music</option>
                  </select>
                  <select
                    name="isOnline"
                    value={filters.isOnline}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                  >
                    <option value="">All Events</option>
                    <option value="true">Online</option>
                    <option value="false">Venue</option>
                  </select>
                  <select
                    name="organizerId"
                    value={filters.organizerId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                  >
                    <option value="">All Organizations</option>
                    <option value="1">Google</option>
                    <option value="2">Apple</option>
                  </select>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search events"
                    className=" w-3/4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-[5px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
                  />
                   <button
                    onClick={handleApplyFilters}
                    className=" w-1/4 px-6 py-2 bg-blue-900 hover:bg-blue-950 text-white font-semibold rounded-r-[5px] transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                  >
                    Search Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-xl text-gray-600">Loading events...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-xl text-red-600">Error: {error}</div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-xl text-gray-600">No events found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.eventId}
                  className="rounded-[5px] backdrop-blur-sm border border-gray-300 overflow-hidden"
                >
                  <div className="sm:flex">
                    <div className="sm:w-48 md:w-56 lg:w-64 relative">
                      <img
                        src={event.imgUrl}
                        alt={event.eventName}
                        className="h-48 sm:h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-800 text-white`}
                        >
                          {event.isOnline ? (
                            <Monitor className="w-3 h-3 mr-1" />
                          ) : (
                            <MapPin className="w-3 h-3 mr-1" />
                          )}
                          {event.isOnline ? "Online" : "Venue"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-4 md:p-6 flex-1">
                      <div className="flex flex-col h-full">
                        <div className="mb-auto">

                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {event.eventName}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-[5px] text-sm font-medium">
                              {event.eventCategory}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-4">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            <time className="text-sm">
                              {event.startDateAndTime}
                            </time>
                          </div>
                        </div>

                        <div className="mt-4">
                          <EventButtonBase64 eventId={event.eventId} organizerId={event.organizerId} isOnline={event.isOnline} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                      currentPage === i
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventListing;
