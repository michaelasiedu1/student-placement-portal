import React, { useState } from "react";
import jsPDF from "jspdf";

export default function ProgressReports({ students, setCurrentView }) {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const generatePDF = (student) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(16);
    doc.text("STUDENT PROGRESS REPORT", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Index Number: ${student.indexNumber}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Class: ${student.class}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Gender: ${student.gender}`, 20, yPosition);
    yPosition += 12;

    // Test Results
    doc.setFontSize(12);
    doc.text("TEST RESULTS:", 20, yPosition);
    yPosition += 8;

    if (student.mockTests.length === 0) {
      doc.text("No test results available", 20, yPosition);
    } else {
      student.mockTests.forEach((test, index) => {
        doc.setFontSize(10);
        doc.text(`Test ${index + 1}: ${test.testName} (${test.date})`, 20, yPosition);
        yPosition += 6;
        doc.text(`Aggregate: ${test.aggregate} | Category: ${test.category}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Predicted School: ${test.predictedSchool}`, 25, yPosition);
        yPosition += 8;

        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    // Performance Recommendations
    yPosition += 5;
    doc.setFontSize(12);
    doc.text("RECOMMENDATIONS:", 20, yPosition);
    yPosition += 8;

    const latestTest = student.mockTests[student.mockTests.length - 1];
    if (latestTest) {
      doc.setFontSize(10);
      if (latestTest.category === "Category A (Top Tier)") {
        doc.text("• Student is performing excellently and is on track for top-tier schools", 25, yPosition);
      } else if (latestTest.category === "Category B (Good Schools)") {
        doc.text("• Student is performing well and should target good secondary schools", 25, yPosition);
      } else {
        doc.text("• Student should focus on improving subject performance", 25, yPosition);
      }
    }

    doc.save(`${student.name}_progress_report.pdf`);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📄 Progress Reports</h1>
        <p className="subtitle">Generate detailed PDF reports for students</p>
      </div>

      <div className="section">
        <h2>Generate Report</h2>
        <div className="student-selector-section">
          <label>Select Student:</label>
          <select 
            className="filter-select"
            onChange={(e) => {
              const student = students.find(s => s.id === e.target.value);
              setSelectedStudent(student);
            }}
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.indexNumber}
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="report-preview" style={{ marginTop: '2rem' }}>
            <h3>{selectedStudent.name}</h3>
            <p><strong>Index Number:</strong> {selectedStudent.indexNumber}</p>
            <p><strong>Class:</strong> {selectedStudent.class}</p>
            <p><strong>Tests Completed:</strong> {selectedStudent.mockTests.length}</p>
            
            <button 
              className="btn-primary"
              onClick={() => generatePDF(selectedStudent)}
              style={{ marginTop: '1rem' }}
            >
              📥 Download PDF Report
            </button>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Bulk Report Generation</h2>
        <button 
          className="btn-secondary"
          onClick={() => {
            students.forEach(student => {
              setTimeout(() => generatePDF(student), 100);
            });
          }}
          style={{ marginBottom: '1rem' }}
        >
          📥 Download All Reports
        </button>
        <p style={{ color: 'var(--text-secondary)' }}>
          This will generate and download progress reports for all {students.length} students
        </p>
      </div>
    </div>
  );
}
