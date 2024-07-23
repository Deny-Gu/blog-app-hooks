import React from "react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUser } from "../../services/userAPI";
import { User } from "../../types/User";

interface IContext {
  user: User | null;
  isAuth: boolean;
  editUser: (arg0: User) => void;
  loginAuth: () => void;
  logoutAuth: () => void;
}

const defaultState = {
  user: null,
  isAuth: false,
  editUser: () => {},
  loginAuth: () => {},
  logoutAuth: () => {},
};

const AuthContext = createContext<IContext>(defaultState);

interface Props {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<null | User>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser(token).then((res) => {
        setUser(res.user);
        setIsAuth(true);
      });
    } else {
      setIsAuth(false);
    }
  }, []);

  const editUser = (user: User) => {
    setUser(user);
  };

  const loginAuth = () => {
    setIsAuth(true);
  };

  const logoutAuth = () => {
    setIsAuth(false);
    localStorage.removeItem("token");
  };

  const data = () => {
    return {
      user,
      isAuth,
      editUser,
      loginAuth,
      logoutAuth,
    };
  };

  return <AuthContext.Provider value={data()}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
