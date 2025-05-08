import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchCurrentUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await axios.get("/api/user/me", { withCredentials: true });
  return res.data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const res = await axios.post("/api/auth/logout");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "loggedOut";
      })
      .addCase(logout.rejected, (state) => {
        state.status = "loggedOut";
      });
  },
});

export default authSlice.reducer;
