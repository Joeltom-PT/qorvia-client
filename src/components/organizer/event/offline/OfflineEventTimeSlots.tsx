import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../../redux/store";
import {
  createOnlineEventTimeSlots,
  getOnlineEventTimeSlot,
} from "../../../../redux/action/organizerActions";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

interface TimeSlotError {
  date?: string;
  startTime?: string;
  endTime?: string;
}

interface EventTimeSlotsProps {
  onSubmit?: (slots: TimeSlot[]) => void;
  onPrevious?: () => void;
}

const OfflineEventTimeSlots: React.FC<EventTimeSlotsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "",
      startTime: "",
      endTime: "",
      duration: "",
    },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: TimeSlotError }>({});

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return "";

    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);

    if (end <= start) return "Invalid time range";

    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}h ${diffMins}m`;
  };

  const validateTimeSlot = (slot: TimeSlot): TimeSlotError => {
    const error: TimeSlotError = {};

    if (!slot.date) {
      error.date = "Date is required";
    }

    if (!slot.startTime) {
      error.startTime = "Start time is required";
    }

    if (!slot.endTime) {
      error.endTime = "End time is required";
    } else if (slot.startTime && slot.endTime) {
      const start = new Date(`2024-01-01 ${slot.startTime}`);
      const end = new Date(`2024-01-01 ${slot.endTime}`);
      if (end <= start) {
        error.endTime = "End time must be after start time";
      }
    }

    return error;
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      date: "",
      startTime: "",
      endTime: "",
      duration: "",
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length === 1) {
      toast.warn("At least one time slot is required");
      return;
    }
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handleChange = (id: string, field: keyof TimeSlot, value: string) => {
    const updatedSlots = timeSlots.map((slot) => {
      if (slot.id === id) {
        const updatedSlot = { ...slot, [field]: value };

        if (field === "startTime" || field === "endTime") {
          updatedSlot.duration = calculateDuration(
            field === "startTime" ? value : slot.startTime,
            field === "endTime" ? value : slot.endTime
          );
        }

        const slotErrors = validateTimeSlot(updatedSlot);
        setErrors((prev) => ({
          ...prev,
          [id]: slotErrors,
        }));

        return updatedSlot;
      }
      return slot;
    });

    setTimeSlots(updatedSlots);
  };

  const validateAllSlots = (): boolean => {
    const newErrors: { [key: string]: TimeSlotError } = {};
    let isValid = true;

    timeSlots.forEach((slot) => {
      const slotErrors = validateTimeSlot(slot);
      if (Object.keys(slotErrors).length > 0) {
        isValid = false;
        newErrors[slot.id] = slotErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAllSlots() && id) {
      dispatch(
        createOnlineEventTimeSlots({
          id,
          slots: timeSlots,
        })
      )
        .unwrap()
        .then(() => {
          navigate(`/organizer/offline-event/tickets/${id}`);
        })
        .catch((error) => {
          toast.error("Failed to create time slots. Please try again");
          console.error("Failed to create time slots:", error);
        });
    }
  };

  const onPrevious = () => {
    navigate(`/organizer/offline-event/details/${id}`);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          setLoading(true);
          const response = await dispatch(getOnlineEventTimeSlot(id)).unwrap();
          if (response && response.length > 0) {
            setTimeSlots(response);
          }
        } catch (error) {
          toast.error("Failed to fetch event information. Please try again.");
          console.error("Error fetching event data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <MoonLoader color="#1E3A8A" loading={true} size={50} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Event Time Slots
          </h3>
          <button
            type="button"
            onClick={addTimeSlot}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Time Slot
          </button>
        </div>

        <div className="space-y-4">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={slot.date}
                    onChange={(e) =>
                      handleChange(slot.id, "date", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[slot.id]?.date
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[slot.id]?.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[slot.id]?.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleChange(slot.id, "startTime", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[slot.id]?.startTime
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[slot.id]?.startTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[slot.id]?.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleChange(slot.id, "endTime", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[slot.id]?.endTime
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[slot.id]?.endTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[slot.id]?.endTime}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                      {slot.duration || "-"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTimeSlot(slot.id)}
                    className="self-end p-2 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default OfflineEventTimeSlots;
