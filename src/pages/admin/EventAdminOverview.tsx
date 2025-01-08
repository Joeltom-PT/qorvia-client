import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import {
  EventDto,
  EventTimeSlotDto,
  OnlineEventTicketDto,
  OfflineEventTicketsDto,
} from "../../interfaces/admin";
import DOMPurify from "dompurify";
import {
  eventAcceptAndReject,
  eventBlockAndUnBlock,
  getEventDetails,
} from "../../redux/action/adminActions";
import { CalendarDays, MapPin, Globe, Users } from "lucide-react";
import { toast } from "react-toastify";

const EventAdminOverview = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [activeTab, setActiveTab] = useState<
    "schedule" | "tickets" | "settings"
  >("schedule");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
      if(event?.approvalStatus == 'REJECTED'){
        navigate("/admin/event-management", {replace : true})
      }
    }
  }, [id, event?.approvalStatus , event?.isBlocked]);

  const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await dispatch(
        getEventDetails({ id: eventId })
      ).unwrap();
      setEvent(response);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  const formatDateTime = (date?: string, time?: string): string => {
    if (!date || !time) return "Not specified";
    return `${date} ${time}`;
  };

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading event details...</div>
      </div>
    );
  }

  const handleEventBlockAndUnBlock = async () => {
    try {
      if (id) {
        await dispatch(eventBlockAndUnBlock({ id })).unwrap();
        fetchEventDetails(id);
        toast.info("Success event status change");
      }
    } catch (error) {
      toast.error("Error changing the event status. Please try again!");
    }
  };

  const handleEventAcceptAndReject = async ({ status }: { status: string }) => {
    try {
      if (id) {
        await dispatch(eventAcceptAndReject({ id, status })).unwrap();
        toast.success("Event status changed successfully");
        fetchEventDetails(id);
      } else {
        toast.error("Event ID is missing");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message || "Error changing the event status. Please try again!"
        );
      } else {
        toast.error("An unknown error occurred. Please try again!");
      }
    }
  };

  const sanitizedDescription = DOMPurify.sanitize(event.description || "");

  return (
    <>
      <input type="checkbox" id="event-block-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>
          <div className="modal-action">
            <label
              htmlFor="event-block-modal"
              className="bg-blue-900 p-2 text-white rounded-[5px]"
            >
              Close!
            </label>
            <label
              htmlFor="event-block-modal"
              onClick={handleEventBlockAndUnBlock}
              className={`${
                event.isBlocked ? "bg-blue-900" : "bg-red-700"
              } text-white py-2 px-4 rounded`}
            >
              {event.isBlocked ? "Unblock Event" : "Block Event"}
            </label>
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        id="event-accept-and-reject-modal"
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>
          <div className="modal-action flex justify-between">
            <span>
            <label
              htmlFor="event-accept-and-reject-modal"
              onClick={() => handleEventAcceptAndReject({ status: "ACCEPTED" })}
              className="bg-blue-900 p-2 text-white rounded-[5px]"
            >
              Accept
            </label>
            <label
              htmlFor="event-accept-and-reject-modal"
              onClick={() => handleEventAcceptAndReject({ status: "REJECTED" })}
              className="bg-red-500 p-2 text-white rounded-[5px] ml-2"
            >
              Reject
            </label>
            </span>
            <span>
            <label
              htmlFor="event-accept-and-reject-modal"
              className="bg-gray-400 shadow-md p-2 text-white rounded-[5px] ml-2"
            >
              Close
            </label>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 bg-gray-50">
        {/* Header Section */}
        <div className="relative">
          <img
            src={event.imageUrl || "/api/placeholder/800/400"}
            alt={event.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <div className="absolute top-4 right-4 space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.isOnline
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {event.isOnline ? "Online" : "Offline"}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
              {event.eventType}
            </span>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <Globe className="h-4 w-4" />
            <span>Event ID: {event.id}</span>
          </div>
          <div
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

          {!event.isOnline && event.address && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{event.address}</span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {event.eventState && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Status: {event.eventState}
              </span>
            )}
            {event.approvalStatus && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Approval: {event.approvalStatus}
              </span>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {["schedule", "tickets", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 px-1 relative font-medium text-sm focus:outline-none
                ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Time Slots</h2>
              {event.timeSlots?.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <CalendarDays className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{slot.date}</div>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(slot.startTime, slot.endTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {slot.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Ticket Information</h2>
              {event.isOnline ? (
                <div className="space-y-4">
                  {event.onlineEventTicket && (
                    <>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">
                          Total Online Tickets:
                        </span>
                        <span>{event.onlineEventTicket.totalTickets}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">Price:</span>
                        <span>
                          {event.onlineEventTicket.isFreeEvent
                            ? "Free"
                            : `$${event.onlineEventTicket.price}`}
                        </span>
                      </div>
                      {event.onlineEventTicket.hasEarlyBirdDiscount && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium">
                            Early Bird Discount:
                          </span>
                          <span>
                            {event.onlineEventTicket.discountValue}% off
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {event.offlineEventTickets?.categories?.map(
                    (category, index) => (
                      <div
                        key={index}
                        className="border p-4 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-lg mb-2">
                          {category.name}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm px-2">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium">
                              ${category.price}
                            </span>
                          </div>
                          <hr className="border border-slate-200" />
                          <div className="flex justify-between text-sm px-2">
                            <span className="text-gray-600">
                              Available Tickets With Specific Category:
                            </span>
                            <span className="font-medium">
                              {category.totalTickets}
                            </span>
                          </div>
                          <hr className="border border-slate-200" />
                          <div className="flex justify-between text-sm px-2">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-medium text-green-600">
                              {category.discountValue}% off
                            </span>
                          </div>
                          <hr className="border border-slate-200" />
                          <p className="text-sm text-gray-600 mt-2 px-2">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Event Settings</h2>
              {event.isOnline && event.eventSettingDto && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Booking Period</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start:</span>
                          <span>
                            {formatDateTime(
                              event.eventSettingDto.bookingStartDate,
                              event.eventSettingDto.bookingStartTime
                            )}
                          </span>
                        </div>
                        {!event.eventSettingDto.continueUntilEvent && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">End:</span>
                            <span>
                              {formatDateTime(
                                event.eventSettingDto.bookingEndDate,
                                event.eventSettingDto.bookingEndTime
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Refund Policy</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Refunds:</span>
                          <span>
                            {event.eventSettingDto.disableRefunds
                              ? "Disabled"
                              : "Enabled"}
                          </span>
                        </div>
                        {!event.eventSettingDto.disableRefunds && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Refund Percentage:
                            </span>
                            <span>
                              {event.eventSettingDto.refundPercentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {event.eventSettingDto.refundPolicy && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">
                        Refund Policy Details
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.eventSettingDto.refundPolicy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium mb-3">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Created At:</p>
                    <p className="font-medium">{event.createdAt}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Last Updated:</p>
                    <p className="font-medium">{event.updatedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Administrative Options</h2>

          {event.approvalStatus == "ACCEPTED" && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                {event.isBlocked
                  ? "Unblock this event to restore access, allowing users to view and interact with it."
                  : "Block this event to restrict access, preventing users from viewing or interacting with it."}
              </p>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="event-block-modal"
                  className={`${
                    event.isBlocked ? "bg-blue-900" : "bg-red-700"
                  } text-white py-2 px-6 rounded-[5px] cursor-pointer transition duration-300 hover:bg-opacity-80`}
                >
                  {event.isBlocked ? "Unblock Event" : "Block Event"}
                </label>
              </div>
            </div>
          )}

          {event.approvalStatus == "PENDING" && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                "Accept or reject this event. Approve it to make it available
                for users to view and participate in, or disapprove it to
                prevent it from being published."
              </p>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="event-accept-and-reject-modal"
                  className="bg-blue-900 text-white py-2 px-6 rounded-[5px] cursor-pointer transition duration-300 hover:bg-opacity-80"
                >
                  Accept OR Reject Event
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventAdminOverview;
