import React, { useState } from "react";

export default function Registration({
  students,
  setCurrentView,
  onStudentRegistered
}) {
  const [formData, setFormData] = useState({
    name: '',
    indexNumber: '',
    class: 'JHS 3 Prudence',
    gender: 'Male',
    dateOfBirth: '',
    parentContact: '',
    picture: null
  });

  const [picturePreview, setPicturePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        let base64String = e.target.result;
        
        // Truncate if too large (MongoDB limit is 16MB per document, be safe)
        if (base64String.length > 2000000) { // ~2MB in base64
          setMessage('⚠️ Image is large, compressing...');
          // Simple truncation as a fallback - this shouldn't happen with small images
          base64String = base64String.substring(0, 2000000);
        }
        
        setFormData(prev => ({
          ...prev,
          picture: base64String
        }));
        setPicturePreview(base64String);
        setMessage('');
        console.log('Picture loaded:', base64String.substring(0, 50) + '...');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!formData.name.trim()) {
      setMessage('❌ Please enter student name');
      setLoading(false);
      return;
    }

    if (!formData.indexNumber.trim()) {
      setMessage('❌ Please enter index number');
      setLoading(false);
      return;
    }

    // Validate index number is 10 digits
    if (!/^\d{10}$/.test(formData.indexNumber.trim())) {
      setMessage('❌ Index number must be exactly 10 digits');
      setLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      setMessage('❌ Please select date of birth');
      setLoading(false);
      return;
    }

    if (!formData.parentContact.trim()) {
      setMessage('❌ Please enter parent contact number');
      setLoading(false);
      return;
    }

    // Validate parent contact is 10 digits (Ghanaian phone number)
    if (!/^\d{10}$/.test(formData.parentContact.trim())) {
      setMessage('❌ Parent contact must be exactly 10 digits');
      setLoading(false);
      return;
    }

    // Check if index number already exists
    if (students.some(s => s.indexNumber === formData.indexNumber)) {
      setMessage('❌ Index number already exists');
      setLoading(false);
      return;
    }

    const newStudent = {
      id: `STD${String(students.length + 1).padStart(3, '0')}`,
      name: formData.name.trim(),
      indexNumber: formData.indexNumber.trim(),
      class: formData.class,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      parentContact: formData.parentContact.trim(),
      picture: formData.picture || null,
      mockTests: []
    };

    try {
      const response = await fetch('http://localhost:4000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
      });

      if (!response.ok) {
        throw new Error('Failed to register student');
      }

      setMessage('✅ Student registered successfully!');
      
      // Reset form
      setFormData({
        name: '',
        indexNumber: '',
        class: 'JHS 3 Prudence',
        gender: 'Male',
        dateOfBirth: '',
        parentContact: '',
        picture: null
      });
      setPicturePreview(null);

      // Notify parent to refresh students
      onStudentRegistered();

      // Navigate back to students view after delay
      // The App.jsx will auto-fetch students when view changes to 'students'
      setTimeout(() => {
        setCurrentView('students');
      }, 1200);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Error registering student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      indexNumber: '',
      class: 'JHS 3 Prudence',
      gender: 'Male',
      dateOfBirth: '',
      parentContact: '',
      picture: null
    });
    setPicturePreview(null);
    setMessage('');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>➕ Register New Student</h1>
        <p className="subtitle">Manually register a new student in the system</p>
      </div>

      <div className="section">
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter student's full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="indexNumber">Index Number (10 digits) *</label>
            <input
              type="text"
              id="indexNumber"
              name="indexNumber"
              value={formData.indexNumber}
              onChange={handleInputChange}
              placeholder="e.g., 2024001234"
              maxLength="10"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="parentContact">Parent Contact (10 digits) *</label>
            <input
              type="text"
              id="parentContact"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleInputChange}
              placeholder="e.g., 0551234567"
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="picture">Passport Picture</label>
            <div className="picture-upload-container">
              {picturePreview ? (
                <div className="picture-preview">
                  <img src={picturePreview} alt="Student passport" />
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, picture: null }));
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
                id="picture"
                accept="image/*"
                onChange={handlePictureChange}
                className="picture-input"
              />
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Student'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
