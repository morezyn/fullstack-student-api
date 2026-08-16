const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

const { studentsValidator } = require('./schema');
const { students: seedStudents, nextStudentId: seedNextId } = require('./seed');

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env'), quiet: true });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'student_management';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Create server/.env with your Atlas connection string.');
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToDb() {
  await client.connect();
  await client.db('admin').command({ ping: 1 });
  db = client.db(DB_NAME);
  await ensureSchema();
  await seedIfEmpty();
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected yet. Call connectToDb() first.');
  }
  return db;
}

async function ensureSchema() {
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const hasStudents = collections.some((c) => c.name === 'students');

  if (!hasStudents) {
    await db.createCollection('students', {
      validator: studentsValidator,
      validationLevel: 'strict',
      validationAction: 'error',
    });
  }

  await db.collection('students').createIndex({ email: 1 }, { unique: true });
  await db.collection('counters').createIndex({ _id: 1 });
}

async function seedIfEmpty() {
  const count = await db.collection('students').countDocuments({}, { limit: 1 });
  if (count === 0) {
    await db.collection('students').insertMany(seedStudents);
    await db
      .collection('counters')
      .updateOne(
        { _id: 'student_id' },
        { $setOnInsert: { seq: seedNextId } },
        { upsert: true },
      );
  }
}

module.exports = { connectToDb, getDb };
