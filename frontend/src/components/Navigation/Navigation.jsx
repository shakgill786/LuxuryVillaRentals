import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { FaUserCircle } from 'react-icons/fa'; // Import Font Awesome Icon

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/">
          <img src="/Logo1.webp" alt="Luxury Villas Logo" className="logo" />
        </NavLink>
      </div>

      {/* Centered Title */}
      <div className="navbar-title">Escape - Indulge - Relax</div>

      {/* Profile Button */}
      <ul className="navbar-links">
        {sessionUser && (
          <li>
            <NavLink to="/spots/new" className="create-spot-button">
              Create a New Spot
            </NavLink>
          </li>
        )}
        {isLoaded && (
          <li className="profile-button-container">
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;