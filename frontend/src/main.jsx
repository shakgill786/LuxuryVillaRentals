import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
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
      <ModalProvider>
        <App />
        <Modal /> {/* Add Modal here to render modal content */}
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);