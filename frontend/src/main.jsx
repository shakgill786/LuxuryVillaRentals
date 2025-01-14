import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ParallaxProvider } from 'react-scroll-parallax'; // Import ParallaxProvider
import App from './App';
import { Modal, ModalProvider } from './context/Modal'; // Import Modal
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';

// Create the Redux store
const store = configureStore();

// Expose store and csrfFetch for debugging in development
if (import.meta.env.MODE !== 'production') {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ParallaxProvider> {/* Parallax effects for the entire app */}
        <ModalProvider> {/* Provides context for modals */}
          <App />
          <Modal /> {/* Renders modal content */}
        </ModalProvider>
      </ParallaxProvider>
    </Provider>
  </React.StrictMode>
);