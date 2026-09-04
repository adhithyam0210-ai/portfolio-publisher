import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Award, Check } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CertificationsForm = ({ certifications, onListChange }) => {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    issue_date: '',
    credential_id: '',
    credential_url: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      organization: '',
      issue_date: '',
      credential_id: '',
      credential_url: ''
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
      credential_url: c.credential_url || ''
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.organization.trim()) {
      toast.error('Certification Name and Organization are required.');
      return;
    }

    try {
      if (editingId) {
        await portfolioApi.updateCertification(editingId, formData);
        onListChange(certifications.map((c) => (c.id === editingId ? { ...c, ...formData } : c)));
        toast.success('Certification updated!');
      } else {
        const res = await portfolioApi.addCertification(formData);
        if (res.certification) {
          onListChange([res.certification, ...certifications]);
        }
        toast.success('Certification added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save certification.');
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

          <div className="form-group">
            <label className="form-label">Verification URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://aws.amazon.com/verification/..."
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
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
