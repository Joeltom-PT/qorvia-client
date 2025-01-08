import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebrtcState {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    role: string;
  }
  
  const initialState: WebrtcState = {
    localStream: null,
    remoteStream: null,
    role: '',
  };
  
  const webrtcSlice = createSlice({
    name: 'webrtc',
    initialState,
    reducers: {
      setLocalStream(state, action: PayloadAction<MediaStream>) {
        state.localStream = action.payload;
      },
      setRemoteStream(state, action: PayloadAction<MediaStream>) {
        state.remoteStream = action.payload;
      },
      setRole(state, action: PayloadAction<string>) {
        state.role = action.payload;
      },
    },
  });
  
  export const { setLocalStream, setRemoteStream, setRole } = webrtcSlice.actions;
  export default webrtcSlice.reducer;