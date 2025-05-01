import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: ('user' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  console.log('ProtectedRoute State:', {
    isAuthenticated,
    isLoading,
    user,
    allowedRoles,
    currentPath: window.location.pathname,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    console.log('Redirecting to /login: Not authenticated or no user');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as 'user' | 'admin')) {
    console.log(`Role mismatch: user.role=${user.role}, allowedRoles=${allowedRoles}`);
    const redirectTo = user.role === 'admin' ? '/admin' : '/';
    console.log(`Redirecting to ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('Rendering protected component');
  return children;
};

export default ProtectedRoute;