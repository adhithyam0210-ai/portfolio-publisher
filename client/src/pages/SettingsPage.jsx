import React, { useEffect, useState } from 'react';
import { portfolioApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Settings, Lock, Eye, Globe, Save, Check } from 'lucide-react';

export const SettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');
  const [settings, setSettings] = useState({
    contact_visible: 1,
    resume_downloadable: 1,
    email_visible: 1,
    phone_visible: 0
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await portfolioApi.getMyPortfolio();
        if (res.success) {
          setSlug(res.portfolio?.slug || user?.username || '');
          if (res.settings) {
            setSettings(res.settings);
          }
        }
      } catch (err) {
        toast.error('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [user]);

  const handleSaveSlug = async (e) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      toast.error('Slug cannot be empty.');
      return;
    }

    try {
      await portfolioApi.updateSlug(cleanSlug);
      toast.success('Public URL slug updated successfully!');
      if (refreshUser) refreshUser();
    } catch (err) {
      toast.error(err.message || 'Failed to update slug.');
    }
  };

  const handleToggleSetting = async (field) => {
    const updated = {
      ...settings,
      [field]: settings[field] === 1 ? 0 : 1
    };
    setSettings(updated);
    try {
      await portfolioApi.updateSettings(updated);
      toast.success('Privacy preference updated.');
    } catch (err) {
      toast.error('Failed to update privacy setting.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter your current and new password.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-page-wrapper">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Account &amp; Privacy Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your custom public URL slug, privacy visibility, and security credentials.
        </p>
      </div>

      {/* 1. Custom Public URL Slug */}
      <div className="settings-card-smooth">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Globe size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Custom Public URL Slug</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Change the URL slug where your published portfolio is viewed.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSlug} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s ease' }}>
              <span style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', borderRight: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.08)', whiteSpace: 'nowrap' }}>
                {window.location.origin}/portfolio/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                className="form-control"
                style={{ border: 'none', background: 'transparent', borderRadius: 0, padding: '0.75rem 1rem' }}
                placeholder="your-slug"
                required
              />
            </div>
            <span className="form-hint" style={{ marginTop: '0.5rem', display: 'block', fontSize: '0.8rem' }}>
              Only lowercase letters, numbers, hyphens, and underscores.
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '44px', borderRadius: '12px', padding: '0 1.25rem' }}>
            <Save size={16} /> Save Slug
          </button>
        </form>
      </div>

      {/* 2. Privacy Settings */}
      <div className="settings-card-smooth">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Eye size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Privacy &amp; Visibility Controls</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Choose which sensitive contact items are exposed on your public portfolio page.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div
            className="settings-toggle-row"
            onClick={() => handleToggleSetting('email_visible')}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Public Email Visibility</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Show mailto button and email address on public portfolio
              </div>
            </div>
            <div
              className={`modern-toggle-switch ${settings.email_visible === 1 ? 'active' : ''}`}
              role="switch"
              aria-checked={settings.email_visible === 1}
            >
              <div className="toggle-thumb" />
            </div>
          </div>

          <div
            className="settings-toggle-row"
            onClick={() => handleToggleSetting('phone_visible')}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Phone Number Visibility</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Show phone number on public portfolio (default off for privacy)
              </div>
            </div>
            <div
              className={`modern-toggle-switch ${settings.phone_visible === 1 ? 'active' : ''}`}
              role="switch"
              aria-checked={settings.phone_visible === 1}
            >
              <div className="toggle-thumb" />
            </div>
          </div>

          <div
            className="settings-toggle-row"
            onClick={() => handleToggleSetting('resume_downloadable')}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Resume Download Allowed</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Allow public visitors to download your uploaded resume PDF
              </div>
            </div>
            <div
              className={`modern-toggle-switch ${settings.resume_downloadable === 1 ? 'active' : ''}`}
              role="switch"
              aria-checked={settings.resume_downloadable === 1}
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Change Password */}
      <div className="settings-card-smooth">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Security &amp; Password</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Update your account password with at least 6 characters.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', maxWidth: '480px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Current Password</label>
            <input
              type="password"
              className="form-control"
              style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>New Password (min. 6 characters)</label>
            <input
              type="password"
              className="form-control"
              style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: 'fit-content', marginTop: '0.5rem', borderRadius: '12px', padding: '0.65rem 1.4rem' }}
            disabled={changingPassword}
          >
            {changingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
