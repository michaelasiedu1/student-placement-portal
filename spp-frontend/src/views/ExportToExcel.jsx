import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ExportToExcel({ students }) {
  const [exportType, setExportType] = useState('all-students');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exportFormat, setExportFormat] = useState('detailed');

  const exportStudentList = () => {
    const data = [];

    students.forEach(student => {
      if (selectedCategory !== 'all' && student.mockTests.length > 0) {
        const latestTest = student.mockTests[student.mockTests.length - 1];
        if (latestTest.category !== selectedCategory) return;
      }

      const latestTest = student.mockTests.length > 0 ? student.mockTests[student.mockTests.length - 1] : null;

      if (exportFormat === 'detailed') {
        data.push({
          'Student Name': student.name,
          'Index Number': student.indexNumber,
          'Gender': student.gender,
          'Date of Birth': student.dateOfBirth || 'N/A',
          'Phone': student.phone || 'N/A',
          'Tests Taken': student.mockTests.length,
          'Latest Aggregate': latestTest?.aggregate || 'N/A',
          'Latest Category': latestTest?.category || 'N/A',
          'Predicted School': latestTest?.predictedSchool || 'N/A',
          'Predicted Program': latestTest?.predictedProgram || 'N/A'
        });
      } else {
        data.push({
          'Name': student.name,
          'Index': student.indexNumber,
          'Gender': student.gender,
          'Tests': student.mockTests.length,
          'Aggregate': latestTest?.aggregate || 'N/A',
          'Category': latestTest?.category || 'N/A'
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `student-list-${Date.now()}.xlsx`);
  };

  const exportTestResults = () => {
    const data = [];

    students.forEach(student => {
      student.mockTests.forEach(test => {
        if (selectedCategory !== 'all' && test.category !== selectedCategory) return;

        if (exportFormat === 'detailed') {
          data.push({
            'Student Name': student.name,
            'Index Number': student.indexNumber,
            'Test Name': test.testName,
            'Test Date': test.date,
            'English': test.scores.ENG,
            'Mathematics': test.scores.MATH,
            'Integrated Science': test.scores.SCI,
            'Social Studies': test.scores.SOC,
            'Religious & Moral Education': test.scores.RME,
            'ICT': test.scores.ICT,
            'Ghanaian Language': test.scores.GHL,
            'French': test.scores.FRN,
            'Aggregate': test.aggregate,
            'Category': test.category,
            'Predicted School': test.predictedSchool,
            'Predicted Program': test.predictedProgram
          });
        } else {
          data.push({
            'Student': student.name,
            'Index': student.indexNumber,
            'Test': test.testName,
            'Date': test.date,
            'ENG': test.scores.ENG,
            'MATH': test.scores.MATH,
            'SCI': test.scores.SCI,
            'SOC': test.scores.SOC,
            'RME': test.scores.RME,
            'ICT': test.scores.ICT,
            'Aggregate': test.aggregate
          });
        }
      });
    });

    if (data.length === 0) {
      alert('No test results found for the selected category');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Test Results');
    XLSX.writeFile(wb, `test-results-${Date.now()}.xlsx`);
  };

  const exportPlacementPredictions = () => {
    const data = [];

    students.forEach(student => {
      if (student.mockTests.length === 0) return;

      const latestTest = student.mockTests[student.mockTests.length - 1];
      if (selectedCategory !== 'all' && latestTest.category !== selectedCategory) return;

      data.push({
        'Student Name': student.name,
        'Index Number': student.indexNumber,
        'Gender': student.gender,
        'Latest Aggregate': latestTest.aggregate,
        'Category': latestTest.category,
        'Predicted School': latestTest.predictedSchool,
        'Predicted Program': latestTest.predictedProgram,
        'Tests Completed': student.mockTests.length,
        'Last Test Date': student.mockTests[student.mockTests.length - 1].date
      });
    });

    if (data.length === 0) {
      alert('No placement predictions found');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Placements');
    XLSX.writeFile(wb, `placement-predictions-${Date.now()}.xlsx`);
  };

  const exportPerformanceAnalysis = () => {
    const subjectData = {};
    const subjects = ['ENG', 'MATH', 'SCI', 'SOC', 'RME', 'ICT', 'GHL', 'FRN'];

    subjects.forEach(subject => {
      subjectData[subject] = {
        scores: [],
        average: 0,
        highest: 0,
        lowest: 100,
        count: 0
      };
    });

    students.forEach(student => {
      student.mockTests.forEach(test => {
        if (selectedCategory !== 'all' && test.category !== selectedCategory) return;

        subjects.forEach(subject => {
          const score = test.scores[subject];
          if (score !== undefined && score >= 0) {
            subjectData[subject].scores.push(score);
            subjectData[subject].highest = Math.max(subjectData[subject].highest, score);
            subjectData[subject].lowest = Math.min(subjectData[subject].lowest, score);
            subjectData[subject].count++;
          }
        });
      });
    });

    const data = [];
    const subjectNames = {
      'ENG': 'English Language',
      'MATH': 'Mathematics',
      'SCI': 'Science',
      'SOC': 'Social Studies',
      'COMP': 'Computing',
      'RME': 'Religious and Moral Education',
      'CTECH': 'Career Technology',
      'CAD': 'Creative Arts and Design',
      'GHL': 'Ghanaian Language (Asante Twi)',
      'FRN': 'French'
    };

    subjects.forEach(subject => {
      if (subjectData[subject].count > 0) {
        const avg = (subjectData[subject].scores.reduce((a, b) => a + b, 0) / subjectData[subject].count).toFixed(1);
        data.push({
          'Subject': subjectNames[subject],
          'Class Average': avg,
          'Highest Score': subjectData[subject].highest,
          'Lowest Score': subjectData[subject].lowest,
          'Students Tested': subjectData[subject].count
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Performance Analysis');
    XLSX.writeFile(wb, `performance-analysis-${Date.now()}.xlsx`);
  };

  const handleExport = () => {
    switch (exportType) {
      case 'all-students':
        exportStudentList();
        break;
      case 'test-results':
        exportTestResults();
        break;
      case 'placements':
        exportPlacementPredictions();
        break;
      case 'performance':
        exportPerformanceAnalysis();
        break;
      default:
        break;
    }
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>Export Data to Excel</h2>
        <p>Export student data, test results, and placement predictions in Excel format</p>
      </div>

      <div className="export-options-grid">
        <div className="export-card">
          <h3>📋 Student List</h3>
          <p>Export all students with their basic information and latest test results</p>
          <button onClick={() => setExportType('all-students')} className={`export-select-btn ${exportType === 'all-students' ? 'active' : ''}`}>
            Select
          </button>
        </div>

        <div className="export-card">
          <h3>📊 Test Results</h3>
          <p>Export all test results with individual subject scores</p>
          <button onClick={() => setExportType('test-results')} className={`export-select-btn ${exportType === 'test-results' ? 'active' : ''}`}>
            Select
          </button>
        </div>

        <div className="export-card">
          <h3>🎯 Placement Predictions</h3>
          <p>Export school placement predictions for each student</p>
          <button onClick={() => setExportType('placements')} className={`export-select-btn ${exportType === 'placements' ? 'active' : ''}`}>
            Select
          </button>
        </div>

        <div className="export-card">
          <h3>⚡ Performance Analysis</h3>
          <p>Export subject-wise performance statistics</p>
          <button onClick={() => setExportType('performance')} className={`export-select-btn ${exportType === 'performance' ? 'active' : ''}`}>
            Select
          </button>
        </div>
      </div>

      <div className="export-settings">
        <h3>Export Settings</h3>

        <div className="setting-group">
          <label>Filter by Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Category A (Top Tier)">Category A (Top Tier)</option>
            <option value="Category B (Good Schools)">Category B (Good Schools)</option>
            <option value="Category C (Standard Schools)">Category C (Standard Schools)</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Export Format</label>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="detailed">Detailed Format (More columns)</option>
            <option value="compact">Compact Format (Essential columns only)</option>
          </select>
        </div>

        <button className="export-button" onClick={handleExport}>
          📥 Download Excel File
        </button>
      </div>

      <style>{`
        .export-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .export-card {
          background: #0d1f2d;
          border: 2px solid #1a4d5c;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s;
        }

        .export-card h3 {
          color: #00d4ff;
          margin: 0 0 0.5rem 0;
        }

        .export-card p {
          color: #bbb;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
        }

        .export-select-btn {
          background: transparent;
          border: 1px solid #00d4ff;
          color: #00d4ff;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .export-select-btn:hover {
          background: rgba(0, 212, 255, 0.1);
        }

        .export-select-btn.active {
          background: #00d4ff;
          color: #051219;
          font-weight: bold;
        }

        .export-settings {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 8px;
          padding: 2rem;
        }

        .export-settings h3 {
          color: #00d4ff;
          margin-bottom: 1.5rem;
        }

        .setting-group {
          margin-bottom: 1.5rem;
        }

        .setting-group label {
          display: block;
          color: #bbb;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .setting-group select {
          width: 100%;
          max-width: 300px;
          background: #051219;
          border: 1px solid #1a4d5c;
          color: #fff;
          padding: 0.75rem;
          border-radius: 4px;
          font-family: inherit;
        }

        .export-button {
          background: linear-gradient(135deg, #00d4ff, #00f5d4);
          color: #051219;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
          margin-top: 1rem;
        }

        .export-button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
