/**
 * URL and asset helper utilities
 */

// Generate Gmail Web Compose URL (redirects to Gmail web instead of Outlook)
export const getGmailComposeUrl = (email, subject = '', body = '') => {
  if (!email) return '#';
  const cleanEmail = email.trim();
  const subParam = subject ? `&su=${encodeURIComponent(subject)}` : '';
  const bodyParam = body ? `&body=${encodeURIComponent(body)}` : '';
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}${subParam}${bodyParam}`;
};

// Resolve asset URLs (uploads, avatars, project images)
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || '';
  const cleanBase = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanBase ? `${cleanBase}${cleanPath}` : cleanPath;
};

// Password standard validation helper:
// Min 8 chars, 1 uppercase, 1 number, 1 special character
export const validatePasswordStrength = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required.',
      rules: { length: false, uppercase: false, number: false, special: false }
    };
  }

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)
  };

  const isValid = rules.length && rules.uppercase && rules.number && rules.special;

  let message = '';
  if (!rules.length) {
    message = 'Password must be at least 8 characters long.';
  } else if (!rules.uppercase) {
    message = 'Password must include at least 1 uppercase letter.';
  } else if (!rules.number) {
    message = 'Password must include at least 1 number.';
  } else if (!rules.special) {
    message = 'Password must include at least 1 special character (!@#$%^&*...).';
  }

  return { isValid, message, rules };
};
