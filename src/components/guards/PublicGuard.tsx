import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

const PublicGuard = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated && userRole) {
    const redirectMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: '/admin',
      [UserRole.DOCTOR]: '/doctor',
      [UserRole.PATIENT]: '/patient',
    };
    return <Navigate to={redirectMap[userRole]} replace />;
  }

  return <Outlet />;
};

export default PublicGuard;
