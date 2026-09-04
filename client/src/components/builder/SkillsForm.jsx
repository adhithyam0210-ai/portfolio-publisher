import React, { useState } from 'react';
import { Plus, X, Layers, Sparkles } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const QUICK_SUGGESTIONS = [
  'React.js', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
  'Python', 'FastAPI', 'PostgreSQL', 'SQLite', 'MongoDB', 'Docker',
  'AWS', 'Kubernetes', 'GraphQL', 'TailwindCSS', 'Figma', 'CI/CD'
];

export const SkillsForm = ({ skills, onListChange }) => {
  const toast = useToast();
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [category, setCategory] = useState('Frontend');

  const handleAdd = async (nameToAdd, profToAdd = proficiency) => {
    const finalName = (nameToAdd || skillName).trim();
    if (!finalName) {
      toast.error('Skill name cannot be empty.');
      return;
    }

    // Check if already added
    if (skills.some((s) => s.skill_name.toLowerCase() === finalName.toLowerCase())) {
      toast.info(`"${finalName}" is already in your skills list.`);
      return;
    }

    try {
      const res = await portfolioApi.addSkill({
        skill_name: finalName,
        proficiency: profToAdd,
        category
      });

      const newSkill = res.item || res.skill || res.data || { id: Date.now(), skill_name: finalName, proficiency: profToAdd, category };
      onListChange([...skills, newSkill]);
      setSkillName('');
      toast.success(`Added "${finalName}"`);
    } catch (err) {
      toast.error('Failed to add skill: ' + (err.message || 'Error'));
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await portfolioApi.deleteSkill(id);
      onListChange(skills.filter((s) => s.id !== id));
      toast.info(`Removed "${name}"`);
    } catch (err) {
      toast.error('Failed to delete skill.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Skills & Technical Proficiencies</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Highlight your languages, frameworks, developer tools, and certifications.
        </p>
      </div>

      {/* Quick Add Suggestion Chips */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> Quick Suggestions (Click to Add)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {QUICK_SUGGESTIONS.map((sug) => {
            const isAdded = skills.some((s) => s.skill_name.toLowerCase() === sug.toLowerCase());
            return (
              <button
                key={sug}
                type="button"
                disabled={isAdded}
                onClick={() => handleAdd(sug, 'Advanced')}
                className={`btn btn-sm ${isAdded ? 'btn-secondary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                {isAdded ? '✓' : '+'} {sug}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Skill Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
        style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Skill Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. GraphQL or Rust"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Proficiency</label>
          <select
            className="form-control"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Cloud">Cloud/DevOps</option>
            <option value="Languages">Languages</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Current Skill Badges */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Your Skills ({skills.length})
        </h4>
        {skills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)' }}>
            No skills added yet. Use the suggestions above or type your own.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {skills.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.skill_name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                  ({s.proficiency})
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id, s.skill_name)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                  title="Remove skill"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
