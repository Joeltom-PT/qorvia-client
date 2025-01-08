import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { otpVerify, resendOtp } from '../../redux/action/userActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type OtpKeys = 'otp1' | 'otp2' | 'otp3' | 'otp4';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<{ [key in OtpKeys]: string }>({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const userEmail = user.user?.email || '';

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const storedExpiryTime = localStorage.getItem('otpExpiryTime');
    if (storedExpiryTime) {
      const expiryTime = new Date(storedExpiryTime).getTime();
      const now = new Date().getTime();
      const remainingTime = expiryTime - now;
      if (remainingTime > 0) {
        setTimeLeft(Math.floor(remainingTime / 1000));
      } else {
        localStorage.removeItem('otpExpiryTime');
      }
    } else {
      const expiryTime = new Date(new Date().getTime() + 5 * 60000);
      localStorage.setItem('otpExpiryTime', expiryTime.toString());
      setTimeLeft(300);
    }
  }, []);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            localStorage.removeItem('otpExpiryTime');
            return null;
          }
          return prev! - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;

    if (isNaN(Number(value)) && value !== '') return;

    const key = `otp${index + 1}` as OtpKeys; 
    setOtp((prev) => ({ ...prev, [key]: value }));

    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    } else if (!value && index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const validateForm = () => {
    const isValid = Object.values(otp).every((digit) => digit.match(/^[0-9]$/));
    if (!isValid) {
      setError('All OTP fields are required and must be single digits');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const fullOtp = `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}`;
    const submitData = { otp: fullOtp, email: userEmail };

    try {
      const result = await dispatch(otpVerify(submitData)).unwrap();
      console.log("OTP verification result:", result);
      setSuccess(true);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Verification failed. Try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      setOtp({ otp1: '', otp2: '', otp3: '', otp4: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    console.log("Resend OTP clicked");
    setLoading(false);
    const data = { email: userEmail };

    try {
      const result = await dispatch(resendOtp(data)).unwrap();
      let successMessage = 'Resend OTP sent successfully';
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      setOtp({ otp1: '', otp2: '', otp3: '', otp4: '' });

      const expiryTime = new Date(new Date().getTime() + 5 * 60000);
      localStorage.setItem('otpExpiryTime', expiryTime.toString());
      setTimeLeft(300); 
    } catch (err: any) {
      let errorMessage = 'Resend OTP failed. Try again.';
      console.error(errorMessage, err);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      setOtp({ otp1: '', otp2: '', otp3: '', otp4: '' });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
          <h2 className="text-3xl font-bold text-white mb-6 text-center">OTP</h2>
          <p className="text-blue-200 text-sm mb-6 text-center">Enter the OTP sent to your email address</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-blue-200 text-sm font-bold mb-2">Enter OTP</label>
              <div className="flex justify-between mb-2">
                {[0, 1, 2, 3].map((_, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    className="w-16 h-16 bg-white bg-opacity-20 rounded-lg border-2 border-blue-400 text-center text-white text-xl focus:outline-none focus:border-blue-700"
                    type="text"
                    maxLength={1}
                    value={otp[`otp${index + 1}` as OtpKeys]}
                    onChange={(e) => handleChange(e, index)}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading || timeLeft === null}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          {success && <p className="text-green-500 text-xs mt-2 text-center">OTP verified successfully!</p>}

          <div className="mt-4 text-center">
            <button className="text-blue-300 hover:underline text-sm" onClick={handleResendOtp} disabled={loading || timeLeft === null}>
              Resend OTP
            </button>
          </div>

          {timeLeft !== null && (
            <p className="text-blue-200 text-xs mt-2 text-center">
              {`Time remaining: ${formatTime(timeLeft)}`}
            </p>
          )}

          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
