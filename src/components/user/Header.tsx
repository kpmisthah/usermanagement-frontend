import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../../../public/Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { logout, reset } from '../../features/auth/authSlice';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">User Management</Link>
      </div>
      <ul>
        {user ? (
          <div className="user-menu">
            <div className="user-icon" onClick={toggleDropdown}>
              <FaUser />
              <span style={{ marginLeft: '8px' }}>{user.username}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={() => alert('Upload feature coming soon')}>
                  Change Profile Picture
                </button>
                <button onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
