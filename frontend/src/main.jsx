// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';


// Create the Redux store
const store = configureStore();

// Expose store and csrfFetch for debugging in development
if (import.meta.env.MODE !== 'production') {
  restoreCSRF(); // Restore the CSRF token
  window.store = store; // Expose the store globally
  window.csrfFetch = csrfFetch; // Expose custom CSRF fetch wrapper globally
  window.sessionActions = sessionActions;
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);