import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await axios.get("/api/auth/me", { withCredentials: true });
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle" },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
