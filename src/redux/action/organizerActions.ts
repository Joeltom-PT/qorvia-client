import { createAsyncThunk } from "@reduxjs/toolkit";
import { IEmailVerificationRequest, IEventCategoryReqeust, IOrganizerLoginRequest, IOrganizerLoginResponse, IOrganizerProfile, IOrganizerProfileView, IOrganizerRegisterRequest, IOrganizerRegisterResponse, IOrganizerSettings, IOrganizerVerificationResponse, IVerifyOrganzierRequest } from "../../interfaces/organizer";
import axiosInstance from "../../axios/axiosInstance";
import { AxiosError } from "axios";
import { organizerEndPoints, userEndPoints } from "../../services/endpoints/endPoints";
import { toast } from "react-toastify";
import { ICreateOfflineEventDetail, ICreateOnlineEventDetail, IEvent, IEventCategory, ILiveEvent, IOfflineEventDetail, IOfflineEventTickets, IOfflineEventTimeSlot, IOnlineEventDetail, IOnlineEventTickets, IOnlineEventTimeSlot } from "../../interfaces/event";
import { BookingSettingsData } from "../../components/organizer/event/online/OnlineEventSettings";
import { IOfflineBookingSettingsData } from "../../components/organizer/event/offline/OfflineEventSettings";
import { IOrganizersForCollaboration } from "../../components/organizer/modal/CollaborationRequestModal";
import { IBookedUsersListResponse } from "../../interfaces/booking";
import { IConnectedAccount } from "../../interfaces/global";



export const OrganizerRegister = createAsyncThunk<IOrganizerRegisterResponse, IOrganizerRegisterRequest>(
    'organizer/register',
    async (formData: IOrganizerRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(organizerEndPoints.register, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response);
                return rejectWithValue({
                    status: error.response?.status,
                    message: error.response?.data.message || 'Organizer Registration Failed.',
                });
            }
            return rejectWithValue({
                status: 500,
                message: 'Organizer Registration Failed.'
            });
        }
    }
);


export const organizerLogin = createAsyncThunk<IOrganizerLoginResponse, IOrganizerLoginRequest>(
 'organizer/login',
    async (formData: IOrganizerLoginRequest, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(organizerEndPoints.login, formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(error.response);
            const errorMessage = error.response?.data.message || 'Organizer Login Failed.';
            toast.error(errorMessage)
            return rejectWithValue({
                status: error.response?.status,
                message: errorMessage,
            });
        }
        return rejectWithValue({
            status: 500,
            message: 'Organizer Login Failed.'
        });
    }
}
);


export const logoutOrganizer = createAsyncThunk<void, void>(
    'organizer/logout',
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

export const emailVerification = createAsyncThunk<void, IEmailVerificationRequest>(
    'organizer/emailVerify',
    async ({ email }, { rejectWithValue }) => {
        try {
            await axiosInstance.post(organizerEndPoints.emailVerification, { email });
            return;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Verification Request send failed');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const verifyOrganizer = createAsyncThunk<IOrganizerVerificationResponse, IVerifyOrganzierRequest>(
    'organizer/verifyOrganizer',
    async (request, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<IOrganizerVerificationResponse>(
                organizerEndPoints.emailVerificationTokenVerify,
                request
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Verification failed, try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const getOrganizerProfile = createAsyncThunk<IOrganizerProfileView, void>(
    'organizer/getOrganizerProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(organizerEndPoints.getOrganizerProfile);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch profile. Please try again!');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const eventCategoryReqeust = createAsyncThunk<any, IEventCategoryReqeust>(
    'organizer/eventCategoryReqeust',
    async (request, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                organizerEndPoints.eventCategoryReqeust,
                request
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Category creation failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const createOnlineEventDetail = createAsyncThunk<any, ICreateOnlineEventDetail >(
    'organizer/createOnlineEventDetail',
    async (request, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                organizerEndPoints.createOnlineEventDetail,
                request
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Online event creation failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const editOnlineEventDetail = createAsyncThunk<any, ICreateOnlineEventDetail >(
    'organizer/createOnlineEventDetail',
    async (request, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                organizerEndPoints.createOnlineEventDetail,
                request
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Online event creation failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);



export const getAllActiveEventCategories = createAsyncThunk<IEventCategory[], void>(
    'organizer/getAllActiveEventCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                organizerEndPoints.getAllActiveEventCategories
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event categories. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const getOnlineEventDetail = createAsyncThunk<IOnlineEventDetail, string>(
    'organizer/getOnlineEventDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${organizerEndPoints.getOnlineEventDetail}?id=${id}`); 
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event detail. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const createOnlineEventTimeSlots = createAsyncThunk<any, { id: string; slots: IOnlineEventTimeSlot[] } >(
    'organizer/createOnlineEventTimeSlots',
    async ({ id, slots }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${organizerEndPoints.createOnlineEventTimeSlots}/${id}`,
                 slots 
            );
            return response.data; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to create time slots. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const getOnlineEventTimeSlot = createAsyncThunk<IOnlineEventTimeSlot[], string>(
    'organizer/getOnlineEventTimeSlot',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<IOnlineEventTimeSlot[]>(
                `${organizerEndPoints.getOnlineEventTimeSlot}/${id}`
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event time slots. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const createOnlineEventTicket = createAsyncThunk<any, { id: string; ticket : IOnlineEventTickets } >(
    'organizer/createOnlineEventTicket',
    async ({ id, ticket }, { rejectWithValue }) => {
        try {
            console.log(ticket)
            const response = await axiosInstance.put(
                `${organizerEndPoints.createOnlineEventTicket}/${id}`,
                 ticket 
            );
            return response.data; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to create time slots. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const getOnlineEventTicket = createAsyncThunk<IOnlineEventTickets, string>(
    'organizer/getOnlineEventTicket',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<IOnlineEventTickets>(
                `${organizerEndPoints.getOnlineEventTicket}/${id}`
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event ticket data. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const saveBookingSettings = createAsyncThunk<any, { id: string; settings: BookingSettingsData }>(
    'organizer/saveBookingSettings',
    async ({ id, settings }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(
          `${organizerEndPoints.createOnlineEventSetting}/${id}`,
          settings
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || 'Failed to save booking settings. Please try again.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );

  export const getBookingSettings = createAsyncThunk<BookingSettingsData, { id: string}>(
    'organizer/getBookingSettings',
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(
          `${organizerEndPoints.getEventSetting}/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || 'Failed to save booking settings. Please try again.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );



  ///////


  ////////////////////////////////////////////////////////////////
// Offline events 

export const createOfflineEventDetail = createAsyncThunk<any, ICreateOfflineEventDetail>(
    'organizer/createOfflineEventDetail',
    async (request, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                organizerEndPoints.createOfflineEventDetail,
                request
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Online event creation failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const editOfflineEventDetail = createAsyncThunk<any, ICreateOfflineEventDetail >(
    'organizer/editOfflineEventDetail',
    async (request, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                organizerEndPoints.createOfflineEventDetail,
                request
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Online event creation failed. Try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const getOfflineEventDetail = createAsyncThunk<IOfflineEventDetail, string>(
    'organizer/getOfflineEventDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${organizerEndPoints.getOfflineEventDetail}?id=${id}`); 
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event detail. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const createOfflineEventTimeSlots = createAsyncThunk<any, { id: string; slots: IOfflineEventTimeSlot[] } >(
    'organizer/createOfflineEventTimeSlots',
    async ({ id, slots }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${organizerEndPoints.createOnlineEventTimeSlots}/${id}`,
                 slots 
            );
            return response.data; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to create time slots. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const getOfflineEventTimeSlot = createAsyncThunk<IOfflineEventTimeSlot[], string>(
    'organizer/getOfflineEventTimeSlot',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<IOfflineEventTimeSlot[]>(
                `${organizerEndPoints.getOnlineEventTimeSlot}/${id}`
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event time slots. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const createOfflineEventTicket = createAsyncThunk<any, { id: string; ticket : IOfflineEventTickets } >(
    'organizer/createOnlineEventTicket',
    async ({ id, ticket }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${organizerEndPoints.createOfflineEventTicket}/${id}`,
                 ticket 
            );
            return response.data; 
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to create tickets. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const getOfflineEventTicket = createAsyncThunk<IOfflineEventTickets, string>(
    'organizer/getOfflineEventTicket',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<IOfflineEventTickets>(
                `${organizerEndPoints.getOfflineEventTicket}/${id}`
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event ticket data. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const saveOfflineBookingSettings = createAsyncThunk<any, { id: string; settings: IOfflineBookingSettingsData }>(
    'organizer/saveOfflineBookingSettings',
    async ({ id, settings }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(
          `${organizerEndPoints.createOnlineEventSetting}/${id}`,
          settings
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || 'Failed to save booking settings. Please try again.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );


  ////////////

  export const getEventsByOrganizer = createAsyncThunk<IEvent[], void>(
    'organizer/getEventsByOrganizer',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(organizerEndPoints.getEventsByOrganizer);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch events.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const getSpecificEventById = createAsyncThunk<IEvent, { id: string }>(
    'organizer/getSpecificEventById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${organizerEndPoints.getSpecificEventById}/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch event.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const requestAdminApprovalForEvent = createAsyncThunk<void, { id: string }>(
    'organizer/requestAdminApprovalForEvent',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${organizerEndPoints.requestAdminApprovalForEvent}/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to Request admin approval. Please try again!');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);



export const deleteEventByOrganizer = createAsyncThunk<void, { id: string }>(
    'organizer/deleteEvent',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${organizerEndPoints.deleteEvent}/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to Request admin approval. Please try again!');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const withdrawEventApprovalRequest = createAsyncThunk<void, { id: string }>(
    'organizer/withdrawEventApprovalRequest',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${organizerEndPoints.withdrawEventApprovalRequest}/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to withdraw the event approval request. Please try again!');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const getOrganizerSettings = createAsyncThunk<IOrganizerSettings, void >(
    'organizer/getOrganizerSettings',
    async ( _ , { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(organizerEndPoints.organizerSettings);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch organizerSettings.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);



export const organizerSettingsUpdate = createAsyncThunk<void, boolean >(
    'organizer/organizerSettingsUpdate',
    async ( isApprovalAllowed , { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(organizerEndPoints.organizerSettings, { isApprovalAllowed });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to update organizerSettings. Please try again.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const fetchOrganizersForCollaboration = createAsyncThunk<IOrganizersForCollaboration[], string>(
    'organizer/fetchOrganizersForCollaboration',
    async (searchQuery, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(organizerEndPoints.getOrganizersForCollaboration, {
          params: { search: searchQuery },
        });
        console.log('API response data:', response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error.response?.data);
          return rejectWithValue(error.response?.data || 'Failed to fetch organizers. Please try again.');
        }
        console.error('Unknown error:', error);
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const updateOrganizerProfile = createAsyncThunk<void, IOrganizerProfileView>(
    'organizer/updateOrganizerProfile',
    async (updatedProfile, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(organizerEndPoints.updateOrganizerProfile, updatedProfile);
        console.log('API response data:', response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error.response?.data);
          return rejectWithValue(error.response?.data);
        }
        console.error('Unknown error:', error);
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const fetchBookedUsersList = createAsyncThunk<IBookedUsersListResponse, { pageNumber: number, pageSize: number, eventId : string } >(
  'booking/fetchBookedUsersList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${organizerEndPoints.getBookedUsersList}/${params.eventId}`, { 
        params: {
          page: params.pageNumber,
          size: params.pageSize,
        }
      });

      console.log('API response data:', response.data);
      return response.data; 
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Axios error:', error.response?.data);
        return rejectWithValue(error.response?.data);
      }
      console.error('Unknown error:', error);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getAccountConnectingLink = createAsyncThunk<string, void>(
    'organizer/getAccountConnectingLink',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(organizerEndPoints.getAccountConnectingLink);
        console.log('API response data:', response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error.response?.data);
          return rejectWithValue(error.response?.data);
        }
        console.error('Unknown error:', error);
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const fetchLiveEvents = createAsyncThunk<ILiveEvent[], void>(
    'organizer/fetchLiveEvents',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(organizerEndPoints.fetchLiveEvents);
        console.log('API response data:', response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error.response?.data);
          return rejectWithValue(error.response?.data);
        }
        console.error('Unknown error:', error);
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  

  export const getConnectedAccountDetails = createAsyncThunk<IConnectedAccount, void>(
    'organizer/getConnectedAccountDetails',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(organizerEndPoints.getConnectedAccountDetails);
        console.log('API response data:', response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error.response?.data);
          return rejectWithValue(error.response?.data);
        }
        console.error('Unknown error:', error);
        return rejectWithValue('An unknown error occurred');
      }
    }
  );


  export const removeConnectedAccount = createAsyncThunk<void, void>(
    'organizer/removeConnectedAccount',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(organizerEndPoints.removeConnectedAccount);
        console.log('API response data:', response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error.response?.data);
          return rejectWithValue(error.response?.data);
        }
        console.error('Unknown error:', error);
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
  
  