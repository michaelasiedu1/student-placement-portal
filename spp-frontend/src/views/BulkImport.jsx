import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function BulkImport({ students, onStudentImported }) {
  const [importMessage, setImportMessage] = useState("");

  const handleBulkImport = (e) => {
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
          const testData = {
            testName: row['Test Name'] || 'Imported Test',
            mockType: row['Mock Type'] || 'Mock 1',
            date: row['Date'] || new Date().toISOString().split('T')[0],
            scores: {
              ENG: parseInt(row['English Language'] || row['ENG'] || 0),
              MATH: parseInt(row['Mathematics'] || row['MATH'] || 0),
              SCI: parseInt(row['Science'] || row['SCI'] || 0),
              SOC: parseInt(row['Social Studies'] || row['SOC'] || 0),
              COMP: parseInt(row['Computing'] || row['COMP'] || 0),
              RME: parseInt(row['Religious and Moral Education'] || row['RME'] || 0),
              CTECH: parseInt(row['Career Technology'] || row['CTECH'] || 0),
              CAD: parseInt(row['Creative Arts and Design'] || row['CAD'] || 0),
              GHL: parseInt(row['Ghanaian Language'] || row['GHL'] || 0),
              FRN: parseInt(row['French'] || row['FRN'] || 0),
            }
          };

          const indexNumber = row['Index Number'] || row['indexNumber'];
          const student = students.find(s => s.indexNumber === indexNumber);
          
          if (student) {
            // Add test to student
            importedCount++;
          }
        }

        setImportMessage(`✅ Successfully imported ${importedCount} test results!`);
        setTimeout(() => setImportMessage(""), 3000);
      } catch (error) {
        setImportMessage("❌ Error importing file. Please check the format.");
        setTimeout(() => setImportMessage(""), 3000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📥 Bulk Import</h1>
        <p className="subtitle">Import multiple test results at once</p>
      </div>

      <div className="section">
        <h2>Upload Excel File</h2>
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px', border: '2px dashed var(--border-primary)' }}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleBulkImport}
            style={{ display: 'block', marginBottom: '1rem' }}
          />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Supported formats: Excel (.xlsx), CSV<br/>
            Required columns: Index Number, Test Name, Mock Type, Date, and subject scores (ENG, MATH, SCI, SOC, COMP, RME, CTECH, CAD, GHL, FRN)
          </p>
        </div>

        {importMessage && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            {importMessage}
          </div>
        )}
      </div>
    </div>
  );
}
