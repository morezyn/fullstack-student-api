const studentService = require('../services/student.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const students = await studentService.getAll();
  res.json(students);
});

exports.getById = asyncHandler(async (req, res) => {
  const student = await studentService.getById(req.params.id);
  res.json(student);
});

exports.create = asyncHandler(async (req, res) => {
  const student = await studentService.create(req.body);
  res.status(201).json(student);
});

exports.update = asyncHandler(async (req, res) => {
  const student = await studentService.update(req.params.id, req.body);
  res.json(student);
});

exports.remove = asyncHandler(async (req, res) => {
  const message = await studentService.remove(req.params.id);
  res.json({ message });
});
