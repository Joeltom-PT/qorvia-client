import React from 'react';
import { Home, Info, Settings, ShoppingBag } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const ProfileNavigation: React.FC = () => {
  const location = useLocation();

  const getButtonClasses = (path: string) => {
    return location.pathname === path
      ? 'flex items-center text-white bg-blue-900 px-3 py-2 rounded transition-colors'
      : 'flex items-center text-blue-900 hover:bg-blue-200 px-3 py-2 rounded transition-colors';
  };

  return (
    <nav className="bg-blue-100 p-2 rounded-[5px] shadow-md mb-4 border border-blue-900">
      <ul className="flex justify-between items-center">
        <li>
          <Link to="/profile">
            <button className={getButtonClasses('/profile')}>
              <Home size={18} className="mr-2" />
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link to="/profile/about">
            <button className={getButtonClasses('/profile/about')}>
              <Info size={18} className="mr-2" />
              About
            </button>
          </Link>
        </li>
        <li>
          <Link to="/profile/settings">
            <button className={getButtonClasses('/profile/settings')}>
              <Settings size={18} className="mr-2" />
              Settings
            </button>
          </Link>
        </li>
        <li>
          <Link to="/profile/bookings">
            <button className={getButtonClasses('/profile/bookings')}>
              <ShoppingBag size={18} className="mr-2" />
              Bookings
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
