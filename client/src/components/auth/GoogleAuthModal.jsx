import React, { useState } from 'react';
import { X, User, ArrowRight } from 'lucide-react';

export const GoogleAuthModal = ({ isOpen, onClose, onSelectAccount, loading = false }) => {
  const [view, setView] = useState('choose'); // 'choose' | 'input'
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [activeAccountIndex, setActiveAccountIndex] = useState(null);

  if (!isOpen) return null;

  // Realistic suggested accounts typical of browser-cached Google profiles
  const suggestedAccounts = [
    {
      name: 'Adhithya M',
      email: 'adhithyam0210@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initial: 'A',
      color: '#4285F4'
    },
    {
      name: 'Alex Rivera',
      email: 'alex.rivera.dev@gmail.com',
      avatar: '',
      initial: 'A',
      color: '#0F9D58'
    }
  ];

  const handleChoose = (acc, idx) => {
    setActiveAccountIndex(idx);
    onSelectAccount({
      email: acc.email,
      name: acc.name,
      picture: acc.avatar || ''
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const clean = customEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError('');
    const extractedName = customName.trim() || clean.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    onSelectAccount({
      email: clean,
      name: extractedName,
      picture: ''
    });
  };

  const resetAndClose = () => {
    setView('choose');
    setCustomEmail('');
    setCustomName('');
    setEmailError('');
    setActiveAccountIndex(null);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.18s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) resetAndClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          fontFamily: "'Roboto', 'Plus Jakarta Sans', system-ui, sans-serif",
          color: '#1f1f1f',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Google Loading Bar */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: '#e0e0e0',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '40%',
                height: '100%',
                background: '#1a73e8',
                borderRadius: '2px',
                animation: 'googleIndeterminate 1.2s infinite linear'
              }}
            />
          </div>
        )}

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={resetAndClose}
          disabled={loading}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#5f6368',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f3f4'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <X size={18} />
        </button>

        <div style={{ padding: '2.25rem 2rem 1.75rem' }}>
          {/* Authentic Google Multi-color Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#202124', margin: '0 0 0.4rem 0', letterSpacing: '-0.01em' }}>
              Sign in with Google
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#5f6368', margin: 0 }}>
              to continue to <strong style={{ color: '#202124', fontWeight: 600 }}>PortfolioCraft</strong>
            </p>
          </div>

          {view === 'choose' ? (
            <>
              {/* Account Chooser List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {suggestedAccounts.map((acc, idx) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={loading}
                    onClick={() => handleChoose(acc, idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '12px',
                      background: activeAccountIndex === idx ? '#e8f0fe' : '#ffffff',
                      border: '1px solid #e0e0e0',
                      cursor: loading ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease, border-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && activeAccountIndex !== idx) {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dadce0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && activeAccountIndex !== idx) {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                      }
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: acc.color,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {acc.avatar ? (
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        acc.initial
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#202124', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#5f6368', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {acc.email}
                      </div>
                    </div>
                  </button>
                ))}

                {/* "Use another account" button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setView('input')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px dashed #dadce0',
                    cursor: loading ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#f8f9fa'; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#ffffff'; }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#f1f3f4',
                      color: '#5f6368',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <User size={18} />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1a73e8' }}>
                    Use another account
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* Custom Email Input View */
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: '#3c4043', marginBottom: '0.4rem' }}>
                  Google Email Address
                </label>
                <input
                  type="email"
                  autoFocus
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => { setCustomEmail(e.target.value); if (emailError) setEmailError(''); }}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 0.85rem',
                    borderRadius: '8px',
                    border: emailError ? '2px solid #d93025' : '1px solid #dadce0',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: '#202124',
                    boxSizing: 'border-box'
                  }}
                />
                {emailError && (
                  <span style={{ fontSize: '0.78rem', color: '#d93025', marginTop: '0.35rem', display: 'block' }}>
                    {emailError}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: '#3c4043', marginBottom: '0.4rem' }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #dadce0',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: '#202124',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setView('choose'); setEmailError(''); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#1a73e8',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '0.5rem 0'
                  }}
                >
                  Back to accounts
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '9999px',
                    background: '#1a73e8',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: loading ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 1px 2px rgba(60,64,67,0.3)'
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Privacy Disclaimer */}
          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid #f1f3f4',
              fontSize: '0.74rem',
              lineHeight: 1.45,
              color: '#5f6368',
              textAlign: 'center'
            }}
          >
            To continue, Google will share your name, email address, language preference, and profile picture with PortfolioCraft.
          </div>
        </div>

        {/* Authentic Google Footer */}
        <div
          style={{
            background: '#f8f9fa',
            borderTop: '1px solid #e8eaed',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: '#5f6368'
          }}
        >
          <span>English (United States)</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ cursor: 'pointer' }}>Help</span>
            <span style={{ cursor: 'pointer' }}>Privacy</span>
            <span style={{ cursor: 'pointer' }}>Terms</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes googleIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};
