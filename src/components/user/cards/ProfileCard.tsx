import React, { useState } from 'react';
import { Calendar, Bell, LogOut, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../../redux/store';
import { logoutUser } from '../../../redux/action/userActions';


const ProfileCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);


  const [showModal, setShowModal] = useState(false);

  const profileData = {
    name: user?.username,
    email: user?.email,
    bookings: 56,
    following: 6,
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/');
      toast.info('Logout successful');
    } catch (error) {
      const errorMessage = 'Logout failed.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    handleLogout(); 
  };

  return (
    <div className="bg-white border border-blue-900 rounded-[5px] shadow-md p-4 h-min w-full md:w-1/3">
      <div className="flex flex-col items-center">
        <img src={user?.pro_img ? user.pro_img : 'user/profile/default_profile_img_low.png'} alt="Profile" className="rounded-full w-20 h-20 mb-3" />
        <h2 className="text-lg font-semibold text-blue-900">{profileData.name}</h2>
        <p className="text-sm text-gray-600 mb-3">{profileData.email}</p>
        <div className="flex justify-between w-full text-sm mb-4 px-8">
          <div className="text-center">
            <span className="block text-lg font-bold text-blue-900">{profileData.bookings}</span>
            <span className="text-gray-600">Bookings</span>
          </div>
          <div className="border-l border-gray-200"></div>
          <div className="text-center">
            <span className="block text-lg font-bold text-blue-900">{profileData.following}</span>
            <span className="text-gray-600">Following</span>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <Link to="/profile/calender" className="bg-blue-100 text-blue-900 border-blue-900 border py-2 px-4 rounded flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Calendar size={18} className="mr-2" />
            Show Calendar
          </Link>
          <button className="bg-blue-100 text-blue-900 border-blue-900 border py-2 px-4 rounded flex items-center justify-center hover:bg-blue-200 transition-colors relative">
            <Bell size={18} className="mr-2" />
            Notifications
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-100 text-red-600 border-red-600 border py-2 px-4 rounded flex items-center justify-center hover:bg-red-200 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Confirm Logout</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} className="text-gray-600 hover:text-gray-900" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                className="bg-red-100 text-red-600 border border-red-600 py-2 px-4 rounded hover:bg-red-200 transition-colors"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
