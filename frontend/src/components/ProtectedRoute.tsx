import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = () => {
  // Check Firebase auth state
  const user = auth.currentUser;

  // Get fallback user info from localStorage
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // If no user -> Kick to login
  if (!user && !userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to authenticated users
  return <Outlet />;
};

export default ProtectedRoute;