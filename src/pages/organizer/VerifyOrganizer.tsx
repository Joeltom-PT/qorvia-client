import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { verifyOrganizer } from '../../redux/action/organizerActions';
import { IOrganizerVerificationResponse } from '../../interfaces/organizer';
import { MoonLoader } from 'react-spinners';

const VerifyOrganizer = () => {
    const { token } = useParams<{ token: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!success && error) {
                setError(error);
            }
        }, 4000);

        const verify = async (): Promise<void> => {
            if (token) {
                try {
                    const result = await dispatch(verifyOrganizer({ token })).unwrap();
                    const response = result as IOrganizerVerificationResponse;
                    setEmail(response.data?.email || null);
                    console.log("Verified Email:", response.data?.email);
                    setSuccess(true); 
                    setError(null); 
                } catch (err: any) {
                    setError(err.message || 'Verification failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); 
            }
        };

        verify(); 

        return () => {
            clearTimeout(timeoutId); 
        };
    }, [token, dispatch, success, error]); 

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
            {loading ? (
                <MoonLoader color="#1E3A8A" loading={loading} size={30} />
            ) : (
                <>
                    {error && !success && (
                        <div className="mt-4 p-4 border rounded bg-red-100 text-red-600">
                            <h2 className="text-lg font-semibold">Verification Failed</h2>
                            <p>{error}</p>
                            <Link to="/login-organizer" className="mt-2 text-blue-500 underline">Login Now</Link>
                        </div>
                    )}
                    {success && email && (
                        <div className="mt-4 p-4 border rounded bg-blue-100 text-blue-900">
                            <h2 className="text-lg font-semibold">Verification Successful!</h2>
                            <p>Your email: <span className="font-bold">{email}</span></p>
                            <p>If you encounter any issues verifying your account, please try logging out and logging back in. For further assistance, contact our support team.</p>
                            <Link to="/login-organizer" className="mt-2 text-blue-800 underline">Login Now</Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VerifyOrganizer;
