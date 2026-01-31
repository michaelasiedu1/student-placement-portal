import React, { useState } from 'react';

export default function SubjectPerformance({ students }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('subject');

  const SUBJECTS = [
    { code: 'ENG', name: 'English Language' },
    { code: 'MATH', name: 'Mathematics' },
    { code: 'SCI', name: 'Science' },
    { code: 'SOC', name: 'Social Studies' },
    { code: 'COMP', name: 'Computing' },
    { code: 'RME', name: 'Religious and Moral Education' },
    { code: 'CTECH', name: 'Career Technology' },
    { code: 'CAD', name: 'Creative Arts and Design' },
    { code: 'GHL', name: 'Ghanaian Language (Asante Twi)' },
    { code: 'FRN', name: 'French' }
  ];

  const getSubjectStats = () => {
    const stats = {};
    SUBJECTS.forEach(subject => {
      stats[subject.code] = {
        name: subject.name,
        scores: [],
        average: 0,
        highest: 0,
        lowest: 100,
        studentsAttempted: 0
      };
    });

    students.forEach(student => {
      if (student.mockTests.length === 0) return;

      const latestTest = student.mockTests[student.mockTests.length - 1];
      if (selectedCategory !== 'all' && latestTest.category !== selectedCategory) return;

      SUBJECTS.forEach(subject => {
        const score = latestTest.scores[subject.code];
        if (score !== undefined && score >= 0) {
          stats[subject.code].scores.push(score);
          stats[subject.code].highest = Math.max(stats[subject.code].highest, score);
          stats[subject.code].lowest = Math.min(stats[subject.code].lowest, score);
          stats[subject.code].studentsAttempted++;
        }
      });
    });

    Object.keys(stats).forEach(code => {
      if (stats[code].scores.length > 0) {
        stats[code].average = (stats[code].scores.reduce((a, b) => a + b, 0) / stats[code].scores.length).toFixed(1);
      }
    });

    return stats;
  };

  const getStudentSubjectPerformance = () => {
    const studentPerfs = [];

    students.forEach(student => {
      if (student.mockTests.length === 0) return;

      const latestTest = student.mockTests[student.mockTests.length - 1];
      if (selectedCategory !== 'all' && latestTest.category !== selectedCategory) return;

      const weakestSubject = Object.entries(latestTest.scores).reduce((min, [code, score]) => {
        const subjectName = SUBJECTS.find(s => s.code === code)?.name || code;
        return score < min.score ? { code, name: subjectName, score } : min;
      }, { code: '', name: '', score: 100 });

      const strongestSubject = Object.entries(latestTest.scores).reduce((max, [code, score]) => {
        const subjectName = SUBJECTS.find(s => s.code === code)?.name || code;
        return score > max.score ? { code, name: subjectName, score } : max;
      }, { code: '', name: '', score: 0 });

      studentPerfs.push({
        studentName: student.name,
        indexNumber: student.indexNumber,
        weakestSubject,
        strongestSubject,
        aggregate: latestTest.aggregate,
        category: latestTest.category
      });
    });

    if (sortBy === 'weakness') {
      studentPerfs.sort((a, b) => a.weakestSubject.score - b.weakestSubject.score);
    }

    return studentPerfs;
  };

  const stats = getSubjectStats();
  const studentPerfs = getStudentSubjectPerformance();

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>Subject Performance Breakdown</h2>
        <p>Analyze how students perform across different subjects</p>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label>Filter by Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Category A (Top Tier)">Category A (Top Tier)</option>
            <option value="Category B (Good Schools)">Category B (Good Schools)</option>
            <option value="Category C (Standard Schools)">Category C (Standard Schools)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort Student Analysis By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="subject">Subject Name</option>
            <option value="weakness">Weakest Subjects First</option>
          </select>
        </div>
      </div>

      <div className="subject-stats-section">
        <h3>Overall Subject Performance</h3>
        <div className="subject-stats-grid">
          {Object.entries(stats).map(([code, stat]) => (
            <div key={code} className="subject-stat-card">
              <h4>{stat.name}</h4>
              <div className="stat-item">
                <span className="label">Class Average</span>
                <span className="value">{stat.average}</span>
              </div>
              <div className="stat-item">
                <span className="label">Highest Score</span>
                <span className="value" style={{ color: '#00d4ff' }}>{stat.highest}</span>
              </div>
              <div className="stat-item">
                <span className="label">Lowest Score</span>
                <span className="value" style={{ color: '#ff9999' }}>{stat.lowest}</span>
              </div>
              <div className="stat-item">
                <span className="label">Students Tested</span>
                <span className="value">{stat.studentsAttempted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="subject-analysis-section">
        <h3>Individual Student Subject Strengths & Weaknesses</h3>
        <div className="student-subject-table">
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Index Number</th>
                <th>Strongest Subject</th>
                <th>Score</th>
                <th>Weakest Subject</th>
                <th>Score</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {studentPerfs.map((perf, idx) => (
                <tr key={idx}>
                  <td>{perf.studentName}</td>
                  <td>{perf.indexNumber}</td>
                  <td style={{ color: '#00d4ff' }}>{perf.strongestSubject.name}</td>
                  <td style={{ color: '#00d4ff' }}>{perf.strongestSubject.score}</td>
                  <td style={{ color: '#ff9999' }}>{perf.weakestSubject.name}</td>
                  <td style={{ color: '#ff9999' }}>{perf.weakestSubject.score}</td>
                  <td>{perf.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>🎯 Recommendations</h3>
        <div className="recommendation-cards">
          {Object.entries(stats).map(([code, stat]) => {
            if (stat.average < 40) {
              return (
                <div key={code} className="recommendation-card warning">
                  <h4>{stat.name}</h4>
                  <p>Class average is below 40. This subject requires additional support and tutoring.</p>
                </div>
              );
            }
            if (stat.lowest < 20) {
              return (
                <div key={code} className="recommendation-card info">
                  <h4>{stat.name}</h4>
                  <p>Some students are struggling significantly. Consider peer tutoring programs.</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
