import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";
import { GoOrganization } from "react-icons/go";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  deleteEventByOrganizer,
  getSpecificEventById,
  requestAdminApprovalForEvent,
  withdrawEventApprovalRequest,
} from "../../../../redux/action/organizerActions";
import { IEvent } from "../../../../interfaces/event";
import { toast } from "react-toastify";
import { string } from "yup";
import CollaborationRequestModal from "../../../../components/organizer/modal/CollaborationRequestModal";
import EventRegisteredUsersList from "../../../../components/organizer/event/EventRegisteredUsersList";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`} />
);

const ApprovalRequestModal = ({
  isOpen,
  onClose,
  id,
  fetchEvent,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
  fetchEvent: () => void;
}) => {
  if (!isOpen) return null;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const approvalRequest = async () => {
    try {
      if (!id) {
        toast.error("Event ID is missing. Please try again!");
        return;
      }
      setLoading(true);
      await dispatch(requestAdminApprovalForEvent({ id })).unwrap();
      setTimeout(() => {
        fetchEvent();
      }, 300);
      onClose();
    } catch (err) {
      toast.error("Error requesting event approval. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-[5px] shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Request Admin Approval
        </h2>
        <p className="text-gray-700 mb-4">
          You are about to send a request to the admin for approval of this
          event. Please make sure all details are correct before submitting.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-[5px]"
          >
            Close
          </button>
          <button
            onClick={() => {
              approvalRequest();
            }}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-[5px]"
          >
            {loading ? "Requesting Approval" : "Request Approval"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrganizerSkeleton = () => {
  return (
    <>
      <div className="bg-white rounded-xl border border-blue-900 shadow-sm overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2 relative">
            <Skeleton className="w-full h-64 lg:h-full" />
            <Skeleton className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium" />
          </div>

          <div className="lg:w-1/2 p-6 lg:p-8">
            <Skeleton className="w-1/2 h-8 bg-gray-300 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                <Skeleton className="w-10 h-10 bg-blue-100 rounded-full" />
                <div>
                  <Skeleton className="w-16 h-4 bg-gray-200" />
                  <Skeleton className="w-24 h-6 bg-gray-200 mt-2" />
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                <Skeleton className="w-10 h-10 bg-green-100 rounded-full" />
                <div>
                  <Skeleton className="w-16 h-4 bg-gray-200" />
                  <Skeleton className="w-24 h-6 bg-gray-200 mt-2" />
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                <Skeleton className="w-10 h-10 bg-purple-100 rounded-full" />
                <div>
                  <Skeleton className="w-16 h-4 bg-gray-200" />
                  <Skeleton className="w-24 h-6 bg-gray-200 mt-2" />
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                <Skeleton className="w-10 h-10 bg-orange-100 rounded-full" />
                <div>
                  <Skeleton className="w-16 h-4 bg-gray-200" />
                  <Skeleton className="w-24 h-6 bg-gray-200 mt-2" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="w-5 h-5 bg-gray-300 rounded-full" />
                <Skeleton className="w-32 h-4 bg-gray-200" />
              </div>
              <Skeleton className="w-full sm:w-auto h-12 bg-blue-800 rounded-[5px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const OrganizerManageEvent = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchEvent = async () => {
    if (!id) {
      setError("Event ID is missing");
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(getSpecificEventById({ id })).unwrap();
      setEvent(response);
    } catch (err) {
      setError("Error fetching event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const deleteEvent = async () => {
    if (id) {
      try {
        await dispatch(deleteEventByOrganizer({ id })).unwrap();
        toast.info("deleted the event");
        navigate("/organizer/event-management", { replace: true });
      } catch {
        toast.error("failed to delete");
      }
    } else {
      toast.error(
        "Failed to getting the event info for delete. Please try again!"
      );
    }
  };

  const withdrawApprovalRequest = async () => {
    if (id) {
      try {
        await dispatch(withdrawEventApprovalRequest({ id })).unwrap();
        toast.info("Event approval request has been successfully withdrawn.");
        fetchEvent();
      } catch (error) {
        toast.error(
          "Failed to withdraw the event approval request. Please try again later."
        );
      }
    } else {
      toast.error(
        "Event approval request information not found. Please try again."
      );
    }
  };

  const eventStatus = (event: IEvent | null): string => {
    if (!event) {
      return "Undefined";
    }
    if (event.approvalStatus != "ACCEPTED") return "Not confirmed";
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    if (event.startDateAndTime) {
      start = new Date(event.startDateAndTime);
    }
    if (event.endDateAndTime) {
      end = new Date(event.endDateAndTime);
    }

    if (start && now < start) {
      return "Upcoming";
    } else if (start && end && now >= start && now <= end) {
      return "Running";
    } else {
      return "Completed";
    }
  };

  return (
    <div className="flex min-h-screen p-4 lg:p-8">
      {/* ///////////////////////// Modals ///////////////////////// */}

      {isModalOpen && (
        <ApprovalRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          id={id}
          fetchEvent={fetchEvent}
        />
      )}

      <input type="checkbox" id="delete_event_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>

          <div className="modal-action">
            <label
              htmlFor="delete_event_modal"
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-[5px]"
            >
              Close
            </label>
            <label
              onClick={deleteEvent}
              htmlFor="delete_event_modal"
              className="w-full sm:w-auto px-4 py-2 ml-4 bg-red-500 hover:bg-red-600 text-white rounded-[5px] transition-colors duration-200"
            >
              Delete
            </label>
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        id="withdraw_approval_request"
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>

          <div className="modal-action">
            <label
              htmlFor="withdraw_approval_request"
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-[5px]"
            >
              Close
            </label>
            <label
              onClick={withdrawApprovalRequest}
              htmlFor="withdraw_approval_request"
              className="w-full sm:w-auto px-4 py-2 ml-4 bg-red-500 hover:bg-red-600 text-white rounded-[5px] transition-colors duration-200"
            >
              Delete
            </label>
          </div>
        </div>
      </div>

      <CollaborationRequestModal />

      {/* ///////////////////////// Modals ///////////////////////// */}

      <div className="flex-1 ml-6 space-y-6 w-3/4 max-w-7xl mx-auto">
        {loading ? (
          <OrganizerSkeleton />
        ) : (
          <div className="bg-white rounded-xl border border-blue-900 shadow-sm overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/2 relative">
                <img
                  src={event?.imageUrl}
                  alt="cover image"
                  className="w-full h-64 lg:h-full object-cover"
                />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-blue-200 text-blue-800`}
                >
                  {eventStatus(event)}
                </span>
              </div>

              <div className="lg:w-1/2 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  {event?.name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {/* {event?.totalTickets}/{event?.totalTickets} */}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      {/* <p className="text-xl font-semibold text-gray-900">${event?.totalTickets}</p> */}
                    </div>
                  </div>

                  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {event?.eventState}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {event?.approvalStatus === "null" ||
                    event?.approvalStatus === undefined ? (
                      <XCircle className="w-5 h-5 text-slate-500" />
                    ) : event?.approvalStatus === "PENDING" ? (
                      <XCircle className="w-5 h-5 text-yellow-500" />
                    ) : event?.approvalStatus === "REJECTED" ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}

                    <span className="text-gray-700">
                      Admin Approval :{" "}
                      {event?.approvalStatus == "null"
                        ? "Make a request"
                        : event?.approvalStatus}
                    </span>
                  </div>

                  {event?.approvalStatus == "PENDING" ? (
                    <label
                      htmlFor="withdraw_approval_request"
                      className="w-full sm:w-auto px-4 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-[5px] transition-colors duration-200"
                    >
                      Withdraw Admin Approval
                    </label>
                  ) : event?.approvalStatus == "ACCEPTED" ? null : (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-[5px] transition-colors duration-200"
                    >
                      {event?.approvalStatus == "REJECTED"
                        ? "Resubmit Request"
                        : "Request Admin Approval"}
                    </button>
                  )}

                  {event?.approvalStatus == "null" ||
                  event?.approvalStatus == undefined ||
                  event?.approvalStatus == "REJECTED" ? (
                    <label
                      htmlFor="delete_event_modal"
                      className="w-full sm:w-auto px-4 py-2 ml-4 bg-red-500 hover:bg-red-600 text-white rounded-[5px] transition-colors duration-200"
                    >
                      Delete event
                    </label>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div className="bg-white border border-blue-900 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Collaboration Requests
            </h2>
            <label
              htmlFor="collaboration-request-modal"
              className="px-4 py-2 bg-blue-800 text-white rounded-[5px] hover:bg-blue-900"
            >
              Create new Request
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Organizer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Approval Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {event?.collabrationRequest.map((organizer) => (
                  <tr
                    key={organizer.oranizerId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <GoOrganization className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{organizer.organizer}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{organizer.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-4 py-2 bg-blue-800 text-white rounded-[5px] hover:bg-blue-900">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
            {event?.id && 
            <EventRegisteredUsersList eventId={event?.id}/>
            }
      </div>
    </div>
  );
};

export default OrganizerManageEvent;
