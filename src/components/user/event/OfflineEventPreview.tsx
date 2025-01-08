import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Calendar, Heart, Share2 } from "lucide-react";
import {
  getOfflineEventData,
  getOrganizerShortInfo,
} from "../../../redux/action/userActions";
import {
  IOfflineEventData,
  IOfflineEventTicket,
} from "../../../interfaces/event";
import { AppDispatch } from "../../../redux/store";
import LocationPreviewComponent from "../LocationPreviewComponent";
import EventBookingButtonBase64 from "../EventBookingButtonBase64";
import { IOrganizerData } from "../../../interfaces/organizer";

const OfflineEventPreview: React.FC<{
  eventId: string;
  organizerId: number;
}> = ({ eventId, organizerId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [event, setEvent] = useState<IOfflineEventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOranizer, setLoadingOrganizer] = useState<boolean>(true);
  const [organizerError, setOrganizerError] = useState<boolean>(false);
  const [organizer, setOrganizer] = useState<IOrganizerData | null>(null);

  const fetchEventInfo = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getOfflineEventData({ id: eventId })
      ).unwrap();
      setEvent(response);
    } catch (err) {
      setError("An error occurred while fetching event details");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerInfo = async () => {
    try {
      setLoadingOrganizer(true);
      const response = await dispatch(
        getOrganizerShortInfo({ id: organizerId })
      ).unwrap();
      setOrganizer(response);
    } catch (err) {
      setOrganizerError(true);
    } finally {
      setLoadingOrganizer(false);
    }
  };

  useEffect(() => {
    fetchEventInfo();
    fetchOrganizerInfo();
  }, [eventId]);

  const formatTicketCategories = (ticket: IOfflineEventTicket) => {
    return ticket.categories.map((category) => (
      <div key={category.name} className="space-y-2">
        <p className="font-medium text-gray-900">{category.name}</p>
        <p className="text-sm">Price: ${category.price}</p>
        <p className="text-sm">Total Tickets: {category.totalTickets}</p>
        <p className="text-sm">
          {category.discountType} Discount: {category.discountValue}%
        </p>
        <p className="text-sm">{category.description}</p>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="mx-auto overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 w-full" />
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded-[5px] w-3/4" />
            <div className="h-4 bg-gray-200 rounded-[5px] w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-[5px] w-full" />
              <div className="h-4 bg-gray-200 rounded-[5px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4 bg-red-50 border border-red-200 rounded-[5px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto p-4 bg-gray-50 border border-gray-200 rounded-[5px]">
        <p className="text-gray-600">No event details available</p>
      </div>
    );
  }

  return (
    <div className="mx-auto overflow-hidden">
      <div className="relative">
        <img
          src={event.imageUrl || "/api/placeholder/800/400"}
          alt={event.name}
          className="w-full h-64 rounded-[5px] object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 border border-blue-900 text-sm font-medium rounded-full">
              {event.categoryName}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Starts From</p>
            <p className="text-2xl font-bold text-blue-900">
              {event.offlineEventTickets.categories.length > 0
                ? `$${Math.min(
                    ...event.offlineEventTickets.categories.map(
                      (category) => category.price
                    )
                  ).toFixed(2)}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-blue-100 rounded-[5px]">
              <Calendar className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Date & Time</p>
              <p className="text-sm">
                {event.timeSlots[0]?.date} at {event.timeSlots[0]?.startTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-blue-100 rounded-[5px]">
              <MapPin className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-sm">{event.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-blue-100 rounded-[5px]">
              <Users className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Capacity</p>
              <p className="text-sm">
                {event.offlineEventTickets?.totalTickets} seats available
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300" />

        {/* Description Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            About This Event
          </h2>
          <div className="prose prose-sm text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        </div>

        {/* Ticket Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Ticket Categories
          </h2>
          {event.offlineEventTickets &&
            formatTicketCategories(event.offlineEventTickets)}
        </div>

        <div className="border-t border-gray-300" />

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Location</h2>
          <LocationPreviewComponent
            latitude={event.lan}
            longitude={event.lon}
            address={event.address}
          />
        </div>

         <div className="border-t border-gray-300" />

        {/* Organizer Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Event Organizer
          </h2>
          {loadingOranizer ? (
            <div className="animate-pulse">
              <div className="bg-gray-200 h-64 w-full" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-[5px] overflow-hidden bg-gray-100">
                  <img
                    src={organizer?.imgUrl}
                    alt="Organizer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{organizer?.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{organizer?.totalFollowers} Followers</span>
                    <span>•</span>
                    <span>{organizer?.totalEvents} Events</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {organizerError && (
            <div className="mx-auto p-4 bg-red-50 border border-red-200 rounded-[5px]">
              <p className="text-red-600">
                Failed to load organizer information.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <EventBookingButtonBase64
            isOnline={false}
            isFree={false}
            eventId={eventId}
            organizerId={organizerId}
            content="Book Now"
          />
        </div>
      </div>
    </div>
  );
};

export default OfflineEventPreview;
