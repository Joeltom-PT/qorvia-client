import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { signUp } from '../../redux/action/userActions';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import GoogleLoginComponent from '../../components/user/GoogleLoginComponent';

interface StepOneFormData {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
}

const schemaStep1 = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    repeatPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Repeat Password is required'),
});

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<StepOneFormData>({
        resolver: yupResolver(schemaStep1),
    });

    const onSubmit = async (data: StepOneFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await dispatch(signUp(data)).unwrap();
            navigate('/verify')
        } catch (err: any) {
            let errorMessage = 'Registration failed. Please try again.';
    
            if (err) {
             
                if (err === 'User already exists with email') {
                    errorMessage = 'User already exists with email, try anther email or login.';
                } else {
                    errorMessage = 'Registration failed. Please try again.';
                }
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            setLoading(false);
        }
    };
    
    

    const inputStyle = "w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400";
    const labelStyle = "block text-blue-200 text-sm font-bold mb-2";
    const errorStyle = "text-red-500 text-xs mt-1";

    return (
        <div className="min-h-screen w-screen bg-cover bg-center bg-fixed bg-[url('/user/bg/banner-bg-2.jpg')]">
            <div
                style={{
                    background: 'linear-gradient(90deg, rgba(0,3,56,1) 0%, rgba(0,6,116,0.4908088235294118) 50%, rgba(0,3,56,1) 100%)',
                }}
                className="min-h-screen flex items-center justify-center p-4"
            >
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
                    <p className="text-blue-200 text-sm mb-6 text-center">Create your account</p>
                    
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4">Registration successful!</p>}
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="username" className={labelStyle}>Username</label>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        id="username" 
                                        {...field} 
                                        className={inputStyle} 
                                        placeholder="Enter Username" 
                                    />
                                )}
                            />
                            {errors.username && <p className={errorStyle}>{errors.username.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className={labelStyle}>Email Address</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        id="email" 
                                        type="email" 
                                        {...field} 
                                        className={inputStyle} 
                                        placeholder="Enter Email Address" 
                                    />
                                )}
                            />
                            {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className={labelStyle}>Password</label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        id="password" 
                                        type="password" 
                                        {...field} 
                                        className={inputStyle} 
                                        placeholder="Enter Password" 
                                    />
                                )}
                            />
                            {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="repeatPassword" className={labelStyle}>Repeat Password</label>
                            <Controller
                                name="repeatPassword"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        id="repeatPassword" 
                                        type="password" 
                                        {...field} 
                                        className={inputStyle} 
                                        placeholder="Repeat Password" 
                                    />
                                )}
                            />
                            {errors.repeatPassword && <p className={errorStyle}>{errors.repeatPassword.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                            aria-live="polite"
                        >
                            {loading ? 'Loading...' : 'Register'}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-blue-200 text-sm">OR</p>
                    </div>
                    <div className='flex justify-center'>
                    <GoogleLoginComponent />
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-blue-200 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white font-semibold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
