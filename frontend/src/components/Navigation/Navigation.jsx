import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal'; // Import LoginFormModal
import SignupFormModal from '../SignupFormModal/SignupFormModal'; // Import SignupFormModal
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const sessionLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} />
      <button onClick={logout}>Log Out</button> {/* Logout button for logged-in users */}
    </li>
  ) : (
    <>
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />} // Trigger Login modal
        />
      </li>
      <li>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />} // Trigger Signup modal
        />
      </li>
    </>
  );

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink> {/* Home link remains as is */}
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;