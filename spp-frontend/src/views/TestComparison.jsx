import React, { useState } from "react";

export default function TestComparison({ students, setCurrentView }) {
  const [student1, setStudent1] = useState(null);
  const [student2, setStudent2] = useState(null);

  const compareStudents = () => {
    if (!student1 || !student2) {
      alert("Please select two students to compare");
      return;
    }

    if (student1.id === student2.id) {
      alert("Please select two different students");
      return;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📊 Test Comparison</h1>
        <p className="subtitle">Compare performance of two students side-by-side</p>
      </div>

      <div className="section">
        <h2>Select Students</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px' }}>
          <div>
            <label>Student 1:</label>
            <select 
              className="filter-select"
              onChange={(e) => setStudent1(students.find(s => s.id === e.target.value))}
            >
              <option value="">Choose student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.indexNumber}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Student 2:</label>
            <select 
              className="filter-select"
              onChange={(e) => setStudent2(students.find(s => s.id === e.target.value))}
            >
              <option value="">Choose student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.indexNumber}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={compareStudents} style={{ marginTop: '1.5rem' }}>
          Compare
        </button>
      </div>

      {student1 && student2 && student1.id !== student2.id && (
        <div className="section">
          <h2>Comparison Results</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Metric</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{student1.name}</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>{student2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <td style={{ padding: '1rem' }}>Tests Completed</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{student1.mockTests.length}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{student2.mockTests.length}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <td style={{ padding: '1rem' }}>Latest Aggregate</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{student1.mockTests.length > 0 ? student1.mockTests[student1.mockTests.length - 1].aggregate : 'N/A'}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{student2.mockTests.length > 0 ? student2.mockTests[student2.mockTests.length - 1].aggregate : 'N/A'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <td style={{ padding: '1rem' }}>Category</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{student1.mockTests.length > 0 ? student1.mockTests[student1.mockTests.length - 1].category : 'N/A'}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{student2.mockTests.length > 0 ? student2.mockTests[student2.mockTests.length - 1].category : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
