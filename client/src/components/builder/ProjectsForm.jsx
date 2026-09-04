import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Code, ExternalLink, Github, Check, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { portfolioApi, uploadApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ProjectsForm = ({ projects, onListChange }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif|svg\+xml)$/i) && !file.name.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i)) {
      toast.error('Only image files (JPG, PNG, WebP, GIF, SVG) are allowed for project cover.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be under 10MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await uploadApi.uploadProjectImage(uploadData);
      if (res.success && res.image_url) {
        setFormData((prev) => ({ ...prev, image_url: res.image_url }));
        toast.success('Project cover image uploaded!');
      } else {
        toast.error(res.message || 'Failed to upload cover image.');
      }
    } catch (err) {
      toast.error('Failed to upload image: ' + (err.message || 'Server error'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Project Title is mandatory.');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Project Description is mandatory.');
      return;
    }

    try {
      if (editingId) {
        const res = await portfolioApi.updateProject(editingId, formData);
        const updatedItem = res.item || res.project || { id: editingId, ...formData };
        onListChange(projects.map((p) => (p.id === editingId ? updatedItem : p)));
        toast.success('Project updated!');
      } else {
        const res = await portfolioApi.addProject(formData);
        const newItem = res.item || res.project || res.data;
        if (newItem) {
          onListChange([newItem, ...projects]);
        } else {
          onListChange([{ id: Date.now(), ...formData }, ...projects]);
        }
        toast.success('Project added!');
      }
      resetForm();
    } catch (err) {
      toast.error('Failed to save project: ' + (err.message || 'Error'));
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

          {/* Cover Image Upload from File Explorer */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Project Cover Image</span>
              {uploadingImage && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>Uploading...</span>}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              style={{ display: 'none' }}
            />

            {formData.image_url ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '0.75rem 1rem'
              }}>
                <img
                  src={formData.image_url}
                  alt="Project Cover"
                  style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    Cover image uploaded
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Saved to portfolio showcase
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-icon-only btn-sm"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    title="Remove cover image"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-light)',
                  borderRadius: '12px',
                  padding: '1.75rem 1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--bg-subtle)',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem' }}>
                  <UploadCloud size={20} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  Upload Project Cover from File Explorer
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Click to browse JPG, PNG, WebP, or SVG (Up to 10MB)
                </div>
              </div>
            )}
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
