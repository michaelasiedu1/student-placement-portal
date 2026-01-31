import React, { useState } from 'react';

export default function ParentPortal({ students }) {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [parentName, setParentName] = useState('John Doe');

  const searchResults = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.indexNumber.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const formatDateWAEC = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  const getPerformanceMessage = (aggregate) => {
    if (aggregate < 12) return 'Excellent - Your child is performing outstandingly!';
    if (aggregate < 18) return 'Very Good - Great performance!';
    if (aggregate < 24) return 'Good - Your child is doing well';
    if (aggregate < 30) return 'Fair - Some improvement needed';
    return 'Needs Support - Please consider additional tutoring';
  };

  const getProgressTrend = (student) => {
    if (student.mockTests.length < 2) return 'N/A';
    const tests = student.mockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
    const improvement = tests[0].aggregate - tests[tests.length - 1].aggregate;
    if (improvement > 5) return '📈 Improving';
    if (improvement < -5) return '📉 Declining';
    return '➡️ Stable';
  };

  if (!selectedStudent) {
    return (
      <div className="page-container">
        <div className="section-header">
          <h2>Parent Portal</h2>
          <p>Welcome {parentName}! View your child's academic progress</p>
        </div>

        <div className="parent-search-section">
          <h3>Find Your Child</h3>
          <input
            type="text"
            placeholder="Search by name or index number..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="parent-search-input"
          />

          {searchResults.length > 0 ? (
            <div className="parent-search-results">
              {searchResults.map(student => (
                <div key={student.id} className="parent-student-card">
                  <div className="card-header">
                    <h4>{student.name}</h4>
                    <p>Index: {student.indexNumber}</p>
                  </div>
                  <button onClick={() => setSelectedStudent(student)} className="view-details-btn">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : studentSearch && (
            <p style={{ color: '#bbb', marginTop: '1rem' }}>No students found</p>
          )}
        </div>
      </div>
    );
  }

  const latestTest = selectedStudent.mockTests.length > 0 
    ? selectedStudent.mockTests[selectedStudent.mockTests.length - 1] 
    : null;

  return (
    <div className="page-container">
      <button onClick={() => setSelectedStudent(null)} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#1a4d5c', color: '#00d4ff', border: '1px solid #00d4ff', borderRadius: '4px', cursor: 'pointer' }}>
        ← Back to Search
      </button>

      <div className="parent-portal-header">
        <h2>{selectedStudent.name}'s Academic Progress</h2>
        <p>Parent View - Last Updated: {latestTest ? formatDateWAEC(latestTest.date) : 'No tests yet'}</p>
      </div>

      <div className="parent-info-grid">
        <div className="parent-info-card">
          <h3>📚 Student Information</h3>
          <table>
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>{selectedStudent.name}</td>
              </tr>
              <tr>
                <td>Index Number</td>
                <td>{selectedStudent.indexNumber}</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>{selectedStudent.gender}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>{selectedStudent.dateOfBirth ? formatDateWAEC(selectedStudent.dateOfBirth) : 'N/A'}</td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>{selectedStudent.phone || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="parent-info-card">
          <h3>📊 Latest Test Results</h3>
          {latestTest ? (
            <table>
              <tbody>
                <tr>
                  <td>Test Name</td>
                  <td>{latestTest.testName}</td>
                </tr>
                <tr>
                  <td>Test Date</td>
                  <td>{formatDateWAEC(latestTest.date)}</td>
                </tr>
                <tr>
                  <td>Aggregate</td>
                  <td style={{ color: '#00d4ff', fontWeight: 'bold' }}>{latestTest.aggregate}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{latestTest.category}</td>
                </tr>
                <tr>
                  <td>Progress Trend</td>
                  <td>{getProgressTrend(selectedStudent)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#bbb' }}>No test results yet</p>
          )}
        </div>
      </div>

      {latestTest && (
        <>
          <div className="parent-performance-message">
            <h3>📈 Performance Assessment</h3>
            <div className="message-box">
              <p>{getPerformanceMessage(latestTest.aggregate)}</p>
            </div>
          </div>

          <div className="parent-subject-scores">
            <h3>Subject-wise Performance</h3>
            <div className="subject-score-grid">
              {Object.entries(latestTest.scores).map(([subject, score]) => (
                <div key={subject} className="subject-score-card">
                  <div className="subject-name">{subject}</div>
                  <div className="subject-score">{score}</div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${(score / 100) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="parent-placement-info">
            <h3>🎯 School Placement Prediction</h3>
            <div className="placement-box">
              <div className="placement-item">
                <span className="placement-label">Predicted School:</span>
                <span className="placement-value">{latestTest.predictedSchool}</span>
              </div>
              <div className="placement-item">
                <span className="placement-label">Predicted Program:</span>
                <span className="placement-value">{latestTest.predictedProgram}</span>
              </div>
            </div>
            <p style={{ color: '#bbb', fontSize: '0.9rem', marginTop: '1rem' }}>
              This prediction is based on your child's current academic performance and may be subject to change as they complete more tests.
            </p>
          </div>

          {selectedStudent.mockTests.length > 1 && (
            <div className="parent-test-history">
              <h3>📋 Previous Test Results</h3>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Date</th>
                    <th>Aggregate</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.mockTests.slice(0, -1).reverse().map((test, idx) => (
                    <tr key={idx}>
                      <td>{test.testName}</td>
                      <td>{formatDateWAEC(test.date)}</td>
                      <td>{test.aggregate}</td>
                      <td>{test.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <style>{`
        .parent-search-input {
          width: 100%;
          max-width: 400px;
          background: #051219;
          border: 1px solid #1a4d5c;
          color: #fff;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .parent-search-results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .parent-student-card {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .parent-student-card .card-header h4 {
          color: #00d4ff;
          margin: 0 0 0.5rem 0;
        }

        .parent-student-card .card-header p {
          color: #bbb;
          margin: 0;
          font-size: 0.9rem;
        }

        .view-details-btn {
          background: linear-gradient(135deg, #00d4ff, #00f5d4);
          color: #051219;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 1rem;
        }

        .parent-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .parent-info-card {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .parent-info-card h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .parent-info-card table {
          width: 100%;
          border-collapse: collapse;
        }

        .parent-info-card table tr {
          border-bottom: 1px solid #1a4d5c;
        }

        .parent-info-card table td {
          padding: 0.75rem 0;
          color: #bbb;
        }

        .parent-info-card table td:first-child {
          font-weight: bold;
          width: 40%;
        }

        .parent-performance-message {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .message-box {
          background: #051219;
          border-left: 4px solid #00d4ff;
          padding: 1rem;
          border-radius: 4px;
        }

        .message-box p {
          color: #bbb;
          margin: 0;
          font-size: 1rem;
        }

        .parent-subject-scores {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .parent-subject-scores h3 {
          color: #00d4ff;
          margin-bottom: 1.5rem;
        }

        .subject-score-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .subject-score-card {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
          text-align: center;
        }

        .subject-name {
          color: #bbb;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .subject-score {
          font-size: 1.8rem;
          color: #00d4ff;
          font-weight: bold;
          margin-bottom: 0.75rem;
        }

        .score-bar {
          height: 8px;
          background: #0d1f2d;
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #00f5d4);
        }

        .parent-placement-info {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .parent-placement-info h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .placement-box {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
        }

        .placement-item {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #1a4d5c;
        }

        .placement-item:last-child {
          border-bottom: none;
        }

        .placement-label {
          color: #bbb;
          font-weight: bold;
        }

        .placement-value {
          color: #00d4ff;
        }

        .parent-test-history {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .parent-test-history h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
        }

        .history-table th {
          background: #051219;
          color: #00d4ff;
          padding: 0.75rem;
          text-align: left;
          border-bottom: 2px solid #00d4ff;
        }

        .history-table td {
          color: #bbb;
          padding: 0.75rem;
          border-bottom: 1px solid #1a4d5c;
        }
      `}</style>
    </div>
  );
}
