import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OnlineEventPreview from "../../components/user/event/OnlineEventPreview";
import OfflineEventPreview from "../../components/user/event/OfflineEventPreview";
import EventsBySameOrganizer from "../../components/user/cards/EventsBySameOrganizer";

const decodeBase64 = (encodedData: string) => {
  const base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

const EventPreview = () => {
  const { eventParams } = useParams<{ eventParams: string }>();
  const [eventId, setEventId] = useState<string | null>(null);
  const [organizerId, setOrganizerId] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (eventParams) {
      try {
        const { eventId, organizerId, isOnline } = decodeBase64(eventParams);
        console.log({ eventId, organizerId, isOnline });
        setEventId(eventId);
        setOrganizerId(organizerId);
        setIsOnline(isOnline);
      } catch (error) {
        console.error("Failed to decode event parameters:", error);
      }
    }
  }, [eventParams]);

  if (eventId === null || isOnline === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isOnline ? (
        <>
          <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-3/4">
                {organizerId && (
                  <OnlineEventPreview
                    eventId={eventId}
                    organizerId={organizerId}
                  />
                )}
              </div>
              <div className="w-full md:w-1/4">
              {organizerId && (
                <EventsBySameOrganizer
                eventId={eventId}
                organizerId={organizerId}
                />
              )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
        <div className="container mx-auto p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-3/4">
              {organizerId && (
                 <OfflineEventPreview 
                 eventId={eventId} 
                 organizerId={organizerId}
                 />
              )}
            </div>
            <div className="w-full md:w-1/4">
             {organizerId && (
                <EventsBySameOrganizer
                eventId={eventId}
                organizerId={organizerId}
                />
              )}
            </div>
          </div>
        </div>
      </>
      )}
    </>
  );
};

export default EventPreview;
