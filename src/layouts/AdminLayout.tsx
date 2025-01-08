import { useState, ReactNode  } from 'react';
import { Home, Users, Calendar, FileText, DollarSign, HelpCircle, Menu, X, UserCircle, LogOut } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { logoutOrganizer } from '../redux/action/organizerActions';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation(); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  const pathToTitleMap: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/organizer-management': 'Organizer Management',
    '/admin/event-management': 'Event Management',
    '/admin/user-management': 'Users Management',
    '/admin/graph-and-reports': 'Graph and Reports',
    '/admin/payout-management': 'Payout Management',
    '/admin/help': 'Help',
    '/admin/profile': 'Profile',
  };

  const pageTitle = pathToTitleMap[location.pathname] || 'Dashboard'; 

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
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col bg-indigo-900 text-white transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4">
          <h1 className={`${sidebarOpen ? 'block' : 'hidden'} text-2xl font-bold`}>QORVIA</h1>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="flex-1">
          <SidebarItem icon={<Home size={20} />} text="Home" link="/admin/dashboard" expanded={sidebarOpen} location={location} />
          <SidebarItem icon={<Users size={20} />} text="Organizers" link="/admin/organizer-management" expanded={sidebarOpen} location={location} />
          <SidebarItem icon={<Calendar size={20} />} text="Events" link="/admin/event-management" expanded={sidebarOpen} location={location} />
          <SidebarItem icon={<Users size={20} />} text="Users Management" link="/admin/user-management" expanded={sidebarOpen} location={location} />
          <SidebarItem icon={<FileText size={20} />} text="Graph and Reports" link="/admin/graph-and-reports" expanded={sidebarOpen} location={location} />
          <SidebarItem icon={<DollarSign size={20} />} text="Payout Management" link="/admin/payout-management" expanded={sidebarOpen} location={location} />
        </nav>
        <div className="mt-auto border-t border-indigo-800">
          <SidebarItem icon={<HelpCircle size={20} />} text="Help" link="/admin/help" expanded={sidebarOpen} location={location} />
          <SidebarItem icon={<UserCircle size={20} />} text="Profile" link="/admin/profile" expanded={sidebarOpen} location={location} />
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-800 focus:outline-none"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border border-b-2">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  link: string;
  expanded: boolean;
  location: ReturnType<typeof useLocation>; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, link, expanded, location }) => (
  <Link to={link} className={`flex items-center px-4 py-2 text-gray-300 ${link === location.pathname ? 'bg-indigo-800' : ''} hover:bg-indigo-800`}>
    {icon}
    {expanded && <span className="ml-3">{text}</span>}
  </Link>
);

export default AdminLayout;
