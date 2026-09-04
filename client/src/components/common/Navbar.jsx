import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  LayoutDashboard,
  Code2,
  Settings,
  Shield,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Navbar = ({ activeTab, onNavigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('portfoliocraft_theme') || 'dark');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfoliocraft_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleBrandClick = () => {
    if (user) {
      onNavigate(isAdmin ? 'admin' : 'dashboard');
    } else {
      onNavigate('home');
    }
  };

  return (
    <nav className={`app-top-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Brand */}
        <div
          onClick={handleBrandClick}
          className="navbar-brand-interactive"
          title={user ? (isAdmin ? 'Go to Admin Dashboard' : 'Go to User Dashboard') : 'Go to PortfolioCraft Home'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <Layers size={18} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              PORTFOLIOCRAFT
            </span>
            {isAdmin && (
              <span className="cool-admin-badge" title="Executive Platform Administrator">
                <Shield size={11} />
                <span>ADMIN</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {isAdmin ? (
                <button
                  className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onNavigate('admin')}
                  style={{ borderColor: activeTab === 'admin' ? 'transparent' : 'rgba(59, 130, 246, 0.4)' }}
                >
                  <Shield size={15} color={activeTab === 'admin' ? '#ffffff' : '#3b82f6'} />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <>
                  <button
                    className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('dashboard')}
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                  </button>

                  <button
                    className={`btn btn-sm ${activeTab === 'builder' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onNavigate('builder')}
                  >
                    <Code2 size={15} />
                    <span>Builder</span>
                  </button>
                </>
              )}

              <button
                className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('settings')}
                title="Settings"
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                className="btn btn-secondary btn-icon-only btn-sm"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* User Account / Sign Out */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.85rem' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {user.username}
                </div>
                <button
                  className="btn btn-secondary btn-icon-only btn-sm"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Theme Toggle for Visitors */}
              <button
                className="btn btn-secondary btn-icon-only btn-sm"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('login')}
              >
                Sign In
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('register')}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
