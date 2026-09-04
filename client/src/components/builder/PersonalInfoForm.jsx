import React, { useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter } from 'lucide-react';
import { uploadApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const PersonalInfoForm = ({ profile, onChange, onProfilePhotoUpdated }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const handleFieldChange = (field, value) => {
    onChange({ ...profile, [field]: value });
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar image must be smaller than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await uploadApi.uploadAvatar(formData);
      if (res.success && res.url) {
        toast.success('Avatar uploaded successfully!');
        onChange({ ...profile, profile_image: res.url });
        if (onProfilePhotoUpdated) onProfilePhotoUpdated(res.url);
      }
    } catch (err) {
      toast.error('Failed to upload avatar: ' + (err.message || 'Error'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Avatar Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'relative' }}>
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt="Avatar"
              style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
          ) : (
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {(profile.full_name || 'U').charAt(0)}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--primary)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}
            title="Upload new photo"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarSelect}
          />
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Profile Photo</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Recommended 400x400px (PNG, JPG, WebP under 5MB).
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Photo
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. John Doe"
            value={profile.full_name || ''}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Professional Title *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Lead Full-Stack Architect"
            value={profile.professional_title || ''}
            onChange={(e) => handleFieldChange('professional_title', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Short Tagline / Bio</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Building scalable cloud systems and intuitive user experiences"
          value={profile.short_intro || ''}
          onChange={(e) => handleFieldChange('short_intro', e.target.value)}
        />
        <span className="form-hint">Brief one-liner that displays in your hero section.</span>
      </div>

      <div className="form-group">
        <label className="form-label">Detailed About Me</label>
        <textarea
          className="form-control"
          rows={5}
          placeholder="Share your story, career philosophy, and background in detail..."
          value={profile.about || ''}
          onChange={(e) => handleFieldChange('about', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. San Francisco, CA"
              value={profile.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Public Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="e.g. john@example.com"
            value={profile.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. +1 (555) 019-2834"
            value={profile.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
          />
          <span className="form-hint">Can be hidden via Settings &gt; Privacy.</span>
        </div>

        <div className="form-group">
          <label className="form-label">Personal Website</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://yourwebsite.com"
            value={profile.website || ''}
            onChange={(e) => handleFieldChange('website', e.target.value)}
          />
        </div>
      </div>

      {/* Social Profiles */}
      <h4 style={{ fontSize: '1rem', fontWeight: 600, borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
        Social Links & Profiles
      </h4>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">LinkedIn Profile URL</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://linkedin.com/in/username"
            value={profile.linkedin || ''}
            onChange={(e) => handleFieldChange('linkedin', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">GitHub Profile URL</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://github.com/username"
            value={profile.github || ''}
            onChange={(e) => handleFieldChange('github', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">X / Twitter Profile URL</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://twitter.com/username"
            value={profile.twitter || ''}
            onChange={(e) => handleFieldChange('twitter', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
