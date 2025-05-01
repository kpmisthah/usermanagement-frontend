import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { updateProfile } from '../features/auth/authSlice';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isError } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    } else {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formDataToSend = new FormData();
    if (formData.username) formDataToSend.append('username', formData.username);
    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.password) formDataToSend.append('password', formData.password);
    if (file) formDataToSend.append('file', file);

    try {
      const response = await api.put('/user/update', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateProfile(response.data));
      alert('Profile updated successfully');
      setFormData({ ...formData, password: '' });
      setFile(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Invalid email');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  if (!user || !isAuthenticated) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>User Profile</h1>
      {isError && <p style={{ color: 'red' }}>{isError}</p>}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = '/default-profile.png';
            }}
          />
        ) : (
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            No Image
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password (leave blank to keep unchanged)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;