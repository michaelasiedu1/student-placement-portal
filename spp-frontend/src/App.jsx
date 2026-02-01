import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import axios from "axios";
import { SCHOOLS_DATA } from './data/schoolsData.js';
import { ACADEMIC_PROGRAMS, MOCK_SUBJECTS } from './utils/constants.js';
import { 
  predictPlacement, 
  getMotivationalMessage, 
  validateStudentData,
  calculateAggregate,
  getSchoolCategory
} from './utils/placementCalculator.js';
import Login from './views/Login.jsx';
import Dashboard from './views/Dashboard.jsx';
import Students from './views/Students.jsx';
import StudentProfile from './views/StudentProfile.jsx';
import AddTest from './views/AddTest.jsx';
import Registration from './views/Registration.jsx';
import Reports from './views/Reports.jsx';
import PerformanceDashboard from './views/PerformanceDashboard.jsx';
import ProgressReports from './views/ProgressReports.jsx';
import AdvancedSearch from './views/AdvancedSearch.jsx';
import DateRangeFilter from './views/DateRangeFilter.jsx';
import SubjectPerformance from './views/SubjectPerformance.jsx';
import TestScheduler from './views/TestScheduler.jsx';
import TestComparison from './views/TestComparison.jsx';
import CertificateGenerator from './views/CertificateGenerator.jsx';
import PlacementTracking from './views/PlacementTracking.jsx';
import PrintFriendlyProfiles from './views/PrintFriendlyProfiles.jsx';
import TeacherNotes from './views/TeacherNotes.jsx';
import BulkImport from './views/BulkImport.jsx';
import PerformanceAlerts from './views/PerformanceAlerts.jsx';
import ExportToExcel from './views/ExportToExcel.jsx';
import Authentication from './views/Authentication.jsx';
import ParentPortal from './views/ParentPortal.jsx';
import BulkMessaging from './views/BulkMessaging.jsx';
import DataBackup from './views/DataBackup.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'dashboard';
  }); // 'dashboard', 'students', 'registration', 'add-test', 'reports'
  const [selectedStudent, setSelectedStudent] = useState(() => {
    const stored = localStorage.getItem('selectedStudent');
    return stored ? JSON.parse(stored) : null;
  });
  const [students, setStudents] = useState([]);
  const [newMockTest, setNewMockTest] = useState({
    testName: '',
      mockType: 'Mock 1',
    date: new Date().toISOString().split('T')[0],
    scores: {}
  });
  const [filterClass, setFilterClass] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [importMessage, setImportMessage] = useState('');

  const API_BASE_URL = "http://localhost:4000";

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    // Refetch students when returning to students or dashboard view
    if (currentView === 'students' || currentView === 'dashboard') {
      fetchStudents();
    }
  }, [currentView]);

  useEffect(() => {
    if (selectedStudent) {
      localStorage.setItem('selectedStudent', JSON.stringify(selectedStudent));
    } else {
      localStorage.removeItem('selectedStudent');
    }
  }, [selectedStudent]);

  useEffect(() => {
    // Update selectedStudent with fresh data from fetched students
    if (selectedStudent && students.length > 0) {
      const updatedStudent = students.find(s => s._id === selectedStudent._id);
      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
      }
    }
  }, [students]);

  const handleNewTestScoreChange = (subjectCode, value) => {
    const score = Math.min(Math.max(parseInt(value) || 0, 0), 100);
    setNewMockTest(prev => ({
      ...prev,
      scores: { ...prev.scores, [subjectCode]: score }
    }));
  };

  const addMockTestToStudent = async () => {
    if (!selectedStudent) return;
    
    const aggregate = calculateAggregate(newMockTest.scores);
    const category = getSchoolCategory(aggregate);
    const availableSchools = SCHOOLS_DATA[category] || [];
    
    const newTest = {
      testId: `MT${Date.now()}`,
      testName: newMockTest.testName,
        mockType: newMockTest.mockType,
      date: newMockTest.date,
      scores: { ...newMockTest.scores },
      aggregate,
      category,
      predictedSchool: availableSchools[0]?.name || 'No placement available',
      predictedProgram: availableSchools[0]?.programs[0] || 'N/A'
    };

    try {
      const updatedStudent = {
        ...selectedStudent,
        mockTests: [...selectedStudent.mockTests, newTest]
      };
      await axios.post(`${API_BASE_URL}/api/students`, updatedStudent);
      setStudents(prev => prev.map(student => 
        student.id === selectedStudent.id 
          ? updatedStudent
          : student
      ));
    } catch (error) {
      console.error("Error adding mock test:", error);
    }

    setNewMockTest({
        mockType: 'Mock 1',
      testName: '',
      date: new Date().toISOString().split('T')[0],
      scores: {}
    });
    
    alert(`Mock test added successfully! Aggregate: ${aggregate}, Category: ${category}`);
  };

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (filterClass !== 'all') {
      filtered = filtered.filter(student => student.class === filterClass);
    }
    
    if (filterGender !== 'all') {
      filtered = filtered.filter(student => student.gender === filterGender);
    }
    
    if (filterPerformance !== 'all') {
      filtered = filtered.filter(student => {
        const latestTest = student.mockTests[student.mockTests.length - 1];
        return latestTest && latestTest.category === filterPerformance;
      });
    }
    
    return filtered;
  };

  const handleImportStudents = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const newStudents = jsonData.map((row, index) => ({
          id: `STD${String(students.length + index + 1).padStart(3, '0')}`,
          name: row.Name || row.name || `Student ${students.length + index + 1}`,
          indexNumber: row['Index Number'] || row.indexNumber || `2024${String(students.length + index + 1).padStart(3, '0')}`,
          class: "JHS 3 Prudence",
          gender: row.Gender || row.gender || (Math.random() > 0.5 ? 'Male' : 'Female'),
          dateOfBirth: row['Date of Birth'] || row.dateOfBirth || "2008-01-01",
          strengths: row.Strengths ? row.Strengths.split(',').map(s => s.trim()) : ["General Arts"],
          weaknesses: row.Weaknesses ? row.Weaknesses.split(',').map(s => s.trim()) : ["Mathematics"],
          mockTests: []
        }));
        let imported = 0;
        for (const student of newStudents) {
          try {
            await axios.post(`${API_BASE_URL}/api/students`, student);
            imported++;
          } catch (err) {
          }
        }
        const response = await axios.get(`${API_BASE_URL}/api/students`);
        setStudents(response.data);
        setImportMessage(`Successfully imported ${imported} students!`);
        setTimeout(() => setImportMessage(''), 3000);
      } catch (error) {
        setImportMessage('Error importing file. Please check the format.');
        setTimeout(() => setImportMessage(''), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportMockTests = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        let importedCount = 0;
        for (const row of jsonData) {
          const studentIndex = row['Index Number'] || row.indexNumber;
          let student = students.find(s => s.indexNumber === studentIndex);
          if (!student) continue;
          const scores = {
            ENG: parseInt(row['English Language'] || row.ENG || 0),
            MATH: parseInt(row['Mathematics'] || row.MATH || 0),
            SCI: parseInt(row['Science'] || row.SCI || 0),
            SOC: parseInt(row['Social Studies'] || row.SOC || 0),
                        COMP: parseInt(row['Computing'] || row.COMP || 0),
            RME: parseInt(row['Religious & Moral Education'] || row.RME || 0),
            CTECH: parseInt(row['Career Technology'] || row.CTECH || 0),
            CAD: parseInt(row['Creative Arts and Design'] || row.CAD || 0),
            GHL: parseInt(row['Ghanaian Language'] || row.GHL || 0),
            FRN: parseInt(row['French'] || row.FRN || 0)
          };
          const aggregate = calculateAggregate(scores);
          const category = getSchoolCategory(aggregate);
          const availableSchools = SCHOOLS_DATA[category] || [];
          const newTest = {
            testId: `MT${Date.now()}_${importedCount}`,
            testName: row['Test Name'] || row.testName || 'Imported Test',
                        mockType: row['Mock Type'] || row.mockType || 'Mock 1',
            date: row['Date'] || row.date || new Date().toISOString().split('T')[0],
            scores,
            aggregate,
            category,
            predictedSchool: availableSchools[0]?.name || 'No placement available',
            predictedProgram: availableSchools[0]?.programs[0] || 'N/A'
          };
          const updatedStudent = {
            ...student,
            mockTests: [...student.mockTests, newTest]
          };
          try {
            await axios.post(`${API_BASE_URL}/api/students`, updatedStudent);
            importedCount++;
          } catch (err) {
          }
        }
        const response = await axios.get(`${API_BASE_URL}/api/students`);
        setStudents(response.data);
        setImportMessage(`Successfully imported ${importedCount} mock test results!`);
        setTimeout(() => setImportMessage(''), 3000);
      } catch (error) {
        setImportMessage('Error importing file. Please check the format.');
        setTimeout(() => setImportMessage(''), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getStudentById = (id) => students.find(s => s.id === id);

  const getTopPerformers = (count = 5) => {
    return students
      .filter(s => s.mockTests.length > 0)
      .sort((a, b) => {
        const aggA = a.mockTests[a.mockTests.length - 1]?.aggregate || 100;
        const aggB = b.mockTests[b.mockTests.length - 1]?.aggregate || 100;
        return aggA - aggB;
      })
      .slice(0, count);
  };

  const getDashboardStats = () => {
    const totalStudents = students.length;
    const topPerformers = getTopPerformers(5);
    
    const genderDistribution = {
      'Male': students.filter(s => s.gender === 'Male').length,
      'Female': students.filter(s => s.gender === 'Female').length
    };
    
    const performanceDistribution = {
      'Category A': students.filter(s => {
        const latest = s.mockTests[s.mockTests.length - 1];
        return latest && latest.category === 'Category A (Top Tier)';
      }).length,
      'Category B': students.filter(s => {
        const latest = s.mockTests[s.mockTests.length - 1];
        return latest && latest.category === 'Category B (Good Schools)';
      }).length,
      'Category C': students.filter(s => {
        const latest = s.mockTests[s.mockTests.length - 1];
        return latest && latest.category === 'Category C (Standard Schools)';
      }).length
    };

    const studentsWithTests = students.filter(s => s.mockTests.length > 0);
    const averageAggregate = studentsWithTests.length > 0 
      ? (studentsWithTests.reduce((sum, s) => {
          const latest = s.mockTests[s.mockTests.length - 1];
          return sum + (latest?.aggregate || 30);
        }, 0) / studentsWithTests.length).toFixed(1)
      : 0;

    const studentsWithMultipleTests = students.filter(s => s.mockTests.length > 1);
    const improvedStudents = studentsWithMultipleTests.filter(s => {
      const tests = s.mockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
      return tests[tests.length - 1].aggregate < tests[0].aggregate;
    }).length;
    const improvementRate = studentsWithMultipleTests.length > 0 
      ? ((improvedStudents / studentsWithMultipleTests.length) * 100).toFixed(1)
      : 0;

    return {
      totalStudents,
      topPerformers,
      genderDistribution,
      performanceDistribution,
      averageAggregate,
      improvementRate,
      studentsWithTests: studentsWithTests.length
    };
  };

  const generateReportData = () => {
    const stats = getDashboardStats();
    
    const performanceData = [
      { label: 'Category A', value: stats.performanceDistribution['Category A'] },
      { label: 'Category B', value: stats.performanceDistribution['Category B'] },
      { label: 'Category C', value: stats.performanceDistribution['Category C'] }
    ];
    
    const genderData = [
      { label: 'Male', value: stats.genderDistribution['Male'] },
      { label: 'Female', value: stats.genderDistribution['Female'] }
    ];
    
    const subjectPerformance = MOCK_SUBJECTS.map(subject => {
      const studentsWithSubject = students.filter(s => s.mockTests.length > 0);
      const averageScore = studentsWithSubject.length > 0 
        ? (studentsWithSubject.reduce((sum, s) => {
            const latestTest = s.mockTests[s.mockTests.length - 1];
            return sum + (latestTest?.scores[subject.code] || 0);
          }, 0) / studentsWithSubject.length).toFixed(1)
        : 0;
      
      return {
        label: subject.name,
        value: parseFloat(averageScore)
      };
    });
    
    const improvementTrend = students
      .filter(s => s.mockTests.length > 1)
      .map(s => {
        const tests = s.mockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstAggregate = tests[0].aggregate;
        const lastAggregate = tests[tests.length - 1].aggregate;
        return {
          student: s.name,
          improvement: firstAggregate - lastAggregate
        };
      })
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 10);
    
    const schoolPredictions = {};
    students.forEach(s => {
      const latestTest = s.mockTests[s.mockTests.length - 1];
      if (latestTest && latestTest.predictedSchool) {
        const school = latestTest.predictedSchool;
        schoolPredictions[school] = (schoolPredictions[school] || 0) + 1;
      }
    });
    
    const topSchools = Object.entries(schoolPredictions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([school, count]) => ({ label: school, value: count }));
    
    return {
      performanceData,
      genderData,
      subjectPerformance,
      improvementTrend,
      topSchools,
      stats
    };
  };

  // Handle logout (must be declared before NavTabs to avoid reference errors)
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentView');
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('dashboard');
  };

  // If user is not authenticated, show Login page immediately
  if (!isLoggedIn) {
    return <Login onLogin={(userData) => { setUser(userData); setIsLoggedIn(true); setCurrentView('dashboard'); }} />;
  }

  const NavTabs = () => (
    <div className="nav-tabs-container">
      <div className="nav-tabs">
        <button className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => handleViewChange('dashboard')}>📊 Dashboard</button>
        <button className={`nav-tab ${currentView === 'students' ? 'active' : ''}`} onClick={() => handleViewChange('students')}>👥 Students</button>
        <button className={`nav-tab ${currentView === 'registration' ? 'active' : ''}`} onClick={() => handleViewChange('registration')}>➕ Register</button>
        <button className={`nav-tab ${currentView === 'add-test' ? 'active' : ''}`} onClick={() => handleViewChange('add-test')}>📝 Tests</button>
        <button className={`nav-tab ${currentView === 'reports' ? 'active' : ''}`} onClick={() => handleViewChange('reports')}>📈 Reports</button>
      </div>
      
      <div className="nav-tabs-secondary">
        <div className="dropdown">
          <button className={`nav-tab dropdown-btn ${['performance', 'progress-reports', 'alerts', 'subject-performance'].includes(currentView) ? 'active' : ''}`}>📊 Analytics</button>
          <div className="dropdown-content">
            <button onClick={() => handleViewChange('performance')}>⚡ Performance Dashboard</button>
            <button onClick={() => handleViewChange('progress-reports')}>📋 Progress Reports</button>
            <button onClick={() => handleViewChange('subject-performance')}>📚 Subject Analysis</button>
            <button onClick={() => handleViewChange('alerts')}>🚨 Performance Alerts</button>
          </div>
        </div>

        <div className="dropdown">
          <button className={`nav-tab dropdown-btn ${['search', 'date-filter', 'comparison', 'placement'].includes(currentView) ? 'active' : ''}`}>🔍 Tools</button>
          <div className="dropdown-content">
            <button onClick={() => handleViewChange('search')}>🔍 Advanced Search</button>
            <button onClick={() => handleViewChange('date-filter')}>📅 Date Filter</button>
            <button onClick={() => handleViewChange('comparison')}>⚖️ Compare Students</button>
            <button onClick={() => handleViewChange('placement')}>🎯 Placement Tracking</button>
          </div>
        </div>

        <div className="dropdown">
          <button className={`nav-tab dropdown-btn ${['scheduler', 'certificates', 'notes', 'import'].includes(currentView) ? 'active' : ''}`}>🎓 Academic</button>
          <div className="dropdown-content">
            <button onClick={() => handleViewChange('scheduler')}>🗓️ Test Scheduler</button>
            <button onClick={() => handleViewChange('certificates')}>🏆 Certificates</button>
            <button onClick={() => handleViewChange('notes')}>📝 Teacher Notes</button>
            <button onClick={() => handleViewChange('import')}>📥 Bulk Import</button>
          </div>
        </div>

        <div className="dropdown">
          <button className={`nav-tab dropdown-btn ${['export', 'print-profiles', 'backup', 'messaging'].includes(currentView) ? 'active' : ''}`}>⚙️ Admin</button>
          <div className="dropdown-content">
            <button onClick={() => handleViewChange('export')}>📥 Export to Excel</button>
            <button onClick={() => handleViewChange('print-profiles')}>🖨️ Print Profiles</button>
            <button onClick={() => handleViewChange('backup')}>💾 Data Backup</button>
            <button onClick={() => handleViewChange('messaging')}>📤 Bulk Messaging</button>
            <button onClick={() => handleViewChange('parent-portal')}>👨‍👩‍👧 Parent Portal</button>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>👤 {user?.name || user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );

  if (currentView === 'dashboard') {
    const stats = getDashboardStats();
    return <>
      <NavTabs />
      <Dashboard
        stats={stats}
        importMessage={importMessage}
        handleImportStudents={handleImportStudents}
        handleImportMockTests={handleImportMockTests}
      />
    </>;
  }
  if (currentView === 'students') {
    return <>
      <NavTabs />
      <Students
        students={students}
        filterGender={filterGender}
        setFilterGender={setFilterGender}
        filterPerformance={filterPerformance}
        setFilterPerformance={setFilterPerformance}
        getFilteredStudents={getFilteredStudents}
        setSelectedStudent={setSelectedStudent}
        setCurrentView={handleViewChange}
      />
    </>;
  }
  if (currentView === 'student-profile') {
    return <>
      <NavTabs />
      <StudentProfile
        student={selectedStudent}
        setCurrentView={handleViewChange}
        setEditingStudent={setSelectedStudent}
      />
    </>;
  }
  if (currentView === 'registration') {
    return <>
      <NavTabs />
      <Registration
        students={students}
        setCurrentView={handleViewChange}
        onStudentRegistered={fetchStudents}
      />
    </>;
  }
  if (currentView === 'add-test') {
    return <>
      <NavTabs />
      <AddTest
        students={students}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        getStudentById={getStudentById}
        newMockTest={newMockTest}
        setNewMockTest={setNewMockTest}
        handleNewTestScoreChange={handleNewTestScoreChange}
        addMockTestToStudent={addMockTestToStudent}
      />
    </>;
  }
  if (currentView === 'reports') {
    const reportData = generateReportData();
    return <>
      <NavTabs />
      <Reports reportData={reportData} />
    </>;
  }
  if (currentView === 'performance') {
    return <>
      <NavTabs />
      <PerformanceDashboard students={students} />
    </>;
  }
  if (currentView === 'progress-reports') {
    return <>
      <NavTabs />
      <ProgressReports students={students} />
    </>;
  }
  if (currentView === 'search') {
    return <>
      <NavTabs />
      <AdvancedSearch students={students} setSelectedStudent={setSelectedStudent} setCurrentView={handleViewChange} />
    </>;
  }
  if (currentView === 'scheduler') {
    return <>
      <NavTabs />
      <TestScheduler />
    </>;
  }
  if (currentView === 'comparison') {
    return <>
      <NavTabs />
      <TestComparison students={students} />
    </>;
  }
  if (currentView === 'certificates') {
    return <>
      <NavTabs />
      <CertificateGenerator students={students} />
    </>;
  }
  if (currentView === 'placement') {
    return <>
      <NavTabs />
      <PlacementTracking students={students} />
    </>;
  }
  if (currentView === 'notes') {
    return <>
      <NavTabs />
      <TeacherNotes students={students} />
    </>;
  }
  if (currentView === 'import') {
    return <>
      <NavTabs />
      <BulkImport students={students} setStudents={setStudents} />
    </>;
  }
  if (currentView === 'date-filter') {
    return <>
      <NavTabs />
      <DateRangeFilter students={students} setSelectedStudent={setSelectedStudent} setCurrentView={handleViewChange} />
    </>;
  }
  if (currentView === 'subject-performance') {
    return <>
      <NavTabs />
      <SubjectPerformance students={students} />
    </>;
  }
  if (currentView === 'print-profiles') {
    return <>
      <NavTabs />
      <PrintFriendlyProfiles students={students} />
    </>;
  }
  if (currentView === 'alerts') {
    return <>
      <NavTabs />
      <PerformanceAlerts students={students} />
    </>;
  }
  if (currentView === 'export') {
    return <>
      <NavTabs />
      <ExportToExcel students={students} />
    </>;
  }
  if (currentView === 'auth') {
    const handleLoginSuccess = (userData) => {
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      handleViewChange('dashboard');
    };
    return <Authentication onLoginSuccess={handleLoginSuccess} />;
  }
  if (currentView === 'parent-portal') {
    return <>
      <NavTabs />
      <ParentPortal students={students} />
    </>;
  }
  if (currentView === 'messaging') {
    return <>
      <NavTabs />
      <BulkMessaging students={students} />
    </>;
  }
  if (currentView === 'backup') {
    return <>
      <NavTabs />
      <DataBackup students={students} />
    </>;
  }

  // Default: show dashboard
  const stats = getDashboardStats();
  return <>
    <NavTabs />
    <Dashboard
      stats={stats}
      importMessage={importMessage}
      handleImportStudents={handleImportStudents}
      handleImportMockTests={handleImportMockTests}
    />
  </>;
}
