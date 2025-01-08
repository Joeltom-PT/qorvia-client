import React, { useEffect, useRef } from 'react';  // Add missing imports
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';  // Correct import
import { AppDispatch } from '../redux/store';
import { setRemoteStream, setRole } from '../redux/reducers/webrtcSlice';
import CommentComponent from './CommentComponent';

const Viewer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const stompClient = Stomp.over(new SockJS('http://localhost:8882/ws'));  // Direct initialization
  let remotePeerConnection: RTCPeerConnection;

  useEffect(() => {
    dispatch(setRole('viewer'));

    stompClient.connect({}, () => {
      console.log("WebSocket connection established");

      stompClient.subscribe('/topic/offer', (message: any) => {
        handleOffer(JSON.parse(message.body));
      });
      stompClient.subscribe('/topic/answer', (message: any) => {
        handleAnswer(JSON.parse(message.body));
      });
      stompClient.subscribe('/topic/candidate', (message: any) => {
        handleCandidate(JSON.parse(message.body));
      });
    }, (error: any) => {
      console.error("WebSocket connection failed", error);
    });

    return () => {
      stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    };
  }, [dispatch, stompClient]);

  const handleOffer = (offer: RTCSessionDescriptionInit) => {
    remotePeerConnection = new RTCPeerConnection();
    remotePeerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => remotePeerConnection.createAnswer())
      .then(answer => {
        remotePeerConnection.setLocalDescription(answer);
        if (stompClient?.connected) {
          stompClient.send('/app/webrtc/answer', {}, JSON.stringify(answer));
        }
      }).catch(error => {
        console.error("Error handling offer.", error);
      });
    remotePeerConnection.onicecandidate = (event) => {
      if (event.candidate && stompClient?.connected) {
        stompClient.send('/app/webrtc/candidate', {}, JSON.stringify(event.candidate));
      }
    };
    remotePeerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      dispatch(setRemoteStream(event.streams[0]));
    };
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    remotePeerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      .catch(error => {
        console.error("Error handling answer.", error);
      });
  };

  const handleCandidate = (candidate: RTCIceCandidateInit) => {
    const rtcCandidate = new RTCIceCandidate(candidate);
    remotePeerConnection.addIceCandidate(rtcCandidate)
      .catch(error => {
        console.error("Error adding ICE candidate.", error);
      });
  };

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay playsInline />
      {/* <CommentComponent /> */}
    </div>
  );
};

export default Viewer;
