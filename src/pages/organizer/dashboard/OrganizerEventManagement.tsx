import React, { useEffect, useState } from "react";
import { Search, MoreVertical, Ticket, Tag } from "lucide-react";
import EventCreationModal from "../../../components/organizer/modal/EventCreationModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { getEventsByOrganizer } from "../../../redux/action/organizerActions";
import { IEvent } from "../../../interfaces/event";
import { MoonLoader } from "react-spinners";
import { Link } from "react-router-dom";

const OrganizerEventManagement: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(5);
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [eventState, setEventState] = useState<string | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getEventsByOrganizer()).unwrap();
      setEvents(response);
      applyFilters(response, page);
    } catch (err) {
      setError("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters(events, page);
  }, [page, isOnline, search, eventState]);

  const applyFilters = (eventsToFilter: IEvent[], currentPage: number) => {
    let filtered = eventsToFilter;

    if (search) {
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(search.toLowerCase()) ||
          event.eventState?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (isOnline !== undefined) {
      filtered = filtered.filter((event) => event.isOnline === isOnline);
    }

    if (eventState) {
      filtered = filtered.filter((event) => event.eventState === eventState);
    }

    const start = currentPage * size;
    const end = start + size;
    setFilteredEvents(filtered.slice(start, end));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
    applyFilters(events, 0);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "isOnline":
        setIsOnline(
          value === "online" ? true : value === "offline" ? false : undefined
        );
        break;
      case "eventState":
        setEventState(value);
        break;
    }
    setPage(0);
    applyFilters(events, 0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    applyFilters(events, newPage);
  };

  const totalPages = Math.ceil(events.length / size);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Events</h1>
        <div className="flex justify-between">
          <EventCreationModal />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by event name, status"
              className="w-full p-2 border border-blue-900 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={search}
              onChange={handleSearchChange}
            />

            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`${
                isOnline === undefined
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 border border-blue-900"
              } px-4 py-2 rounded flex-grow sm:flex-grow-0`}
              onClick={() => handleFilterChange("isOnline", "")}
            >
              All Events
            </button>
            <button
              className={`${
                isOnline === true
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 border border-blue-900"
              } px-4 py-2 rounded flex-grow sm:flex-grow-0`}
              onClick={() => handleFilterChange("isOnline", "online")}
            >
              Online Events
            </button>
            <button
              className={`${
                isOnline === false
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 border border-blue-900"
              } px-4 py-2 rounded flex-grow sm:flex-grow-0`}
              onClick={() => handleFilterChange("isOnline", "offline")}
            >
              Venue Events
            </button>
          </div>
        </div>
      </div>
      {error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center h-full mt-10 bg-gray-100">
          <MoonLoader color="#1E3A8A" loading={true} size={50} />
        </div>
      ) : null}
      {filteredEvents.length <= 0 && !loading && !error ? (
        <div
          className="bg-orange-100 border border-orange-300 text-orange-600 px-4 py-3 rounded relative"
          role="alert"
        >
          Events not found
        </div>
      ) : (
        filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
      <div className="flex justify-center mt-6">
        <button
          className={`px-4 py-2 mx-2 rounded ${
            page === 0
              ? "bg-slate-200 border border-blue-900"
              : "bg-blue-900 text-white"
          }`}
          disabled={page === 0}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-2 rounded ${
              page === index
                ? "bg-blue-900 text-white"
                : "bg-white text-blue-900 border border-blue-900"
            }`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`px-4 py-2 mx-2 rounded ${
            page >= totalPages - 1
              ? "bg-slate-200 border border-blue-900"
              : "bg-blue-900 text-white"
          }`}
          disabled={page >= totalPages - 1}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: IEvent }> = ({ event }) => (
  <div className="bg-white rounded-[5px] border border-blue-900 shadow p-3 mb-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center">
      <img
        src={event.imageUrl ?? ""}
        alt={`Event ${event.id} thumbnail`}
        className="w-full sm:w-16 h-16 object-cover rounded mb-4 sm:mb-0 sm:mr-4"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-2">
          {event.name ?? "Unnamed Event"}
        </h3>
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
          <div className="flex items-center">
            <span
              className={`mr-2 w-2 h-2 rounded-full ${
                event.eventState === "PUBLISH"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            ></span>
            <span>{event.eventState ?? "Unknown State"}</span>
          </div>
          <div className="flex items-center">
            <span>{event.isOnline ? "Online" : "Venue"}</span>
          </div>
          <div className="flex items-center">
            <Ticket className="mr-2" size={16} />
            <span>
              {event.totalTickets == 0 || null
                ? "complete event"
                : event.totalTickets}
            </span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-2" size={16} />
            <span>{event.category}</span>
          </div>
          <div className="flex items-center">
            <span>Approval Status : </span>
            <span className="ml-1">
            {event.approvalStatus == "null" ? "Make request" : event.approvalStatus || "Unknown status"}

            </span>
          </div>
        </div>
      </div>
      <div className="relative group">
        {event.eventFormStatus === "PENDING" ? (
          <Link
            to={
              event.isOnline
                ? `/organizer/online-event/details/${event.id}`
                : `/organizer/offline-event/details/${event.id}`
            }
            className="bg-blue-900 text-white px-4 py-2 rounded flex-grow sm:flex-grow-0"
          >
            Complete
          </Link>
        ) : (
          <>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-900 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link
                to={
                  event.isOnline
                    ? `/organizer/online-event/details/${event.id}`
                    : `/organizer/offline-event/details/${event.id}`
                }
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-200 rounded"
              >
                Edit
              </Link>
              <Link
              to={`/organizer/event/${event.id}`}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-200 rounded">
                Manage
              </Link>
            </div>
            <button className="p-2 mt-4 sm:mt-0">
              <MoreVertical size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

export default OrganizerEventManagement;
