import React, { useEffect, useState } from "react";
import SocketService from "../../../services/SocketService";

interface ChatMessage {
  userId: number;
  message: string;
}

const ChatRoom: React.FC<{ eventId: string; userId: number }> = ({
  eventId,
  userId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Connect to the WebSocket server
    SocketService.connect();

    // Join the room
    SocketService.joinRoom(eventId, userId);

    // Handle incoming messages
    SocketService.onMessage((message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      SocketService.disconnect();
    };
  }, [eventId, userId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      SocketService.sendMessage(eventId, userId, newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>User {msg.userId}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
