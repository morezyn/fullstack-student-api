const studentRepository = require('../repositories/student.repository');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw httpError(400, `Invalid student id: "${rawId}"`);
  }
  return id;
}

function validateAndNormalize(payload) {
  if (!payload || typeof payload !== 'object') {
    throw httpError(400, 'Request body must be a JSON object');
  }

  const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim() : '';
  if (!firstName) throw httpError(400, 'firstName is required');
  if (firstName.length > 50) throw httpError(400, 'firstName must be 50 characters or fewer');

  const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim() : '';
  if (!lastName) throw httpError(400, 'lastName is required');
  if (lastName.length > 50) throw httpError(400, 'lastName must be 50 characters or fewer');

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  if (!email) throw httpError(400, 'email is required');
  if (!EMAIL_REGEX.test(email)) throw httpError(400, 'email must be a valid email address');

  let dateOfBirth = payload.dateOfBirth;
  if (dateOfBirth !== undefined && dateOfBirth !== null && dateOfBirth !== '') {
    dateOfBirth = String(dateOfBirth);
    if (!ISO_DATE_REGEX.test(dateOfBirth)) {
      throw httpError(400, 'dateOfBirth must use the YYYY-MM-DD format');
    }
  } else {
    dateOfBirth = null;
  }

  let major = payload.major;
  if (major !== undefined && major !== null && major !== '') {
    major = String(major).trim();
    if (major.length > 100) throw httpError(400, 'major must be 100 characters or fewer');
  } else {
    major = null;
  }

  let enrollmentYear = payload.enrollmentYear;
  if (enrollmentYear !== undefined && enrollmentYear !== null && enrollmentYear !== '') {
    enrollmentYear = Number(enrollmentYear);
    if (!Number.isInteger(enrollmentYear) || enrollmentYear < 1900 || enrollmentYear > 2100) {
      throw httpError(400, 'enrollmentYear must be a year between 1900 and 2100');
    }
  } else {
    enrollmentYear = null;
  }

  return { firstName, lastName, email, dateOfBirth, major, enrollmentYear };
}

exports.getAll = async () => studentRepository.findAll();

exports.getById = async (rawId) => {
  const id = parseId(rawId);
  const student = await studentRepository.findById(id);
  if (!student) throw httpError(404, `Student ${id} not found`);
  return student;
};

exports.create = async (payload) => {
  const data = validateAndNormalize(payload);
  if (await studentRepository.findByEmail(data.email)) {
    throw httpError(409, `A student with email "${data.email}" already exists`);
  }
  return studentRepository.create(data);
};

exports.update = async (rawId, payload) => {
  const id = parseId(rawId);
  if (!(await studentRepository.findById(id))) {
    throw httpError(404, `Student ${id} not found`);
  }
  const data = validateAndNormalize(payload);
  const existing = await studentRepository.findByEmail(data.email);
  if (existing && existing.id !== id) {
    throw httpError(409, `A student with email "${data.email}" already exists`);
  }
  return studentRepository.update(id, data);
};

exports.remove = async (rawId) => {
  const id = parseId(rawId);
  const removed = await studentRepository.remove(id);
  if (removed === 0) throw httpError(404, `Student ${id} not found`);
  return `Student ${id} deleted`;
};
