import React, { useState } from "react";

export default function TestScheduler({ students, setCurrentView }) {
  const [scheduledTests, setScheduledTests] = useState([]);
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testTime, setTestTime] = useState("");

  const handleScheduleTest = () => {
    if (testName && testDate && testTime) {
      setScheduledTests([...scheduledTests, { id: Date.now(), name: testName, date: testDate, time: testTime }]);
      setTestName("");
      setTestDate("");
      setTestTime("");
      alert("✅ Test scheduled successfully!");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📅 Test Scheduler</h1>
        <p className="subtitle">Schedule upcoming mock tests</p>
      </div>

      <div className="section">
        <h2>Schedule New Test</h2>
        <div className="form-group" style={{ maxWidth: '500px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Test Name:</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g., Mock Test 1"
              className="filter-select"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Test Date:</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="filter-select"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Test Time:</label>
            <input
              type="time"
              value={testTime}
              onChange={(e) => setTestTime(e.target.value)}
              className="filter-select"
            />
          </div>
          <button className="btn-primary" onClick={handleScheduleTest}>
            📅 Schedule Test
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Scheduled Tests</h2>
        {scheduledTests.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tests scheduled yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scheduledTests.map(test => (
              <div key={test.id} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                <h4>{test.name}</h4>
                <p>📅 {test.date} at {test.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
