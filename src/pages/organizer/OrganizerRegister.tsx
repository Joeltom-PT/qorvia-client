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
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      {success ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h1>
          <p className="text-blue-800 mb-4">Your registration request is pending. When approved, a notification will be sent to your email.</p>
          <p className="text-blue-800">
            Click here to login: <Link to="/login-organizer" className="underline">Login here</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold text-blue-900 mb-8">Event Organizer Registration</h1>
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="profileImage" className="block text-blue-800 mb-2">
                Profile Image
              </label>
              <div className="flex justify-center items-center">
                <CloudinaryUpload
                  ref={uploadRef}
                  fixedSize={{ width: 16, height: 9 }}
                  onUploadSuccess={(url) => setValue('profileImage', url)}
                  uploadMessage="Click to Upload Image"
                />
              </div>
              {errors.profileImage && <p className="text-red-600">{errors.profileImage.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="organizationName" className="block text-blue-800 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                id="organizationName"
                {...register('organizationName')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.organizationName && <p className="text-red-600">{errors.organizationName.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="email" className="block text-blue-800 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="password" className="block text-blue-800 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="repeatPassword" className="block text-blue-800 mb-2">
                Repeat Password
              </label>
              <input
                type="password"
                id="repeatPassword"
                {...register('repeatPassword')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.repeatPassword && <p className="text-red-600">{errors.repeatPassword.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="phone" className="block text-blue-800 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="website" className="block text-blue-800 mb-2">
                Website
              </label>
              <input
                type="text"
                id="website"
                {...register('website')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.website && <p className="text-red-600">{errors.website.message}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="address" className="block text-blue-800 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register('address')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.address && <p className="text-red-600">{errors.address.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="address2" className="block text-blue-800 mb-2">
                Address 2 (Optional)
              </label>
              <input
                type="text"
                id="address2"
                {...register('address2')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.address2 && <p className="text-red-600">{errors.address2.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="city" className="block text-blue-800 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                {...register('city')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.city && <p className="text-red-600">{errors.city.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="country" className="block text-blue-800 mb-2">
                Country
              </label>
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
                    classes="w-full p-3 border border-blue-300 rounded-md"
                    priorityOptions={['USA', 'CAN']}
                  />
                )}
              />
              {errors.country && <p className="text-red-600">{errors.country.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="state" className="block text-blue-800 mb-2">
                State
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <RegionDropdown
                    country={watch('country')}
                    value={field.value}
                    onChange={field.onChange}
                    classes={`w-full p-3 border border-blue-300 rounded-md ${!field.value ? 'bg-gray-200' : ''}`}
                  />
                )}
              />
              {errors.state && <p className="text-red-600">{errors.state.message}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="about" className="block text-blue-800 mb-2">
                About
              </label>
              <textarea
                id="about"
                {...register('about')}
                rows={4}
                className="w-full p-3 border border-blue-300 rounded-md"
                placeholder="Tell us about yourself (at least 50 characters)"
              />
              {errors.about && <p className="text-red-600">{errors.about.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="facebook" className="block text-blue-800 mb-2">
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                {...register('facebook')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.facebook && <p className="text-red-600">{errors.facebook.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="instagram" className="block text-blue-800 mb-2">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                {...register('instagram')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.instagram && <p className="text-red-600">{errors.instagram.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="twitter" className="block text-blue-800 mb-2">
                Twitter
              </label>
              <input
                type="text"
                id="twitter"
                {...register('twitter')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.twitter && <p className="text-red-600">{errors.twitter.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="linkedin" className="block text-blue-800 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                {...register('linkedin')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.linkedin && <p className="text-red-600">{errors.linkedin.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="youtube" className="block text-blue-800 mb-2">
                YouTube
              </label>
              <input
                type="text"
                id="youtube"
                {...register('youtube')}
                className="w-full p-3 border border-blue-300 rounded-md"
              />
              {errors.youtube && <p className="text-red-600">{errors.youtube.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white'
            }`}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
          <div className="p-2 mt-4 flex justify-center items-center">
            <p className="text-blue-800">
              If you don't have an account,{' '}
              <Link to="/login-organizer" className="underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrganizerRegister;
