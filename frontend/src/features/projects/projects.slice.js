import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Fetch all projects
export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const res = await axios.get("/api/projects", { withCredentials: true });
  return res.data;
});

// Fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id) => {
    const res = await axios.get(`/api/projects/${id}`, {
      withCredentials: true,
    });
    return res.data;
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  "projects/create",
  async (project) => {
    const sentences =
      project?.sentences
        ?.split(/,|\n/)
        ?.filter((sentence) => sentence)
        .map((sentence) => ({ source: sentence })) ?? [];
    const res = await axios.post(
      "/api/projects",
      { ...project, sentences },
      {
        withCredentials: true,
      }
    );
    return res.data;
  }
);

// Update a project (translations)
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

// Delete a project
export const deleteProject = createAsyncThunk("projects/delete", async (id) => {
  await axios.delete(`/api/projects/${id}`, { withCredentials: true });
  return id;
});

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    selectedProject: null,
    status: "idle",
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch single project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state) => {
        state.status = "failed";
        state.selectedProject = null;
      })

      // Create a project
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update a project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index >= 0) state.items[index] = action.payload;
      })

      // Delete a project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
