import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const res = await axios.get("/api/projects", { withCredentials: true });
  return res.data;
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (project) => {
    const res = await axios.post("/api/projects", project, {
      withCredentials: true,
    });
    return res.data;
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, sentences }) => {
    const res = await axios.put(
      `/api/projects/${id}`,
      { sentences },
      { withCredentials: true }
    );
    return res.data;
  }
);

export const deleteProject = createAsyncThunk("projects/delete", async (id) => {
  await axios.delete(`/api/projects/${id}`, { withCredentials: true });
  return id;
});

const projectsSlice = createSlice({
  name: "projects",
  initialState: { list: [], status: "idle" },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index >= 0) state.list[index] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
