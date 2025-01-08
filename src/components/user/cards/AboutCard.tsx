// import { Edit } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ProfileEditModal from '../modal/ProfileEditModal';
import { useState } from 'react';
import { Edit } from 'lucide-react';

const AboutCard = () => {

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

    const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
    <ProfileEditModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        />
   
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">About</h2>
        <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1.5 rounded-[5px] flex items-center transition duration-300 ease-in-out"
      >
        <Edit className="mr-1" size={16} />
        Edit
      </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-bold text-gray-700 mb-1">Name</h3>
          <p className="text-gray-600">{user?.username}</p>
        </div>
        
        <div>
          <h3 className="text-md font-bold text-gray-700 mb-1">Tell us about yourself and let people know who you are</h3>
          <p className="text-gray-600">
            {user?.about ? user.about : <span  onClick={handleOpenModal} >Add about section</span>}
          </p>
        </div>
        
        <div>
          <h3 className="text-md font-bold text-gray-700 mb-1">Address</h3>
          <p className="text-gray-600">{user?.address ? user.address : <span  onClick={handleOpenModal} >Add address</span>}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutCard;
