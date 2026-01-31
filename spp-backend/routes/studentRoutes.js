const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/students', studentController.getAllStudents);
router.post('/students', studentController.addOrUpdateStudent);
router.delete('/students/:id', studentController.deleteStudent);

module.exports = router;
