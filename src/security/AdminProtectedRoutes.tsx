import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface AdminProtectedRouteProps {
  children: React.ReactElement;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const profile = useSelector((state: RootState) => state.organizer.profile);
  const isLogged = useSelector((state: RootState) => state.organizer.isLogged);

  if (isLogged && profile?.role === 'ADMIN') {
    return children;
  } else {
    return <Navigate to="/login-organizer" />;
  }
};

export default AdminProtectedRoute;
