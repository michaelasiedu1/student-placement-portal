import React, { useState, useEffect } from "react";
import { MOCK_SUBJECTS, MOCK_TYPES } from "../utils/constants.js";

export default function AddTest({
  students,
  selectedStudent,
  setSelectedStudent,
  getStudentById,
  newMockTest,
  setNewMockTest,
  handleNewTestScoreChange,
  addMockTestToStudent
}) {
  const [mockTypes, setMockTypes] = useState(MOCK_TYPES || []);
  const [newMockTypeName, setNewMockTypeName] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mockTypes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setMockTypes(Array.from(new Set([...MOCK_TYPES, ...parsed])));
      }
    } catch (e) {}
  }, []);

  function createMockType() {
    const name = (newMockTypeName || "").trim();
    if (!name) return;
    if (!mockTypes.includes(name)) {
      const updated = [...mockTypes, name];
      setMockTypes(updated);
      try { localStorage.setItem("mockTypes", JSON.stringify(updated)); } catch (e) {}
    }
    setNewMockTest(prev => ({ ...prev, mockType: name }));
    setNewMockTypeName("");
  }

  function deleteMockType() {
    const typeToDelete = newMockTest.mockType;
    if (!typeToDelete) return;
    const updated = mockTypes.filter(t => t !== typeToDelete);
    setMockTypes(updated);
    try { 
      const customOnly = updated.filter(t => !MOCK_TYPES.includes(t));
      localStorage.setItem("mockTypes", JSON.stringify(customOnly)); 
    } catch (e) {}
    setNewMockTest(prev => ({ ...prev, mockType: '' }));
  }
  return (
    <div className="container">
      <div className="header">
        <h1>➕ Add Mock Test</h1>
        <p className="subtitle">Record a new mock test for a student</p>
      </div>
      {/* Navigation is handled in App */}
      <div className="section">
        <h2>Select Student</h2>
        <div className="student-selector">
          <select
            value={selectedStudent?.id || ''}
            onChange={(e) => setSelectedStudent(getStudentById(e.target.value))}
            className="form-select"
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.class} ({student.indexNumber})
              </option>
            ))}
          </select>
        </div>
      </div>
      <>
        <div className="section">
          <h2>Student Information</h2>
          <div className="student-info">
            {selectedStudent ? (
              <>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Index Number:</strong> {selectedStudent.indexNumber}</p>
                <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                <p><strong>Class:</strong> {selectedStudent.class}</p>
                <p><strong>Date of Birth:</strong> {selectedStudent.dateOfBirth}</p>
                <p><strong>Strengths:</strong> {(selectedStudent.strengths || []).join(', ')}</p>
                <p><strong>Weaknesses:</strong> {(selectedStudent.weaknesses || []).join(', ')}</p>
              </>
            ) : (
              <p>Please select a student from the dropdown above to add a mock test.</p>
            )}
          </div>
        </div>
        <div className="section">
          <h2>Mock Test Details</h2>
          <div className="form-row">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
              <input
                type="text"
                placeholder="Create mock type"
                value={newMockTypeName}
                onChange={(e) => setNewMockTypeName(e.target.value)}
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="button" className="btn-primary" onClick={createMockType}>Create</button>
            </div>
            <select
              value={newMockTest.mockType || ''}
              onChange={(e) => setNewMockTest(prev => ({ ...prev, mockType: e.target.value }))}
              className="form-input"
            >
              <option value="">Select Mock Type...</option>
              {mockTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={deleteMockType}
              disabled={!newMockTest.mockType}
              title="Delete mock type"
            >
              🗑️ Delete
            </button>
            <input
              type="text"
              placeholder="Test Name (optional)"
              value={newMockTest.testName}
              onChange={(e) => setNewMockTest(prev => ({ ...prev, testName: e.target.value }))}
              className="form-input"
            />
            <input
              type="date"
              value={newMockTest.date}
              onChange={(e) => setNewMockTest(prev => ({ ...prev, date: e.target.value }))}
              className="form-input"
            />
          </div>
        </div>
        <div className="section">
          <h2>Test Scores</h2>
          <div className="scores-grid">
            {MOCK_SUBJECTS.map((subject) => (
              <div key={subject.code} className="score-item">
                <label><strong>{subject.name}</strong></label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={(newMockTest.scores && newMockTest.scores[subject.code]) || ''}
                  onChange={(e) => handleNewTestScoreChange(subject.code, e.target.value)}
                  className="score-input"
                  placeholder="0-100"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="calculate-section">
          <button
            className="btn-primary calculate-btn"
            onClick={addMockTestToStudent}
            disabled={!selectedStudent || !newMockTest.mockType || !Object.values(newMockTest.scores || {}).some(v => v !== '' && v !== null && v !== undefined)}
          >
            ➕ Add Mock Test
          </button>
          <p className="calculate-note">
            Enter scores for the subjects shown (all 10 are available). Mock type is required.
          </p>
        </div>
      </>
    </div>
  );
}
