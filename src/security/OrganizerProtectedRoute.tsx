import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { emailVerification, logoutOrganizer } from '../redux/action/organizerActions'; 
import { toast } from 'react-toastify';

const OrganizerProtectedRoute: React.FC = () => {
  const profile = useSelector((state: RootState) => state.organizer.profile);
  const dispatch = useDispatch<AppDispatch>(); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile == null) {
      dispatch(logoutOrganizer()); 
    }
  }, [profile, dispatch]);

  const requestVerification = async () => {
    try {
      if (loading) {
        return;
      }

      const email = profile?.email;
      setLoading(true);

      if (email) {
        await dispatch(emailVerification({ email })).unwrap();
        toast.success('Verification email sent successfully! Please check your email.');
      } else {
        toast.error('Email is required for verification.');
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Verification request failed! ${error.message}`);
      } else {
        toast.error('Verification request failed! Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  if (!profile) {
    return <Navigate to="/login-organizer" />;
  }

  const { verificationStatus, registerRequestStatus, status } = profile;

  if (verificationStatus === 'PENDING' || registerRequestStatus === 'PENDING' || status !== 'ACTIVE') {
    return (
      <div className="p-5">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Account Status</h2>
        <p>Your account is currently having some issues as shown below. Please complete the following steps to use your account:</p>
        <div className="mt-2 space-y-4">
          {verificationStatus === 'PENDING' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Email Verification Pending</p>
              <p>
                {loading ? (
                  <p className="mt-2 text-blue-900">Sending verification email...</p>
                ) : (
                  <> 
                    Your email verification is pending.{' '}
                    <a
                      className="text-blue-900 underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault(); 
                        requestVerification(); 
                      }}
                    >
                      Send verification to your email: {profile.email}
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
          {registerRequestStatus === 'PENDING' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Registration Request Pending</p>
              <p>
                Your registration request has been sent to the site administration and is awaiting approval. <br />
                You will be notified by email once it has been accepted. <br />
                If you receive an acceptance email, please log out and log back in.
              </p>
            </div>
          )}
          {status !== 'ACTIVE' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Account Blocked</p>
              <p>Your account has been blocked by the administration. Please contact the administration to resolve this issue.</p>
            </div>
          )}
        </div>
        <p className="mt-4">Please contact the support team if you have any questions or need further assistance.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default OrganizerProtectedRoute;
