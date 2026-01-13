/**
 * RoleRoute - Guards routes by allowed roles (admin, doctor, secretary)
 * Adapted for MedInsights system
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type RoleRouteProps = {
  roles: Array<'admin' | 'doctor' | 'secretary' | 'user'>;
  redirectTo?: string;
};

export default function RoleRoute({ roles, redirectTo = '/profile' }: RoleRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (!roles.includes(user.role as any)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
