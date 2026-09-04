import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, ArrowLeft, Check, X, Layers, AlertCircle, ChevronRight } from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Inline error state & general banner error
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const validateField = (field, value) => {
    let err = '';
    if (field === 'identifier') {
      const clean = value.trim();
      if (!clean) {
        err = 'E-mail, username, or phone number is required.';
      } else if (clean.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(clean)) {
          err = 'Please enter a valid email address (e.g. name@gmail.com).';
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
        setErrors((prev) => ({ ...prev, identifier: 'No account found with this email, username, or phone number.' }));
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

  const executeGoogleAuth = async (email, name, picture) => {
    setSubmitting(true);
    try {
      const loggedUser = await loginWithGoogle({
        email,
        name,
        picture: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      setIsGoogleModalOpen(false);
      toast.success(`Signed in with Google as ${loggedUser.email}!`);
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
          maxWidth: '430px',
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
        maxWidth: '440px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '20px',
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
              E-mail or Username
            </label>
            <input
              type="text"
              placeholder="e.g. name@gmail.com or username"
              value={identifier}
              onChange={handleIdentifierChange}
              onBlur={() => validateField('identifier', identifier)}
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
                <span>⚠️</span>
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
                <span>⚠️</span>
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
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0', gap: '1rem' }}>
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
          {/* Multi-colored Google G Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Google Sign-In Account Chooser Modal */}
      {isGoogleModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            maxWidth: '430px',
            width: '100%',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            position: 'relative',
            animation: 'modalSlideUp 0.2s ease-out'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--bg-subtle)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Google Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Sign in with Google
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Choose an account to continue to PortfolioCraft
                </span>
              </div>
            </div>

            {/* Quick 1-Click User Account Option with Rich Profile Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {/* Account 1: Adhithya M */}
              <div
                onClick={() => executeGoogleAuth('adhithyam0210@gmail.com', 'Adhithya M', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1rem',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: '14px',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="Adhithya M"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    Adhithya M
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    adhithyam0210@gmail.com
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>

              {/* Account 2: Adhithya */}
              <div
                onClick={() => executeGoogleAuth('adhithya@gmail.com', 'Adhithya', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1rem',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: '14px',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
                    alt="Adhithya"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    Adhithya
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    adhithya@gmail.com
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>

            {/* Custom Google Email Input */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Or enter another Google email:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="e.g. name@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.7rem 0.9rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.includes('@')}
                  onClick={() => executeGoogleAuth(customGoogleEmail, customGoogleEmail.split('@')[0])}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '10px', padding: '0.7rem 1.25rem', fontWeight: 700 }}
                >
                  Continue
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1.25rem', marginBottom: 0, textAlign: 'center', lineHeight: 1.4 }}>
              To continue, Google will verify your email and profile with PortfolioCraft.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

