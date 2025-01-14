import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './SignupFormModal.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);

  const modalRef = useRef(null);

  useEffect(() => {
    // Handle clicking outside the modal to close it
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        resetForm();
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeModal]);

  // Reset fields and errors when the modal closes
  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setErrors({});
  };

  // Disable the button if validation fails
  useEffect(() => {
    const isFormValid =
      email &&
      username.length >= 4 &&
      password.length >= 6 &&
      password === confirmPassword &&
      firstName &&
      lastName;
    setIsDisabled(!isFormValid);
  }, [email, username, password, confirmPassword, firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: 'Passwords do not match' });
    }

    try {
      await dispatch(
        sessionActions.signup({
          email,
          username,
          password,
          firstName,
          lastName,
        })
      );
      resetForm();
      closeModal();
    } catch (err) {
      const data = await err.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className="signup-modal-wrapper">
      <div className="signup-modal" ref={modalRef}>
        {/* Close Modal Button */}
        <button
          className="close-modal-button"
          onClick={() => {
            resetForm();
            closeModal();
          }}
        >
          ✖
        </button>

        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}

          <label>
            <input
              type="text"
              placeholder="Username (min. 4 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p className="error">{errors.username}</p>}

          <label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p className="error">{errors.firstName}</p>}

          <label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p className="error">{errors.lastName}</p>}

          <label>
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="error">{errors.password}</p>}

          <label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button type="submit" disabled={isDisabled}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;