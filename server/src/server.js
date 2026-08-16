const app = require('./app');
const { connectToDb } = require('../../database/db');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectToDb();
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Student Management API running at http://localhost:${PORT}`);
    console.log(`Student Web Interface available at http://localhost:${PORT}`);
  });
}

start();
