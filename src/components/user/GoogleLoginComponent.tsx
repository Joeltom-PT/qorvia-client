import {jwtDecode} from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { fetchUserData } from '../../redux/action/userActions';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';


interface DecodedToken {
  name: string;
  email: string;
}

interface CredentialResponse {
  credential?: string; 
}

const GoogleLoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Failed to get credentials. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
      return;
    }

    try {
      console.log(credentialResponse);
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(credentialResponse.credential);
      console.log('Decoded Token:', decodedToken);

      const response = await axiosInstance.post('/account/auth/googleAuth', {
        username: decodedToken.name,
        email: decodedToken.email,
        password: '', 
      });

      console.log(response);
      await dispatch(fetchUserData({ email: decodedToken.email }));
      navigate('/'); 
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    }
  };

  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin(credentialResponse);
        }}
        onError={() => {
          console.log('Login failed');
          toast.error('Login failed. Please try again.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        }}
      />
      </>
  );
};

export default GoogleLoginComponent;
