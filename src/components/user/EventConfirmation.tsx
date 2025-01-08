import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Base64 } from "js-base64";
import OrderConfirmationForm from "./OrderConfirmationForm";
import { TicketSelected } from "./OrderSummaryCard";

const EventConfirmation = () => {
  const { eventParams } = useParams<{ eventParams: string }>();
  const user = useSelector((state: RootState) => state.user);
  const [ticketOptions, setTicketOptions] = useState<TicketSelected[] | null>(null);
  const [decryptedData, setDecryptedData] = useState<{ eventId: string; isOnline: boolean } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user.isLogged || user.user == null) {
      navigate("/login");
    } else if (eventParams) {
      const data = decryptParams(eventParams);
      setDecryptedData(data);
      if (!data.isOnline && location.state.selectedTickets) {
        setTicketOptions(location.state.selectedTickets);
      }
    }
  }, [user, navigate, eventParams]);

  function decryptParams(encryptedParams: string) {
    const decryptedString = Base64.decode(encryptedParams);
    return JSON.parse(decryptedString);
  }

  return (
    <div>
      {decryptedData && (
        <OrderConfirmationForm
          eventId={decryptedData.eventId}
          isOnline={decryptedData.isOnline}
          ticketOptions={ticketOptions}
        />
      )}
    </div>
  );
};

export default EventConfirmation;
