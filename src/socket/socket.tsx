// import { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

// export const SocketContext = createContext<ReturnType<typeof Stomp.over> | null>(null);

// export const useSocket = () => useContext(SocketContext);

// type Children = {
//     children: ReactNode;
// };

// export const SocketProvider = ({ children }: Children) => {
//     const [stompClient, setStompClient] = useState<ReturnType<typeof Stomp.over> | null>(null);

//     useEffect(() => {
//         const sock = new SockJS(`${process.env.VITE_API_BASE_URL}/account/socket/ws`);
//         const client = Stomp.over(sock);

//         client.connect({}, (frame: any) => {
//             console.log('Connected: ' + frame);
//             setStompClient(client);
//         }, (error: any) => {
//             console.error('Connection error: ' + error);
//             setStompClient(null); // Handle connection error
//         });

//         // Cleanup on unmount
//         return () => {
//             if (client) {
//                 client.disconnect();
//             }
//         };
//     }, []);

//     return (
//         <SocketContext.Provider value={stompClient}>
//             {children}
//         </SocketContext.Provider>
//     );
// };
