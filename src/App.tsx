import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Header from './components/user/Header';
import ProtectedRoute from './routes/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/Userprofile';
import { checkAuth } from './features/auth/authSlice';
import { RootState, AppDispatch } from './app/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    console.log('App: Dispatching checkAuth');
    dispatch(checkAuth()).finally(() => {
      console.log('App: checkAuth completed');
      setIsInitialLoading(false);
    });
  }, [dispatch]);

  console.log('App State:', {
    isAuthenticated,
    isLoading,
    isInitialLoading,
    userRole: user?.role,
    user,
    currentPath: window.location.pathname,
  });

  if (isInitialLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <div className="container">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated && user ? (
                  <ProtectedRoute allowedRoles={['user']}>
                    <Home />
                  </ProtectedRoute>
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;