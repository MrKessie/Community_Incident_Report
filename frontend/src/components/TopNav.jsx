import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function TopNav() {
  const navigate = useNavigate();
  const { user, clearSession } = useAuth();
  const roleName = user?.role?.role_name;

  async function handleLogout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore API failures and clear local session.
    } finally {
      clearSession();
      navigate('/login');
    }
  }

  return (
    <nav className="top-nav">
      <div className="top-nav-left">
        <strong>CIR System</strong>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/incidents">Incidents</Link>
        <Link to="/incidents/report">Report</Link>
        {roleName === 'Admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div className="top-nav-right">
        <span>{user?.name}</span>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default TopNav;
