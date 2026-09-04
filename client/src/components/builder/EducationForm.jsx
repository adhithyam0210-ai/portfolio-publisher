import React, { useState } from 'react';
import { Plus, Trash2, Edit2, GraduationCap, Check } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const EducationForm = ({ education, onListChange }) => {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    start_year: '',
    end_year: '',
    grade: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      start_year: '',
      end_year: '',
      grade: '',
      description: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      start_year: item.start_year,
      end_year: item.end_year || '',
      grade: item.grade || '',
      description: item.description || ''
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim() || !formData.start_year.trim()) {
      toast.error('Degree, Institution, and Start Year are required.');
      return;
    }

    try {
      if (editingId) {
        await portfolioApi.updateEducation(editingId, formData);
        onListChange(education.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
        toast.success('Education record updated!');
      } else {
        const res = await portfolioApi.addEducation(formData);
        if (res.education) {
          onListChange([res.education, ...education]);
        }
        toast.success('Education record added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save education: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await portfolioApi.deleteEducation(id);
      onListChange(education.filter((item) => item.id !== id));
      toast.success('Education record removed.');
    } catch (err) {
      toast.error('Failed to delete education.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Education & Academic Background</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            List your degrees, certifications, and educational institutions.
          </p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setIsAdding(true); }}>
            <Plus size={16} /> Add Education
          </button>
        )}
      </div>

      {/* Adding / Editing Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
            {editingId ? 'Edit Education' : 'Add New Education'}
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Degree / Certificate *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. B.S. in Computer Science"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution / University *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Stanford University"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Year *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 2019"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Year (or Expected)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 2023 or Present"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Grade / GPA</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 3.9 GPA / Magna Cum Laude"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Coursework / Honors / Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Key accomplishments, research focus, student clubs..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

      {/* List of Education Records */}
      {education.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
          <GraduationCap size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No education records added yet.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setIsAdding(true)}>
            <Plus size={15} /> Add First Degree
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {education.map((item) => (
            <div
              key={item.id}
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
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.degree}</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{item.institution}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.start_year} – {item.end_year || 'Present'} {item.grade ? `• ${item.grade}` : ''}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-icon-only btn-sm"
                  onClick={() => handleEdit(item)}
                  title="Edit entry"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="btn btn-danger btn-icon-only btn-sm"
                  onClick={() => handleDelete(item.id)}
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
