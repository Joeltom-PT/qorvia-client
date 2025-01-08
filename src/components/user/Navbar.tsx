import React, { useState } from 'react';
import { TfiMenu } from 'react-icons/tfi';
import Button from './Button';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IUserState } from '../../interfaces/user';

interface NavbarProps {
  isFloating?: boolean;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state: { user: IUserState }) => state.user);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleProfile = () => {
    if (user.isLogged) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const isFloating = location.pathname === '/';

  return (
    <>
      <nav
        className={`p-4 flex items-center justify-between ${
          isFloating ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'bg-blue-100'
        }`}
      >
        <img
          src={isFloating ? '/secondary_logo.svg' : '/primary_logo.svg'}
          alt="Logo" className="max-w-[50%] md:max-w-[25%] cursor-pointer"
          onClick={() => navigate('/')} 
        />
        <div className="flex items-center space-x-4">
          <button onClick={handleProfile} className='w-[45px] h-[45px] rounded-full border-2 border-blue-900'>
            {user.isLogged ? 
              <img src={user.user?.pro_img ? user.user.pro_img : "user/profile/default_profile_img_low.png" } alt="User Profile" className='rounded-full'/> :
              <img src="user/profile/default_profile_img_low.png" alt="Default Profile" className='transform mx-auto rounded-full'/>
            } 
          </button>
          <Button variant="primary" rounded onClick={handleSidebarOpen}>
            <TfiMenu size={25} />
          </Button>
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export default Navbar;
