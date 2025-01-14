import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ParallaxProvider } from 'react-scroll-parallax'; // Import ParallaxProvider
import App from './App';
import { ModalProvider } from './context/Modal'; // Import Modal
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';

const store = configureStore();

// Ensure user session persistence on refresh
async function initializeApp() {
  if (import.meta.env.MODE !== 'production') {
    restoreCSRF();
    window.csrfFetch = csrfFetch;
    window.store = store;
    window.sessionActions = sessionActions;
  }

  // Dispatch restoreUser to load user session before rendering
  await store.dispatch(sessionActions.restoreUser());

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <ParallaxProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </ParallaxProvider>
      </Provider>
    </React.StrictMode>
  );
}

initializeApp();