import { createSlice } from "@reduxjs/toolkit";
import { IAdminState } from "../../interfaces/admin";
import { getAllUsers } from "../action/adminActions";




const initialState: IAdminState = {
    loading: false,
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Fetching user data
           .addCase(getAllUsers.pending, (state : IAdminState) => {
            state.loading = true;
           })
           .addCase(getAllUsers.fulfilled, (state: IAdminState) => {
            state.loading = false;
           })
           .addCase(getAllUsers.rejected, (state: IAdminState) => {
            state.loading = false;
           })
    },
});


export default adminSlice.reducer;