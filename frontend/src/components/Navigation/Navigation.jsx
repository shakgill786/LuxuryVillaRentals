import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

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

      {/* Auth/User Buttons */}
      <div className="navbar-links">
        {sessionUser && (
          <NavLink to="/spots/new" className="create-spot-button">
            Create a New Spot
          </NavLink>
        )}
        {isLoaded && (
          <div className="profile-button-container">
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;