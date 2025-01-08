import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { createOnlineEventTicket, getOnlineEventTicket } from '../../../../redux/action/organizerActions';
import { IOnlineEventTickets } from '../../../../interfaces/event';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

interface TicketFormData {
  totalTickets: string;
  isFreeEvent: boolean;
  price: string;
  hasEarlyBirdDiscount: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
}

const EventTickets = () => {
  const { id } = useParams<{ id: string }>(); 
  const [formData, setFormData] = useState<TicketFormData>({
    totalTickets: '',
    isFreeEvent: false,
    price: '',
    hasEarlyBirdDiscount: false,
    discountType: 'percentage',
    discountValue: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          setLoading(true);
          const response = await dispatch(getOnlineEventTicket(id)).unwrap();
          console.log("data is fetched:", response);
          if (response) {
            setFormData({
              totalTickets: response.totalTickets || '',
              isFreeEvent: response.freeEvent || false,
              price: response.price || '',
              hasEarlyBirdDiscount: response.hasEarlyBirdDiscount || false,
              discountType: (response.discountType as 'percentage' | 'fixed') || 'percentage',
              discountValue: response.discountValue || '',
            });
          }
        } catch (error) {
          toast.error("Failed to fetch event information. Please try again.");
          console.error('Error fetching event data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchEventData();
    }
  }, [id, dispatch]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'discountValue' || name === 'totalTickets') && value !== '') {
      const isValid = /^\d*\.?\d*$/.test(value);
      if (!isValid) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof TicketFormData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
   
    let formIsValid = true;
    const newErrors: Partial<Record<keyof TicketFormData, string>> = {};

    const totalTicketsValue = parseInt(formData.totalTickets);
    if (!formData.totalTickets || isNaN(totalTicketsValue) || totalTicketsValue <= 0) {
        newErrors.totalTickets = 'Total tickets must be a non-negative integer';
        formIsValid = false;
    }

    if (!formData.isFreeEvent) {
        const priceValue = parseFloat(formData.price);
        if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
            newErrors.price = 'Ticket price is required and must be a non-negative number for paid events';
            formIsValid = false;
        }

        if (formData.hasEarlyBirdDiscount) {
            const discountValue = parseFloat(formData.discountValue);
            if (!formData.discountValue || isNaN(discountValue) || discountValue <= 0) {
                newErrors.discountValue = 'Discount value is required and must be a non-negative number for early bird discounts';
                formIsValid = false;
            } else if (formData.discountType === 'percentage' && discountValue > 80) {
                newErrors.discountValue = 'Discount percentage must be less than or equal to 80';
                formIsValid = false;
            } else if (formData.discountType === 'fixed' && discountValue >= 0.8 * priceValue) {
                newErrors.discountValue = 'Fixed discount amount must be less than 80% of the ticket price';
                formIsValid = false;
            }
        }
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    const ticketData: IOnlineEventTickets = {
      totalTickets: formData.totalTickets,
      isFreeEvent: formData.isFreeEvent,
      price: formData.isFreeEvent ? undefined : formData.price,
      hasEarlyBirdDiscount: formData.hasEarlyBirdDiscount,
      discountType: formData.hasEarlyBirdDiscount ? formData.discountType : undefined,
      discountValue: formData.hasEarlyBirdDiscount ? formData.discountValue : undefined,
    };

    try {
      const response = await dispatch(createOnlineEventTicket({ id: id as string, ticket: ticketData })).unwrap();
      navigate(`/organizer/online-event/settings/${id}`);
      console.log('Ticket created successfully:', response);
    } catch (err) {
       toast.error("Failed to create event ticket. Please try again!")
    }
  };

  const onPrevious = () => {
    navigate(`/organizer/online-event/time-slots/${id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <MoonLoader color="#1E3A8A" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Total Tickets Available */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Tickets Available
          </label>
          <input
            type="text"
            name="totalTickets"
            value={formData.totalTickets}
            onChange={handleInputChange}
            placeholder="Enter total number of tickets"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.totalTickets && <p className="text-red-500 text-sm">{errors.totalTickets}</p>}
        </div>

        {/* Free Event Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-sm font-medium text-gray-700">Free Event</span>
            <span className="block text-sm text-gray-500">Toggle if this is a free event</span>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={formData.isFreeEvent}
            onChange={() => handleSwitchChange('isFreeEvent')}
          />
        </div>

        {/* Price Input - Show only if not free */}
        {!formData.isFreeEvent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>
        )}

        {/* Early Bird Discount Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-sm font-medium text-gray-700">Early Bird Discount</span>
            <span className="block text-sm text-gray-500">Offer an early bird discount</span>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={formData.hasEarlyBirdDiscount}
            onChange={() => handleSwitchChange('hasEarlyBirdDiscount')}
          />
        </div>

        {/* Early Bird Discount Options */}
        {formData.hasEarlyBirdDiscount && !formData.isFreeEvent && (
          <div className="space-y-4">
            {/* Discount Type Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Discount Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="discountType"
                    value="percentage"
                    checked={formData.discountType === 'percentage'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Percentage
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="discountType"
                    value="fixed"
                    checked={formData.discountType === 'fixed'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Fixed Amount
                  </label>
                </div>
              </div>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
              </label>
              <div className="relative">
                {formData.discountType === 'percentage' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                )}
                {formData.discountType === 'fixed' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                )}
                <input
                  type="text"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`w-full ${formData.discountType === 'percentage' ? 'pl-8' : 'pl-8'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.discountValue && <p className="text-red-500 text-sm">{errors.discountValue}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Previous
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save & Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventTickets;
