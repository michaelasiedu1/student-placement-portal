import React, { useState } from "react";

export default function TeacherNotes({ students }) {
  const [notes, setNotes] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="container">
      <div className="header">
        <h1>📝 Teacher Notes</h1>
        <p className="subtitle">Add feedback and comments on student performance</p>
      </div>

      <div className="section">
        <h2>Select Student</h2>
        <select 
          className="filter-select"
          onChange={(e) => setSelectedStudent(students.find(s => s.id === e.target.value))}
          style={{ maxWidth: '400px', marginBottom: '2rem' }}
        >
          <option value="">Choose a student...</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} - {s.indexNumber}</option>
          ))}
        </select>

        {selectedStudent && (
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px' }}>
            <h3>{selectedStudent.name}</h3>
            <textarea
              value={notes[selectedStudent.id] || ""}
              onChange={(e) => setNotes({ ...notes, [selectedStudent.id]: e.target.value })}
              placeholder="Enter feedback and comments..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                marginBottom: '1rem',
                marginTop: '1rem'
              }}
            />
            <button className="btn-primary">💾 Save Notes</button>
          </div>
        )}
      </div>
    </div>
  );
}
