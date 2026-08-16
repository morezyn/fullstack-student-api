const { getDb } = require('../../../database/db');

const STUDENTS = 'students';
const COUNTERS = 'counters';

function toStudent(doc) {
  if (!doc) return undefined;
  return {
    id: doc._id,
    firstName: doc.first_name,
    lastName: doc.last_name,
    email: doc.email,
    dateOfBirth: doc.date_of_birth,
    major: doc.major,
    enrollmentYear: doc.enrollment_year,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
}

function toStudentRow(data) {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    date_of_birth: data.dateOfBirth,
    major: data.major,
    enrollment_year: data.enrollmentYear,
  };
}

async function nextStudentId() {
  const result = await getDb().collection(COUNTERS).findOneAndUpdate(
    { _id: 'student_id' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true },
  );
  return result.seq;
}

exports.findAll = async () => {
  const docs = await getDb().collection(STUDENTS).find().sort({ _id: 1 }).toArray();
  return docs.map(toStudent);
};

exports.findById = async (id) => {
  const doc = await getDb().collection(STUDENTS).findOne({ _id: id });
  return toStudent(doc);
};

exports.findByEmail = async (email, excludeId) => {
  const filter = excludeId === undefined ? { email } : { email, _id: { $ne: excludeId } };
  const doc = await getDb().collection(STUDENTS).findOne(filter);
  return toStudent(doc);
};

exports.create = async (data) => {
  const row = toStudentRow(data);
  const now = new Date().toISOString();
  const doc = { _id: await nextStudentId(), ...row, created_at: now, updated_at: now };
  await getDb().collection(STUDENTS).insertOne(doc);
  return toStudent(doc);
};

exports.update = async (id, data) => {
  const row = toStudentRow(data);
  const now = new Date().toISOString();
  await getDb().collection(STUDENTS).updateOne(
    { _id: id },
    { $set: { ...row, updated_at: now } },
  );
  const doc = await getDb().collection(STUDENTS).findOne({ _id: id });
  return toStudent(doc);
};

exports.remove = async (id) => {
  const result = await getDb().collection(STUDENTS).deleteOne({ _id: id });
  return result.deletedCount;
};
