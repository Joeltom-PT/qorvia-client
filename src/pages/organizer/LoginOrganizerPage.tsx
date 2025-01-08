import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { IOrganizerLoginRequest } from '../../interfaces/organizer';
import { organizerLogin } from '../../redux/action/organizerActions';
import ForgotPasswordModal from '../../components/organizer/ForgotPasswordModal';

type Errors = {
  email?: string;
  password?: string;
};

const LoginOrganizerPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useDispatch<AppDispatch>();
  const { isLogged, profile } = useSelector((state: RootState) => state.organizer);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const formData: IOrganizerLoginRequest = { email, password };

    try {
      setLoading(true);
      await dispatch(organizerLogin(formData)).unwrap();
    } catch (loginError) {
      console.error('Login failed:', loginError);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isLogged) {
      if (profile?.role === 'ORGANIZER') {
        navigate('/organizer/dashboard');
      } else if (profile?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    }
  }, [isLogged, profile, navigate]);

  return (
    <div className="bg-[url('/organizer/bg/bg_events_collection.png')] min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Organizer Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full border rounded-md p-2 focus:ring ${
                errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full border rounded-md p-2 focus:ring ${
                errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
          </div>
        {/* <p onClick={handleForgotPassword} className="mt-4 text-blue-900 text-sm cursor-pointer hover:underline">
           forgot password
        </p> */}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-300 py-2 rounded-md font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <ForgotPasswordModal />
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register-organizer" className="text-blue-900 hover:underline">
            Register here
          </Link>
        </p>
        <div>
       </div>
      </div>
    </div>
  );
};

export default LoginOrganizerPage;
