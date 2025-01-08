import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './others/ErrorBoundary.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { SocketProvider } from './socket/socket.tsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={googleClientId}>
          {/* <SocketProvider> */}
          <Router>
            <App />
          </Router>
          {/* </SocketProvider> */}
        </GoogleOAuthProvider>
      </Provider>
    </ErrorBoundary>
  // </StrictMode>,
);
