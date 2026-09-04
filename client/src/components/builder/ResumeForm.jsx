import React, { useRef, useState } from 'react';
import { FileText, Upload, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { uploadApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ResumeForm = ({ resume, onResumeUpdated }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension / type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Invalid document format. Please upload a PDF, DOC, or DOCX.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const res = await uploadApi.uploadResume(formData);
      if (res.success && res.resume) {
        toast.success('Resume uploaded successfully!');
        onResumeUpdated(res.resume);
      }
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your uploaded resume?')) return;
    try {
      await uploadApi.deleteResume();
      toast.success('Resume deleted.');
      onResumeUpdated(null);
    } catch (err) {
      toast.error('Failed to delete resume.');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Resume & CV Document</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Upload your resume document so recruiters and visitors can download it from your public portfolio.
        </p>
      </div>

      {resume ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {resume.original_name}
                <CheckCircle2 size={16} color="#10b981" />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {formatBytes(resume.file_size)} • Uploaded {new Date(resume.uploaded_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a
              href={resume.download_url || resume.file_path || resume.file_url}
              download={resume.original_name || 'Resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title={`Download ${resume.original_name || 'Resume'}`}
            >
              <Download size={15} /> Download
            </a>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Replace
            </button>
            <button
              type="button"
              className="btn btn-danger btn-icon-only btn-sm"
              onClick={handleDelete}
              title="Delete resume"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-subtle)',
            borderRadius: '16px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.01)',
            transition: 'border-color 0.2s ease, background 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
        >
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 1rem' }}>
            <Upload size={24} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            {uploading ? 'Uploading Document...' : 'Click to Upload Resume Document'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Supports PDF, DOC, DOCX up to 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};
