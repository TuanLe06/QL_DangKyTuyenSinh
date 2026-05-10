import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
