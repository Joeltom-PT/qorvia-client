import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { forgotPasswordRequest, forgotPasswordReset } from '../../redux/action/userActions';

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

const ForgotPasswordModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mt-4 cursor-pointer text-blue-900 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        Forgot Password
      </p>

      {isOpen && (
        <div className="fixed inset-0 bg-blue-950 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-[5px] shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            
            {stage === 'request' ? (
              <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                  <Controller
                    name="email"
                    control={emailControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="email"
                          id="email"
                          {...field}
                          placeholder="Enter Email Address"
                          className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                          autoComplete="off"
                        />
                        {emailErrors.email && <p className="text-red-500 text-sm mt-1">{emailErrors.email.message}</p>}
                      </>
                    )}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-950'} transition`}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium">Email Address</label>
                  <Controller
                    name="email"
                    control={resetControl}
                    render={({ field }) => (
                      <input
                        type="email"
                        id="reset-email"
                        {...field}
                        disabled
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100 cursor-not-allowed"
                      />
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium">OTP</label>
                  <Controller
                    name="otp"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          id="otp"
                          {...field}
                          placeholder="Enter OTP"
                          className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                          autoComplete="off"
                        />
                        {resetErrors.otp && <p className="text-red-500 text-sm mt-1">{resetErrors.otp.message}</p>}
                      </>
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium">New Password</label>
                  <Controller
                    name="password"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="password"
                          id="password"
                          {...field}
                          placeholder="Enter New Password"
                          className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                          autoComplete="new-password"
                        />
                        {resetErrors.password && <p className="text-red-500 text-sm mt-1">{resetErrors.password.message}</p>}
                      </>
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm New Password</label>
                  <Controller
                    name="confirmPassword"
                    control={resetControl}
                    render={({ field }) => (
                      <>
                        <input
                          type="password"
                          id="confirmPassword"
                          {...field}
                          placeholder="Confirm New Password"
                          className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
                          autoComplete="new-password"
                        />
                        {resetErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{resetErrors.confirmPassword.message}</p>}
                      </>
                    )}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-950'} transition`}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-gray-600 hover:text-gray-900 p-2 w-full bg-slate-300 rounded-[5px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordModal;
