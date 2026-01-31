import React, { useState } from 'react';

export default function BulkMessaging({ students }) {
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [messageType, setMessageType] = useState('placement');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [sentStatus, setSentStatus] = useState('');

  const getRecipientList = () => {
    let recipients = [];

    if (recipientFilter === 'all') {
      recipients = students.map(s => ({
        id: s.id,
        name: s.name,
        indexNumber: s.indexNumber,
        email: s.email || `${s.indexNumber}@school.edu`,
        type: 'student'
      }));
    } else if (recipientFilter === 'top-performers') {
      recipients = students
        .filter(s => s.mockTests.length > 0)
        .filter(s => s.mockTests[s.mockTests.length - 1]?.category === 'Category A (Top Tier)')
        .map(s => ({
          id: s.id,
          name: s.name,
          indexNumber: s.indexNumber,
          email: s.email || `${s.indexNumber}@school.edu`,
          type: 'student'
        }));
    } else if (recipientFilter === 'at-risk') {
      recipients = students
        .filter(s => s.mockTests.length > 0)
        .filter(s => {
          const latest = s.mockTests[s.mockTests.length - 1];
          return latest && latest.aggregate > 24;
        })
        .map(s => ({
          id: s.id,
          name: s.name,
          indexNumber: s.indexNumber,
          email: s.email || `${s.indexNumber}@school.edu`,
          type: 'student'
        }));
    } else if (recipientFilter === 'category-filtered') {
      recipients = students
        .filter(s => s.mockTests.length > 0)
        .filter(s => {
          const latest = s.mockTests[s.mockTests.length - 1];
          return latest && (category === 'all' || latest.category === category);
        })
        .map(s => ({
          id: s.id,
          name: s.name,
          indexNumber: s.indexNumber,
          email: s.email || `${s.indexNumber}@school.edu`,
          type: 'student'
        }));
    }

    return recipients;
  };

  const generateMessage = (recipientIndex) => {
    const recipient = getRecipientList()[recipientIndex];
    if (!recipient) return '';

    const student = students.find(s => s.id === recipient.id);
    if (!student) return '';

    const latestTest = student.mockTests.length > 0 ? student.mockTests[student.mockTests.length - 1] : null;

    switch (messageType) {
      case 'placement':
        return `Dear Parent/Guardian,\n\n${student.name} has been tested and shows strong performance. Based on current results, the predicted school placement is ${latestTest?.predictedSchool || 'To be determined'}. We wish them success!\n\nBest regards,\nAcademic Team`;

      case 'improvement':
        return `Congratulations!\n\n${student.name} has shown remarkable improvement in their recent test. Their aggregate score is ${latestTest?.aggregate || 'pending'}, which is excellent. We encourage continued hard work!\n\nBest regards,\nAcademic Team`;

      case 'support':
        return `Dear Parent/Guardian,\n\n${student.name} requires additional academic support in certain areas. We recommend tutoring sessions to strengthen their performance. Please contact the school for more information.\n\nBest regards,\nAcademic Team`;

      case 'custom':
        return customMessage;

      default:
        return '';
    }
  };

  const handleSelectRecipient = (recipientId) => {
    if (selectedRecipients.includes(recipientId)) {
      setSelectedRecipients(selectedRecipients.filter(id => id !== recipientId));
    } else {
      setSelectedRecipients([...selectedRecipients, recipientId]);
    }
  };

  const handleSelectAll = () => {
    const allIds = getRecipientList().map(r => r.id);
    setSelectedRecipients(allIds);
  };

  const handleSendMessages = () => {
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    // Simulate sending messages
    setSentStatus(`Sending to ${selectedRecipients.length} recipient(s)...`);

    setTimeout(() => {
      setSentStatus(`✓ Successfully sent messages to ${selectedRecipients.length} recipient(s)!`);
      setTimeout(() => setSentStatus(''), 3000);
    }, 1000);
  };

  const recipients = getRecipientList();

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>Bulk Messaging System</h2>
        <p>Send messages to multiple students and parents</p>
      </div>

      {sentStatus && (
        <div style={{
          background: '#0f3d2f',
          border: '1px solid #00d4ff',
          color: '#bbb',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem'
        }}>
          {sentStatus}
        </div>
      )}

      <div className="messaging-configuration">
        <div className="config-section">
          <h3>Message Configuration</h3>

          <div className="config-group">
            <label>Message Type</label>
            <select value={messageType} onChange={(e) => setMessageType(e.target.value)}>
              <option value="placement">Placement Prediction</option>
              <option value="improvement">Performance Improvement</option>
              <option value="support">Support Needed</option>
              <option value="custom">Custom Message</option>
            </select>
          </div>

          {messageType === 'custom' && (
            <div className="config-group">
              <label>Custom Message</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your custom message here..."
                rows="5"
              />
            </div>
          )}
        </div>

        <div className="config-section">
          <h3>Select Recipients</h3>

          <div className="config-group">
            <label>Recipient Group</label>
            <select value={recipientFilter} onChange={(e) => setRecipientFilter(e.target.value)}>
              <option value="all">All Students</option>
              <option value="top-performers">Top Performers (Category A)</option>
              <option value="at-risk">At-Risk Students</option>
              <option value="category-filtered">Filter by Category</option>
            </select>
          </div>

          {recipientFilter === 'category-filtered' && (
            <div className="config-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="Category A (Top Tier)">Category A (Top Tier)</option>
                <option value="Category B (Good Schools)">Category B (Good Schools)</option>
                <option value="Category C (Standard Schools)">Category C (Standard Schools)</option>
              </select>
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: '#bbb', marginBottom: '0.5rem' }}>
              Selected: {selectedRecipients.length} / {recipients.length}
            </p>
            <button onClick={handleSelectAll} style={{
              background: 'transparent',
              border: '1px solid #00d4ff',
              color: '#00d4ff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Select All
            </button>
          </div>
        </div>
      </div>

      <div className="recipients-list">
        <h3>Recipients ({recipients.length})</h3>
        <div className="recipient-cards">
          {recipients.map(recipient => (
            <div key={recipient.id} className="recipient-card">
              <input
                type="checkbox"
                checked={selectedRecipients.includes(recipient.id)}
                onChange={() => handleSelectRecipient(recipient.id)}
              />
              <div className="recipient-info">
                <h4>{recipient.name}</h4>
                <p>Index: {recipient.indexNumber}</p>
                <p style={{ fontSize: '0.85rem' }}>{recipient.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRecipients.length > 0 && (
        <div className="message-preview">
          <h3>Message Preview</h3>
          <div className="preview-box">
            <pre>{generateMessage(0)}</pre>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={handleSendMessages} style={{
          background: 'linear-gradient(135deg, #00d4ff, #00f5d4)',
          color: '#051219',
          padding: '0.75rem 2rem',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          📤 Send Messages ({selectedRecipients.length})
        </button>
      </div>

      <style>{`
        .messaging-configuration {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .config-section {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .config-section h3 {
          color: #00d4ff;
          margin-bottom: 1.5rem;
        }

        .config-group {
          margin-bottom: 1.5rem;
        }

        .config-group label {
          display: block;
          color: #bbb;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .config-group select,
        .config-group textarea {
          width: 100%;
          background: #051219;
          border: 1px solid #1a4d5c;
          color: #fff;
          padding: 0.75rem;
          border-radius: 4px;
          font-family: inherit;
        }

        .config-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .recipients-list {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .recipients-list h3 {
          color: #00d4ff;
          margin-bottom: 1.5rem;
        }

        .recipient-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .recipient-card {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .recipient-card input[type="checkbox"] {
          margin-top: 0.25rem;
          cursor: pointer;
        }

        .recipient-card h4 {
          margin: 0 0 0.25rem 0;
          color: #00d4ff;
        }

        .recipient-card p {
          margin: 0.25rem 0;
          color: #bbb;
          font-size: 0.9rem;
        }

        .message-preview {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .message-preview h3 {
          color: #00d4ff;
          margin-bottom: 1rem;
        }

        .preview-box {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .preview-box pre {
          color: #bbb;
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 0.9rem;
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
}
