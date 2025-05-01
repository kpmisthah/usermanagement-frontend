import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../app/store';
import { toast } from 'react-toastify';  // Fixed import
import '../../public/Login.css';
import { reset } from '../features/auth/authSlice';
import { login } from '../features/auth/authSlice';
import Spinner from '../components/user/Spinner';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    setIsLoaded(true); // Trigger animation
  }, []);

  useEffect(() => {
    console.log('Login state:', { user, isError, isSuccess, message, isLoading, isAuthenticated });
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess && user) {
      toast.success('Logged in successfully!');
      navigate('/');
      dispatch(reset());
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [user, isError, isSuccess, message, navigate, dispatch, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await dispatch(login({ username, password })).unwrap();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="form-container">
      <div className={`welcome-container ${isLoaded ? 'loaded' : ''}`}>
        <div className="welcome-animation">
          <div className="welcome-text">
            <span className="welcome-word">Welcome</span>
            <span className="welcome-word">Back</span>
          </div>
          <div className="welcome-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-circle"></div>
          </div>
        </div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          name="username"
          placeholder="Username"
          value={username}
          onChange={onChange}
          required
        />
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <button className="form-btn" disabled={isLoading}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
