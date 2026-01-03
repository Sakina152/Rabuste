import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Get user info from storage
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // 2. Security Check
  // If no user OR user is not admin -> Kick them to login
  if (!userInfo || userInfo.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // 3. Allow access
  return <Outlet />;
};

export default ProtectedRoute;