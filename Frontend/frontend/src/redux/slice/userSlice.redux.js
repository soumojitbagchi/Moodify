import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,        // Will hold { name, username, email } after login
    isAuthenticated: false, // true = user is logged in, false = not
    loading: false,         // true = an API call is in progress
    token: null,            // JWT token from backend after successful login
    error: null,            // Error message string if login/register fails
  },

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.error = null;
    },
  },
});

export const {
  setUserInfo,
  setIsAuthenticated,
  setLoading,
  setToken,
  setError,
  clearError,
  logout,
} = userSlice.actions;
export default userSlice.reducer;