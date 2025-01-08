import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { forgotPasswordRequest, forgotPasswordReset } from '../../redux/action/userActions';
import { useNavigate } from 'react-router-dom';

// Define your validation schemas
const emailSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const resetSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  otp: yup.string().required('OTP is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

type EmailFormData = {
  email: string;
};

type ResetFormData = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

const ForgotPassword: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { control: emailControl, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors }, reset: resetEmailForm } = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
  });

  const { control: resetControl, handleSubmit: handleResetSubmit, formState: { errors: resetErrors }, reset: resetResetForm } = useForm<ResetFormData>({
    resolver: yupResolver(resetSchema),
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setLoading(true);
    try {
      await dispatch(forgotPasswordRequest({ email: data.email })).unwrap();
      setEmail(data.email);
      resetEmailForm();
      setStage('reset');
      resetResetForm({ email: data.email });
      toast.success('OTP sent to your email');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    setLoading(true);
    try {
      await dispatch(forgotPasswordReset({ email: data.email, otp: data.otp, password: data.password })).unwrap();
      toast.success('Password reset successfully');
      setIsOpen(false); 
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-cover bg-center bg-fixed bg-[url('/user/bg/banner-bg-2.jpg')]">
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(0,3,56,1) 0%, rgba(0,6,116,0.4908088235294118) 50%, rgba(0,3,56,1) 100%)',
      }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <button
        onClick={() => setIsOpen(true)}
        className=" bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Forgot Password
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Forgot Password</h2>
            
            {stage === 'request' ? (
              <form onSubmit={handleEmailSubmit(onEmailSubmit)} autoComplete="off">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-blue-200 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <Controller
                    name="email"
                    control={emailControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="email"
                          id="email"
                          {...field}
                          className={`w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${emailErrors.email ? 'border-red-500' : ''}`}
                          placeholder="Enter Email Address"
                          autoComplete="off"
                        />
                        {emailErrors.email && <p className="text-red-500 text-xs mt-1">{emailErrors.email.message}</p>}
                      </>
                    )}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit(onResetSubmit)} autoComplete="off">
                <div className="mb-4">
                  <label htmlFor="reset-email" className="block text-blue-200 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <Controller
                    name="email"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="email"
                          id="reset-email"
                          {...field}
                          className="w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-not-allowed"
                          disabled
                        />
                      </>
                    )}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="otp" className="block text-blue-200 text-sm font-bold mb-2">
                    OTP
                  </label>
                  <Controller
                    name="otp"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          id="otp"
                          {...field}
                          className={`w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${resetErrors.otp ? 'border-red-500' : ''}`}
                          placeholder="Enter OTP"
                          autoComplete="off"
                        />
                        {resetErrors.otp && <p className="text-red-500 text-xs mt-1">{resetErrors.otp.message}</p>}
                      </>
                    )}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-blue-200 text-sm font-bold mb-2">
                    New Password
                  </label>
                  <Controller
                    name="password"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="password"
                          id="password"
                          {...field}
                          className={`w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${resetErrors.password ? 'border-red-500' : ''}`}
                          placeholder="Enter New Password"
                          autoComplete="new-password"
                        />
                        {resetErrors.password && <p className="text-red-500 text-xs mt-1">{resetErrors.password.message}</p>}
                      </>
                    )}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-blue-200 text-sm font-bold mb-2">
                    Confirm New Password
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="password"
                          id="confirmPassword"
                          {...field}
                          className={`w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${resetErrors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Confirm New Password"
                          autoComplete="new-password"
                        />
                        {resetErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{resetErrors.confirmPassword.message}</p>}
                      </>
                    )}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ForgotPassword;
