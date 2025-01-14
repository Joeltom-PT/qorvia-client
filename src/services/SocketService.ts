import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    this.socket = io("http://localhost:8087"); 
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinRoom(eventId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit("join_room", { eventId, userId });
    }
  }

  sendMessage(eventId: string, userId: string, message: string): void {
    if (this.socket) {
      this.socket.emit("chat_message", { eventId, userId, message });
    }
  }

  onMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on("chat_message", callback);
    }
  }

  onRoomStatus(callback: (status: string) => void): void {
    if (this.socket) {
      this.socket.on("room_status", callback);
    }
  }
}

export default new SocketService();
