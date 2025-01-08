import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const encodeBase64 = (data: object) =>
  btoa(JSON.stringify(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

interface EventButtonProps {
  eventId: string;
  organizerId: number;
  isOnline: boolean;
  isFree: boolean;
  content: string;
}

const EventBookingButtonBase64 = ({ eventId, organizerId, isOnline, isFree , content }: EventButtonProps) => {

   const user = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  const navigateToContinue = () => {
    if(!user.isLogged){
        navigate("/login")
        return;
    }
     if(isOnline){
        navigate(`/event/register/${encodeBase64({eventId,organizerId,isOnline,isFree})}`)
     } else if (!isOnline) {
        navigate(`/event/tickets/${encodeBase64({eventId,organizerId,isOnline,isFree})}`)
     }
  }

  return (
    <button
      onClick={navigateToContinue}
      className="w-full px-4 py-3 rounded-[5px] font-medium transition-colors text-white bg-blue-900 hover:bg-blue-950"
    >
      {content}
    </button>
  );
};

export default EventBookingButtonBase64;


