import { Navigate, Outlet } from 'react-router-dom';
import { tokenStorage } from '@/services/api';
import { UserRole } from '@/types/auth';

const PublicGuard = () => {
  if (!tokenStorage.isJwtExpired()) {
    const userRole = tokenStorage.getUserRole() as UserRole | null;
    if (userRole) {
      const redirectMap: Record<UserRole, string> = {
        [UserRole.ADMIN]: '/admin',
        [UserRole.DOCTOR]: '/doctor',
        [UserRole.PATIENT]: '/patient',
      };
      return <Navigate to={redirectMap[userRole]} replace />;
    }
  }

  return <Outlet />;
};

export default PublicGuard;
