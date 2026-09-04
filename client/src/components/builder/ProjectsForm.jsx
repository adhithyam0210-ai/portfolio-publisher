import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Code, ExternalLink, Github, Check } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ProjectsForm = ({ projects, onListChange }) => {
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    image_url: '',
    github_url: '',
    live_url: '',
    duration: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image_url: '',
      github_url: '',
      live_url: '',
      duration: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      technologies: p.technologies || '',
      image_url: p.image_url || '',
      github_url: p.github_url || '',
      live_url: p.live_url || '',
      duration: p.duration || ''
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Project Title and Description are required.');
      return;
    }

    try {
      if (editingId) {
        await portfolioApi.updateProject(editingId, formData);
        onListChange(projects.map((p) => (p.id === editingId ? { ...p, ...formData } : p)));
        toast.success('Project updated!');
      } else {
        const res = await portfolioApi.addProject(formData);
        if (res.project) {
          onListChange([res.project, ...projects]);
        }
        toast.success('Project added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save project.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await portfolioApi.deleteProject(id);
      onListChange(projects.filter((p) => p.id !== id));
      toast.success('Project deleted.');
    } catch (err) {
      toast.error('Failed to delete project.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Projects & Showcases</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Present your best software engineering, design, or open source works.
          </p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setIsAdding(true); }}>
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h4>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CloudScale Analytics Engine"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration / Timeline</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 4 Months or 2024"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="What does this project do? What challenges did you solve?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tech Stack (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Cover Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://github.com/user/repo"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Live Demo / Deployed URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://myproject.dev"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={16} /> Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {projects.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
          <Code size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No projects added yet.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setIsAdding(true)}>
            <Plus size={15} /> Add First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{p.title}</h4>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button className="btn btn-secondary btn-icon-only btn-sm" onClick={() => handleEdit(p)}>
                    <Edit2 size={13} />
                  </button>
                  <button className="btn btn-danger btn-icon-only btn-sm" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>{p.description}</p>
              {p.technologies && (
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                  {p.technologies}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
