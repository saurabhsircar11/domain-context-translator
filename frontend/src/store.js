import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import projectsReducer from "./features/projects/projects.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
  },
});
