import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session'; // Adjust the path to your Redux session actions
import { useModal } from '../../context/Modal';

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal(); // Close modal on successful signup
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // New state for First Name
  const [lastName, setLastName] = useState(''); // New state for Last Name
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate password confirmation
    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: 'Passwords do not match' });
    }
    setErrors({}); // Clear any previous errors

    try {
      // Dispatch signup action
      await dispatch(
        sessionActions.signup({
          email,
          username,
          password,
          firstName,
          lastName,
        })
      );
      closeModal(); // Close the modal on success
    } catch (err) {
      // Handle errors from the backend
      const data = await err.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className="signup-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}
        
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;