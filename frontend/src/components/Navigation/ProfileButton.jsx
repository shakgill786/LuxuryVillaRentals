import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem.jsx';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
  };

  const navigateToManageSpots = () => {
    setShowMenu(false);
    navigate('/manage-spots');
  };

  const ulClassName = `profile-dropdown ${showMenu ? 'visible' : 'hidden'}`;

  return (
    <div className="profile-button-container">
      <button className="profile-button" onClick={toggleMenu} aria-label="Profile Menu">
        <FaUserCircle className="profile-icon" />
      </button>

      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="dropdown-item">Hello, {user.username}</li>
            <li className="dropdown-item">{user.email}</li>
            <li className="dropdown-item">
              <button onClick={navigateToManageSpots} className="dropdown-button">
                Manage Spots
              </button>
            </li>
            <li className="dropdown-item">
              <button onClick={logout} className="dropdown-button">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="dropdown-item">
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={() => setShowMenu(false)}
                modalComponent={<SignupFormModal />}
              />
            </li>
            <li className="dropdown-item">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={() => setShowMenu(false)}
                modalComponent={<LoginFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;