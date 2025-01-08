import { Navigate, Route, Routes } from "react-router-dom"
import EventDetails from "../../../../components/organizer/event/online/OnlineEventDetails"
import EventSettings from "../../../../components/organizer/event/online/OnlineEventSettings"
import EventTickets from "../../../../components/organizer/event/online/OnlineEventTickets"
import EventTimeSlots from "../../../../components/organizer/event/online/OnlineEventTimeSlots"

const CreateOnlineEvent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="details" replace />} />
      <Route path="details/:id?" element={<EventDetails />} />
      <Route path="time-slots/:id?" element={<EventTimeSlots />} />
      <Route path="tickets/:id?" element={<EventTickets />} />
      <Route path="settings/:id?" element={<EventSettings />} />
    </Routes>
  )
}

export default CreateOnlineEvent
