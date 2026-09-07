import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, ArrowLeft, Layers, AlertCircle, Sparkles, FolderGit2, Share2 } from 'lucide-react';

import { GoogleAuthModal } from '../components/auth/GoogleAuthModal';

export const LoginPage = ({ onNavigate }) => {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Inline errors state & general banner error
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [formError, setFormError] = useState('');

  const validateField = (field, value) => {
    let err = '';
    if (field === 'identifier') {
      const clean = value.trim();
      if (!clean) {
        err = 'Email or username is required.';
      } else if (clean.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(clean)) {
          err = 'Please enter a valid email address (e.g. name@example.com).';
        }
      }
    } else if (field === 'password') {
      if (!value) {
        err = 'Password is required.';
      }
    }
    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setIdentifier(val);
    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
    if (formError) setFormError('');
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const errId = validateField('identifier', identifier);
    const errPass = validateField('password', password);

    if (errId || errPass) {
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(identifier.trim(), password);
      if (loggedUser.role === 'ADMIN') {
        toast.success(`Welcome to Admin Governance, ${loggedUser.username}!`);
        onNavigate('admin');
      } else {
        toast.success(`Welcome back, ${loggedUser.username}!`);
        onNavigate('dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Invalid credentials. Please check your details.';
      const lowerMsg = msg.toLowerCase();

      if (lowerMsg.includes('user not found') || lowerMsg.includes('username') || lowerMsg.includes('email')) {
        setErrors((prev) => ({ ...prev, identifier: 'No account found with this email or username.' }));
      } else if (lowerMsg.includes('password')) {
        setErrors((prev) => ({ ...prev, password: 'Incorrect password. Please verify and try again.' }));
      } else {
        setFormError(msg);
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAccountSelect = async (account) => {
    setSubmitting(true);
    try {
      const loggedUser = await loginWithGoogle({
        email: account.email.trim(),
        name: account.name || account.email.split('@')[0],
        picture: account.picture || ''
      });
      setIsGoogleModalOpen(false);
      toast.success(`Signed in as ${loggedUser.email}!`);
      if (loggedUser.role === 'ADMIN') {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Google authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem'
    }}>
      {/* Back to Home Link */}
      <button
        type="button"
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
          width: '100%',
          maxWidth: '460px',
          transition: 'color 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={16} />
        <span>Back to Landing Page</span>
      </button>

      {/* Main Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        padding: '2.5rem 2.25rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Brand Icon & Heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-primary, #059669), #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
          }}>
            <Layers size={20} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            PortfolioCraft
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '0.35rem',
          letterSpacing: '-0.025em'
        }}>
          Sign in
        </h1>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Create now
          </button>
        </p>

        {/* Form Level Error Alert Banner */}
        {formError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#ef4444',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {/* Active Session Notice if already signed in */}
        {user && (
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Active: </span>
              <strong style={{ color: 'var(--text-main)' }}>{user.username}</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => onNavigate(user.role === 'ADMIN' ? 'admin' : 'dashboard')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => { logout(); toast.info('Signed out.'); }}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email or Username
            </label>
            <input
              type="text"
              placeholder="name@example.com or username"
              value={identifier}
              onChange={handleIdentifierChange}
              onBlur={() => validateField('identifier', identifier)}
              className={`form-input-standard ${errors.identifier ? 'has-error' : ''}`}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: `1.5px solid ${errors.identifier ? '#ef4444' : 'var(--border-medium)'}`,
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.identifier ? '#ef4444' : 'var(--accent-primary)';
                e.target.style.boxShadow = errors.identifier ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(5, 150, 105, 0.15)';
              }}
              autoComplete="username"
            />
            {errors.identifier && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.identifier}</span>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validateField('password', password)}
                className={`form-input-standard ${errors.password ? 'has-error' : ''}`}
                style={{
                  width: '100%',
                  padding: '0.8rem 2.8rem 0.8rem 1rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${errors.password ? '#ef4444' : 'var(--border-medium)'}`,
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.password ? '#ef4444' : 'var(--accent-primary)';
                  e.target.style.boxShadow = errors.password ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(5, 150, 105, 0.15)';
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.84rem',
                padding: 0
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Pill Sign In Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.85rem',
              fontWeight: 700,
              fontSize: '0.98rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: '0.25rem',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
              transition: 'background 0.15s ease, transform 0.15s ease'
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--accent-primary-hover)'; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--accent-primary)'; }}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* OR Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            OR
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
        </div>

        {/* Continue with Google Pill Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={submitting}
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '9999px',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            transition: 'border-color 0.15s ease, background 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
        loading={submitting}
      />
    </div>
  );
};
export default LoginPage;
