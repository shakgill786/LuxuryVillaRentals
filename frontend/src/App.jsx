import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginFormPage from "./components/LoginFormModal/LoginFormModal";
import SignupFormPage from "./components/SignupFormModal/SignupFormModal";
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import SpotDetailsPage from './components/SpotDetailsPage/SpotDetailsPage';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import ManageSpotsPage from './components/ManageSpotsPage/ManageSpotsPage';
import UpdateSpotForm from "./components/UpdateSpotForm/UpdateSpotForm";
import ReservationPage from "./components/ReservationPage/ReservationPage"; // Import the reservation page
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginFormPage />,
      },
      {
        path: '/signup',
        element: <SignupFormPage />,
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetailsPage />,
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />,
      },
      {
        path: '/manage-spots',
        element: <ManageSpotsPage />,
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm />,
      },
      {
        path: '/reserve',
        element: <ReservationPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;