import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { setLocalStream, setRemoteStream, setRole } from '../redux/reducers/webrtcSlice';
import CommentComponent from './CommentComponent';

const Host: React.FC = () => {
  const dispatch = useDispatch();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [stompClient, setStompClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  // ICE Servers configuration (STUN/TURN)
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' }, // Google STUN server
  ];

  const connectWebSocket = () => {
    console.log("Attempting to connect to WebSocket...");
    const socket = new SockJS('http://localhost:8882/ws'); // Correct URL here
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setIsConnected(true);
      console.log("WebSocket connected");

      // Subscribe to topics
      client.subscribe('/topic/offer', (message: any) => {
        handleOffer(JSON.parse(message.body));
      });
      client.subscribe('/topic/answer', (message: any) => {
        handleAnswer(JSON.parse(message.body));
      });
      client.subscribe('/topic/candidate', (message: any) => {
        handleCandidate(JSON.parse(message.body));
      });

      // Get user media
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          dispatch(setLocalStream(stream));
          createOffer(stream); // Pass the stream to createOffer
        }).catch(error => {
          console.error("Error accessing media devices.", error);
        });
    }, (error: any) => {
      console.error("WebSocket connection failed", error);
      setIsConnected(false);
      // Try reconnecting after a delay
      setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
    });

    return client;
  };

  useEffect(() => {
    dispatch(setRole('host'));
    const client = connectWebSocket();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
      // Clean up peer connection if it exists
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [dispatch, peerConnection]);

  const createOffer = (stream: MediaStream) => {
    // Create a new peer connection
    const peerConnection = new RTCPeerConnection({ iceServers });
    setPeerConnection(peerConnection);

    // Add local stream tracks to the peer connection
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    // Set up ICE candidate handler
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        stompClient.send('/app/candidate', {}, JSON.stringify(event.candidate));
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      dispatch(setRemoteStream(event.streams[0]));
    };

    // Create an offer
    peerConnection.createOffer()
      .then((offer) => {
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        // Send the offer via WebSocket
        stompClient.send('/app/offer', {}, JSON.stringify(peerConnection.localDescription));
      })
      .catch((error) => {
        console.error('Error creating offer:', error);
      });
  };

  const handleOffer = (offer: RTCSessionDescriptionInit) => {
    // Create a new peer connection for handling the offer
    const peerConnection = new RTCPeerConnection({ iceServers });
    setPeerConnection(peerConnection);

    // Set the remote description with the received offer
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        // Get the local stream and add it to the peer connection
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            dispatch(setLocalStream(stream));

            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            // Create an answer
            return peerConnection.createAnswer();
          })
          .then((answer) => {
            return peerConnection.setLocalDescription(answer);
          })
          .then(() => {
            // Send the answer back via WebSocket
            stompClient.send('/app/answer', {}, JSON.stringify(peerConnection.localDescription));
          })
          .catch((error) => {
            console.error('Error handling offer:', error);
          });
      })
      .catch((error) => {
        console.error('Error setting remote description:', error);
      });

    // Set up ICE candidate handler
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        stompClient.send('/app/candidate', {}, JSON.stringify(event.candidate));
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      dispatch(setRemoteStream(event.streams[0]));
    };
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    // Set the remote description with the received answer
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
        .catch((error) => {
          console.error('Error setting remote description with answer:', error);
        });
    }
  };

  const handleCandidate = (candidate: RTCIceCandidateInit) => {
    // Add the received ICE candidate to the peer connection
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error('Error adding ICE candidate:', error);
        });
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      <CommentComponent />
    </div>
  );
};

export default Host;
