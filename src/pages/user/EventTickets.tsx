import React, { useEffect, useState } from "react";
import { IOfflineEventData, ITicketCategory } from "../../interfaces/event";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { getOfflineEventData } from "../../redux/action/userActions";
import { toast } from "react-toastify";
import { Base64 } from "js-base64";

const decodeBase64 = (data: string) => {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json);
};

const EventHeader = ({ eventDetails }: { eventDetails: IOfflineEventData }) => (
  <div className="mb-8">
    <img
      src={eventDetails.imageUrl}
      alt={eventDetails.name}
      className="w-full h-64 object-cover rounded-[5px] shadow-md"
    />
    <div className="mt-2 space-y-2">
      <h1 className="text-2xl md:text-3xl font-medium text-gray-900">{eventDetails.name}</h1>
      <div className="text-sm md:text-base text-gray-700">
        <p><span className="font-semibold text-black">Address: </span> {eventDetails.address}</p>
      </div>
    </div>
  </div>
);

const TicketOptionComponent = ({
  option,
  quantity,
  onQuantityChange,
}: {
  option: ITicketCategory;
  quantity: number;
  onQuantityChange: (id: string, change: number) => void;
}) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div
      key={option.name}
      className="bg-white p-6 rounded-[5px] shadow-md border border-gray-200 hover:border-indigo-500 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{option.name}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm md:text-base text-gray-600">
              ${option.price.toFixed(2)} • {option.totalTickets} {option.totalTickets === 1 ? 'ticket' : 'tickets'}
            </p>
            {option.discountValue > 0 && (
              <p className="text-green-600 text-xs md:text-sm">
                {option.discountValue}% discount applied
              </p>
            )}
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-blue-500 hover:underline text-sm"
            >
              {showDescription ? 'Hide Description' : 'Show Description'}
            </button>
            {showDescription && (
              <p className="text-sm font-light md:text-base text-gray-600 mt-2">
                {option.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onQuantityChange(option.name, -1)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            disabled={quantity <= 0}
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{quantity || 0}</span>
          <button
            onClick={() => onQuantityChange(option.name, 1)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

const EventTickets = () => {
  const { eventParams } = useParams<{ eventParams: string }>();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [event, setEvent] = useState<IOfflineEventData | null>(null);

  const decodedParams = eventParams ? decodeBase64(eventParams) : null;

  useEffect(() => {
    if (!user.isLogged || !user.user?.email) {
      navigate("/login");
    } else if (decodedParams) {
      try {
        fetchEventData(decodedParams.eventId);
      } catch (error) {
        toast.error("Something went wrong. Please try again!");
      }
    }
  }, [eventParams, navigate, user.isLogged, user.user]);

  const fetchEventData = async (eventId: string) => {
    try {
      const response = await dispatch(getOfflineEventData({ id: eventId })).unwrap();
      setEvent(response);
    } catch (error) {
      toast.info("Failed to fetch event data. Please try again.");
    }
  };

  const handleQuantityChange = (id: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change),
    }));
  };

  const continueBooking = () => {
    const selectedTickets =
      event?.offlineEventTickets.categories
        .filter((category) => quantities[category.name] > 0)
        .map((category) => ({
          name: category.name,
          quantity: quantities[category.name],
          availableTickets: category.totalTickets,
          price: category.price,
          discountPrice: category.discountType
            ? category.discountType === "percentage"
              ? category.price - (category.price * category.discountValue) / 100
              : category.price - category.discountValue
            : category.price,
        })) || [];

    const encryptedParams = Base64.encode(
      JSON.stringify({ eventId: decodedParams.eventId, isOnline: false })
    );

    navigate(`/event/confirmation/${encryptedParams}`, { state: { selectedTickets } });
  };

  const isAnyTicketSelected = Object.values(quantities).some(
    (quantity) => quantity > 0
  );

  return (
    <div className="max-w-6xl mt-10 mx-auto p-6 border border-indigo-600 rounded-[5px] shadow-xl bg-gradient-to-r from-indigo-100 to-indigo-50">
      <div className="md:flex md:space-x-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          {event && <EventHeader eventDetails={event} />}
        </div>

        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Select Your Tickets
          </h2>
          <div className="space-y-6">
            {event?.offlineEventTickets.categories.map((option) => (
              <TicketOptionComponent
                key={option.name}
                option={option}
                quantity={quantities[option.name] || 0}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>

          <div className="mt-8">
            <button
              className={`w-full bg-indigo-900 hover:bg-indigo-800 text-white font-semibold py-3 px-6 rounded-[5px] transition-all duration-300 ${
                !isAnyTicketSelected ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isAnyTicketSelected}
              onClick={continueBooking}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTickets;
