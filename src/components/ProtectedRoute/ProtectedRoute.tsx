import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuth } = useAuth();
  if (!isAuth) {
    return <Navigate to="/sign-in" />;
  }
  return <>{children}</>;
};
