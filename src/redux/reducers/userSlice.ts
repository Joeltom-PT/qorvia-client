import { createSlice } from "@reduxjs/toolkit";
import { IUserState } from "../../interfaces/user";
import { changeAboutInformation, fetchUserData, loginUser, logoutUser, otpVerify, resendOtp, signUp } from "../action/userActions";
import { organizerLogin } from "../action/organizerActions";

const initialState: IUserState = {
    loading: false,
    isLogged: false,
    error: null,
    success: null,
    user: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInactive: (state) => {
            console.log('Setting user to null');
            state.user = null;
            state.isLogged = false;
        }        
    },
    extraReducers: (builder) => {
        builder
            // Sign UP
            .addCase(signUp.pending, (state) => {
                state.loading = true;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(signUp.rejected, (state) => {
                state.loading = false;
            })
            // Verify OTP
            .addCase(otpVerify.pending, (state) => {
                state.loading = true;
            })
            .addCase(otpVerify.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.verificationStatus = action.payload.data.verificationStatus;
                } else {
                    console.error('User is not defined');
                }
                state.isLogged = true;
                state.loading = false; 
            })
            .addCase(otpVerify.rejected, (state) => {
                state.loading = false;
            })
            // Resend OTP
            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resendOtp.rejected, (state) => {
                state.loading = false;
            })
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogged = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
            })
            // Google Auth
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogged = true;
                state.user = action.payload;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.loading = false;
            })
            // Logout User
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isLogged = false;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
            })
            // Update user profile
            .addCase(changeAboutInformation.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeAboutInformation.fulfilled, (state, action) => {
                if (state.user) { 
                    state.user.pro_img = action.payload.profile_img;
                    state.user.about = action.payload.about;
                    state.user.address = action.payload.address;
                    state.user.username = action.payload.username;
                }
                state.loading = false; 
            })
            .addCase(changeAboutInformation.rejected, (state) => {
                state.loading = false;
            })
            // when organizer login user will logout
            .addCase(organizerLogin.fulfilled, (state) => {
                if(state.user){
                    state.user = null;
                    state.isLogged = false;
                }
            })
            ;
    },
});

export default userSlice.reducer;
