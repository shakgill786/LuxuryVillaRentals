import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (err) {
      const data = await err.json();
      if (data && data.message === 'Invalid credentials') {
        setErrors('The provided credentials were invalid');
      } else if (data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const handleDemoLogin = async () => {
    try {
      await dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }));
      closeModal();
    } catch (err) {
      const data = await err.json();
      if (data && data.message === 'Invalid credentials') {
        setErrors('Demo login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-modal-wrapper">
      <div className="login-modal" ref={modalRef}>
        <button className="close-modal-button" onClick={closeModal}>
          ✖
        </button>
        <h1>Log In</h1>
        {errors && <p className="error-message">{errors}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-modal-button" type="submit">
            Log In
          </button>
        </form>
        <button className="demo-login-button" onClick={handleDemoLogin}>
          Log in as Demo User
        </button>
      </div>
    </div>
  );
}

export default LoginFormModal;