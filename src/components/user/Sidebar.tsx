import React from 'react';
import { TfiClose } from 'react-icons/tfi';
import './Sidebar.css';
import Button from './Button';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-transform ${isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="bg-cover bg-center bg-no-repeat h-full bg-[url('/user/bg/sidebar_bg_img.jpg')] w-full">
        <div className="bg-blue-950 h-full opacity-90">
          <div className="p-4 flex justify-between items-center">
            <img src="/secondary_logo.svg" alt="Logo" className="max-w-[50%] md:max-w-[25%]" />
            <Button onClick={onClose} className='rounded'>
              <TfiClose size={25} />
            </Button>
          </div>
          <div className="p-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Home</Link>
              <Link to="/explore" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Explore Events</Link>
              <Link to="/organizers" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Organizers</Link>
              <Link to="/become-an-organizer" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Become an Organizer</Link>
              <Link to="/blogs" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Blogs</Link>
              <Link to="/contact-support" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Contact and Support</Link>
              <Link to="/about" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">About</Link>
              <Link to="/privacy-policy" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">Privacy and Policy</Link>
              <Link to="/faqs" onClick={onClose} className="text-white font-light text-2xl hover:text-gray-300">FAQs</Link>
            </nav>
          </div>
        </div>
      </div>
  
      {/* Right Content
      <div className="bg-cover bg-center bg-blue-100 bg-no-repeat h-full hidden sm:block xl:w-2/4">
      <div className="p-4 flex justify-between items-center">
            <img src="/secondary_logo.svg" alt="Logo" className="max-w-[50%] md:max-w-[25%]" />
            <Button onClick={onClose} className='rounded'>
              <TfiClose size={25} />
            </Button>
          </div>
        <div className="bg-blue-100 h-full opacity-90 p-4">
          <div className="text-black text-center mb-6">
            <h2 className="text-3xl font-semibold">Welcome Back!</h2>
            <p className="text-lg">Here's what's happening today:</p>
          </div>
          <div className="text-white">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">Notifications</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-lg">New event created by John Doe</li>
                <li className="text-lg">You have 3 new messages</li>
                <li className="text-lg">Event "Tech Conference" starts tomorrow</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold">Settings</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-lg">Update Profile</li>
                <li className="text-lg">Change Password</li>
                <li className="text-lg">Privacy Settings</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold">Upcoming Events</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-lg">React Meetup - Dec 5th</li>
                <li className="text-lg">Spring Boot Workshop - Dec 10th</li>
                <li className="text-lg">JavaScript Conference - Dec 15th</li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  </div>
  
  );
};

export default Sidebar;
