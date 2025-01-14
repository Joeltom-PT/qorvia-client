import { useEffect, useState } from "react";
import { ILiveEvent } from "../../../interfaces/event";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchLiveEvents } from "../../../redux/action/organizerActions";

const OrganizerLiveEvents = () => {
  const [liveEvents, setLiveEvents] = useState<ILiveEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchAllLiveEvents();
  }, []);

  const fetchAllLiveEvents = async () => {
    setLoading(true);
    try {
      const response = await dispatch(fetchLiveEvents()).unwrap();
      setLiveEvents(response);
    } catch (error: any) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-xl text-blue-900">Loading events...</p>;
  }

  if (error) {
    return <p className="text-xl text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl text-blue-900 mb-4">Organizer Live Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveEvents?.map((event) => (
          <div
            key={event.id}
            className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-blue-800">{event.name}</h2>
            <p className="text-gray-600">
              {new Date(event.startDateAndTime).toLocaleString()} -{" "}
              {new Date(event.endDateAndTime).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {event.isOnline  ? "Online" : "Venue"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerLiveEvents;
