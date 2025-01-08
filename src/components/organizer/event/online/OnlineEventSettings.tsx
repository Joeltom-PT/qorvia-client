import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { getBookingSettings, saveBookingSettings } from '../../../../redux/action/organizerActions';
import { toast } from 'react-toastify';

export interface BookingSettingsData {
  startImmediately: boolean;
  bookingStartDate: string;
  bookingStartTime: string;
  continueUntilEvent: boolean;
  bookingEndDate: string;
  bookingEndTime: string;
  disableRefunds: boolean;
  refundPercentage: string;
  refundPolicy: string;
}

const EventSettings = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<BookingSettingsData>({
    startImmediately: true,
    bookingStartDate: '',
    bookingStartTime: '',
    continueUntilEvent: true,
    bookingEndDate: '',
    bookingEndTime: '',
    disableRefunds: false,
    refundPercentage: '',
    refundPolicy: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'refundPercentage' && value !== '') {
      const isValid = /^\d*\.?\d*$/.test(value);
      if (!isValid) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof BookingSettingsData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleRefundPolicyChange = (value: string) => {
    setFormData(prev => ({ ...prev, refundPolicy: value }));
  };

  const onPrevious = () => {
    navigate(`/organizer/online-event/tickets/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('form data ',formData)
    try {
      await dispatch(saveBookingSettings({ id: id as string, settings: formData })).unwrap();
      toast.success("Event created")
      navigate("/organizer/event-management")
    } catch (error) {
      toast.error('Event creation failed. Please try again!')
    }
  };

  const getOnlineEventSettings = async () => {
    try {
      if (id) {
        const response = await dispatch(getBookingSettings({ id })).unwrap();
        setFormData(response);
      }
    } catch (error) {
      toast.error('Failed to load booking settings. Please try again!');
    }
  };

  useEffect(() => {
    getOnlineEventSettings();
  }, [id, dispatch]);


  return (
    <div className="max-w-4xl mx-auto space-y-8">
     
      <div className="p-4 md:p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Settings</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
      
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-sm font-medium text-gray-700">
                I want the bookings to start immediately
              </span>
              <span className="block text-sm text-gray-500">
                Toggle off to set a specific start date and time
              </span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.startImmediately}
              onChange={() => handleSwitchChange('startImmediately')}
            />
          </div>

          {/* Booking Start Date/Time */}
          {!formData.startImmediately && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Start Date
                </label>
                <input
                  type="date"
                  name="bookingStartDate"
                  value={formData.bookingStartDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Start Time
                </label>
                <input
                  type="time"
                  name="bookingStartTime"
                  value={formData.bookingStartTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Continue Until Event Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-sm font-medium text-gray-700">
                I want the bookings to continue until my event starts
              </span>
              <span className="block text-sm text-gray-500">
                Toggle off to set a specific end date and time
              </span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.continueUntilEvent}
              onChange={() => handleSwitchChange('continueUntilEvent')}
            />
          </div>

          {/* Booking End Date/Time */}
          {!formData.continueUntilEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking End Date
                </label>
                <input
                  type="date"
                  name="bookingEndDate"
                  value={formData.bookingEndDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking End Time
                </label>
                <input
                  type="time"
                  name="bookingEndTime"
                  value={formData.bookingEndTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Refund Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-sm font-medium text-gray-700">
                I do not wish to offer my customers with option to cancel their orders and receive refund
              </span>
              <span className="block text-sm text-gray-500">
                Toggle on to disable refunds
              </span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.disableRefunds}
              onChange={() => handleSwitchChange('disableRefunds')}
            />
          </div>

          {/* Refund Settings */}
          {!formData.disableRefunds && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Percentage
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  <input
                    type="text"
                    name="refundPercentage"
                    value={formData.refundPercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Policy Description
                </label>
                <div className="border rounded-md">
                  <ReactQuill
                    value={formData.refundPolicy}
                    onChange={handleRefundPolicyChange}
                    theme="snow"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onPrevious}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventSettings;
