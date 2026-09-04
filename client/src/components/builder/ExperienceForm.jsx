import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Briefcase, Check } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ExperienceForm = ({ experience, onListChange }) => {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    responsibilities: ''
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      responsibilities: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      company: item.company,
      position: item.position,
      start_date: item.start_date,
      end_date: item.end_date || '',
      is_current: Boolean(item.is_current),
      description: item.description || '',
      responsibilities: item.responsibilities || ''
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim() || !formData.start_date.trim()) {
      toast.error('Company, Position, and Start Date are required.');
      return;
    }

    const payload = {
      ...formData,
      is_current: formData.is_current ? 1 : 0,
      end_date: formData.is_current ? '' : formData.end_date
    };

    try {
      if (editingId) {
        await portfolioApi.updateExperience(editingId, payload);
        onListChange(experience.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        toast.success('Experience record updated!');
      } else {
        const res = await portfolioApi.addExperience(payload);
        if (res.experience) {
          onListChange([res.experience, ...experience]);
        }
        toast.success('Experience record added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save experience.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await portfolioApi.deleteExperience(id);
      onListChange(experience.filter((item) => item.id !== id));
      toast.success('Experience record deleted.');
    } catch (err) {
      toast.error('Failed to delete experience.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Work Experience & Career History</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            List your relevant roles, achievements, and responsibilities.
          </p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setIsAdding(true); }}>
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
            {editingId ? 'Edit Work Experience' : 'Add New Work Experience'}
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Position / Job Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lead Full-Stack Architect"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company / Organization *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acme Corp or Self-Employed"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Jan 2022"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dec 2023"
                disabled={formData.is_current}
                value={formData.is_current ? 'Present' : formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
              />
              <span>I currently work in this role</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Role Overview / Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Summary of your team, scope of work, and key technologies..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Responsibilities & Measurable Impact</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Architected streaming pipelines reducing latency by 42%. Mentored junior engineers."
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
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

      {/* Experience List */}
      {experience.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
          <Briefcase size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No career experiences added yet.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setIsAdding(true)}>
            <Plus size={15} /> Add First Experience
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {experience.map((exp) => (
            <div
              key={exp.id}
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
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{exp.position}</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{exp.company}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-icon-only btn-sm"
                  onClick={() => handleEdit(exp)}
                  title="Edit entry"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="btn btn-danger btn-icon-only btn-sm"
                  onClick={() => handleDelete(exp.id)}
                  title="Delete entry"
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
