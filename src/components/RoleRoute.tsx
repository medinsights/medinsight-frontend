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

export default function RoleRoute({ roles, redirectTo }: RoleRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Smart redirect based on user role if not specified
  const getDefaultRedirect = () => {
    if (redirectTo) return redirectTo;
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/dashboard';
      case 'doctor':
      case 'secretary':
        return '/patients';
      default:
        return '/profile';
    }
  };

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
    return <Navigate to={getDefaultRedirect()} replace />;
  }

  return <Outlet />;
}
