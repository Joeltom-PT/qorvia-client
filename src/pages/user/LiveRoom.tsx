import React, { useState } from "react";
import ChatRoom from "../../components/user/room/ChatRoom";

const LiveRoom: React.FC = () => {
  const [eventId, setEventId] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  const handleEnterChat = () => {
    if (eventId.trim() && userId !== null) {
      setIsChatActive(true);
    } else {
      alert("Please enter both Event ID and User ID.");
    }
  };

  const handleLeaveChat = () => {
    setIsChatActive(false);
    setEventId("");
    setUserId(null);
  };

  return (
    <div className="chat-room-manager p-4 bg-gray-100 rounded shadow-md">
      {!isChatActive ? (
        <div className="setup-form">
          <h2 className="text-lg font-bold mb-4">Enter Chat Room</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Event ID:</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter Event ID"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">User ID:</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={userId || ""}
              onChange={(e) => setUserId(parseInt(e.target.value))}
              placeholder="Enter User ID"
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleEnterChat}
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <div className="active-chat">
          <button
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleLeaveChat}
          >
            Leave Chat
          </button>
          <ChatRoom eventId={eventId} userId={userId as number} />
        </div>
      )}
    </div>
  );
};

export default LiveRoom;
