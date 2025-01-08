import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedules: Schedule[]) => void;
}

interface Schedule {
  date: Date | null;
  timeRange: [Date, Date] | null;
  duration: string;
}

const DateAndTimeSchedulerModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { date: null, timeRange: null, duration: "" },
    
  ]);
  const addRow = () => {
    setSchedules([...schedules, { date: null, timeRange: null, duration: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof Schedule,
    value: any
  ) => {
    const updatedSchedules = schedules.map((schedule, i) => {
      if (i === index) {
        const updatedSchedule = { ...schedule, [field]: value };
        if (field === "timeRange" && value && value[0] && value[1]) {
          const duration = calculateDuration(value[0], value[1]);
          updatedSchedule.duration = duration;
        }
        return updatedSchedule;
      }
      return schedule;
    });
    setSchedules(updatedSchedules);
  };

  const calculateDuration = (start: Date, end: Date): string => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSave = () => {
    onSave(schedules);
    onClose();
  };

  const handleRemoveRow = (index: number) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">
          Add Schedule
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Start Time</th>
                <th className="px-4 py-2 text-left">End Time</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2">
                    <DatePicker
                      selected={schedule.date}
                      onChange={(date: Date | null) =>
                        handleInputChange(index, "date", date)
                      }
                      className="border rounded px-2 py-1 w-full"
                      placeholderText="Select date"
                      dateFormat="yyyy/MM/dd"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <DatePicker
                      selected={
                        schedule.timeRange ? schedule.timeRange[0] : null
                      }
                      onChange={(start: Date | null) =>
                        handleInputChange(index, "timeRange", [
                          start,
                          schedule.timeRange ? schedule.timeRange[1] : null,
                        ])
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Start Time"
                      dateFormat="h:mm aa"
                      className="border rounded px-2 py-1 w-full"
                      placeholderText="Select start time"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <DatePicker
                      selected={
                        schedule.timeRange ? schedule.timeRange[1] : null
                      }
                      onChange={(end: Date | null) =>
                        handleInputChange(index, "timeRange", [
                          schedule.timeRange ? schedule.timeRange[0] : null,
                          end,
                        ])
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="End Time"
                      dateFormat="h:mm aa"
                      className="border rounded px-2 py-1 w-full"
                      placeholderText="Select end time"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-gray-700">{schedule.duration}</span>
                  </td>
                  <td className="px-4 py-2">
                    {index > 0 && (
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addRow}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 mt-4"
        >
          + Add Row
        </button>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateAndTimeSchedulerModal;
