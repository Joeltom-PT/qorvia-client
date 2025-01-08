import { Navigate, Route, Routes } from "react-router-dom";
import OfflineEventDetails from "../../../../components/organizer/event/offline/OfflineEventDetails";
import OfflineEventSettings from "../../../../components/organizer/event/offline/OfflineEventSettings";
import OfflineEventTickets from "../../../../components/organizer/event/offline/OfflineEventTickets";
import OfflineEventTimeSlots from "../../../../components/organizer/event/offline/OfflineEventTimeSlots";

const CreateOfflineEvent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="details" replace />} />
      <Route path="details/:id?" element={<OfflineEventDetails />} />
      <Route path="location-time/:id?" element={<OfflineEventTimeSlots />} />
      <Route path="tickets/:id?" element={<OfflineEventTickets />} />
      <Route path="settings/:id?" element={<OfflineEventSettings />} />
    </Routes>
  );
};

export default CreateOfflineEvent;
