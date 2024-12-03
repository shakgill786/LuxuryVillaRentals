import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session'; // Adjust the path to your Redux session actions
import { useModal } from '../../context/Modal';
// import './LoginFormModal.css'; // Optional: Add styling if needed

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal(); // Close modal on successful login
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal(); // Close modal after successful login
    } catch (err) {
      const data = await err.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
