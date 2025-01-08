import { useNavigate } from "react-router-dom";

const encodeBase64 = (data: object) =>
  btoa(JSON.stringify(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

interface EventButtonProps {
  eventId: string;
  organizerId: number;
  isOnline: boolean;
}

const EventButtonBase64 = ({ eventId, organizerId, isOnline }: EventButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate(`/event/${encodeBase64({ eventId, organizerId, isOnline })}`)
      }
      className="w-full px-4 py-2 rounded-[5px] font-medium transition-colors text-white bg-blue-800 hover:bg-blue-900"
    >
      {isOnline ? "Join Now" : "Get Tickets"}
    </button>
  );
};

export default EventButtonBase64;
