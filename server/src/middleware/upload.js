const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsRoot = path.resolve(__dirname, '../../uploads');
const avatarDir = path.join(uploadsRoot, 'avatars');
const resumeDir = path.join(uploadsRoot, 'resumes');
const projectsDir = path.join(uploadsRoot, 'projects');
const certificatesDir = path.join(uploadsRoot, 'certificates');

[avatarDir, resumeDir, projectsDir, certificatesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${req.user ? req.user.id : 'user'}-${uniqueSuffix}${ext}`);
  }
});

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `project-${req.user ? req.user.id : 'user'}-${uniqueSuffix}${ext}`);
  }
});

const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certificatesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `cert-${req.user ? req.user.id : 'user'}-${uniqueSuffix}${ext}`);
  }
});

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${req.user ? req.user.id : 'user'}-${uniqueSuffix}${ext}`);
  }
});

const avatarFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mime = file.mimetype.toLowerCase();

  if (allowed.test(ext) || allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP, GIF, SVG) are allowed for profile photo!'));
  }
};

const projectFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mime = file.mimetype.toLowerCase();

  if (allowed.test(ext) || allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP, GIF, SVG) are allowed for project cover!'));
  }
};

const certificateFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mime = file.mimetype.toLowerCase();

  if (allowed.test(ext) || mime.includes('pdf') || mime.includes('msword') || mime.includes('officedocument') || mime.includes('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Word documents, or image files (PDF, DOC, DOCX, JPG, PNG, WebP) are allowed for certificates!'));
  }
};

const resumeFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (allowed.test(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('msword') || file.mimetype.includes('officedocument')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents (PDF, DOC, DOCX) are allowed for resume upload!'));
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: avatarFilter
});

const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: projectFilter
});

const uploadCertificate = multer({
  storage: certificateStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: certificateFilter
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: resumeFilter
});

module.exports = {
  uploadAvatar,
  uploadProjectImage,
  uploadCertificate,
  uploadResume,
  uploadsRoot,
  avatarDir,
  resumeDir,
  projectsDir,
  certificatesDir
};
