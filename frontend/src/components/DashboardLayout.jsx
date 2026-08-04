import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const SIDENAV_COLLAPSE_KEY = 'cir.sidenav.collapsed';
const THEME_KEY = 'cir.ui.theme';

function Icon({ children }) {
  return (
    <span className="ui-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
  );
}

function navIconPath(path) {
  if (path === '/dashboard') {
    return <path d="M3 4h8v7H3V4zm10 0h8v4h-8V4zM3 13h8v7H3v-7zm10-3h8v10h-8V10z" />;
  }

  if (path === '/incidents') {
    return <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" />;
  }

  if (path === '/incidents/report') {
    return <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2z" />;
  }

  return <path d="M12 2l9 4v6c0 5-3.8 9.7-9 10-5.2-.3-9-5-9-10V6l9-4zm0 2.2L5 7v5c0 3.9 2.8 7.7 7 8.1 4.2-.4 7-4.2 7-8.1V7l-7-2.8z" />;
}

function DashboardLayout({ title, subtitle, children, statusBadge, breadcrumbItems = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearSession } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => window.innerWidth > 680);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme || 'light';
  });
  const profileRef = useRef(null);
  const roleName = user?.role?.role_name;

  useEffect(() => {
    const savedCollapseState = localStorage.getItem(SIDENAV_COLLAPSE_KEY);

    if (savedCollapseState === '1') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    function handleResize() {
      const isDesktop = window.innerWidth > 680;
      setIsDesktopViewport(isDesktop);

      if (isDesktop) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const navigationLinks = useMemo(() => {
    const links = [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Incidents', to: '/incidents' },
      { label: 'Report Incident', to: '/incidents/report' },
    ];

    if (roleName === 'Admin') {
      links.push({ label: 'Admin', to: '/admin' });
    }

    return links;
  }, [roleName]);

  const fallbackBreadcrumb = useMemo(() => {
    const activeLink = navigationLinks.find((link) => location.pathname.startsWith(link.to));

    if (!activeLink) {
      return [{ label: 'Dashboard', to: '/dashboard' }];
    }

    return [{ label: activeLink.label }];
  }, [location.pathname, navigationLinks]);

  const breadcrumbs = breadcrumbItems.length > 0 ? breadcrumbItems : fallbackBreadcrumb;

  async function handleLogout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore API failures and clear local session.
    } finally {
      setIsProfileOpen(false);
      clearSession();
      navigate('/login');
    }
  }

  function handleNavClick() {
    setIsMobileMenuOpen(false);
  }

  function toggleSidebar() {
    setIsSidebarCollapsed((previous) => {
      const nextValue = !previous;
      localStorage.setItem(SIDENAV_COLLAPSE_KEY, nextValue ? '1' : '0');
      return nextValue;
    });
  }

  const applyCollapsedClass = isDesktopViewport && isSidebarCollapsed;
  const fullBreadcrumbs = [{ label: 'Home', to: '/dashboard' }, ...breadcrumbs];

  return (
    <div className={`dashboard-shell-v2 ${applyCollapsedClass ? 'sidenav-collapsed' : ''}`}>
      {isMobileMenuOpen && <button type="button" className="shell-backdrop" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`shell-sidenav ${applyCollapsedClass ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidenav-brand-row">
          <Link to="/dashboard" className="sidenav-brand" onClick={handleNavClick}>
            CIR System
          </Link>
          <button
            type="button"
            className="collapse-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon>
              {isSidebarCollapsed ? (
                <path d="M8 5l8 7-8 7v-4H4v-6h4V5z" />
              ) : (
                <path d="M16 5l-8 7 8 7v-4h4v-6h-4V5z" />
              )}
            </Icon>
          </button>
        </div>

        <nav className="sidenav-nav" aria-label="Sidebar navigation">
          {navigationLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidenav-link ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <Icon>{navIconPath(item.to)}</Icon>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="shell-main-column">
        <header className="shell-header">
          <div>
            <button type="button" className="header-menu-button" onClick={() => setIsMobileMenuOpen(true)}>
              <Icon>
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2z" />
              </Icon>
              <span>Menu</span>
            </button>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="header-actions">
            {statusBadge}
            <div className="profile-dropdown" ref={profileRef}>
              <button type="button" className="profile-toggle" onClick={() => setIsProfileOpen((previous) => !previous)}>
                <span className="user-chip">{user?.name}</span>
                <Icon>
                  <path d="M7 10l5 5 5-5z" />
                </Icon>
              </button>

              {isProfileOpen && (
                <div className="profile-menu" role="menu" aria-label="User profile menu">
                  <p className="profile-menu-name">{user?.name}</p>
                  <p className="profile-menu-role">{roleName || 'User'}</p>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))}
                  >
                    <Icon>
                      {theme === 'light' ? <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" /> : <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6L4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4m15.6-15.6-1.4 1.4M12 7a5 5 0 100 10 5 5 0 000-10z" />}
                    </Icon>
                    <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
                  </button>
                  <button type="button" onClick={handleLogout}>
                    <Icon>
                      <path d="M15 3H6a2 2 0 00-2 2v14a2 2 0 002 2h9v-2H6V5h9V3zm2.3 4.3l-1.4 1.4 1.3 1.3H10v2h7.2l-1.3 1.3 1.4 1.4L21 11l-3.7-3.7z" />
                    </Icon>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <nav className="shell-breadcrumb" aria-label="Breadcrumb">
          <ol>
            {fullBreadcrumbs.map((item, index) => (
              <li key={`${item.label}-${item.to || 'current'}`}>
                {index > 0 && <span className="crumb-separator">/</span>}
                {item.to && index !== fullBreadcrumbs.length - 1 ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span className="crumb-current">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <main className="shell-content page-transition">{children}</main>

        <footer className="shell-footer">Community Incident Reporting System</footer>
      </div>
    </div>
  );
}

export default DashboardLayout;
