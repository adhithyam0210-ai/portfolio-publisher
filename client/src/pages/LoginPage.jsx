import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Shield, User, ArrowLeft, Sparkles, KeyRound } from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { user, login } = useAuth();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Notice: Auto-redirect removed so clicking Login always prompts for credentials.
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error('Please enter your email/username and password.');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(identifier.trim(), password);
      
      // Role-based redirection after authentication
      if (loggedUser.role === 'ADMIN') {
        toast.success(`Welcome to Admin Governance, ${loggedUser.username}!`);
        onNavigate('admin');
      } else {
        toast.success(`Welcome back, ${loggedUser.username}!`);
        onNavigate('dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick 1-click demo login helper
  const handleQuickLogin = async (demoIdentifier, demoPassword) => {
    setIdentifier(demoIdentifier);
    setPassword(demoPassword);
    setSubmitting(true);
    try {
      const loggedUser = await login(demoIdentifier, demoPassword);
      if (loggedUser.role === 'ADMIN') {
        toast.success(`Signed in as Administrator: ${loggedUser.username}`);
        onNavigate('admin');
      } else {
        toast.success(`Signed in as User: ${loggedUser.username}`);
        onNavigate('dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-narrow" style={{ padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Back to Home Link */}
      <button
        onClick={() => onNavigate('home')}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          alignSelf: 'flex-start',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={16} />
        <span>Back to Landing Page</span>
      </button>

      <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem 2rem' }}>
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'var(--accent-tag-bg)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Sign In to PortfolioCraft
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Single unified sign-in for users and administrators. You will be redirected to your dashboard automatically.
          </p>
        </div>

        {/* Active Session Notice if already signed in */}
        {user && (
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontSize: '0.84rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Active session: </span>
              <strong style={{ color: 'var(--text-main)' }}>{user.username}</strong>{' '}
              <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{user.role}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => onNavigate(user.role === 'ADMIN' ? 'admin' : 'dashboard')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => { logout(); toast.info('Signed out. Enter credentials to sign in.'); }}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Unified Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. john@example.com or admin"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={submitting}
          >
            <LogIn size={18} />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Don't have an account */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Create an Account
          </button>
        </div>

        {/* Pre-Seeded Fast Demo Login Section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Instant 1-Click Demo Accounts
            </span>
            <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
              Auto-Routing
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* Demo User */}
            <button
              type="button"
              className="btn btn-secondary btn-md"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem' }}
              onClick={() => handleQuickLogin('john@example.com', 'UserPassword@123')}
              disabled={submitting}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={15} color="var(--accent-primary)" />
                <span style={{ fontWeight: 600 }}>Demo User (John Doe)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>→ User Dashboard</span>
            </button>

            {/* Demo Admin */}
            <button
              type="button"
              className="btn btn-secondary btn-md"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem' }}
              onClick={() => handleQuickLogin('admin@platform.com', 'AdminPassword@123')}
              disabled={submitting}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={15} color="#ef4444" />
                <span style={{ fontWeight: 600 }}>Demo Admin (Platform Admin)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>→ Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
