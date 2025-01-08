import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface UnauthenticatedOrganizerPagesProps {
  element: React.ReactNode;
}

const UnauthenticatedOrganizerPages: React.FC<UnauthenticatedOrganizerPagesProps> = ({ element }) => {
  const { isLogged, profile } = useSelector((state: RootState) => state.organizer);

  if (isLogged) {
    if (profile?.role === 'ORGANIZER') {
      return <Navigate to="/organizer/dashboard" replace />;
    } else if (profile?.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{element}</>;
};

export default UnauthenticatedOrganizerPages;
