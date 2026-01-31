import React, { useState } from "react";

export default function PerformanceDashboard({
  students,
  setCurrentView
}) {
  const [selectedMetric, setSelectedMetric] = useState('students');

  // Calculate performance metrics
  const metrics = {
    totalStudents: students.length,
    studentsWithTests: students.filter(s => s.mockTests.length > 0).length,
    topPerformers: students.filter(s => {
      const latest = s.mockTests[s.mockTests.length - 1];
      return latest && latest.category === 'Category A (Top Tier)';
    }).length,
    averageAggregate: students.length > 0 
      ? (students.reduce((sum, s) => {
          const latest = s.mockTests[s.mockTests.length - 1];
          return sum + (latest?.aggregate || 0);
        }, 0) / students.filter(s => s.mockTests.length > 0).length).toFixed(1)
      : 0
  };

  // Performance distribution
  const performanceData = {
    'Category A (Top Tier)': students.filter(s => {
      const latest = s.mockTests[s.mockTests.length - 1];
      return latest && latest.category === 'Category A (Top Tier)';
    }).length,
    'Category B (Good Schools)': students.filter(s => {
      const latest = s.mockTests[s.mockTests.length - 1];
      return latest && latest.category === 'Category B (Good Schools)';
    }).length,
    'Category C (Standard Schools)': students.filter(s => {
      const latest = s.mockTests[s.mockTests.length - 1];
      return latest && latest.category === 'Category C (Standard Schools)';
    }).length,
    'Not Tested': students.filter(s => s.mockTests.length === 0).length
  };

  // Subject performance
  const subjectScores = {};
  const subjects = ['ENG', 'MATH', 'SCI', 'SOC', 'COMP', 'RME', 'CTECH', 'CAD', 'GHL', 'FRN'];
  const subjectNames = {
    'ENG': 'English Language',
    'MATH': 'Mathematics',
    'SCI': 'Science',
    'SOC': 'Social Studies',
    'COMP': 'Computing',
    'RME': 'Religious & Moral',
    'CTECH': 'Career Technology',
    'CAD': 'Creative Arts',
    'GHL': 'Ghanaian Language',
    'FRN': 'French'
  };

  subjects.forEach(code => {
    const scores = students
      .filter(s => s.mockTests.length > 0)
      .map(s => s.mockTests[s.mockTests.length - 1].scores[code] || 0)
      .filter(score => score > 0);
    
    subjectScores[subjectNames[code]] = scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 0;
  });

  // Gender distribution
  const genderData = {
    'Male': students.filter(s => s.gender === 'Male').length,
    'Female': students.filter(s => s.gender === 'Female').length
  };

  // Improvement tracking
  const improvingStudents = students.filter(s => {
    if (s.mockTests.length < 2) return false;
    const tests = s.mockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
    return tests[tests.length - 1].aggregate < tests[tests.length - 2].aggregate;
  }).length;

  return (
    <div className="container">
      <div className="header">
        <h1>📊 Performance Dashboard</h1>
        <p className="subtitle">Comprehensive analysis of student performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>👥 Total Students</h3>
          <p className="metric-value">{metrics.totalStudents}</p>
          <p className="metric-label">Registered</p>
        </div>
        <div className="metric-card">
          <h3>📝 Tested Students</h3>
          <p className="metric-value">{metrics.studentsWithTests}</p>
          <p className="metric-label">Completed Tests</p>
        </div>
        <div className="metric-card">
          <h3>🏆 Top Performers</h3>
          <p className="metric-value">{metrics.topPerformers}</p>
          <p className="metric-label">Category A</p>
        </div>
        <div className="metric-card">
          <h3>📈 Average Aggregate</h3>
          <p className="metric-value">{metrics.averageAggregate}</p>
          <p className="metric-label">Overall Performance</p>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="dashboard-grid">
        <div className="chart-section">
          <h2>Performance Distribution</h2>
          <div className="chart-container">
            <div className="category-breakdown">
              {Object.entries(performanceData).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{
                        width: `${metrics.studentsWithTests > 0 ? (count / metrics.totalStudents * 100) : 0}%`,
                        backgroundColor: getCategoryColor(category)
                      }}
                    />
                  </div>
                  <span className="category-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="chart-section">
          <h2>Subject Performance (Avg Scores)</h2>
          <div className="subject-performance">
            {Object.entries(subjectScores).map(([subject, avgScore]) => (
              <div key={subject} className="subject-item">
                <span className="subject-name">{subject}</span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${(avgScore / 100) * 100}%` }}
                  />
                </div>
                <span className="score-value">{avgScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gender Distribution & Improvement */}
      <div className="dashboard-grid">
        <div className="chart-section">
          <h2>Gender Distribution</h2>
          <div className="gender-stats">
            {Object.entries(genderData).map(([gender, count]) => (
              <div key={gender} className="gender-item">
                <h4>{gender}</h4>
                <p className="gender-count">{count}</p>
                <p className="gender-percent">
                  {((count / metrics.totalStudents) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <h2>Student Progress</h2>
          <div className="progress-stats">
            <div className="progress-item">
              <h4>Improving</h4>
              <p className="progress-value">{improvingStudents}</p>
              <p className="progress-label">Students with positive trend</p>
            </div>
            <div className="progress-item">
              <h4>Not Tested Yet</h4>
              <p className="progress-value">{performanceData['Not Tested']}</p>
              <p className="progress-label">Need test results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="section">
        <h2>Performance Summary</h2>
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Students with Tests</td>
                <td>{metrics.studentsWithTests}</td>
                <td>{((metrics.studentsWithTests / metrics.totalStudents) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td>Category A Students</td>
                <td>{performanceData['Category A (Top Tier)']}</td>
                <td>{metrics.studentsWithTests > 0 ? ((performanceData['Category A (Top Tier)'] / metrics.studentsWithTests) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td>Category B Students</td>
                <td>{performanceData['Category B (Good Schools)']}</td>
                <td>{metrics.studentsWithTests > 0 ? ((performanceData['Category B (Good Schools)'] / metrics.studentsWithTests) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td>Category C Students</td>
                <td>{performanceData['Category C (Standard Schools)']}</td>
                <td>{metrics.studentsWithTests > 0 ? ((performanceData['Category C (Standard Schools)'] / metrics.studentsWithTests) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td>Improving Students</td>
                <td>{improvingStudents}</td>
                <td>{metrics.studentsWithTests > 1 ? ((improvingStudents / (metrics.studentsWithTests - 1)) * 100).toFixed(1) : 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    'Category A (Top Tier)': '#107c10',
    'Category B (Good Schools)': '#00bcf2',
    'Category C (Standard Schools)': '#ffb900',
    'Not Tested': '#999999'
  };
  return colors[category] || '#666';
}
