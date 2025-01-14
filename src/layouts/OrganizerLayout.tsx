import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaBlog, FaChartBar, FaFileAlt, FaCreditCard, FaCog, FaUser, FaSignOutAlt, FaQuestionCircle, FaBars, FaTimes, FaVideo } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logoutOrganizer } from '../redux/action/organizerActions';
import { AppDispatch } from '../redux/store';
import OrganizerProtectedRoute from '../security/OrganizerProtectedRoute';
import { IOrganizerState } from '../interfaces/organizer';


interface NavItem {
  icon: IconType;
  label: string;
  link: string;
}

const navItems: NavItem[] = [
  { icon: FaHome, label: 'Home', link: '/organizer/dashboard' },
  { icon: FaVideo, label: 'Live', link: '/organizer/live' },
  { icon: FaCalendarAlt, label: 'Events', link: '/organizer/event-management' },
  { icon: FaBlog, label: 'Blogs', link: '/organizer/blog-management' },
  { icon: FaChartBar, label: 'Reports and Graph', link: '/organizer/reports-and-graph' },
  { icon: FaFileAlt, label: 'Reports', link: '/organizer/user-reports' },
  { icon: FaCreditCard, label: 'Payouts', link: '/organizer/payout-management' },
  { icon: FaCog, label: 'Settings', link: '/organizer/settings' },
];

const isItemSelected = () => {

   return false;
}

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void; onLogout: () => void; }> = ({ isOpen, toggleSidebar, onLogout }) => (
  <div className={`bg-blue-900 text-white flex flex-col transition-width duration-300 ease-in-out ${isOpen ? 'w-54' : 'w-16'} min-h-full flex-shrink-0`}>
    <div className="p-4 bg-blue-950 flex justify-between items-center">
      <img src='/secondary_logo.svg' className={`${isOpen ? 'block' : 'hidden'} h-5`} />
      <button onClick={toggleSidebar} className="text-white focus:outline-none">
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
    </div>
    <nav className="flex-grow">
      <ul className="space-y-2 p-4">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link to={item.link} 
              className={`flex items-center space-x-2 p-2 rounded ${location.pathname === item.link || isItemSelected() ? 'bg-blue-800' : ''} hover:bg-blue-800`}>
              <item.icon className="text-blue-100" size={16} />
              <span className={isOpen ? 'block' : 'hidden'}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    <div className="p-4 space-y-2 mb-4">
      <Link to='/organizer/profile' className="w-full bg-blue-800 p-2 rounded flex items-center justify-center space-x-2">
        <FaUser />
        <span className={isOpen ? 'block' : 'hidden'}>Profile</span>
      </Link>
      <button onClick={onLogout} className="w-full bg-red-600 p-2 rounded flex items-center justify-center space-x-2">
        <FaSignOutAlt />
        <span className={isOpen ? 'block' : 'hidden'}>Log Out</span>
      </button>
      <button className="w-full bg-blue-800 p-2 rounded flex items-center justify-center space-x-2">
        <FaQuestionCircle />
        <span className={isOpen ? 'block' : 'hidden'}>Help</span>
      </button>
    </div>
  </div>
);


const Navbar: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white shadow-md p-3">
    <h1 className="text-xl font-bold text-blue-900">{title}</h1>
  </div>
);

const OrganizerLayout: React.FC = () => {
  // const organizer = useSelector((state: { organizer: IOrganizerState }) => state.organizer);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();

  // Verification time auto Logout
  ////////////////////////////////
  // useEffect(() => {
  //   console.log(organizer)
  //   if (organizer.profile?.email == null){
  //     navigate("/login-organizer")
  //   }
  // },[organizer])
 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getTitleFromPath = (path: string) => {
    switch (path) {
      case '/organizer/dashboard':
        return 'Dashboard';
      case '/organizer/event-management':
        return 'Event Management';
      case '/organizer/blog-management':
        return 'Blogs Management';
      case '/organizer/reports-and-graph':
        return 'Reports and Graph';
      case '/organizer/user-reports':
        return 'User Reports Management';
      case '/organizer/payout-management':
        return 'Payouts Management';
      case '/organizer/settings':
        return 'Settings';
      case '/organizer/profile':
        return 'Profile';  
      case '/organizer/live':
        return 'Live Events'
      default:
        return 'Organizer Dashboard';
    }
  };

  const currentTitle = getTitleFromPath(location.pathname);

  const handleLogout = () => {
    setIsModalOpen(true); 
  };

  const confirmLogout = () => {
    dispatch(logoutOrganizer());
    setIsModalOpen(false); 
  };

  const cancelLogout = () => {
    setIsModalOpen(false); 
  };

  return (
    <>
    {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={cancelLogout}></div>
          <dialog open className="modal modal-open z-50">
            <div className="modal-box bg-blue-white text-black">
              <h3 className="font-bold text-lg">Logout Confirmation</h3>
              <p className="py-4">Are you sure you want to log out?</p>
              <div className="modal-action">
                <button onClick={cancelLogout} className="bg-blue-900 p-2 text-white rounded flex items-center justify-center space-x-2">Cancel</button>
                <button onClick={confirmLogout} className="bg-red-600 p-2 text-white rounded flex items-center justify-center space-x-2">Confirm</button>
              </div>
            </div>
          </dialog>
        </>
      )}
    <div className="flex h-screen bg-slate-100 text-sm">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      <div className="flex-grow overflow-hidden">
        <Navbar title={currentTitle} />
        <div className="p-5 overflow-auto h-[calc(100vh-52px)]">
          {currentTitle === 'Profile' ? <Outlet /> : <OrganizerProtectedRoute />} 
        </div>
      </div>
    </div>
    </>
  );
};

export default OrganizerLayout;
