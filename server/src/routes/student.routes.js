const express = require('express');
const studentController = require('../controllers/student.controller');
const validateStudent = require('../middleware/validateStudent.middleware');

const router = express.Router();

router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', validateStudent, studentController.create);
router.put('/:id', validateStudent, studentController.update);
router.delete('/:id', studentController.remove);

module.exports = router;
