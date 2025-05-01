import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Home: React.FC = () => {
  const { user ,isAuthenticated} = useSelector((state: RootState) => state.auth);
console.log(user,'user',isAuthenticated,'uhvsid')
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to User Management</h1>
      {isAuthenticated && user ? (
        <div>
          <p>Hello, {user.username}!</p>
          <Link to="/profile" style={{ color: '#007bff', textDecoration: 'none' }}>
            View Your Profile
          </Link>
        </div>
      ) : (
        <p>Please <Link to="/login">log in</Link> or <Link to="/register">register</Link>.</p>
      )}
    </div>
   
  );
};

export default Home;