const app = require('../server/src/app');
const { initSchema } = require('../server/src/config/database');
const { seedDatabase } = require('../server/src/utils/seeder');

let dbInitPromise = null;

const ensureDb = async () => {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        await initSchema();
        await seedDatabase();
      } catch (err) {
        console.error('Serverless database init failed:', err);
      }
    })();
  }
  return dbInitPromise;
};

module.exports = async (req, res) => {
  await ensureDb();
  return app(req, res);
};
