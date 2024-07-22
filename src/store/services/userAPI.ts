import { createAsyncThunk } from '@reduxjs/toolkit';
import { PropsEditProfileUser, PropsLogUser, PropsRegUser, responseUser } from '../../types/User';
import axios from 'axios';
import { IErrorUser } from '../../types/IErrorUser';

const apiUrl = 'https://api.realworld.io/api';

export const getUser = createAsyncThunk<responseUser, string, { rejectValue: IErrorUser }>(
  'user/getUser',
  async function (token: string, { rejectWithValue }) {
    try {
      const res = await axios.get(`${apiUrl}/user`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 422) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              getUser: {
                message: `${keys} is already in use.`,
                fields: Object.keys(error.response.data.errors),
              },
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            getUser: {
              message: error.message,
            },
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);

export const logUser = createAsyncThunk<responseUser, PropsLogUser, { rejectValue: IErrorUser }>(
  'user/logUser',
  async function (user: PropsLogUser, { rejectWithValue }) {
    try {
      const { email, password } = user;
      const res = await axios.post(`${apiUrl}/users/login`, {
        user: {
          email,
          password,
        },
      });
      if (res.data) {
        localStorage.setItem('token', res.data.user.token);
        return res.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 403) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              logUser: {
                message: `${keys} is already in use.`,
                fields: Object.keys(error.response.data.errors),
              },
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            logUser: {
              message: error.message,
            },
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);

export const regUser = createAsyncThunk<responseUser, PropsRegUser, { rejectValue: IErrorUser }>(
  'user/regUser',
  async function (user: PropsRegUser, { rejectWithValue }) {
    try {
      const { username, email, password } = user;
      const res = await axios.post(`${apiUrl}/users`, {
        user: {
          username,
          email,
          password,
        },
      });
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 422) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              regUser: {
                message: `${keys} is already in use.`,
                fields: Object.keys(error.response.data.errors),
              },
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            regUser: {
              message: error.message,
            },
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);

export const editProfileUser = createAsyncThunk<
  responseUser,
  PropsEditProfileUser,
  { rejectValue: IErrorUser }
>('user/editProfileUser', async function (user: PropsEditProfileUser, { rejectWithValue }) {
  try {
    const { token, username, email, password, image } = user;
    const res = await axios.put(
      `${apiUrl}/user`,
      {
        user: {
          username,
          email,
          password,
          image,
        },
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(' and ');
          const obj = {
            editProfileUser: {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            },
          };
          return rejectWithValue(obj);
        }
        if (error.response.status === 500) {
          const obj = {
            editProfileUser: {
              message: error.response.data,
            },
          };
          return rejectWithValue(obj);
        }
      }
      if (error.message) {
        const obj = {
          editProfileUser: {
            message: error.message,
          },
        };
        return rejectWithValue(obj);
      }
    }
  }
});
