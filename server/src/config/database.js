const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'portfolio.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Promisified helper methods
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const initSchema = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT CHECK (role IN ('USER', 'ADMIN')) DEFAULT 'USER',
      status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
      reset_token TEXT,
      reset_token_expiry DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      full_name TEXT DEFAULT '',
      professional_title TEXT DEFAULT '',
      short_intro TEXT DEFAULT '',
      about TEXT DEFAULT '',
      location TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      website TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      github TEXT DEFAULT '',
      twitter TEXT DEFAULT '',
      other_socials TEXT DEFAULT '[]',
      profile_image TEXT DEFAULT '',
      availability_status TEXT DEFAULT 'Available for Opportunities',
      show_availability_badge INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  try {
    await dbRun(`ALTER TABLE profiles ADD COLUMN availability_status TEXT DEFAULT 'Available for Opportunities'`);
  } catch (e) {}
  try {
    await dbRun(`ALTER TABLE profiles ADD COLUMN show_availability_badge INTEGER DEFAULT 1`);
  } catch (e) {}
  try {
    await dbRun(`ALTER TABLE profiles ADD COLUMN email TEXT DEFAULT ''`);
  } catch (e) {}

  await dbRun(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL COLLATE NOCASE,
      template TEXT DEFAULT 'modern',
      theme TEXT DEFAULT 'dark',
      font_family TEXT DEFAULT 'Inter',
      accent_color TEXT DEFAULT '#6366f1',
      layout_style TEXT DEFAULT 'standard',
      section_visibility TEXT DEFAULT '{"about":true,"skills":true,"projects":true,"experience":true,"education":true,"certifications":true,"achievements":true,"resume":true}',
      status TEXT CHECK (status IN ('draft', 'published', 'unpublished')) DEFAULT 'draft',
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      start_year TEXT NOT NULL,
      end_year TEXT,
      grade TEXT,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      skill_name TEXT NOT NULL,
      proficiency TEXT DEFAULT 'Intermediate',
      category TEXT DEFAULT 'Technical',
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT,
      image_url TEXT,
      github_url TEXT,
      live_url TEXT,
      duration TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_current INTEGER DEFAULT 0,
      description TEXT,
      responsibilities TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      organization TEXT NOT NULL,
      issue_date TEXT,
      credential_id TEXT,
      credential_url TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      file_path TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      contact_visible INTEGER DEFAULT 1,
      resume_downloadable INTEGER DEFAULT 1,
      email_visible INTEGER DEFAULT 1,
      phone_visible INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Indexes for high performance lookup
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status)`);
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initSchema
};
