import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, ArrowLeft, Layers, AlertCircle, Check, X } from 'lucide-react';
import { validatePasswordStrength } from '../utils/url';

export const RegisterPage = ({ onNavigate }) => {
  const { register, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Eye toggles for password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inline errors state
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [submitting, setSubmitting] = useState(false);

  // Live password strength checks
  const passAnalysis = validatePasswordStrength(password);

  const validateField = (field, value) => {
    let err = '';
    if (field === 'fullName') {
      const clean = value.trim();
      if (!clean) {
        err = 'Full name is required.';
      } else if (clean.length < 2) {
        err = 'Full name must be at least 2 characters.';
      }
    } else if (field === 'email') {
      const clean = value.trim();
      if (!clean) {
        err = 'Email address is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(clean)) {
          err = 'Please enter a valid email address (e.g. name@example.com).';
        }
      }
    } else if (field === 'phone') {
      const clean = value.replace(/\D/g, '');
      if (!clean) {
        err = 'Phone number is required.';
      } else if (clean.length !== 10) {
        err = 'Phone number must be exactly 10 digits.';
      }
    } else if (field === 'password') {
      if (!value) {
        err = 'Password is required.';
      } else {
        const check = validatePasswordStrength(value);
        if (!check.isValid) {
          err = check.message;
        }
      }
    } else if (field === 'confirmPassword') {
      if (!value) {
        err = 'Please confirm your password.';
      } else if (value !== password) {
        err = 'Passwords do not match.';
      }
    }
    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFullName(val);
    if (errors.fullName) validateField('fullName', val);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (errors.email) validateField('email', val);
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (errors.phone) validateField('phone', digitsOnly);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (errors.password) validateField('password', val);
    if (confirmPassword && errors.confirmPassword) {
      if (confirmPassword === val) {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (errors.confirmPassword) validateField('confirmPassword', val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errName = validateField('fullName', fullName);
    const errEmail = validateField('email', email);
    const errPhone = validateField('phone', phone);
    const errPass = validateField('password', password);
    const errConfirm = validateField('confirmPassword', confirmPassword);

    if (errName || errEmail || errPhone || errPass || errConfirm) {
      return;
    }

    setSubmitting(true);
    try {
      const cleanName = fullName.trim();
      const usernameGen = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(100 + Math.random() * 900);
      await register({
        username: usernameGen,
        email: email.trim(),
        password,
        fullName: cleanName,
        phone
      });
      toast.success(`Welcome to PortfolioCraft, ${cleanName}!`);
      onNavigate('dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const defaultEmail = prompt('Enter your Google email to sign up:', 'user@gmail.com');
    if (!defaultEmail || !defaultEmail.includes('@')) return;
    setSubmitting(true);
    try {
      const loggedUser = await loginWithGoogle({
        email: defaultEmail.trim(),
        name: defaultEmail.split('@')[0],
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      toast.success(`Registered with Google as ${loggedUser.email}!`);
      onNavigate('dashboard');
    } catch (err) {
      toast.error(err.message || 'Google registration failed.');
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
          Create account
        </h1>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
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
            Sign in
          </button>
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Adhithya M"
              value={fullName}
              onChange={handleNameChange}
              onBlur={() => validateField('fullName', fullName)}
              className={`form-input-standard ${errors.fullName ? 'has-error' : ''}`}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: `1.5px solid ${errors.fullName ? '#ef4444' : 'var(--border-medium)'}`,
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.fullName ? '#ef4444' : 'var(--accent-primary)';
                e.target.style.boxShadow = errors.fullName ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(5, 150, 105, 0.15)';
              }}
            />
            {errors.fullName && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateField('email', email)}
              className={`form-input-standard ${errors.email ? 'has-error' : ''}`}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: `1.5px solid ${errors.email ? '#ef4444' : 'var(--border-medium)'}`,
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--accent-primary)';
                e.target.style.boxShadow = errors.email ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(5, 150, 105, 0.15)';
              }}
            />
            {errors.email && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Phone number
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => validateField('phone', phone)}
              className={`form-input-standard ${errors.phone ? 'has-error' : ''}`}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: `1.5px solid ${errors.phone ? '#ef4444' : 'var(--border-medium)'}`,
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.phone ? '#ef4444' : 'var(--accent-primary)';
                e.target.style.boxShadow = errors.phone ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(5, 150, 105, 0.15)';
              }}
            />
            {errors.phone && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Password with eye toggle & live requirements checklist */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validateField('password', password)}
                className={`form-input-standard ${errors.password ? 'has-error' : ''}`}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.8rem 0.75rem 1rem',
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
                autoComplete="new-password"
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

            {/* Standardized Password Requirements Box */}
            <div className="password-requirements-box" style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Password must meet:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                <div className={`password-req-item ${passAnalysis.rules.length ? 'met' : ''}`}>
                  {passAnalysis.rules.length ? <Check size={12} /> : <span style={{ width: '12px' }}>•</span>}
                  <span>Min 8 characters</span>
                </div>
                <div className={`password-req-item ${passAnalysis.rules.uppercase ? 'met' : ''}`}>
                  {passAnalysis.rules.uppercase ? <Check size={12} /> : <span style={{ width: '12px' }}>•</span>}
                  <span>1 uppercase letter</span>
                </div>
                <div className={`password-req-item ${passAnalysis.rules.number ? 'met' : ''}`}>
                  {passAnalysis.rules.number ? <Check size={12} /> : <span style={{ width: '12px' }}>•</span>}
                  <span>1 number</span>
                </div>
                <div className={`password-req-item ${passAnalysis.rules.special ? 'met' : ''}`}>
                  {passAnalysis.rules.special ? <Check size={12} /> : <span style={{ width: '12px' }}>•</span>}
                  <span>1 special character</span>
                </div>
              </div>
            </div>

            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                className={`form-input-standard ${errors.confirmPassword ? 'has-error' : ''}`}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.8rem 0.75rem 1rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${errors.confirmPassword ? '#ef4444' : 'var(--border-medium)'}`,
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : 'var(--accent-primary)';
                  e.target.style.boxShadow = errors.confirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(5, 150, 105, 0.15)';
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
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
              marginTop: '0.35rem',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
              transition: 'background 0.15s ease, transform 0.15s ease'
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--accent-primary-hover)'; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--accent-primary)'; }}
          >
            {submitting ? 'Creating account...' : 'Create account'}
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

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
    </div>
  );
};
export default RegisterPage;
