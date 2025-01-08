import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  getOfflineEventData,
  getOnlineEventData,
} from "../../redux/action/userActions";
import {
  IOfflineEventData,
  IOnlineEventData,
  IEventTimeSlot,
} from "../../interfaces/event";

interface OrderSummaryCardProps {
  eventId: string;
  isOnline: boolean;
  ticketOptions: TicketSelected[] | null;
}

export interface TicketSelected {
  name: string;          
  quantity: number;  
  availableTickets: number;
  price: number;
  discountPrice: number;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  eventId,
  isOnline,
  ticketOptions,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [event, setEvent] = useState<IOnlineEventData | IOfflineEventData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOnline) {
      fetchOnlineEventData();
    } else {
      fetchOfflineEventData();
    }
  }, [eventId, isOnline]);

  const fetchOnlineEventData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getOnlineEventData({ id: eventId })).unwrap();
      setEvent(response);
    } catch (error) {
      console.error("Failed to fetch event data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfflineEventData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getOfflineEventData({ id: eventId })).unwrap();
      setEvent(response);
    } catch (error) {
      console.error("Failed to fetch event data", error);
    } finally {
      setLoading(false);
    }
  };

  const isOnlineEvent = (event: IOnlineEventData | IOfflineEventData): event is IOnlineEventData => {
    return (event as IOnlineEventData).onlineEventTicket !== undefined;
  };

  const calculateTotalPrice = () => {
    if (!event) return 0;
  
    if (isOnlineEvent(event)) {
      if (event.onlineEventTicket.freeEvent) {
        return 0; 
      } else {
        return event.onlineEventTicket.price;
      }
    }
  
    if (!ticketOptions || ticketOptions.length === 0) return 0;
  
    return ticketOptions.reduce((total, ticket) => {
      // Ensure the discountPrice is applied correctly
      const priceToUse = ticket.discountPrice && ticket.discountPrice < ticket.price ? ticket.discountPrice : ticket.price;
      const ticketTotalPrice = ticket.quantity * priceToUse;
      return total + ticketTotalPrice;
    }, 0);
  };
  

  const calculateTotalDiscount = () => {
    if (!event) return 0;
  
    if (isOnlineEvent(event)) { 
      if (event.onlineEventTicket.freeEvent) {
        return 0; 
      } else {
        const ticketPrice = event.onlineEventTicket.price;
        const discountValue = event.onlineEventTicket.discountValue;
    
        if (event.onlineEventTicket.discountType === "percentage") {
          const discount = (ticketPrice * discountValue) / 100;
          return discount;
        } else if (event.onlineEventTicket.discountType === "fixed") {
          return discountValue;
        }
      }
    }
  
    if (!ticketOptions || ticketOptions.length === 0) return 0;
  
    return ticketOptions.reduce((totalDiscount, ticket) => {
      const discountPerTicket = ticket.price - (ticket.discountPrice || ticket.price);
      const discountForAllTickets = discountPerTicket * ticket.quantity;
      return totalDiscount + discountForAllTickets;
    }, 0);
  };
  

  const roundToTwoDecimalPlaces = (value: number) => {
    return Math.round(value * 100) / 100;
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse bg-slate-300 rounded-[5px] shadow-md">
        <div className="w-full h-48 object-cover rounded-[5px]"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="p-6 bg-white rounded-[5px] shadow-md">No event data available</div>;
  }

  return (
    <div className="p-6 bg-white rounded-[5px] shadow-md">
      <img
        src={event.imageUrl || "https://via.placeholder.com/150"}
        alt="Event"
        className="w-full h-48 object-cover rounded-[5px]"
      />
      <h2 className="text-xl font-semibold mt-4">{event.name}</h2>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Event Time Slots:</h3>
        {event.timeSlots && event.timeSlots.length > 0 ? (
          event.timeSlots.map((slot: IEventTimeSlot) => (
            <div key={slot.id} className="mt-2">
              <p className="text-gray-500 text-sm">
                <strong>Date:</strong> {slot.date}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Time:</strong> {slot.startTime} - {slot.endTime}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No time slots available</p>
        )}
      </div>

      <p className="text-gray-500 text-sm mt-1">
        <strong>Event Type:</strong> {isOnline ? "Online" : "Offline"}
      </p>

      {!isOnline ? 
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Ticket Categories:</h3>
        {ticketOptions?.map((ticket, index) => (
          <div key={index} className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-gray-500 text-sm">
              <strong>Ticket Category:</strong> {ticket.name}
            </p>
            <p className="text-gray-500 text-sm">
              <strong>Available Tickets on {ticket.name} X {ticket.quantity}:</strong> {ticket.availableTickets * ticket.quantity}
            </p>
            <p className="text-gray-500 text-sm">
              <strong>Price per Ticket Category:</strong> &#8377;{roundToTwoDecimalPlaces(ticket.price)}
            </p>
            {ticket.discountPrice && ticket.discountPrice < ticket.price && (
              <p className="text-gray-500 text-sm">
                <strong>Discounted Price per Ticket:</strong> &#8377;{roundToTwoDecimalPlaces(ticket.discountPrice)}
              </p>
            )}
            <p className="text-gray-500 text-sm">
              <strong>Total Price for {ticket.quantity} {ticket.name}:</strong> &#8377;
              {roundToTwoDecimalPlaces(ticket.quantity * (ticket.discountPrice || ticket.price))}
            </p>
          </div>
        ))}
      </div> : 
      null
    }

      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <p className="text-gray-500 text-sm">
            <strong>Sub Total:</strong>
          </p>
          <p className="text-gray-700 text-sm">
            &#8377;{roundToTwoDecimalPlaces(calculateTotalPrice())}
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-gray-500 text-sm">
            <strong>Total Discount:</strong>
          </p>
          <p className="text-gray-700 text-sm">
            &#8377;{roundToTwoDecimalPlaces(calculateTotalDiscount())}
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <p className="text-black text-lg font-semibold">
            <strong>Total:</strong>
          </p>
          <p className="text-black text-lg font-semibold">
            &#8377;{roundToTwoDecimalPlaces(calculateTotalPrice() - calculateTotalDiscount())}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
