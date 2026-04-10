import { Navigate, Outlet } from 'react-router-dom';
import { tokenStorage } from '@/services/api';

const AuthGuard = () => {
  if (tokenStorage.isJwtExpired()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
