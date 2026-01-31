import React, { useState } from "react";

export default function AdvancedSearch({ students, setCurrentView, setSelectedStudent }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    let filtered = students;

    if (searchTerm.trim()) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.indexNumber.includes(searchTerm)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(s => {
        const latest = s.mockTests[s.mockTests.length - 1];
        return latest && latest.category === filterCategory;
      });
    }

    if (filterGender !== "all") {
      filtered = filtered.filter(s => s.gender === filterGender);
    }

    setResults(filtered);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔍 Advanced Search</h1>
        <p className="subtitle">Search and filter students by multiple criteria</p>
      </div>

      <div className="section">
        <div className="search-filters">
          <div className="filter-group">
            <label>Search by Name or Index:</label>
            <input
              type="text"
              className="filter-select"
              placeholder="Enter student name or index number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Category A (Top Tier)">Category A</option>
              <option value="Category B (Good Schools)">Category B</option>
              <option value="Category C (Standard Schools)">Category C</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Gender:</label>
            <select className="filter-select" value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleSearch} style={{ marginTop: '1.5rem' }}>
            🔍 Search
          </button>
        </div>
      </div>

      {hasSearched && (
        <div className="section">
          <h2>Results ({results.length} students found)</h2>
          {results.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No students match your search criteria</p>
          ) : (
            <div className="students-grid">
              {results.map(student => (
                <div key={student.id} className="student-card">
                  <div className="student-picture">
                    {student.picture ? (
                      <img src={student.picture} alt={student.name} />
                    ) : (
                      <div className="picture-placeholder-card">📷</div>
                    )}
                  </div>
                  <div className="student-card-info">
                    <h3>{student.name}</h3>
                    <p className="card-index">INDEX: {student.indexNumber}</p>
                    <button
                      className="btn-view-profile"
                      onClick={() => {
                        setSelectedStudent(student);
                        setCurrentView('student-profile');
                      }}
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
