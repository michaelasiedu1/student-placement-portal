const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or update a student
exports.addOrUpdateStudent = async (req, res) => {
  try {
    const { id } = req.body;
    console.log('Received student data, has picture:', !!req.body.picture);
    if (req.body.picture) {
      console.log('Picture data length:', req.body.picture.length);
    }
    
    let student = await Student.findOne({ id });
    if (student) {
      await Student.updateOne({ id }, req.body);
      student = await Student.findOne({ id });
      console.log('Updated student, has picture:', !!student.picture);
      res.json(student);
    } else {
      student = new Student(req.body);
      await student.save();
      console.log('Created student, has picture:', !!student.picture);
      res.json(student);
    }
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(500).json({ error: err.message });
  }
};
// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Student.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: err.message });
  }
};
