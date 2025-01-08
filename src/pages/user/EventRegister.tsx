import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { IOnlineEventData } from "../../interfaces/event";
import { getOnlineEventData } from "../../redux/action/userActions";
import EventRegistrationHero from "../../components/user/EventRegistrationHero";

const decodeBase64 = (encodedData: string) => {
  const json = atob(encodedData.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json);
};

const EventRegister: React.FC = () => {
  const { eventParams } = useParams<{ eventParams: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [event, setEvent] = useState<IOnlineEventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { eventId } = decodeBase64(eventParams!);

  const fetchEventInfo = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getOnlineEventData({ id: eventId })
      ).unwrap();
      setEvent(response);
    } catch (err) {
      setError("An error occurred while fetching event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventParams) {
      fetchEventInfo();
    }
  }, [eventParams]);

  if (loading) {
    return (
      <div className="mx-auto bg-white rounded-[5px] shadow-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 w-full" />
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded-[5px] w-3/4" />
            <div className="h-4 bg-gray-200 rounded-[5px] w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-[5px] w-full" />
              <div className="h-4 bg-gray-200 rounded-[5px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4 bg-red-50 border border-red-200 rounded-[5px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto p-4 bg-gray-50 border border-gray-200 rounded-[5px]">
        <p className="text-gray-600">No event details available</p>
      </div>
    );
  }

  const { name, isOnline, imageUrl, timeSlots, onlineEventTicket } = event;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <EventRegistrationHero 
       eventId={eventId}
       imageUrl={imageUrl}
       title={name}
       isOnline={isOnline}
       date={timeSlots[0].date}
       time={timeSlots[0].startTime}
       duration={timeSlots[0].duration}
       onlineEventTicket={onlineEventTicket}
      />
    </div>
  );
};

export default EventRegister;
