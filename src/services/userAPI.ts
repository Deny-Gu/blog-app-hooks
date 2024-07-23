import axios from "axios";
import {
  PropsEditProfileUser,
  PropsLogUser,
  PropsRegUser,
} from "../types/User";

const apiUrl = "https://api.realworld.io/api";

export const getUser = async (token: string) => {
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
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            getUser: {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            },
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          getUser: {
            message: error.message,
          },
        };
        return obj;
      }
    }
  }
};

export const logUser = async (user: PropsLogUser) => {
  try {
    const { email, password } = user;
    const res = await axios.post(`${apiUrl}/users/login`, {
      user: {
        email,
        password,
      },
    });
    if (res.data) {
      localStorage.setItem("token", res.data.user.token);
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 403) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            logUser: {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            },
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          logUser: {
            message: error.message,
          },
        };
        return obj;
      }
    }
  }
};

export const regUser = async (user: PropsRegUser) => {
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
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            regUser: {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            },
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          regUser: {
            message: error.message,
          },
        };
        return obj;
      }
    }
  }
};

export const editProfileUser = async (user: PropsEditProfileUser) => {
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
      },
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            editProfileUser: {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            },
          };
          return obj;
        }
        if (error.response.status === 500) {
          const obj = {
            editProfileUser: {
              message: error.response.data,
            },
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          editProfileUser: {
            message: error.message,
          },
        };
        return obj;
      }
    }
  }
};
