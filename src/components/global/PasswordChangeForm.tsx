import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { passwordReset } from '../../redux/action/userActions';
import { toast } from 'react-toastify';

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [requiredErrors, setRequiredErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const dispatch = useDispatch<AppDispatch>();
  const email = useSelector((state: RootState) => state.user.user?.email);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("1 lowercase letter");
    if (!/\d/.test(password)) errors.push("1 digit");
    if (!/[!@#$%^&*]/.test(password)) errors.push("1 special character");
    return errors;
  };

  useEffect(() => {
    setValidationErrors(validatePassword(newPassword));
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!currentPassword) errors.push('Current password is required.');
    if (!newPassword) errors.push('New password is required.');
    if (!confirmPassword) errors.push('Please confirm your new password.');
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.push('New password and confirmation do not match.');
    }
    setRequiredErrors(errors);
    if (errors.length > 0) {
      return;
    }
    const passwordValidationErrors = validatePassword(newPassword);
    setValidationErrors(passwordValidationErrors);
    if (passwordValidationErrors.length > 0) {
      return;
    }
  
    if (!email) {
      toast.error('Email is missing. Please log in again.');
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(passwordReset({ email : email, currentPass: currentPassword, newPass: newPassword })).unwrap();
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error || 'Password change request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
      <p className="text-sm text-gray-600 mb-6">Change password</p>
      <p className="text-xs text-gray-500 mb-6">
        You can update your password from here. If you can't remember your current password, just log out and click on Forgot password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current password*
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-1 focus:ring-blue-900"
            placeholder="Enter your password"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New password*
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-1 focus:ring-blue-900"
            placeholder="Enter your password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm new password*
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-1 focus:ring-blue-900"
            placeholder="Enter your password"
          />
        </div>

        {requiredErrors.length > 0 && (
          <div className="text-sm text-red-500">
            <ul className="list-disc list-inside">
              {requiredErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {newPassword && validationErrors.length > 0 && (
          <div className="text-sm text-red-500">
            Password must contain:
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-blue-900 text-white py-2 px-4 rounded-[5px] hover:bg-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-900 focus:ring-offset-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
