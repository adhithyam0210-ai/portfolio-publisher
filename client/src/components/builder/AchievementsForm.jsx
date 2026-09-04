import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Trophy, Check } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AchievementsForm = ({ achievements, onListChange }) => {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', date: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setFormData({
      title: a.title,
      description: a.description || '',
      date: a.date || ''
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Achievement Title is mandatory.');
      return;
    }

    try {
      if (editingId) {
        const res = await portfolioApi.updateAchievement(editingId, formData);
        const updatedItem = res.item || res.achievement || { id: editingId, ...formData };
        onListChange(achievements.map((a) => (a.id === editingId ? updatedItem : a)));
        toast.success('Achievement updated!');
      } else {
        const res = await portfolioApi.addAchievement(formData);
        const newItem = res.item || res.achievement || res.data || { id: Date.now(), ...formData };
        onListChange([newItem, ...achievements]);
        toast.success('Achievement added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save achievement: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await portfolioApi.deleteAchievement(id);
      onListChange(achievements.filter((a) => a.id !== id));
      toast.success('Achievement removed.');
    } catch (err) {
      toast.error('Failed to delete achievement.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Achievements & Honors</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Awards, hackathon wins, published papers, or industry recognitions.
          </p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setIsAdding(true); }}>
            <Plus size={16} /> Add Achievement
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
            {editingId ? 'Edit Achievement' : 'Add New Achievement'}
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Honor / Award Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1st Place Winner – Global Hackathon"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date / Year</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 2024 or October 2023"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Context</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="What was the recognition for? How many contestants?"
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

      {achievements.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
          <Trophy size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No achievements added yet.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setIsAdding(true)}>
            <Plus size={15} /> Add First Honor
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {achievements.map((a) => (
            <div
              key={a.id}
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
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{a.title}</div>
                {a.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{a.description}</p>}
                {a.date && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.date}</span>}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-icon-only btn-sm"
                  onClick={() => handleEdit(a)}
                  title="Edit achievement"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  className="btn btn-danger btn-icon-only btn-sm"
                  onClick={() => handleDelete(a.id)}
                  title="Delete achievement"
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
