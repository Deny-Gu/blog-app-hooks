import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { editProfileUser, getUser, logUser, regUser } from '../services/userAPI';
import { IErrorUser } from '../../types/IErrorUser';

type State = {
  user: User | null;
  isLoading: boolean;
  userToken: string | null;
  error: null | undefined | IErrorUser;
  success: boolean;
};

const userToken = localStorage.getItem('token') ? localStorage.getItem('token') : null;

const initialState: State = {
  user: null,
  isLoading: false,
  userToken,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.userToken = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(regUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(regUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(regUser.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(logUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload.user;
        state.userToken = action.payload.user.token;
      })
      .addCase(logUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.success = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(editProfileUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editProfileUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload.user;
      })
      .addCase(editProfileUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
