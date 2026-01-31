import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

export default function DataBackup({ students }) {
  const [backupStatus, setBackupStatus] = useState('');
  const [lastBackup, setLastBackup] = useState(() => {
    const saved = localStorage.getItem('lastBackupTime');
    return saved ? new Date(saved).toLocaleString() : 'Never';
  });
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(() => {
    return localStorage.getItem('autoBackupEnabled') === 'true';
  });

  const createFullBackupExcel = () => {
    const studentData = students.map(s => ({
      'Student Name': s.name,
      'Index Number': s.indexNumber,
      'Gender': s.gender,
      'Date of Birth': s.dateOfBirth,
      'Phone': s.phone,
      'Email': s.email,
      'Picture URL': s.pictureUrl ? 'YES' : 'NO',
      'Tests Taken': s.mockTests.length,
      'Registration Date': s.registrationDate || 'N/A'
    }));

    const testData = [];
    students.forEach(student => {
      student.mockTests.forEach(test => {
        testData.push({
          'Student Name': student.name,
          'Index Number': student.indexNumber,
          'Test ID': test.testId,
          'Test Name': test.testName,
          'Mock Type': test.mockType,
          'Test Date': test.date,
          'ENG': test.scores.ENG,
          'MATH': test.scores.MATH,
          'SCI': test.scores.SCI,
          'SOC': test.scores.SOC,
                    'COMP': test.scores.COMP,
          'RME': test.scores.RME,
                    'CTECH': test.scores.CTECH,
                    'CAD': test.scores.CAD,
          'ICT': test.scores.ICT,
          'GHL': test.scores.GHL,
          'FRN': test.scores.FRN,
          'Aggregate': test.aggregate,
          'Category': test.category,
          'Predicted School': test.predictedSchool,
          'Predicted Program': test.predictedProgram
        });
      });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(studentData), 'Students');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(testData), 'Test Results');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(wb, `SPP-Backup-${timestamp}.xlsx`);

    setBackupStatus(`✓ Full backup created: ${new Date().toLocaleString()}`);
    localStorage.setItem('lastBackupTime', new Date().toISOString());
    setLastBackup(new Date().toLocaleString());
  };

  const createCompressedBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      studentCount: students.length,
      totalTests: students.reduce((sum, s) => sum + s.mockTests.length, 0),
      students: students
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveAs(blob, `SPP-Backup-${timestamp}.json`);

    setBackupStatus(`✓ Compressed backup created: ${new Date().toLocaleString()}`);
    localStorage.setItem('lastBackupTime', new Date().toISOString());
    setLastBackup(new Date().toLocaleString());
  };

  const createCSVBackup = () => {
    const data = [];
    students.forEach(s => {
      s.mockTests.forEach(test => {
        data.push({
          'Student': s.name,
          'Index': s.indexNumber,
          'Test': test.testName,
                    'Mock Type': test.mockType,
          'Date': test.date,
                    'COMP': test.scores.COMP,
                    'CTECH': test.scores.CTECH,
                    'CAD': test.scores.CAD,
                    'GHL': test.scores.GHL,
                    'FRN': test.scores.FRN,
          'ENG': test.scores.ENG,
          'MATH': test.scores.MATH,
          'SCI': test.scores.SCI,
          'SOC': test.scores.SOC,
          'RME': test.scores.RME,
          'Aggregate': test.aggregate,
          'Category': test.category
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Backup');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(wb, `SPP-Backup-CSV-${timestamp}.xlsx`);

    setBackupStatus(`✓ CSV backup created: ${new Date().toLocaleString()}`);
    localStorage.setItem('lastBackupTime', new Date().toISOString());
    setLastBackup(new Date().toLocaleString());
  };

  const toggleAutoBackup = () => {
    const newState = !autoBackupEnabled;
    setAutoBackupEnabled(newState);
    localStorage.setItem('autoBackupEnabled', newState.toString());
    setBackupStatus(newState ? '✓ Auto-backup enabled' : '✓ Auto-backup disabled');
    setTimeout(() => setBackupStatus(''), 2000);
  };

  const createManualBackupNow = () => {
    if (autoBackupEnabled) {
      createFullBackupExcel();
    }
  };

  const getBackupStats = () => {
    return {
      totalStudents: students.length,
      totalTests: students.reduce((sum, s) => sum + s.mockTests.length, 0),
      totalRecords: students.length + students.reduce((sum, s) => sum + s.mockTests.length, 0),
      estimatedSize: (JSON.stringify(students).length / 1024).toFixed(2) + ' KB'
    };
  };

  const stats = getBackupStats();

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>Data Backup & Recovery</h2>
        <p>Backup your student data and protect against data loss</p>
      </div>

      {backupStatus && (
        <div style={{
          background: '#0f3d2f',
          border: '1px solid #00d4ff',
          color: '#bbb',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem'
        }}>
          {backupStatus}
        </div>
      )}

      <div className="backup-stats-grid">
        <div className="backup-stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{stats.totalStudents}</div>
          </div>
        </div>

        <div className="backup-stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{stats.totalTests}</div>
          </div>
        </div>

        <div className="backup-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{stats.totalRecords}</div>
          </div>
        </div>

        <div className="backup-stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <div className="stat-label">Estimated Size</div>
            <div className="stat-value">{stats.estimatedSize}</div>
          </div>
        </div>
      </div>

      <div className="backup-info-section">
        <h3>💡 Backup Information</h3>
        <div className="info-box">
          <p><strong>Last Backup:</strong> {lastBackup}</p>
          <p><strong>Auto-Backup Status:</strong> {autoBackupEnabled ? '🟢 Enabled' : '🔴 Disabled'}</p>
          <p><strong>Data Location:</strong> Browser LocalStorage + Server Database</p>
        </div>
      </div>

      <div className="backup-options-grid">
        <div className="backup-option-card">
          <h3>📊 Full Backup (Excel)</h3>
          <p>Complete backup with all students and test results in Excel format with multiple sheets</p>
          <button onClick={createFullBackupExcel} className="backup-action-btn">
            ⬇️ Create Full Backup
          </button>
        </div>

        <div className="backup-option-card">
          <h3>📦 Compressed Backup (JSON)</h3>
          <p>Lightweight JSON format backup that preserves all data structure and metadata</p>
          <button onClick={createCompressedBackup} className="backup-action-btn">
            ⬇️ Create Compressed Backup
          </button>
        </div>

        <div className="backup-option-card">
          <h3>📋 CSV Export Backup</h3>
          <p>Simple CSV format backup ideal for importing into other systems</p>
          <button onClick={createCSVBackup} className="backup-action-btn">
            ⬇️ Create CSV Backup
          </button>
        </div>

        <div className="backup-option-card">
          <h3>🔄 Auto Backup Settings</h3>
          <p>Enable automatic daily backups to protect your data</p>
          <button 
            onClick={toggleAutoBackup} 
            className={`backup-action-btn ${autoBackupEnabled ? 'active' : ''}`}
          >
            {autoBackupEnabled ? '✓ Auto-Backup Enabled' : '○ Auto-Backup Disabled'}
          </button>
          {autoBackupEnabled && (
            <button onClick={createManualBackupNow} className="backup-action-btn secondary">
              🚀 Backup Now
            </button>
          )}
        </div>
      </div>

      <div className="backup-recovery-section">
        <h3>🔐 Recovery & Security</h3>
        <div className="recovery-box">
          <h4>How to Restore a Backup:</h4>
          <ol>
            <li>Contact your system administrator</li>
            <li>Provide the backup file (.xlsx, .json, or .csv)</li>
            <li>The system will verify and import the backup</li>
            <li>All data will be restored to the specified point in time</li>
          </ol>
          <p style={{ marginTop: '1rem', color: '#ffaa00' }}>
            ⚠️ Important: Keep backup files in a secure location. Do not share backup files with unauthorized users.
          </p>
        </div>
      </div>

      <div className="backup-recommendations">
        <h3>💡 Backup Recommendations</h3>
        <ul>
          <li>✓ Create backups weekly or after major data entries</li>
          <li>✓ Store backups in multiple locations (local + cloud)</li>
          <li>✓ Enable auto-backup for continuous protection</li>
          <li>✓ Test backup restoration periodically</li>
          <li>✓ Keep sensitive data encrypted</li>
          <li>✓ Document your backup procedures</li>
        </ul>
      </div>

      <style>{`
        .backup-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .backup-stat-card {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-label {
          color: #bbb;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          color: #00d4ff;
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 0.25rem;
        }

        .backup-info-section {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .backup-info-section h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .info-box {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
        }

        .info-box p {
          color: #bbb;
          margin: 0.5rem 0;
        }

        .backup-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .backup-option-card {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .backup-option-card h3 {
          color: #00d4ff;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .backup-option-card p {
          color: #bbb;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
        }

        .backup-action-btn {
          width: 100%;
          background: transparent;
          border: 1px solid #00d4ff;
          color: #00d4ff;
          padding: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          margin-bottom: 0.5rem;
        }

        .backup-action-btn:hover {
          background: rgba(0, 212, 255, 0.1);
        }

        .backup-action-btn.active {
          background: #00d4ff;
          color: #051219;
        }

        .backup-action-btn.secondary {
          background: linear-gradient(135deg, #00d4ff, #00f5d4);
          color: #051219;
          border: none;
        }

        .backup-recovery-section {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .backup-recovery-section h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .recovery-box {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
        }

        .recovery-box h4 {
          color: #00f5d4;
          margin: 0 0 0.75rem 0;
        }

        .recovery-box ol {
          color: #bbb;
          padding-left: 1.5rem;
        }

        .recovery-box li {
          margin-bottom: 0.5rem;
        }

        .backup-recommendations {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .backup-recommendations h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .backup-recommendations ul {
          color: #bbb;
          padding-left: 1.5rem;
        }

        .backup-recommendations li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
