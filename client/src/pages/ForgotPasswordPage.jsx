import React, { useState } from 'react';
import { authApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = ({ onNavigate }) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tokenResult, setTokenResult] = useState(null);

  // For quick reset flow
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      toast.success(res.message || 'Reset token generated!');
      setTokenResult(res.resetToken);
    } catch (err) {
      toast.error(err.message || 'Failed to request reset token.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setResetting(true);
    try {
      const res = await authApi.resetPassword({ token: tokenResult, newPassword });
      toast.success(res.message || 'Password reset successfully! Please sign in.');
      onNavigate('login');
    } catch (err) {
      toast.error(err.message || 'Password reset failed.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="container-narrow" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem' }}>
        <button
          onClick={() => onNavigate('login')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 1rem' }}>
            <KeyRound size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter your account email to retrieve or update your password
          </p>
        </div>

        {!tokenResult ? (
          <form onSubmit={handleRequestToken} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Registered Account Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Generating Token...' : 'Generate Reset Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', color: '#a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <CheckCircle2 size={16} /> Token Generated for Demonstration:
              </div>
              <code style={{ wordBreak: 'break-all', display: 'block', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4px', marginTop: '0.4rem' }}>
                {tokenResult}
              </code>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Set New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={resetting}>
              {resetting ? 'Updating Password...' : 'Save New Password & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
