import React, { useState } from 'react';

export default function DateRangeFilter({ students, setSelectedStudent, setCurrentView }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const applyFilter = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    const results = students.filter(student => {
      if (student.mockTests.length === 0) return false;

      const hasTestInRange = student.mockTests.some(test => {
        const testDate = new Date(test.date);
        return testDate >= start && testDate <= end;
      });

      if (!hasTestInRange) return false;

      if (filterCategory === 'all') return true;
      const latestTest = student.mockTests[student.mockTests.length - 1];
      return latestTest && latestTest.category === filterCategory;
    });

    setFilteredResults(results);
    setHasSearched(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const ordinal = ['st', 'nd', 'rd'][((day + 90) % 10 - 3)] || 'th';
    return `${day}${ordinal} ${month} ${year}`;
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>Filter Test Results by Date Range</h2>
        <p>Find all students with test results within a specific date range</p>
      </div>

      <div className="filter-card">
        <div className="filter-section">
          <h3>Select Date Range</h3>
          
          <div className="date-filter-group">
            <div className="date-input-wrapper">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="date-input-wrapper">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Filter by Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Category A (Top Tier)">Category A (Top Tier)</option>
              <option value="Category B (Good Schools)">Category B (Good Schools)</option>
              <option value="Category C (Standard Schools)">Category C (Standard Schools)</option>
            </select>
          </div>

          <button className="apply-filter-button" onClick={applyFilter}>
            🔍 Filter Results
          </button>
        </div>
      </div>

      {hasSearched && (
        <div className="results-section">
          <h3>Found {filteredResults.length} Student(s)</h3>
          
          {filteredResults.length === 0 ? (
            <p className="no-results">No students found matching your criteria</p>
          ) : (
            <div className="student-grid">
              {filteredResults.map(student => {
                const testsInRange = student.mockTests.filter(test => {
                  const testDate = new Date(test.date);
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  return testDate >= start && testDate <= end;
                });

                const latestTest = student.mockTests[student.mockTests.length - 1];

                return (
                  <div key={student.id} className="student-card" style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      {student.pictureUrl && (
                        <img src={student.pictureUrl} alt={student.name} style={{ width: '80px', height: '100px', borderRadius: '4px', objectFit: 'cover' }} />
                      )}
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#00d4ff' }}>{student.name}</h4>
                        <p style={{ margin: '0.25rem 0', color: '#bbb', fontSize: '0.9rem' }}>INDEX: {student.indexNumber}</p>
                        <p style={{ margin: '0.25rem 0', color: '#bbb', fontSize: '0.85rem' }}>Category: {latestTest?.category || 'N/A'}</p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #1a4d5c', paddingTop: '1rem', marginBottom: '1rem' }}>
                      <p style={{ margin: '0.5rem 0', color: '#bbb', fontSize: '0.85rem' }}>
                        <strong>Tests in Range:</strong> {testsInRange.length}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: '#bbb', fontSize: '0.85rem' }}>
                        <strong>Latest Aggregate:</strong> <span style={{ color: '#00d4ff' }}>{latestTest?.aggregate || 'N/A'}</span>
                      </p>
                    </div>

                    <button
                      className="view-profile-button"
                      onClick={() => {
                        setSelectedStudent(student);
                        setCurrentView('student-profile');
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
