import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBookingResponse, IBookingSubmitData, IForgotPasswordRequest, IForgotPasswordResetRequest, ILoginRequest, IloginUserResponse, IOtpRequest, IOtpResponse, IPasswordChangeRequest, IRegisterRequest, IRegisterResponse, IResendOTPRequest, IUser, IUserProfileUpdateRequest, resendOTPResponse, userDataRequest } from "../../interfaces/user";
import axiosInstance from "../../axios/axiosInstance";
import { commonEndPoints, userEndPoints } from "../../services/endpoints/endPoints";
import { AxiosError } from "axios";
import { FetchEventsParams, FetchEventsResponse, IOfflineEventData, IOnlineEventData, RegisteredEvent } from "../../interfaces/event";
import { IOrganizerList } from "../../pages/user/OrganizerListing";
import { OrganizerData } from "../../interfaces/admin";
import { IOrganizerData, IOrganizerProfileData } from "../../interfaces/organizer";
import { IBooking, IUserBookingInfo } from "../../interfaces/booking";

export const signUp = createAsyncThunk<IRegisterResponse, IRegisterRequest>(
    'user/register',
    async (userData: IRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(userEndPoints.signup, userData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data.message || 'Signup failed');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const otpVerify = createAsyncThunk<IOtpResponse, IOtpRequest>(
    'user/verifyOtp',
    async (OtpData: IOtpRequest, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(userEndPoints.verifyOTP, OtpData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'OTP verification failed');
            } 
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const loginUser = createAsyncThunk<IloginUserResponse, ILoginRequest>(
    'user/loginUser',
    async (loginData : ILoginRequest, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(userEndPoints.login, loginData);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                
                return rejectWithValue(error.request?.data || 'Login Error');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)

export const resendOtp = createAsyncThunk<resendOTPResponse, IResendOTPRequest> (
    'user/resendOTP',
    async (resendOtpData : IResendOTPRequest, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(userEndPoints.resendOTP, resendOtpData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.request?.data || 'Resend OTP failed.')
            }
            return rejectWithValue('And unknown error ocuurred'); 
        }
    }
)


export const fetchUserData = createAsyncThunk<IUser, userDataRequest>(
    'user/userDetails',
    async (userDataRequest: userDataRequest, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(userEndPoints.getUserData, {
          params: { email: userDataRequest.email }
        });
        console.log(response, 'response in slice');
        return response.data; 
      } catch (err) {
        const axiosError = err as AxiosError;
        console.log(axiosError);
        return rejectWithValue(axiosError.response?.data || 'Failed to fetch user data');
      }
    }
);


export const logoutUser = createAsyncThunk<void, void>(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post(userEndPoints.logout); 
            return; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Logout failed');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const passwordReset = createAsyncThunk<void, IPasswordChangeRequest>(
    'user/passwordChangeRequest',
    async (IPasswordChangeRequest, { rejectWithValue }) => {
        try {
            await axiosInstance.put(userEndPoints.passwordReset, IPasswordChangeRequest); 
            return; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Password change request failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const changeAboutInformation = createAsyncThunk<IUserProfileUpdateRequest, IUserProfileUpdateRequest>(
    'user/userProfileUpdate',
    async (IUserProfileUpdateRequest, { rejectWithValue }) => {
        try {
            await axiosInstance.put(userEndPoints.changeProfileInfo, IUserProfileUpdateRequest); 
            return IUserProfileUpdateRequest; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'About section change request failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const forgotPasswordReset = createAsyncThunk<void, IForgotPasswordResetRequest>(
    'user/forgotPasswordReset',
    async (resetData: IForgotPasswordResetRequest, { rejectWithValue }) => {
        try {
            await axiosInstance.post(userEndPoints.forgotPasswordReset, resetData);
            return;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Forgot password reset failed.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


  export const isUserActive = createAsyncThunk<boolean, { email: string }>(
    'user/isUserActive',
    async ({ email }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`${userEndPoints.isUserActive}/${email}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || 'Failed to check if the user is active or not');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const forgotPasswordRequest = createAsyncThunk<void, IForgotPasswordRequest>(
    'user/forgotPasswordRequest',
    async ({ email }, { rejectWithValue }) => {
      try {
        await axiosInstance.post('/forgotPasswordRequest', { email });
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || 'Failed to send OTP');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );


  export const fetchEvents = createAsyncThunk<FetchEventsResponse, FetchEventsParams>(
    'events/fetchEvents',
    async (params, { rejectWithValue }) => {
      try {
        
        console.log("the params are : ," , params)

        const response = await axiosInstance.get(userEndPoints.getAllEvents, { params });
        console.log(response.data)
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const getOnlineEventData = createAsyncThunk<IOnlineEventData, { id: string }>(
    'events/getOnlineEventData',
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`${userEndPoints.getOnlineEventData}/${id}`);
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const getAllOrganizers = createAsyncThunk<IOrganizerList, { currentPage: number, itemsPerPage: number }>(
    'events/getAllOrganizers',
    async ({ currentPage, itemsPerPage }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/account/public/get-organizer-list', {
          params: {
            page: currentPage , 
            size: itemsPerPage,
          },
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );


  export const followOrganizer = createAsyncThunk<void, { organizerId: number, isFollowing: boolean }>(
    'events/followOrganizer',
    async ({ organizerId, isFollowing }, { rejectWithValue }) => {
      try {
        const response = isFollowing
          ? await axiosInstance.delete(`/account/user/unfollowOrganizer`,{
              params: { organizerId: organizerId }
            })
          : await axiosInstance.post(`/account/user/followOrganizer`, null, {
              params: { organizerId: organizerId }
            });
  
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );



  export const getOrganizerInfo = createAsyncThunk<OrganizerData[], { organizerId: number; eventId: string }>(
    'events/getOrganizerInfo',
    async ({ organizerId, eventId }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/account/public/get-organizers-byEvent', {
          params: {
            organizerId,
            eventId,
          },
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const getOfflineEventData = createAsyncThunk<IOfflineEventData, { id: string }>(
    'events/getOfflineEventData',
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`${userEndPoints.getOfflineEventData}/${id}`);
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );

  
  export const getOrganizerShortInfo = createAsyncThunk<IOrganizerData, { id: number }>(
    'events/getOrganizerShortInfo',
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`${userEndPoints.getOrganizerShortInfo}/${id}`);
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );


  export const bookingFromSubmit = createAsyncThunk<IBookingResponse, IBookingSubmitData >(
  'events/bookingFromSubmit',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(commonEndPoints.booking, orderData);
      console.log(response.data);
      console.log("here I am getting the response with success", response)
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      console.log("here I am getting the response with failed one", error)

      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const fetchBooking = createAsyncThunk<IBooking, { id: string; isFree: boolean }>(
  'events/fetchBooking',
  async ({ id, isFree }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${commonEndPoints.booking}/info/${id}`, {
        params: { isFree },
      });
      console.log("getting the response with data", response.data)
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const fetchAllBookings = createAsyncThunk<IUserBookingInfo[], void>(
  'events/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${commonEndPoints.booking}/get-all/byUser`);
      console.log("Fetched all bookings data:", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const cancelBooking = createAsyncThunk<void, {id : string}>(
  'events/cancelBooking',
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${commonEndPoints.booking}/cancel/${id}`);
      console.log("Cancel event Response", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const getOrganizerProfileData = createAsyncThunk<IOrganizerProfileData, {id : number}>(
  'events/getOrganizerProfileData',
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${userEndPoints.getOrganizerProfileData}/${id}`);
      console.log("Organizer profile Response", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getAllRegisteredEvents = createAsyncThunk<RegisteredEvent[], void>(
  'events/getAllRegisteredEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(userEndPoints.getAllRegisteredEvents);
      console.log("All registered events by user", response.data)
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const checkRoomAccess = createAsyncThunk<boolean, void>(
  'events/checkRoomAccess',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(userEndPoints.checkRoomAccess);
      console.log("Check user access", response.data)
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const getStreamKey = createAsyncThunk<string, {id : string}>(
  'events/getStreamKey',
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${userEndPoints.getStreamKey}/${id}`);
      console.log("Check user access", response.data)
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);