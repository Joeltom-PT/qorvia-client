import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CloudinaryUpload from '../../components/global/CloudinaryUpload';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { OrganizerRegister as OrganizerRegisterAction } from '../../redux/action/organizerActions'; 
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FormData {
  organizationName: string;
  email: string;
  password: string;
  repeatPassword: string;
  phone: number;
  website?: string;
  address: string;
  address2?: string;
  city: string;
  country: string;
  state: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  profileImage: string;
  about: string;
}

const schema = yup.object().shape({
  organizationName: yup.string().required('Organization Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Repeat Password is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  website: yup.string().url('Invalid URL').nullable().notRequired(),
  address: yup.string().required('Address is required'),
  address2: yup.string().nullable().notRequired(),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  facebook: yup.string().url('Invalid URL').nullable().notRequired(),
  instagram: yup.string().url('Invalid URL').nullable().notRequired(),
  twitter: yup.string().url('Invalid URL').nullable().notRequired(),
  linkedin: yup.string().url('Invalid URL').nullable().notRequired(),
  youtube: yup.string().url('Invalid URL').nullable().notRequired(),
  profileImage: yup.string().required('Profile image is required'),
  about: yup
    .string()
    .min(50, 'About must be at least 50 characters')
    .max(1000, 'About must be at most 1000 characters')
    .required('About is required'),
});

const OrganizerRegister: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema as any),
  });
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch<AppDispatch>();
  const uploadRef = useRef<{ getCroppedImage: () => string | null }>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true); 
    try {
        await dispatch(OrganizerRegisterAction(data)).unwrap();
        setSuccess(true);
        toast.success("Registration successful!");
    } catch (err: unknown) {
        console.error("Registration error:", err); 
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message || "Registration failed. Please try again.";
            if (status === 409) {
                toast.error("Email is already in use. Please use a different email.");
            } else {
                toast.error(message);
            }
        } else if (err instanceof Error) {
            toast.error(err.message || "An unknown error occurred. Try again");
        } else {
            toast.error("An unknown error occurred.");
        }
    } finally {
        setLoading(false); 
    }
  };

  const handleCountryChange = (country: string) => {
    setValue('country', country);
    setValue('state', '');
  };

  return (
    <div className={`max-w-lg mx-auto mt-5 p-6 bg-white rounded-lg shadow-md transition-opacity duration-500 ${success ? 'opacity-100' : 'opacity-100'}`}>
      {success ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h1>
          <p className="text-blue-800 mb-4">Your registration request is pending. When approved, a notification will be sent to your email.</p>
          <p className="text-blue-800">Click here to login : <Link to='/login-organizer' className="underline">Login here</Link></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Event Organizer Registration</h1>
          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-blue-800 mb-2">Profile Image</label>
            <div className='flex-col justify-center w-full'>
              <div className='flex justify-center items-center'>
                <CloudinaryUpload
                  ref={uploadRef}
                  fixedSize={{ width: 16, height: 9 }}
                  onUploadSuccess={(url) => setValue('profileImage', url)}
                  uploadMessage="Click to Upload Image"
                />
              </div>
              {errors.profileImage && <p className="text-red-600">{errors.profileImage.message}</p>}
            </div>
          </div>

          {Object.keys(schema.fields).map((key) => (
            key !== 'profileImage' && (
              <div className="mb-4" key={key}>
                <label htmlFor={key} className="block text-blue-800 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                {key === 'country' ? (
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <CountryDropdown
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          handleCountryChange(val);
                        }}
                        classes="w-full p-2 border border-blue-300 rounded"
                        priorityOptions={['USA', 'CAN']}
                      />
                    )}
                  />
                ) : key === 'state' ? (
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <RegionDropdown
                        country={watch('country')}
                        value={field.value}
                        onChange={field.onChange}
                        classes={`w-full p-2 border border-blue-300 rounded ${!field.value ? 'bg-gray-200' : ''}`}
                      />
                    )}
                  />
                ) : key === 'about' ? (
                  <textarea
                    id={key}
                    {...register(key as keyof FormData)}
                    rows={4}
                    className="w-full p-2 border border-blue-300 rounded"
                    placeholder="Tell us about yourself (at least 50 characters)"
                  />
                ) : (
                  <div>
                    <input
                      type={key.toLowerCase().includes('password') ? 'password' : 'text'}
                      id={key}
                      {...register(key as keyof FormData)}
                      className="w-full p-2 border border-blue-300 rounded"
                    />
                    {errors[key as keyof FormData] && (
                      <p className="text-red-600">{errors[key as keyof FormData]?.message}</p>
                    )}
                  </div>
                )}
              </div>
            )
          ))}

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-2 rounded transition duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-900 hover:bg-blue-800 text-white'}`}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
          <div className='p-2 mt-4 flex justify-center items-center'>
          <p className="text-blue-800">If you don't have an account,{' '} <Link to='/login-organizer' className="underline">Login here</Link></p>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrganizerRegister;
