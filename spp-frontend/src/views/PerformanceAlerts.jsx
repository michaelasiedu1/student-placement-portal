import React, { useState, useEffect } from 'react';

export default function PerformanceAlerts({ students }) {
  const [alerts, setAlerts] = useState([]);
  const [alertFilter, setAlertFilter] = useState('all'); // 'all', 'improvement', 'decline', 'at-risk'
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    generateAlerts();
  }, [students]);

  const generateAlerts = () => {
    const generatedAlerts = [];

    students.forEach(student => {
      if (student.mockTests.length < 2) return;

      const tests = student.mockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
      const previousTest = tests[tests.length - 2];
      const latestTest = tests[tests.length - 1];

      if (!previousTest || !latestTest) return;

      const improvement = previousTest.aggregate - latestTest.aggregate; // Negative means improvement
      const improvementPercent = Math.abs(((previousTest.aggregate - latestTest.aggregate) / previousTest.aggregate) * 100).toFixed(1);

      // Significant Improvement Alert
      if (improvement > 5) {
        generatedAlerts.push({
          id: `${student.id}-improvement`,
          type: 'improvement',
          severity: 'positive',
          studentName: student.name,
          studentId: student.id,
          indexNumber: student.indexNumber,
          title: '⬇️ Significant Improvement',
          message: `${student.name} has improved their aggregate by ${improvement} points (${improvementPercent}%)`,
          previousAggregate: previousTest.aggregate,
          currentAggregate: latestTest.aggregate,
          icon: '🎉'
        });
      }

      // Significant Decline Alert
      if (improvement < -5) {
        generatedAlerts.push({
          id: `${student.id}-decline`,
          type: 'decline',
          severity: 'warning',
          studentName: student.name,
          studentId: student.id,
          indexNumber: student.indexNumber,
          title: '📉 Performance Decline',
          message: `${student.name} has declined by ${Math.abs(improvement)} points (${improvementPercent}%)`,
          previousAggregate: previousTest.aggregate,
          currentAggregate: latestTest.aggregate,
          icon: '⚠️'
        });
      }

      // At-Risk Alert (aggregate above 24, which is poor)
      if (latestTest.aggregate > 24 && latestTest.aggregate <= 30) {
        generatedAlerts.push({
          id: `${student.id}-at-risk`,
          type: 'at-risk',
          severity: 'critical',
          studentName: student.name,
          studentId: student.id,
          indexNumber: student.indexNumber,
          title: '🚨 At-Risk Student',
          message: `${student.name} is at risk with an aggregate of ${latestTest.aggregate}`,
          currentAggregate: latestTest.aggregate,
          icon: '⛔'
        });
      }

      // Excellent Performance Alert
      if (latestTest.aggregate < 12) {
        generatedAlerts.push({
          id: `${student.id}-excellent`,
          type: 'excellent',
          severity: 'positive',
          studentName: student.name,
          studentId: student.id,
          indexNumber: student.indexNumber,
          title: '⭐ Excellent Performance',
          message: `${student.name} is performing excellently with an aggregate of ${latestTest.aggregate}`,
          currentAggregate: latestTest.aggregate,
          icon: '🏆'
        });
      }
    });

    setAlerts(generatedAlerts);
  };

  const dismissAlert = (alertId) => {
    const newDismissed = new Set(dismissedAlerts);
    newDismissed.add(alertId);
    setDismissedAlerts(newDismissed);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (dismissedAlerts.has(alert.id)) return false;
    if (alertFilter === 'all') return true;
    return alert.type === alertFilter;
  });

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'positive': return '#0f3d2f';
      case 'warning': return '#3d2d0f';
      case 'critical': return '#3d0f0f';
      default: return '#0d1f2d';
    }
  };

  const getBorderColor = (severity) => {
    switch (severity) {
      case 'positive': return '#00d4ff';
      case 'warning': return '#ff9900';
      case 'critical': return '#ff6b6b';
      default: return '#1a4d5c';
    }
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>Performance Alerts & Notifications</h2>
        <p>Monitor student performance changes and identify at-risk students</p>
      </div>

      <div className="alerts-stats">
        <div className="stat-box">
          <span className="stat-number">{alerts.filter(a => !dismissedAlerts.has(a.id)).length}</span>
          <span className="stat-label">Active Alerts</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{alerts.filter(a => a.type === 'improvement').length}</span>
          <span className="stat-label">Improvements</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{alerts.filter(a => a.type === 'decline').length}</span>
          <span className="stat-label">Declines</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{alerts.filter(a => a.type === 'at-risk').length}</span>
          <span className="stat-label">At-Risk</span>
        </div>
      </div>

      <div className="filter-card">
        <label>Filter Alerts</label>
        <select value={alertFilter} onChange={(e) => setAlertFilter(e.target.value)}>
          <option value="all">All Alerts ({alerts.filter(a => !dismissedAlerts.has(a.id)).length})</option>
          <option value="improvement">Improvements ({alerts.filter(a => a.type === 'improvement').length})</option>
          <option value="decline">Declines ({alerts.filter(a => a.type === 'decline').length})</option>
          <option value="at-risk">At-Risk ({alerts.filter(a => a.type === 'at-risk').length})</option>
          <option value="excellent">Excellent ({alerts.filter(a => a.type === 'excellent').length})</option>
        </select>
      </div>

      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#bbb' }}>
            <p>No alerts to display</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="alert-item"
              style={{
                background: getAlertColor(alert.severity),
                borderLeft: `4px solid ${getBorderColor(alert.severity)}`,
                borderRadius: '4px',
                padding: '1.5rem',
                marginBottom: '1rem',
                display: 'grid',
                gridTemplateColumns: '50px 1fr 100px',
                alignItems: 'start',
                gap: '1.5rem'
              }}
            >
              <div style={{ fontSize: '2rem', textAlign: 'center' }}>{alert.icon}</div>

              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{alert.title}</h3>
                <p style={{ margin: '0.5rem 0', color: '#bbb', fontSize: '0.95rem' }}>{alert.message}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#999' }}>Student:</span>
                    <p style={{ margin: '0.25rem 0', color: '#fff' }}>{alert.studentName}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999' }}>Index:</span>
                    <p style={{ margin: '0.25rem 0', color: '#fff' }}>{alert.indexNumber}</p>
                  </div>
                  {alert.previousAggregate && (
                    <div>
                      <span style={{ color: '#999' }}>Previous:</span>
                      <p style={{ margin: '0.25rem 0', color: '#fff' }}>{alert.previousAggregate}</p>
                    </div>
                  )}
                  {alert.currentAggregate && (
                    <div>
                      <span style={{ color: '#999' }}>Current:</span>
                      <p style={{ margin: '0.25rem 0', color: '#fff' }}>{alert.currentAggregate}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid #666',
                  color: '#bbb',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.3s',
                  height: 'fit-content'
                }}
                onHover
              >
                Dismiss
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .alerts-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-box {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          color: #00d4ff;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          display: block;
          color: #bbb;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alerts-container {
          margin-top: 2rem;
        }

        .alert-item {
          transition: all 0.3s ease;
        }

        .alert-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(0, 212, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
