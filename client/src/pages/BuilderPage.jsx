import React, { useEffect, useState, useRef } from 'react';
import { portfolioApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PortfolioRenderer } from '../components/templates/PortfolioRenderer';
import { ShareModal } from '../components/common/ShareModal';

import { PersonalInfoForm } from '../components/builder/PersonalInfoForm';
import { EducationForm } from '../components/builder/EducationForm';
import { SkillsForm } from '../components/builder/SkillsForm';
import { ProjectsForm } from '../components/builder/ProjectsForm';
import { ExperienceForm } from '../components/builder/ExperienceForm';
import { CertificationsForm } from '../components/builder/CertificationsForm';
import { AchievementsForm } from '../components/builder/AchievementsForm';
import { ResumeForm } from '../components/builder/ResumeForm';
import { SectionVisibilityForm } from '../components/builder/SectionVisibilityForm';
import { CustomizationForm } from '../components/builder/CustomizationForm';

import {
  User,
  GraduationCap,
  Sparkles,
  Code,
  Briefcase,
  Award,
  Trophy,
  FileText,
  Palette,
  Save,
  UploadCloud,
  Eye,
  ExternalLink,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Edit3
} from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'customization', label: 'Template & Design', icon: Palette },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'resume', label: 'Resume / CV', icon: FileText },
  { id: 'visibility', label: 'Section Visibility', icon: Eye }
];

export const BuilderPage = ({ initialTab = 'personal', onNavigate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mobileView, setMobileView] = useState('editor'); // 'editor' or 'preview' on small viewports
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Autosave status: 'saved' | 'saving' | 'unsaved' | 'error'
  const [autosaveStatus, setAutosaveStatus] = useState('saved');
  const autosaveTimerRef = useRef(null);
  const initialLoadedRef = useRef(false);
  const lastSavedPayloadRef = useRef('');
  const isSavingRef = useRef(false);

  // Core state containing portfolio, profile, lists, and settings
  const [data, setData] = useState({
    portfolio: {},
    profile: {},
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    resume: null,
    settings: {}
  });

  // Helper to serialize saveable profile & customization data
  const getSerializedPayload = (currentData) => {
    if (!currentData) return '';
    return JSON.stringify({
      profile: {
        full_name: currentData.profile?.full_name || '',
        professional_title: currentData.profile?.professional_title || '',
        short_intro: currentData.profile?.short_intro || '',
        about: currentData.profile?.about || '',
        location: currentData.profile?.location || '',
        phone: currentData.profile?.phone || '',
        website: currentData.profile?.website || '',
        email: currentData.profile?.email || '',
        linkedin: currentData.profile?.linkedin || '',
        github: currentData.profile?.github || '',
        twitter: currentData.profile?.twitter || '',
        availability_status: currentData.profile?.availability_status || '',
        show_availability_badge: currentData.profile?.show_availability_badge,
        profile_image: currentData.profile?.profile_image || ''
      },
      customization: {
        template: currentData.portfolio?.template || 'modern',
        theme: currentData.portfolio?.theme || 'dark',
        font_family: currentData.portfolio?.font_family || 'Inter',
        accent_color: currentData.portfolio?.accent_color || '#6366f1',
        section_visibility: currentData.portfolio?.section_visibility || {}
      }
    });
  };

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const res = await portfolioApi.getMyPortfolio();
      if (res.success) {
        const loadedData = res.data || res;
        setData(loadedData);
        lastSavedPayloadRef.current = getSerializedPayload(loadedData);
        initialLoadedRef.current = true;
        setAutosaveStatus('saved');
      }
    } catch (err) {
      toast.error('Failed to load portfolio details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  // Core background save routine
  const performSave = async (dataToSave = data) => {
    if (isSavingRef.current) return true;
    isSavingRef.current = true;
    setAutosaveStatus('saving');

    try {
      const promises = [];
      if (dataToSave.profile) {
        promises.push(portfolioApi.updateProfile(dataToSave.profile));
      }
      if (dataToSave.portfolio) {
        promises.push(portfolioApi.updateCustomization({
          template: dataToSave.portfolio.template,
          theme: dataToSave.portfolio.theme,
          font_family: dataToSave.portfolio.font_family,
          accent_color: dataToSave.portfolio.accent_color,
          section_visibility: dataToSave.portfolio.section_visibility
        }));
      }

      await Promise.all(promises);
      lastSavedPayloadRef.current = getSerializedPayload(dataToSave);
      setAutosaveStatus('saved');
      return true;
    } catch (err) {
      console.error('Autosave error:', err);
      setAutosaveStatus('error');
      return false;
    } finally {
      isSavingRef.current = false;
    }
  };

  // Continuous debounced autosave when profile or portfolio changes
  useEffect(() => {
    if (!initialLoadedRef.current) return;

    const currentPayload = getSerializedPayload(data);
    if (currentPayload === lastSavedPayloadRef.current) {
      return;
    }

    setAutosaveStatus('unsaved');

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      performSave(data);
    }, 1200);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [data.profile, data.portfolio]);

  // Save changes (Profile & Customization) & set status to draft
  const handleSaveDraft = async () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    setSaving(true);
    try {
      const ok = await performSave(data);
      if (!ok) throw new Error('Could not save details');

      await portfolioApi.saveDraft();
      setData((prev) => ({
        ...prev,
        portfolio: { ...prev.portfolio, status: 'draft' }
      }));
      setAutosaveStatus('saved');
      toast.success('All changes saved to draft!');
    } catch (err) {
      toast.error('Failed to save draft: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  // Publish Portfolio
  const handlePublish = async () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    setPublishing(true);
    try {
      const ok = await performSave(data);
      if (!ok) throw new Error('Could not save details');

      const slugToPublish = data.portfolio?.slug || user?.username;
      const res = await portfolioApi.publish(slugToPublish);
      setData((prev) => ({
        ...prev,
        portfolio: { ...prev.portfolio, status: 'published', slug: res.slug || slugToPublish }
      }));
      setAutosaveStatus('saved');
      toast.success('Your portfolio is now published and live!');
    } catch (err) {
      toast.error('Failed to publish: ' + (err.message || 'Error'));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading portfolio studio...</p>
      </div>
    );
  }

  const slug = data.portfolio?.slug || user?.username;
  const status = data.portfolio?.status || 'draft';
  const isPublished = status === 'published';

  return (
    <div className="builder-layout-wrapper">
      {/* Top Builder Toolbar (Theme-aware) */}
      <div className="builder-header-bar">
        {/* Left: Back to Dashboard, Title, Status & Autosave Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn btn-secondary btn-icon-only btn-sm"
            title="Back to Dashboard"
            style={{ borderRadius: '8px' }}
          >
            <ArrowLeft size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Portfolio Builder
            </span>
            <span
              className="badge"
              style={{
                background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: isPublished ? '#10b981' : '#f59e0b',
                border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {isPublished && <CheckCircle2 size={11} />}
              {status.toUpperCase()}
            </span>

            {/* Autosave Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: '20px',
                background: autosaveStatus === 'saving'
                  ? 'rgba(99, 102, 241, 0.1)'
                  : autosaveStatus === 'unsaved'
                  ? 'rgba(245, 158, 11, 0.1)'
                  : autosaveStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(16, 185, 129, 0.08)',
                color: autosaveStatus === 'saving'
                  ? 'var(--accent-primary, #6366f1)'
                  : autosaveStatus === 'unsaved'
                  ? '#d97706'
                  : autosaveStatus === 'error'
                  ? '#ef4444'
                  : '#10b981',
                border: `1px solid ${
                  autosaveStatus === 'saving'
                    ? 'rgba(99, 102, 241, 0.25)'
                    : autosaveStatus === 'unsaved'
                    ? 'rgba(245, 158, 11, 0.25)'
                    : autosaveStatus === 'error'
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(16, 185, 129, 0.2)'
                }`,
                transition: 'all 0.2s ease'
              }}
              title="Changes to personal info & design are automatically saved as you edit"
            >
              {autosaveStatus === 'saving' && (
                <>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    border: '1.5px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>Autosaving...</span>
                </>
              )}
              {autosaveStatus === 'unsaved' && (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }} />
                  <span>Unsaved</span>
                </>
              )}
              {autosaveStatus === 'saved' && (
                <>
                  <CheckCircle2 size={11} color="#10b981" />
                  <span>Autosaved</span>
                </>
              )}
              {autosaveStatus === 'error' && (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                  <span>Save Error</span>
                </>
              )}
            </div>
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'none' }} className="d-md-inline">
            /portfolio/{slug}
          </span>
        </div>

        {/* Center: Mobile/Tablet View Switcher (Only visible on small viewports) */}
        <div className="builder-mobile-switch">
          <button
            onClick={() => setMobileView('editor')}
            className={`btn btn-sm ${mobileView === 'editor' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          >
            <Edit3 size={13} />
            <span>Edit Form</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`btn btn-sm ${mobileView === 'preview' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsShareOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Share Portfolio"
            style={{ borderRadius: '8px' }}
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          {isPublished && (
            <a
              href={`/portfolio/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open public live URL"
              style={{ borderRadius: '8px' }}
            >
              <ExternalLink size={14} />
              <span>View Live</span>
            </a>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '8px' }}
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '8px' }}
          >
            <UploadCloud size={14} />
            <span>{publishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main Harmonized Split Workspace */}
      <div className="builder-split-workspace">
        {/* Left Side: Navigation Tabs + Input Forms (Theme-aware) */}
        <div className={`builder-form-pane ${mobileView === 'preview' ? 'hidden-on-mobile' : ''}`}>
          {/* Scrollable Horizontal Tabs Bar */}
          <div className="builder-tabs-track">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`builder-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Form Content */}
          <div className="builder-form-body">
            {activeTab === 'personal' && (
              <PersonalInfoForm
                profile={data.profile || {}}
                onChange={(updatedProfile) => setData((prev) => ({ ...prev, profile: updatedProfile }))}
                onProfilePhotoUpdated={(url) =>
                  setData((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, profile_image: url }
                  }))
                }
              />
            )}

            {activeTab === 'customization' && (
              <CustomizationForm
                portfolio={data.portfolio || {}}
                onChange={(updatedPortfolio) => setData((prev) => ({ ...prev, portfolio: updatedPortfolio }))}
              />
            )}

            {activeTab === 'education' && (
              <EducationForm
                education={data.education || []}
                onListChange={(list) => setData((prev) => ({ ...prev, education: list }))}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsForm
                skills={data.skills || []}
                onListChange={(list) => setData((prev) => ({ ...prev, skills: list }))}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsForm
                projects={data.projects || []}
                onListChange={(list) => setData((prev) => ({ ...prev, projects: list }))}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceForm
                experience={data.experience || []}
                onListChange={(list) => setData((prev) => ({ ...prev, experience: list }))}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsForm
                certifications={data.certifications || []}
                onListChange={(list) => setData((prev) => ({ ...prev, certifications: list }))}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsForm
                achievements={data.achievements || []}
                onListChange={(list) => setData((prev) => ({ ...prev, achievements: list }))}
              />
            )}

            {activeTab === 'resume' && (
              <ResumeForm
                resume={data.resume}
                onResumeUpdated={(updatedResume) => setData((prev) => ({ ...prev, resume: updatedResume }))}
              />
            )}

            {activeTab === 'visibility' && (
              <SectionVisibilityForm
                portfolio={data.portfolio || {}}
                onVisibilityChange={(newVis) =>
                  setData((prev) => ({
                    ...prev,
                    portfolio: { ...prev.portfolio, section_visibility: newVis }
                  }))
                }
              />
            )}
          </div>
        </div>

        {/* Right Side: Live Interactive Synchronized Preview (Natural full width) */}
        <div className={`builder-preview-pane ${mobileView === 'editor' ? 'hidden-on-mobile' : ''}`}>
          <div className="builder-preview-card-wrap">
            <PortfolioRenderer data={data} />
          </div>
        </div>
      </div>

      {/* Share Modal Window */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        slug={slug}
      />
    </div>
  );
};
