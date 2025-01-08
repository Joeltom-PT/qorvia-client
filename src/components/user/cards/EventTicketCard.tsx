import React, { useRef } from "react";
import domtoimage from "dom-to-image";
import { Calendar, Ticket } from "lucide-react";
import { IUserBookingInfo } from "../../../interfaces/booking";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { cancelBooking } from "../../../redux/action/userActions";
import { toast } from "react-toastify";

interface StatusBadgeProps {
  type: "primary" | "secondary" | "danger";
  content: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, content }) => {
  const typeClasses = {
    primary: "bg-green-100 text-green-800",
    secondary: "bg-blue-100 text-blue-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-block text-sm font-medium px-3 py-1 mx-1 rounded-full ${typeClasses[type]}`}
    >
      {content}
    </span>
  );
};

interface EventTicketCardProps {
  bookingInfo: IUserBookingInfo;
  setBookings: React.Dispatch<React.SetStateAction<IUserBookingInfo[] | null>>;
  customClass?: string;
}


const EventTicketCard: React.FC<EventTicketCardProps> = ({
  bookingInfo,
  setBookings,
  customClass = "",
}) => {
  const {
    bookingId,
    eventName,
    startTimeAndDate,
    totalAmount,
    totalDiscount,
    ticket,
    bookingStatus,
    paymentStatus,
  } = bookingInfo;

  const dispatch = useDispatch<AppDispatch>();

  const componentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleDownload = async () => {
    if (!componentRef.current) return;

    try {
      const dataUrl = await domtoimage.toPng(componentRef.current, {
        quality: 1.0,
        bgcolor: "#fff",
        style: {
          transform: "none",
        },
      });

      const link = document.createElement("a");
      link.download = `${"event".replace(/\s+/g, "-")}-ticket.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating ticket:", error);
    }
  };

  const handleCancel = async () => {
    if (bookingId) {
      try {
        const response = await dispatch(cancelBooking({ id: bookingId })).unwrap();
        setBookings((prevBookings) =>
          prevBookings
            ? prevBookings.map((booking) =>
                booking.bookingId === bookingId
                  ? {
                      ...booking,
                      bookingStatus: "CANCELED",
                      paymentStatus: "REFUND_IN_PROGRESS",
                    }
                  : booking
              )
            : [] 
        );
        
        
         
        toast.info("Event cancel successful");
      } catch (error) {
        console.error("Error canceling booking:", error);
        toast.error("Event cancel failed, please try again");
      }
    }
  };
  
  const handlePrint = () => {
    if (!componentRef.current) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      const content = componentRef.current.innerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Ticket</title>
            <style>
              body { margin: 0; padding: 16px; }
              .print-container { 
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
              }
              .ticket-content {
                display: flex;
                flex-direction: row;
              }
              .image-container {
                width: 33.333%;
              }
              .image-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .details-container {
                padding: 24px;
                flex-grow: 1;
              }
              .grid-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-top: 16px;
              }
              .status-badge {
                display: inline-block;
                background-color: #dcfce7;
                color: #166534;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 14px;
                font-weight: 500;
                margin-top: 16px;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .print-container { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${content}
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <>
      <div className={`max-w-2xl mx-auto m-4 bg-white border border-gray-200 shadow-lg rounded-[8px] ${customClass}`}>
        <div
          id="ticket-component"
          ref={componentRef}
          className="overflow-hidden rounded-tl-[8px]"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3">
              <img
                src={bookingInfo.imageUrl}
                alt="Event"
                className="w-full h-full object-cover rounded-tl-[8px]"
                crossOrigin="anonymous"
              />
            </div>

            <div className="p-6 flex-grow bg-gradient-to-r from-white to-gray-50 rounded-r-[8px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {eventName || "Event Name"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Invoice ID: {bookingInfo.eventId || "N/A"}
                  </p>
                </div>
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-700">Event Starts on</p>
                    <p className="text-gray-600">{startTimeAndDate}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Ticket className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-700">Total Tickets</p>
                    <p className="text-gray-600">
                      {bookingInfo.isOnline
                        ? "1"
                        : ticket?.name && ticket?.quantity
                        ? `${ticket.name} x ${ticket.quantity}`
                        : "No tickets available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 flex items-center justify-center text-gray-600">
                    $
                  </span>
                  <div>
                    <p className="font-semibold text-gray-700">Paid Amount</p>
                    <p className="text-gray-600">INR {totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {bookingStatus === "CONFIRMED" ? (
                  <StatusBadge type="primary" content="Status: Confirmed" />
                ) : (
                  <StatusBadge type="danger" content="Status: Cancelled" />
                )}

                {paymentStatus !== "NONE" &&
                  ((paymentStatus === "COMPLETED" && (
                    <StatusBadge
                      type="primary"
                      content="Payment Status: Completed"
                    />
                  )) ||
                    (paymentStatus === "REFUND_IN_PROGRESS" && (
                      <StatusBadge
                        type="secondary"
                        content="Payment Status: Refund processing"
                      />
                    )) ||
                    (paymentStatus === "REFUND_PROCESSED" && (
                      <StatusBadge
                        type="secondary"
                        content="Payment Status: Refunded"
                      />
                    )))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex w-1/3">
            <button
              onClick={() => navigate(`/event/${bookingInfo.eventId}`)}
              className="w-full rounded-bl-[8px] bg-blue-300 font-bold text-blue-900 text-xl"
            >
              View Event
            </button>
          </div>
          <div className="mt-2 flex justify-end space-x-5 w-2/3">
            {bookingStatus === "CONFIRMED" && (
              <label
                htmlFor="cancel-booking"
                className="px-4 py-1 w-1/5 bg-red-400 text-black hover:bg-red-600 transition-colors duration-200"
              >
                Cancel
              </label>
            )}
            {bookingStatus === "CONFIRMED" && (
              <button
                onClick={handleDownload}
                className="px-4 py-1 w-2/4 bg-blue-400 text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Download Ticket
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-1 w-2/5 bg-gray-400 text-white hover:bg-gray-700 transition-colors duration-200"
            >
              Print Ticket
            </button>
          </div>
        </div>
      </div>

      <input type="checkbox" id="cancel-booking" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Are you sure you want to cancel the booking?
          </h3>
          <p className="py-4">
            You are about to cancel the booking for "{eventName}". Once canceled, a refund will be processed if applicable.
          </p>
          <div className="modal-action">
            <label htmlFor="cancel-booking" className="btn">
              Close
            </label>
            <label
              onClick={handleCancel}
              className="btn"
              htmlFor="cancel-booking"
            >
              Cancel Booking
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventTicketCard;
