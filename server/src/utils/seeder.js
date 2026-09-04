const bcrypt = require('bcryptjs');
const { dbRun, dbGet } = require('../config/database');

const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminExists = await dbGet('SELECT id FROM users WHERE email = ?', ['admin@platform.com']);
    if (!adminExists) {
      const adminHash = await bcrypt.hash('AdminPassword@123', 10);
      const res = await dbRun(`
        INSERT INTO users (username, email, password_hash, role, status)
        VALUES (?, ?, ?, 'ADMIN', 'ACTIVE')
      `, ['admin', 'admin@platform.com', adminHash]);

      const adminId = res.lastID;
      await dbRun(`
        INSERT INTO profiles (user_id, full_name, professional_title, short_intro, about)
        VALUES (?, 'Platform Administrator', 'System Administrator', 'Platform Governance & Operations', 'System administrator account.')
      `, [adminId]);

      await dbRun(`
        INSERT INTO portfolios (user_id, slug, template, theme, status)
        VALUES (?, 'admin', 'professional', 'dark', 'draft')
      `, [adminId]);

      await dbRun(`
        INSERT INTO user_settings (user_id, contact_visible, resume_downloadable, email_visible, phone_visible)
        VALUES (?, 0, 0, 0, 0)
      `, [adminId]);

      console.log('✅ Admin account seeded: admin@platform.com / AdminPassword@123');
    }

    // 2. Seed Demo Published User (John Doe)
    const johnExists = await dbGet('SELECT id FROM users WHERE email = ?', ['john@example.com']);
    if (!johnExists) {
      const johnHash = await bcrypt.hash('UserPassword@123', 10);
      const res = await dbRun(`
        INSERT INTO users (username, email, password_hash, role, status)
        VALUES (?, ?, ?, 'USER', 'ACTIVE')
      `, ['john-doe', 'john@example.com', johnHash]);

      const johnId = res.lastID;

      // Profile
      await dbRun(`
        INSERT INTO profiles (
          user_id, full_name, professional_title, short_intro, about,
          location, phone, website, linkedin, github, twitter, other_socials, profile_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        johnId,
        'John Doe',
        'Senior Full-Stack Cloud Architect',
        'Passionate software engineer building resilient, scalable web applications and intuitive interfaces.',
        'I am a full-stack engineer with over 6 years of hands-on experience designing distributed architectures, high-traffic web applications, and developer platforms. I specialize in TypeScript, React, Node.js, and cloud native architectures. Outside of coding, I mentor aspiring developers and contribute to open-source developer tooling.',
        'San Francisco, CA',
        '+1 (555) 349-2910',
        'https://johndoe.dev',
        'https://linkedin.com/in/johndoe',
        'https://github.com/johndoe',
        'https://twitter.com/johndoe',
        JSON.stringify([{ platform: 'YouTube', url: 'https://youtube.com/@johndoe-tech' }]),
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      ]);

      // Portfolio
      await dbRun(`
        INSERT INTO portfolios (
          user_id, slug, template, theme, font_family, accent_color,
          layout_style, section_visibility, status, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', CURRENT_TIMESTAMP)
      `, [
        johnId,
        'john-doe',
        'modern',
        'dark',
        'Inter',
        '#6366f1',
        'standard',
        JSON.stringify({
          about: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          certifications: true,
          achievements: true,
          resume: true
        })
      ]);

      // User Settings
      await dbRun(`
        INSERT INTO user_settings (user_id, contact_visible, resume_downloadable, email_visible, phone_visible)
        VALUES (?, 1, 1, 1, 1)
      `, [johnId]);

      // Education
      await dbRun(`
        INSERT INTO education (user_id, degree, institution, start_year, end_year, grade, description, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [johnId, 'M.S. in Computer Science', 'Stanford University', '2019', '2021', '3.92 GPA', 'Specialized in Distributed Systems and Cloud Computing. Authored research paper on event-driven streaming pipelines.', 1]);

      await dbRun(`
        INSERT INTO education (user_id, degree, institution, start_year, end_year, grade, description, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [johnId, 'B.S. in Software Engineering', 'UC Berkeley', '2015', '2019', '3.85 GPA', "Dean's Honor List. Led the Open Source Developers Club and organized annual hackathons.", 2]);

      // Skills
      const sampleSkills = [
        ['React.js & Next.js', 'Expert', 'Frontend', 1],
        ['TypeScript / JavaScript', 'Expert', 'Languages', 2],
        ['Node.js & Express', 'Expert', 'Backend', 3],
        ['Python & FastAPI', 'Advanced', 'Backend', 4],
        ['PostgreSQL & SQLite', 'Advanced', 'Database', 5],
        ['Docker & Kubernetes', 'Advanced', 'DevOps', 6],
        ['AWS Cloud Infrastructure', 'Advanced', 'Cloud', 7],
        ['GraphQL & REST APIs', 'Expert', 'Backend', 8],
        ['TailwindCSS & CSS3', 'Expert', 'Frontend', 9],
        ['CI/CD & Git Automation', 'Advanced', 'DevOps', 10]
      ];

      for (const sk of sampleSkills) {
        await dbRun(`
          INSERT INTO skills (user_id, skill_name, proficiency, category, order_index)
          VALUES (?, ?, ?, ?, ?)
        `, [johnId, sk[0], sk[1], sk[2], sk[3]]);
      }

      // Projects
      const sampleProjects = [
        ['CloudScale Analytics Engine', 'Real-time telemetry and streaming ingestion platform capable of parsing 500k events/sec with automated alerting and anomaly detection.', 'React, TypeScript, Go, Kafka, ClickHouse', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 'https://github.com/johndoe/cloudscale', 'https://cloudscale-demo.dev', '6 Months', 1],
        ['DevPulse Collaborative IDE', 'Browser-based real-time collaborative code workspace featuring low-latency operational transformation, syntax highlighting, and WebRTC audio.', 'Next.js, Node.js, WebSockets, Redis, Monaco', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', 'https://github.com/johndoe/devpulse', 'https://devpulse.dev', '4 Months', 2],
        ['Nexus E-Commerce Hub', 'High-performance headless e-commerce store with sub-second page loads, automated tax calculations, and Stripe multi-currency checkout.', 'React, TailwindCSS, Express, PostgreSQL, Stripe', 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=600&q=80', 'https://github.com/johndoe/nexus-shop', 'https://nexus-demo.store', '3 Months', 3]
      ];

      for (const p of sampleProjects) {
        await dbRun(`
          INSERT INTO projects (user_id, title, description, technologies, image_url, github_url, live_url, duration, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [johnId, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]]);
      }

      // Experience
      const sampleExp = [
        ['TechNova Solutions', 'Lead Full-Stack Architect', 'Jan 2022', 'Present', 1, 'Leading a cross-functional engineering squad of 12 engineers building modern micro-frontend applications and resilient serverless cloud APIs.', 'Architected multi-tenant SaaS infrastructure reducing latency by 42%. Mentored senior engineers and instituted CI/CD test automation standard.', 1],
        ['Apex Cloud Systems', 'Senior Software Engineer', 'Aug 2019', 'Dec 2021', 0, 'Spearheaded the redesign of core customer portal using React and TypeScript, handling over 2M monthly active sessions.', 'Optimized frontend rendering bottlenecks resulting in 99.4 Lighthouse performance score. Integrated OAuth2 and role-based access controls.', 2]
      ];

      for (const e of sampleExp) {
        await dbRun(`
          INSERT INTO experience (user_id, company, position, start_date, end_date, is_current, description, responsibilities, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [johnId, e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]]);
      }

      // Certifications
      const sampleCerts = [
        ['AWS Certified Solutions Architect – Professional', 'Amazon Web Services', 'March 2023', 'AWS-PSA-991204', 'https://aws.amazon.com/verification', 1],
        ['Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation (CNCF)', 'November 2022', 'CKA-2022-8819', 'https://cncf.io/certification', 2]
      ];

      for (const c of sampleCerts) {
        await dbRun(`
          INSERT INTO certifications (user_id, name, organization, issue_date, credential_id, credential_url, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [johnId, c[0], c[1], c[2], c[3], c[4], c[5]]);
      }

      // Achievements
      const sampleAch = [
        ['1st Place Winner – Silicon Valley Hackathon 2024', 'Built an autonomous AI agent for incident triage selected 1st out of 120 global competitor teams.', '2024', 1],
        ['Featured Open Source Contributor of the Year', 'Recognized for substantial core contributions to popular React ecosystem tooling with over 40k GitHub stars.', '2023', 2]
      ];

      for (const a of sampleAch) {
        await dbRun(`
          INSERT INTO achievements (user_id, title, description, date, order_index)
          VALUES (?, ?, ?, ?, ?)
        `, [johnId, a[0], a[1], a[2], a[3]]);
      }

      console.log('✅ Published demo user seeded: john@example.com / UserPassword@123 (Slug: john-doe)');
    }

    // 3. Seed Demo Draft User (Sarah)
    const sarahExists = await dbGet('SELECT id FROM users WHERE email = ?', ['sarah@example.com']);
    if (!sarahExists) {
      const sarahHash = await bcrypt.hash('UserPassword@123', 10);
      const res = await dbRun(`
        INSERT INTO users (username, email, password_hash, role, status)
        VALUES (?, ?, ?, 'USER', 'ACTIVE')
      `, ['sarah-tech', 'sarah@example.com', sarahHash]);

      const sarahId = res.lastID;
      await dbRun(`
        INSERT INTO profiles (user_id, full_name, professional_title, short_intro, about, location)
        VALUES (?, 'Sarah Jenkins', 'Data Scientist & ML Engineer', 'Specializing in computer vision and deep learning pipelines.', 'Passionate about deploying efficient ML models at the edge.', 'Austin, TX')
      `, [sarahId]);

      await dbRun(`
        INSERT INTO portfolios (user_id, slug, template, theme, status)
        VALUES (?, 'sarah-tech', 'professional', 'light', 'draft')
      `, [sarahId]);

      await dbRun(`
        INSERT INTO user_settings (user_id, contact_visible, resume_downloadable, email_visible, phone_visible)
        VALUES (?, 1, 1, 1, 0)
      `, [sarahId]);

      console.log('✅ Draft demo user seeded: sarah@example.com / UserPassword@123 (Slug: sarah-tech)');
    }

  } catch (err) {
    console.error('Seeder error:', err);
  }
};

module.exports = {
  seedDatabase
};
