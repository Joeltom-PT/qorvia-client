import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { changeAdminPassword } from '../../redux/action/adminActions';
import { toast } from 'react-toastify';


interface ResetPasswordModalProps {
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const isPasswordValid = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasDigit;
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    if (!isPasswordValid(password)) {
      setError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.'
      );
    } else {
      setError(''); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError(''); 

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit.'
      );
      return;
    }
   try{
    await dispatch(changeAdminPassword({ currentPass: currentPassword, newPass: newPassword })).unwrap();
      onClose();
      toast.success("Password change sucessful.")
   } catch {
    toast.error("Failed to update password. Please try again!");
   }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-[5px] w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <p className="mb-4">Please enter your current password and a new password to reset.</p>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full p-2 mb-2 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 mb-2 border rounded"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-2 mb-4 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className='flex justify-between'>
          <button type="submit" className="bg-blue-900 text-white py-2 px-4 rounded">Submit</button>
          <button onClick={onClose} className="bg-blue-900 text-white py-2 px-4 rounded">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};



  interface RevenueSettingsModalProps {
    onClose: () => void;
  }
  
  const RevenueSettingsModal: React.FC<RevenueSettingsModalProps> = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
          <h2 className="text-xl font-semibold mb-4">Revenue Settings</h2>
          <div className="flex items-center mb-4">
            <input type="number" defaultValue={13} className="w-16 p-2 border rounded mr-2" />
            <span>% of each event's revenue will be taken as administrative fees (our revenue).</span>
          </div>
          <p className="text-red-600 mb-4 text-sm">
            Warning: Changing the percentage of administrative fees will impact all pending payouts in the current month and future months. This adjustment will be applied to all existing and upcoming transactions, potentially altering the amounts to be disbursed to recipients. Please ensure you review and confirm the changes to avoid any unintended consequences.
          </p>
          <div className="flex justify-end">
            <button onClick={onClose} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">Discard Changes</button>
            <button className="bg-red-500 text-white py-2 px-4 rounded">Save Changes</button>
          </div>
        </div>
      </div>
    );
  };
  
  

const AdminProfile: React.FC = () => {
  const [isRevenueModalOpen, setRevenueModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="border p-4 rounded mb-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={() => setRevenueModalOpen(true)}
        >
          Edit
        </button>
        <span className="ml-4">Edit default settings of the revenue</span>
      </div>
      <div className="border p-4 rounded">
        <button
          className="bg-blue-900 text-white py-2 px-4 rounded"
          onClick={() => setPasswordModalOpen(true)}
        >
          Change Password
        </button>
      </div>
      
      {isRevenueModalOpen && (
        <RevenueSettingsModal onClose={() => setRevenueModalOpen(false)} />
      )}
      {isPasswordModalOpen && (
        <ResetPasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
    </div>
  );
};

export default AdminProfile;
