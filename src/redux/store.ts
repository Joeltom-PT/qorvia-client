import { PersistPartial } from 'redux-persist/es/persistReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loadingSlice from './reducers/globalSlice';
import userSlice from './reducers/userSlice';
import organizerSlice from './reducers/organizerSlice'; 
import webrtcSlice from './reducers/webrtcSlice';

const rootReducer = combineReducers({
  loading: loadingSlice,
  user: userSlice,
  organizer: organizerSlice,
  webrtc: webrtcSlice,

});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loading', 'user', 'organizer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'webrtc/setLocalStream', 
          'webrtc/setRemoteStream',
        ],
        ignoredPaths: ['webrtc.localStream', 'webrtc.remoteStream'],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer> & PersistPartial;

export default store;
