const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
  testId: String,
  mockType: String,
  testName: String,
  date: String,
  scores: Object,
  aggregate: Number,
  category: String,
  predictedSchool: String,
  predictedProgram: String
});

const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  indexNumber: String,
  class: String,
  gender: String,
  dateOfBirth: String,
  parentContact: String,
  picture: String, // Base64 encoded image
  mockTests: [mockTestSchema]
});

module.exports = mongoose.model('Student', studentSchema);
