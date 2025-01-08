import { createSlice } from "@reduxjs/toolkit";
import { IOrganizerState } from "../../interfaces/organizer";
import { emailVerification, logoutOrganizer, organizerLogin, OrganizerRegister, verifyOrganizer } from "../action/organizerActions";
import { fetchUserData, loginUser, signUp } from "../action/userActions";

const initialState: IOrganizerState = {
    loading: false,
    isLogged: false,
    error: null,
    success: null,
    profile : null,
};

export const organizerSlice = createSlice({
    name: "organizer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Organizer Registration
            .addCase(OrganizerRegister.pending, (state) => {
                state.loading = true;
            })
            .addCase(OrganizerRegister.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(OrganizerRegister.rejected, (state) => {
                state.loading = false;
            })
            // Organization Login
            .addCase(organizerLogin.pending, (state : IOrganizerState) => {
                state.loading = true;
            })
            .addCase(organizerLogin.fulfilled, (state : IOrganizerState, action) => {
                state.loading = false;
                state.profile = action.payload.data;
                state.isLogged = true;
            })
            .addCase(organizerLogin.rejected, (state : IOrganizerState) => {
                state.loading = false;
            })
            // Organizer Logout
            .addCase(logoutOrganizer.pending, (state : IOrganizerState) => {
               state.loading = true;
            })
            .addCase(logoutOrganizer.fulfilled, (state: IOrganizerState) => {
                state.isLogged = false;
                state.profile = null;
                state.loading  = false;
            })
            .addCase(logoutOrganizer.rejected, (state : IOrganizerState) => {
                state.loading = false;
            })
            // Email Verification 
            .addCase(emailVerification.pending, (state : IOrganizerState) => {
                state.loading = true;
            })
            .addCase(emailVerification.fulfilled, (state : IOrganizerState) => {
                state.loading = false;
            })
            .addCase(emailVerification.rejected, (state : IOrganizerState)=> {
                state.loading = false;
            })
            // Verify Email via Token 
            .addCase(verifyOrganizer.pending, (state : IOrganizerState)=> {
                state.loading = true;
            })
            .addCase(verifyOrganizer.fulfilled, (state : IOrganizerState) => {
                state.loading = false;
                state.profile = null;
            })
            .addCase(verifyOrganizer.rejected, (state : IOrganizerState) => {
                state.loading = false;
            })
            // When user login and signup the orgnaizer need to logout
            .addCase(loginUser.fulfilled, (state : IOrganizerState) => {
                if(state.profile){
                    state.profile = null;
                    state.isLogged = false;
                }
            })
            .addCase(signUp.fulfilled, (state : IOrganizerState) => {
                if(state.profile){
                    state.profile = null;
                    state.isLogged = false;
                }
            })
            .addCase(fetchUserData.fulfilled, (state : IOrganizerState) => {
                if(state.profile){
                    state.profile = null;
                    state.isLogged = false;
                }
            })
        },
});


export default organizerSlice.reducer;