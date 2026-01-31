import React, { useState } from "react";

export default function PlacementTracking({ students }) {
  const [actualPlacements, setActualPlacements] = useState({});

  return (
    <div className="container">
      <div className="header">
        <h1>📍 Placement Tracking</h1>
        <p className="subtitle">Track actual placement vs predicted placement</p>
      </div>

      <div className="section">
        <h2>Placement Status</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Student Name</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Predicted School</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actual Placement</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.filter(s => s.mockTests.length > 0).map(student => {
              const latestTest = student.mockTests[student.mockTests.length - 1];
              const actualSchool = actualPlacements[student.id] || "Pending";
              const status = actualSchool !== "Pending" && actualSchool === latestTest.predictedSchool ? "✅ Match" : "❌ Mismatch";

              return (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '1rem' }}>{student.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{latestTest.predictedSchool}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input
                      type="text"
                      value={actualSchool}
                      onChange={(e) => setActualPlacements({ ...actualPlacements, [student.id]: e.target.value })}
                      placeholder="Enter school name"
                      style={{ maxWidth: '200px' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
