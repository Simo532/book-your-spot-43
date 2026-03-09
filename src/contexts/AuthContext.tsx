import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenStorage } from '@/services/api';
import { UserRole } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  doctorOrPatientId: string | null;
  setDoctorOrPatientId: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!tokenStorage.isJwtExpired());
  const [userRole, setUserRole] = useState<UserRole | null>(tokenStorage.getUserRole() as UserRole | null);
  const [userId, setUserId] = useState<string | null>(tokenStorage.getUserId());
  const [userEmail, setUserEmail] = useState<string | null>(tokenStorage.getUserEmail());
  const [doctorOrPatientId, setDoctorOrPatientIdState] = useState<string | null>(tokenStorage.getDoctorOrPatientId());

  const firstName = tokenStorage.getUserFirstName();
  const lastName = tokenStorage.getUserLastName();
  const userName = firstName && lastName ? `${firstName} ${lastName}` : null;

  useEffect(() => {
    const checkAuth = () => {
      const valid = !tokenStorage.isJwtExpired();
      setIsAuthenticated(valid);
      if (valid) {
        setUserRole(tokenStorage.getUserRole() as UserRole | null);
        setUserId(tokenStorage.getUserId());
        setUserEmail(tokenStorage.getUserEmail());
        setDoctorOrPatientIdState(tokenStorage.getDoctorOrPatientId());
      }
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const setDoctorOrPatientId = (id: string) => {
    tokenStorage.setDoctorOrPatientId(id);
    setDoctorOrPatientIdState(id);
  };

  const logout = () => {
    tokenStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUserEmail(null);
    setDoctorOrPatientIdState(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, userEmail, userName, doctorOrPatientId, setDoctorOrPatientId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
