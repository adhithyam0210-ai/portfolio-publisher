const app = require('./app');
const { initSchema } = require('./config/database');
const { seedDatabase } = require('./utils/seeder');

const PORT = process.env.PORT || 5050;

// Initialize database schema, seed default records, and start server
const startServer = async () => {
  try {
    await initSchema();
    await seedDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Portfolio Platform API Server running on port ${PORT}`);
      console.log(`🌐 Application UI available at http://localhost:${PORT}`);
      console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
