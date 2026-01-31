import React, { useState } from "react";

export default function Students({
  students,
  filterGender,
  setFilterGender,
  filterPerformance,
  setFilterPerformance,
  getFilteredStudents,
  setSelectedStudent,
  setCurrentView
}) {
  const [editingStudent, setEditingStudent] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);

  const filteredStudents = getFilteredStudents();

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('❌ Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        let base64String = e.target.result;
        
        // Truncate if too large (MongoDB limit is 16MB per document, be safe)
        if (base64String.length > 2000000) { // ~2MB in base64
          console.log('Image is large, truncating...');
          base64String = base64String.substring(0, 2000000);
        }
        
        setPicturePreview(base64String);
        setEditingStudent(prev => ({
          ...prev,
          picture: base64String
        }));
        console.log('Picture loaded:', base64String.substring(0, 50) + '...');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStudent = async () => {
    try {
      let response;
      if (editingStudent && editingStudent.id) {
        response = await fetch(`http://localhost:4000/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingStudent)
        });
      } else {
        response = await fetch('http://localhost:4000/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingStudent)
        });
      }

      if (!response.ok) throw new Error('Failed to update student');

      // Close modal and refresh with a small delay to ensure DB update is complete
      setEditingStudent(null);
      setPicturePreview(null);
      
      // Force a hard refresh to clear cache
      setTimeout(() => { window.location.href = window.location.href; }, 500);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>👥 Student Management</h1>
        <p className="subtitle">View and manage student records and mock test history</p>
      </div>
      {/* Navigation is handled in App */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Gender:</label>
          <select className="filter-select" value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Performance:</label>
          <select className="filter-select" value={filterPerformance} onChange={(e) => setFilterPerformance(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Category A (Top Tier)">Category A</option>
            <option value="Category B (Good Schools)">Category B</option>
            <option value="Category C (Standard Schools)">Category C</option>
          </select>
        </div>
      </div>
      <div className="section">
        <h2>Student Cards ({filteredStudents.length} students)</h2>
        {filteredStudents.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No students found matching your filters.
          </p>
        ) : (
          <div className="students-grid">
            {filteredStudents.map((student) => (
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
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-view-profile"
                        onClick={() => {
                          setSelectedStudent(student);
                          setCurrentView('student-profile');
                        }}
                      >
                        View Profile →
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setEditingStudent({ ...student });
                          setPicturePreview(student.picture || null);
                        }}
                        style={{ padding: '0.5rem 0.9rem', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.9rem' }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => {
          setEditingStudent(null);
          setPicturePreview(null);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Student - {editingStudent.name}</h2>
              <button className="close-btn" onClick={() => {
                setEditingStudent(null);
                setPicturePreview(null);
              }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={editingStudent.name || ''} onChange={(e) => setEditingStudent(prev => ({ ...prev, name: e.target.value }))} />

                  <label className="form-label">Index Number</label>
                  <input type="text" className="form-input" value={editingStudent.indexNumber || ''} onChange={(e) => setEditingStudent(prev => ({ ...prev, indexNumber: e.target.value }))} />

                  <label className="form-label">Class</label>
                  <input type="text" className="form-input" value={editingStudent.class || ''} onChange={(e) => setEditingStudent(prev => ({ ...prev, class: e.target.value }))} />

                  <label className="form-label">Parent Contact</label>
                  <input type="text" className="form-input" value={editingStudent.parentContact || ''} onChange={(e) => setEditingStudent(prev => ({ ...prev, parentContact: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select className="form-input" value={editingStudent.gender || ''} onChange={(e) => setEditingStudent(prev => ({ ...prev, gender: e.target.value }))}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-input" value={editingStudent.dateOfBirth || ''} onChange={(e) => setEditingStudent(prev => ({ ...prev, dateOfBirth: e.target.value }))} />

                  <div style={{ marginTop: '1rem' }}>
                    <label className="form-label">Photo</label>
                    {picturePreview ? (
                      <div className="picture-preview">
                        <img src={picturePreview} alt="Student passport" />
                        <button
                          type="button"
                          className="btn-small"
                          onClick={() => {
                            setEditingStudent(prev => ({ ...prev, picture: null }));
                            setPicturePreview(null);
                          }}
                        >
                          Remove Picture
                        </button>
                      </div>
                    ) : (
                      <div className="picture-placeholder">
                        <p>📷 No picture selected</p>
                        <p className="small-text">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                      className="picture-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={handleSaveStudent}
              >
                Save Student
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditingStudent(null);
                  setPicturePreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
