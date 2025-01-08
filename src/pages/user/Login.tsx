import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { loginUser } from '../../redux/action/userActions';
import { toast } from 'react-toastify';
import GoogleLoginComponent from '../../components/user/GoogleLoginComponent';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: FormData) => { 
    setLoading(true);
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      console.log("OTP verification result:", result);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Something went wrong try again.';
      if (err === 'User not found'){
       errorMessage = 'Invalid credentials.'
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

  return (
    <div className="min-h-screen w-screen bg-cover bg-center bg-fixed bg-[url('/user/bg/banner-bg-2.jpg')]">
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(0,3,56,1) 0%, rgba(0,6,116,0.4908088235294118) 50%, rgba(0,3,56,1) 100%)',
        }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
          <p className="text-blue-200 text-sm mb-6 text-center">If you don't have an account, please login</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-blue-200 text-sm font-bold mb-2">
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="email"
                      id="email"
                      {...field}
                      className={`w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter Email Address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </>
                )}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-blue-200 text-sm font-bold mb-2">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="password"
                      id="password"
                      {...field}
                      className={`w-full px-3 py-2 text-white bg-white bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Enter Password"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </>
                )}
              />
              <Link to="/forgot-password" className="text-xs text-blue-300 hover:underline mt-1 inline-block">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
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
              If you don't have an account,{' '}
              <Link to="/register" className="text-white font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
