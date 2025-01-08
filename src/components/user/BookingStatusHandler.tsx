import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchBooking } from '../../redux/action/userActions';
import { IBooking, IBookingTicket, IEventInfo } from '../../interfaces/booking';
import { AppDispatch } from '../../redux/store';
import ClipLoader from "react-spinners/ClipLoader";  

const BookingConfirmationCard: React.FC = () => {
  const { eventParams } = useParams<{ eventParams?: string }>();
  const { search, state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [eventInfo, setEventInfo] = useState<IEventInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const paymentStatusAsParams = queryParams.get('status');
    const bookingDetails = state as { bookingId: string | null; isFree: boolean | null };

    if (paymentStatusAsParams === 'failure') {
      setPaymentStatus('failure');
    } else if (paymentStatusAsParams === 'success') {
      if (bookingDetails?.bookingId && bookingDetails.isFree) {
        setIsFree(bookingDetails.isFree);
        fetchEventData(bookingDetails.bookingId, bookingDetails.isFree);
      } else {
        const sessionId = queryParams.get('session_id');
        if(sessionId){
           fetchEventData(sessionId, false);
        }
      }
    } else {
      setPaymentStatus('failure');
    }
  }, [search, state]);

  const fetchEventData = async (id: string, isFree: boolean) => {
    try {
      const response = await dispatch(fetchBooking({ id, isFree })).unwrap();
      setBooking(response);
      fetchEventInfo(response.eventInfo);
  
      if (response.paymentStatus === "PENDING") {
        setLoading(true);
        const checkPaymentStatus = setInterval(async () => {
          const updatedResponse = await dispatch(fetchBooking({ id, isFree })).unwrap();
          if (
            updatedResponse.paymentStatus === "COMPLETED" ||
            updatedResponse.paymentStatus === "NONE"
          ) {
            clearInterval(checkPaymentStatus);
            setBooking(updatedResponse);
            if(updatedResponse.eventInfo){
            setEventInfo(updatedResponse.eventInfo);
            }
            setPaymentStatus(updatedResponse.paymentStatus);
            setLoading(false); 
          }
        }, 6000);
      } else {
        if(response.paymentStatus){
                  setPaymentStatus(response.paymentStatus);
        setLoading(false); 

        }
      }
    } catch (error) {
      setPaymentStatus('failure');
      setLoading(false);
    }
  };
  
  const fetchEventInfo = (eventInfo: IEventInfo | undefined) => {
    if (eventInfo) {
      setEventInfo(eventInfo);
    }
  };

  if (paymentStatus === 'failure') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Payment Failed</h2>
            <p className="text-center text-gray-600">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="text-center">
            {paymentStatus === 'loading' || loading ? (
              <div className="flex justify-center items-center">
                <ClipLoader color="#0000ff" loading={loading} size={50} />
                <p className="ml-4">Verifying payment status...</p>
              </div>
            ) :  booking && ( booking.paymentStatus === "COMPLETED" || booking.paymentStatus === "NONE" ) ? (
              <>
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">Booking Confirmed</h2>
                <p className="text-gray-600 text-sm mb-6">
                  We are pleased to inform you that your reservation request has been received and confirmed.
                </p>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-[200px] h-[120px] bg-cover rounded flex items-center justify-center"
                      style={{ backgroundImage: `url(${eventInfo?.imageUrl || 'default-image-url'})` }}
                    ></div>
                  </div>

                  <h3 className="font-semibold text-lg mb-4">{eventInfo?.name}</h3>

                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booked user:</span>
                      <span>{booking.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{booking.email}</span>
                    </div>
                    {isFree ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tickets:</span>
                        <span>1x Free Ticket</span>
                      </div>
                    ) : (
                      booking.tickets?.map((ticket: IBookingTicket, index: number) => (
                        <div className="flex justify-between" key={index}>
                          <span className="text-gray-600">{ticket.name}:</span>
                          <span>{ticket.quantity}x Tickets</span>
                        </div>
                      ))
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>&#x20b9;{booking.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => navigate('/profile/bookings', { replace: true })}
                >
                  View Ticket
                </button>
              </>
            ) : (
              <p className="text-gray-600 text-sm">Payment status verification in progress...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationCard;
