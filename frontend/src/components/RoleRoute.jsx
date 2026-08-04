import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleRoute({ allowedRoles, children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="screen-center" aria-live="polite" aria-label="Checking access">
        <div className="route-preloader" aria-hidden="true" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role?.role_name;

  if (!roleName || !allowedRoles.includes(roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;
