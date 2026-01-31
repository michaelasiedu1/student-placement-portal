import React, { useState } from "react";

const formatDateWAEC = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dayName = days[date.getDay()];
    
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  } catch (error) {
    return dateString;
  }
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default function StudentProfile({
  student,
  setCurrentView,
  setEditingStudent,
  setPicturePreview
}) {
  if (!student) {
    return (
      <div className="container">
        <button
          className="btn-back"
          onClick={() => setCurrentView('students')}
        >
          ← Back to Students
        </button>
        <div className="section" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>No student selected</h2>
          <p>Please select a student from the Students tab.</p>
          <button
            className="btn-primary"
            onClick={() => setCurrentView('students')}
            style={{ marginTop: '1rem' }}
          >
            Go to Students
          </button>
        </div>
      </div>
    );
  }

  const [picturePreview, setLocalPicturePreview] = useState(student.picture);

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
        
        if (base64String.length > 2000000) {
          console.log('Image is large, truncating...');
          base64String = base64String.substring(0, 2000000);
        }
        
        setLocalPicturePreview(base64String);
        if (editingProfile) {
          setEditingProfile(prev => ({ ...prev, picture: base64String }));
        } else if (setEditingStudent) {
          setEditingStudent(prev => ({
            ...prev,
            picture: base64String
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStudent = async () => {
    // Save either the editingProfile (if editing whole profile) or the current student (photo-only)
    const payload = editingProfile || student;
    try {
      let response;
      if (payload && payload.id) {
        response = await fetch(`http://localhost:4000/api/students/${payload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('http://localhost:4000/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!response.ok) throw new Error('Failed to update student');
      setEditingPhoto(false);
      setEditingProfile(null);
      setCurrentView('students');
      setTimeout(() => { window.location.href = window.location.href; }, 500);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student. Please try again.');
    }
  };

  const latestTest = student.mockTests[student.mockTests.length - 1];
  const [editingPhoto, setEditingPhoto] = useState(false);

  return (
    <div className="container">
      <button
        className="btn-back"
        onClick={() => setCurrentView('students')}
      >
        ← Back to Students
      </button>

      <div className="profile-header">
        <div className="profile-picture-main">
          {picturePreview ? (
            <img src={picturePreview} alt={student.name} />
          ) : (
            <div className="picture-placeholder-main">📷</div>
          )}
        </div>
        <div className="profile-header-info">
          <h1>{student.name}</h1>
          <p className="student-id">Index Number: {student.indexNumber}</p>
          <button
            className="btn-secondary"
            onClick={() => setEditingPhoto(!editingPhoto)}
          >
            📸 {student.picture ? 'Update' : 'Add'} Photo
          </button>

        </div>
      </div>

      {editingPhoto && (
        <div className="photo-edit-section">
          <div className="picture-upload-container">
            {picturePreview ? (
              <div className="picture-preview">
                <img src={picturePreview} alt="Preview" />
                <button
                  type="button"
                  className="btn-small"
                  onClick={() => {
                    setLocalPicturePreview(null);
                    setEditingStudent(prev => ({ ...prev, picture: null }));
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
          <button className="btn-primary" onClick={handleSaveStudent}>
            Save Photo
          </button>
        </div>
      )}

      <div className="profile-grid">
        <div className="profile-section">
          <h2>📋 Personal Information</h2>
          <div className="detail-row">
            <span className="label">Index Number:</span>
            <span className="value">{student.indexNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">Full Name:</span>
            <span className="value">{student.name}</span>
          </div>
          <div className="detail-row">
            <span className="label">Class:</span>
            <span className="value">{student.class}</span>
          </div>
          <div className="detail-row">
            <span className="label">Gender:</span>
            <span className="value">{student.gender}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date of Birth:</span>
            <span className="value">{formatDateWAEC(student.dateOfBirth)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Parent Contact:</span>
            <span className="value">{student.parentContact || 'N/A'}</span>
          </div>
        </div>

        {latestTest && (
          <div className="profile-section">
            <h2>📊 Latest Test Performance</h2>
            <div className="detail-row">
              <span className="label">Test Name:</span>
              <span className="value">{latestTest.testName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Test Date:</span>
              <span className="value">{latestTest.date}</span>
            </div>
            <div className="detail-row">
              <span className="label">Aggregate Score:</span>
              <span className="value" style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>
                {latestTest.aggregate}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Performance Category:</span>
              <span className="value" style={{ color: 'var(--primary-blue)' }}>
                {latestTest.category}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Predicted School:</span>
              <span className="value">{latestTest.predictedSchool}</span>
            </div>
            <div className="detail-row">
              <span className="label">Predicted Program:</span>
              <span className="value">{latestTest.predictedProgram}</span>
            </div>
          </div>
        )}
      </div>

      {student.mockTests.length > 0 && (
        <div className="profile-section">
          <h2>📝 Mock Test History</h2>
          <div className="test-history">
            {student.mockTests.map((test, index) => (
              <div key={test.testId} className="test-item">
                <div className="test-header">
                  <h4>{test.testName}</h4>
                  <span className="test-date">{test.date}</span>
                </div>
                <div className="test-details">
                  <div className="test-score">
                    <span className="score-label">Aggregate:</span>
                    <span className="score-value">{test.aggregate}</span>
                  </div>
                  <div className="test-score">
                    <span className="score-label">Category:</span>
                    <span className="score-value">{test.category}</span>
                  </div>
                  <div className="test-score">
                    <span className="score-label">School:</span>
                    <span className="score-value">{test.predictedSchool}</span>
                  </div>
                </div>
                <div className="subject-scores">
                  {Object.entries(test.scores).map(([subject, score]) => (
                    <div key={subject} className="subject-score">
                      <span className="subject-code">{subject}:</span>
                      <span className="subject-score-value">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="profile-actions">
        <button
          className="btn-primary"
          onClick={() => setCurrentView('students')}
        >
          ← Back to Students
        </button>
        <button
          className="btn-danger"
          onClick={async () => {
            if (!window.confirm(`Are you sure you want to delete ${student.name}? This cannot be undone.`)) return;
            try {
              const res = await fetch(`http://localhost:4000/api/students/${student.id}`, { method: 'DELETE' });
              if (!res.ok) throw new Error('Failed to delete');
              setCurrentView('students');
              setTimeout(() => { window.location.href = window.location.href; }, 300);
            } catch (err) {
              console.error('Delete failed', err);
              alert('Failed to delete student.');
            }
          }}
          style={{ marginLeft: '1rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          🗑️ Delete Profile
        </button>
      </div>
    </div>
  );
}
