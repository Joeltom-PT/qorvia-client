import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { EventDto, FetchAllOrganizersParams, FetchAllUsersParams, GetAllApprovedEventsRequest, GetAllApprovedEventsResponse, IAdminSideOrganizerDetailReponse, IAdminSideOrganizerDetailReqeust, IChangeEventCategoryRequest, IEventApprovalResponse, IGetAllCategoriesResponse, IGetAllEventCategoriesRequest, IGetAllOrganizersResponse, IGetAllUsersResponse, IOrganizerStatusChangeRequest } from "../../interfaces/admin";
import { AxiosError } from "axios";
import { adminEndPoints } from "../../services/endpoints/endPoints";
import { IApiResponse } from "../../interfaces/global";
  

export const getAllUsers = createAsyncThunk<IGetAllUsersResponse, FetchAllUsersParams>(
    'admin/fetchAllUsers',
    async ({ page, size , search }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(adminEndPoints.getAllUsers, {
          params: { page, size , search },
        });
        console.info(response)
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error)
          return rejectWithValue(error.response?.data.message || 'Fetch all users failed.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );

  export const getAllOrganizers = createAsyncThunk<IGetAllOrganizersResponse, FetchAllOrganizersParams> (
    'admin/fetchAllOrganizers',
    async ({ page, size , search , status }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(adminEndPoints.getAllOrganizers, {
          params: { page, size , search, status },
        });
        console.info(response)
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error)
          return rejectWithValue(error.response?.data.message || 'Fetch all organizers failed.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  )

  export const getOrganizerDetails = createAsyncThunk<IAdminSideOrganizerDetailReponse, IAdminSideOrganizerDetailReqeust> (
    'admin/fetchOrganizerDetails',
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`${adminEndPoints.getOrganizerDetails}/${id}`);
        console.info(response)
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error)
          return rejectWithValue(error.response?.data.message || 'Fetch organizer failed.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  )

  export const changeOrganizerStatus = createAsyncThunk<IApiResponse<string>, { id: string; data: IOrganizerStatusChangeRequest }>(
    'admin/changeOrganizerStatus',
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(`${adminEndPoints.changeOrganizerStatus}/${id}`, data);
  
        const responseData: IApiResponse<string> = response.data;
        return responseData;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error); 
          return rejectWithValue(error.response?.data.message || 'An error occurred while changing the status.');
        }
        return rejectWithValue('An unknown error occurred while changing the status.');
      }
    }
  );

  export const changeUserStatus = createAsyncThunk<IApiResponse<string>, string>(
    'admin/changeUserStatus',
    async (email, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(adminEndPoints.blockOrUnblockUser, { email });
    
        const responseData: IApiResponse<string> = response.data;
        return responseData;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios error:', error); 
          return rejectWithValue(error.response?.data.message || 'An error occurred while changing the status.');
        }
        return rejectWithValue('An unknown error occurred while changing the status.');
      }
    }
  );

  
  export const getAllEventCategories = createAsyncThunk<IGetAllCategoriesResponse, IGetAllEventCategoriesRequest>(
    'admin/getAllEventCategories',
    async (request, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(adminEndPoints.getAllEventCategories, {
          params: request
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data || 'Fetching categories failed.');
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );


  export const updateCategoryStatus = createAsyncThunk<any, IChangeEventCategoryRequest>(
    'admin/updateCategoryStatus',
    async (request, { rejectWithValue }) => {
        try {
            console.log('Requesting update with:', request); 
            const response = await axiosInstance.put(`${adminEndPoints.changeEventCategoryStatus}/${request.id}`, null, {
                params: { status: request.status }
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Updating category status failed.');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const changeAdminPassword = createAsyncThunk<void, { currentPass: string, newPass: string }>(
  'admin/changeAdminPassword',
  async ({ currentPass, newPass }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(adminEndPoints.changeAdminPassword, {
        currentPass,
        newPass
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Failed to change the admin password. Please try again!');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getAllEventApprovalRequest = createAsyncThunk<IEventApprovalResponse, IGetAllEventCategoriesRequest>(
  'admin/getAllEventApprovalRequest',
  async (request, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(adminEndPoints.getAllEventApprovalRequest, {
        params: request
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Fetching categories failed.');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getEventDetails = createAsyncThunk<EventDto, { id: string }>(
  'admin/getEventDetails',
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("api call for event details for admin")
      const response = await axiosInstance.get(`${adminEndPoints.getEventDetails}/${id}`);
      console.log("result for api call : ",response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Fetching Event details failed.');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const getAllApprovedEvents = createAsyncThunk<GetAllApprovedEventsResponse, GetAllApprovedEventsRequest>(
  'admin/getAllApprovedEvents',
  async (requestParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetAllApprovedEventsResponse>(
        adminEndPoints.getAllApprovedEvents,
        {
          params: requestParams,
        }
      );
      console.log('Result for API call:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching events:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Fetching Events failed.');
      }
      console.error('Unknown error occurred while fetching events:', error);
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const changeEventStatus = createAsyncThunk<void, { id: string , eventState : string , approvalStatus : string}>(
  'admin/changeEventStatus',
  async ({ id , approvalStatus, eventState }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${adminEndPoints.changeEventStatus}/${id}`, {
        params: {
          eventState,
          approvalStatus,
        },
      });
      console.log("result for api call : ",response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Updating the event status failed');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const eventBlockAndUnBlock = createAsyncThunk<void, { id: string}>(
  'admin/eventBlockAndUnBlock',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${adminEndPoints.eventBlockAndUnBlock}/${id}`);
      console.log("result for api call : ",response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || 'Updating the event status failed');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const eventAcceptAndReject = createAsyncThunk<void,  { id: string; status: string },  { rejectValue: string }>(
  'admin/eventAcceptAndReject',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${adminEndPoints.eventAcceptAndReject}/${id}`,
        { status }
      );
      console.log('Result for API call: ', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || 'Updating the event status failed'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

