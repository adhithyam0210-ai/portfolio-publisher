import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { BuilderPage } from './pages/BuilderPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';

export const App = () => {
  const { user, loading, isAdmin } = useAuth();

  // Helper to parse current path
  const getRouteFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/portfolio/')) {
      const slug = path.replace('/portfolio/', '').replace(/\/$/, '');
      return { view: 'public', slug };
    }
    if (path === '/login') return { view: 'login' };
    if (path === '/register') return { view: 'register' };
    if (path === '/forgot-password') return { view: 'forgot-password' };
    if (path === '/dashboard') return { view: 'dashboard' };
    if (path === '/builder') return { view: 'builder' };
    if (path === '/settings') return { view: 'settings' };
    if (path === '/admin') return { view: 'admin' };
    return { view: 'home' };
  };

  const [route, setRoute] = useState(getRouteFromPath());
  const [builderTab, setBuilderTab] = useState('personal');

  // Handle URL change
  const navigate = (view, extra = null) => {
    let targetPath = '/';
    if (view === 'public') targetPath = `/portfolio/${extra}`;
    else if (view === 'home') targetPath = '/';
    else targetPath = `/${view}`;

    window.history.pushState({}, '', targetPath);
    if (view === 'builder' && extra) {
      setBuilderTab(extra);
    }
    setRoute({ view, slug: extra });
    window.scrollTo(0, 0);
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Public Portfolio direct rendering
  if (route.view === 'public') {
    return <PublicPortfolioPage slug={route.slug} onNavigateHome={() => navigate('home')} />;
  }

  // Authentication guards
  const protectedViews = ['dashboard', 'builder', 'settings', 'admin'];

  if (loading && protectedViews.includes(route.view)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary, #2563eb)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Role guards: Admin routes vs User routes & home page dashboard routing
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        if (['home', 'dashboard', 'builder', 'login', 'register'].includes(route.view)) {
          navigate('admin');
        }
      } else {
        if (['home', 'admin', 'login', 'register'].includes(route.view)) {
          navigate('dashboard');
        }
      }
    }
  }, [route.view, user, isAdmin]);

  if (protectedViews.includes(route.view) && !user) {
    return (
      <div className="app-layout">
        <Navbar activeTab="login" onNavigate={navigate} />
        <main className="main-content">
          <LoginPage onNavigate={navigate} />
        </main>
        <Footer />
      </div>
    );
  }

  // Compute effective view: authenticated users/admins landing on 'home', 'login', or 'register' directly see their dashboard
  const effectiveView = (() => {
    if (user) {
      if (route.view === 'home' || route.view === 'login' || route.view === 'register') {
        return isAdmin ? 'admin' : 'dashboard';
      }
      if (isAdmin && (route.view === 'dashboard' || route.view === 'builder')) {
        return 'admin';
      }
      if (!isAdmin && route.view === 'admin') {
        return 'dashboard';
      }
    }
    return route.view;
  })();

  return (
    <div className="app-layout">
      {/* Top Navbar displayed across views */}
      <Navbar activeTab={effectiveView} onNavigate={navigate} />

      <main className="main-content">
        {effectiveView === 'home' && <HomePage onNavigate={navigate} />}
        {effectiveView === 'login' && <LoginPage onNavigate={navigate} />}
        {effectiveView === 'register' && <RegisterPage onNavigate={navigate} />}
        {effectiveView === 'forgot-password' && <ForgotPasswordPage onNavigate={navigate} />}
        {effectiveView === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {effectiveView === 'builder' && <BuilderPage initialTab={builderTab} onNavigate={navigate} />}
        {effectiveView === 'settings' && <SettingsPage onNavigate={navigate} />}
        {effectiveView === 'admin' && <AdminDashboardPage onNavigate={navigate} />}
      </main>

      {/* Footer rendered on all pages except builder */}
      {effectiveView !== 'builder' && <Footer />}
    </div>
  );
};
