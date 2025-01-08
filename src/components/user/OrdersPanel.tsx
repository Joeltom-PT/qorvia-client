import { useState, useEffect } from 'react';
import EventTicketCard from './cards/EventTicketCard';
import { IUserBookingInfo } from '../../interfaces/booking';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { fetchAllBookings } from '../../redux/action/userActions';

const OrdersPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [bookings, setBookings] = useState<IUserBookingInfo[] | null>(null);

  const fetchUserBookings = async () => {
    try {
      const response = await dispatch(fetchAllBookings()).unwrap();
      setBookings(response);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [dispatch]);

  return (
    <div className="bg-white border border-blue-900 rounded-[5px] shadow-md p-4 w-full md:w-2/3 max-h-[400px] overflow-y-auto">
      {bookings && bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <EventTicketCard key={index} bookingInfo={booking} customClass={`custom-class-${index}`} setBookings={setBookings} />
        ))
      ) : (
        <p>No bookings available</p>
      )}
    </div>
  );
};

export default OrdersPanel;
