import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { getUser } from '../../store/services/userAPI';

interface IContext {
  isAuth: boolean;
  loginAuth: () => void;
  logoutAuth: () => void;
}

const defaultState = {
  isAuth: false,
  loginAuth: () => {},
  logoutAuth: () => {},
};

const AuthContext = createContext<IContext>(defaultState);

interface Props {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUser(token));
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  const loginAuth = () => {
    setIsAuth(true);
  };

  const logoutAuth = () => {
    setIsAuth(false);
    localStorage.removeItem('token');
  };

  const data = () => {
    return {
      isAuth,
      loginAuth,
      logoutAuth,
    };
  };

  return <AuthContext.Provider value={data()}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
