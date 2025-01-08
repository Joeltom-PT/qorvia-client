// import { io, Socket } from "socket.io-client";

// // Define the interface for the Socket type if needed
// let socket: Socket | null = null;

// export const connectSocket = () => {
//     // Initialize the Socket.IO connection to the server URL
//     socket = io("http://localhost:9092"); // Ensure the URL matches your server config

//     // Listen for connection events
//     socket.on("connect", () => {
//         console.log("Connected to Socket.IO server");
//     });

//     socket.on("disconnect", (reason) => {
//         console.log("Disconnected from server:", reason);
//     });

//     socket.on("connect_error", (error) => {
//         console.error("Socket connection error:", error);
//     });
// };

// export const disconnectSocket = () => {
//     if (socket) {
//         socket.disconnect();
//         console.log("Socket disconnected manually.");
//     }
// };

// export const subscribeToUserStatus = (callback: (data: any) => void) => {
//     if (socket) {
//         // Listen for the user status update event from the backend
//         socket.on("userStatusUpdated", (data) => {
//             console.log("Received user status update:", data);
//             callback(data);  // Pass data to callback for handling
//         });
//     }
// };

// export const unsubscribeFromUserStatus = () => {
//     if (socket) {
//         socket.off("userStatusUpdated");
//         console.log("Unsubscribed from user status updates.");
//     }
// };
