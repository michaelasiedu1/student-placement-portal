import React, { useState } from 'react';

export default function PrintFriendlyProfiles({ students }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [printFormat, setPrintFormat] = useState('detailed'); // 'detailed' or 'compact'

  const handlePrint = () => {
    window.print();
  };

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

  if (!selectedStudent) {
    return (
      <div className="page-container">
        <div className="section-header">
          <h2>Print-Friendly Student Profiles</h2>
          <p>Select a student to generate a formatted printable profile</p>
        </div>

        <div className="student-select-section">
          <label>Select Student</label>
          <select onChange={(e) => {
            const student = students.find(s => s.id === e.target.value);
            setSelectedStudent(student);
          }}>
            <option value="">-- Choose a student --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.indexNumber})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="print-profile-wrapper">
      <div className="print-controls no-print" style={{ display: 'none' }}>
        <select value={printFormat} onChange={(e) => setPrintFormat(e.target.value)}>
          <option value="detailed">Detailed Format</option>
          <option value="compact">Compact Format</option>
        </select>
        <button onClick={handlePrint} style={{ background: '#00d4ff', color: '#051219' }}>
          🖨️ Print Profile
        </button>
      </div>

      <div className="print-content" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '3px solid #333' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: '#333' }}>STUDENT PROFILE</h1>
          <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>Academic Performance Record</p>
        </div>

        {/* Student Information */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedStudent.pictureUrl ? '150px 1fr' : '1fr', gap: '2rem', marginBottom: '2rem' }}>
          {selectedStudent.pictureUrl && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={selectedStudent.pictureUrl} 
                alt={selectedStudent.name}
                style={{ width: '150px', height: '150px', objectFit: 'cover', border: '1px solid #333' }}
              />
            </div>
          )}
          
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold', width: '30%' }}>Full Name:</td>
                  <td style={{ padding: '0.5rem 0', paddingLeft: '1rem' }}>{selectedStudent.name}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>Index Number:</td>
                  <td style={{ padding: '0.5rem 0', paddingLeft: '1rem' }}>{selectedStudent.indexNumber}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>Date of Birth:</td>
                  <td style={{ padding: '0.5rem 0', paddingLeft: '1rem' }}>{selectedStudent.dateOfBirth ? formatDateWAEC(selectedStudent.dateOfBirth) : 'N/A'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>Gender:</td>
                  <td style={{ padding: '0.5rem 0', paddingLeft: '1rem' }}>{selectedStudent.gender}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>Contact:</td>
                  <td style={{ padding: '0.5rem 0', paddingLeft: '1rem' }}>{selectedStudent.phone || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Performance */}
        {selectedStudent.mockTests.length > 0 && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#333', borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Academic Performance Summary
              </h2>
              
              {printFormat === 'detailed' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #333' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Test Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Aggregate</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.mockTests.map((test, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #ddd' }}>{test.testName}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', borderRight: '1px solid #ddd' }}>{formatDateWAEC(test.date)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>{test.aggregate}</td>
                        <td style={{ padding: '0.75rem' }}>{test.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  <p><strong>Total Tests Taken:</strong> {selectedStudent.mockTests.length}</p>
                  <p><strong>Latest Aggregate:</strong> {selectedStudent.mockTests[selectedStudent.mockTests.length - 1]?.aggregate}</p>
                  <p><strong>Latest Category:</strong> {selectedStudent.mockTests[selectedStudent.mockTests.length - 1]?.category}</p>
                </div>
              )}
            </div>

            {/* Subject Performance */}
            {printFormat === 'detailed' && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#333', borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  Latest Test Subject Scores
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #333' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Subject</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedStudent.mockTests[selectedStudent.mockTests.length - 1]?.scores || {}).map(([subject, score]) => (
                      <tr key={subject} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '0.75rem', borderRight: '1px solid #ddd' }}>{subject}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Placement Information */}
        {selectedStudent.mockTests.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#333', borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              School Placement Prediction
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', width: '30%' }}>Predicted School:</td>
                  <td style={{ padding: '0.75rem', paddingLeft: '1rem' }}>{selectedStudent.mockTests[selectedStudent.mockTests.length - 1]?.predictedSchool}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>Predicted Program:</td>
                  <td style={{ padding: '0.75rem', paddingLeft: '1rem' }}>{selectedStudent.mockTests[selectedStudent.mockTests.length - 1]?.predictedProgram}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #ddd', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
          <p style={{ margin: '0.5rem 0' }}>This is an official record of student academic performance</p>
          <p style={{ margin: '0.5rem 0' }}>Generated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-content {
            color: #000;
            background: #fff;
          }
          table {
            page-break-inside: avoid;
          }
          h2, h3 {
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
}
