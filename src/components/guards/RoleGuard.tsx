import { Navigate, Outlet } from 'react-router-dom';
import { tokenStorage } from '@/services/api';
import { UserRole } from '@/types/auth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  if (tokenStorage.isJwtExpired()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = tokenStorage.getUserRole() as UserRole | null;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
