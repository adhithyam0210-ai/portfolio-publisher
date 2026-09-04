import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Award, Check, Upload, FileText, Link, X } from 'lucide-react';
import { portfolioApi, uploadApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CertificationsForm = ({ certifications, onListChange }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    file_name: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      organization: '',
      issue_date: '',
      credential_id: '',
      credential_url: '',
      file_name: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      organization: c.organization,
      issue_date: c.issue_date || '',
      credential_id: c.credential_id || '',
      credential_url: c.credential_url || '',
      file_name: c.credential_url ? (c.credential_url.split('/').pop() || '') : ''
    });
    setIsAdding(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('certificate', file);

    setUploadingCert(true);
    try {
      const res = await uploadApi.uploadCertificate(uploadData);
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          credential_url: res.url,
          file_name: res.filename || file.name
        }));
        toast.success(`Uploaded: ${res.filename || file.name}`);
      }
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingCert(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Certification Name is mandatory.');
      return;
    }
    if (!formData.organization.trim()) {
      toast.error('Issuing Organization is mandatory.');
      return;
    }

    try {
      if (editingId) {
        const res = await portfolioApi.updateCertification(editingId, formData);
        const updatedItem = res.item || res.certification || { id: editingId, ...formData };
        onListChange(certifications.map((c) => (c.id === editingId ? updatedItem : c)));
        toast.success('Certification updated!');
      } else {
        const res = await portfolioApi.addCertification(formData);
        const newItem = res.item || res.certification || res.data || { id: Date.now(), ...formData };
        onListChange([newItem, ...certifications]);
        toast.success('Certification added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save certification: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await portfolioApi.deleteCertification(id);
      onListChange(certifications.filter((c) => c.id !== id));
      toast.success('Certification removed.');
    } catch (err) {
      toast.error('Failed to delete certification.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Certifications & Licenses</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showcase your industry credentials, badges, and verified accomplishments.
          </p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setIsAdding(true); }}>
            <Plus size={16} /> Add Certification
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
            {editingId ? 'Edit Certification' : 'Add New Certification'}
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Certification Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issuing Organization *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Amazon Web Services"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. March 2023"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credential ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AWS-PSA-991204"
                value={formData.credential_id}
                onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
              />
            </div>
          </div>

          {/* Verification Option: URL OR File Explorer Document */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Verification Document or URL</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Upload file or paste link</span>
            </label>

            {formData.credential_url && formData.credential_url.startsWith('/uploads/') ? (
              /* Uploaded Document Badge */
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  <FileText size={20} color="var(--primary)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formData.file_name || formData.credential_url.split('/').pop()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <a
                    href={formData.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, credential_url: '', file_name: '' })}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ) : (
              /* URL Input + Upload from File Explorer Button */
              <div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://aws.amazon.com/verification/... or browse document →"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value, file_name: '' })}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingCert}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', padding: '0 0.85rem' }}
                    title="Upload Certificate Document from File Explorer"
                  >
                    <Upload size={14} />
                    <span>{uploadingCert ? 'Uploading...' : 'Browse File'}</span>
                  </button>
                </div>
                <span className="form-hint">Supports PDF, DOC, DOCX, PNG, JPG up to 10MB</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={16} /> Save Record
            </button>
          </div>
        </form>
      )}

      {certifications.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
          <Award size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No certifications added yet.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setIsAdding(true)}>
            <Plus size={15} /> Add First Credential
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {certifications.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{c.name}</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{c.organization}</div>
                {c.issue_date && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Issued: {c.issue_date} {c.credential_id ? `• ID: ${c.credential_id}` : ''}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-icon-only btn-sm"
                  onClick={() => handleEdit(c)}
                  title="Edit certification"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="btn btn-danger btn-icon-only btn-sm"
                  onClick={() => handleDelete(c.id)}
                  title="Delete certification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
